<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { Coordinate, DIRECTIONS, Directions, Game } from "../typedef";
  interface BoardProps extends Game.Status {
    size: number;
  }
  const props = defineProps<BoardProps>();
  const emit = defineEmits({ played: String, win: String, capture: Number });
  const board = ref(Array.from({ length: props.size }, () => new Array(props.size))); // size*size array
  function onCellClick(event: MouseEvent) {
    const target = event.target as HTMLButtonElement;
    const coordinate = target.dataset.coordinate;
    if (!coordinate) return;
    target.disabled = true;
    const [row, col] = coordinate.split("-").map((e) => parseInt(e));
    const formattedIndex = formatBoardIndex(row + 1, col + 1);
    board.value[row][col].textContent = props.isTurnWhite ? "⚪" : "⚫";
    emit("played", formattedIndex);
    const findFiveInRow = FiveInRowChecker();
    const results = findFiveInRow([row, col]);

    if (props.gameType === "pente") {
      const findCaptures = CaptureChecker();
      const captures = findCaptures([row, col]);
      if (captures.length) {
        const logs = captures.map(([row, col]) => formatBoardIndex(row + 1, col + 1));
        console.log(`${props.isTurnWhite ? props.players[1] : props.players[0]}捕獲 @ :${logs}`);
        captures.forEach(([row, col]) => {
          board.value[row][col].classList.add("fade-out");
        });
        emit("capture", captures.length);
      }
    }

    if (results.length) {
      results.flat(1).forEach((e) => {
        board.value[e[0]][e[1]].dataset.bingo = true;
      });
      emit("win", props.isTurnWhite ? props.players[1] : props.players[0]);
    } else if (board.value.flat(1).every((elm) => elm.textContent && !elm.classList.contains("fade-out"))) {
      emit("win", "沒有人");
    }
  }

  function CaptureChecker() {
    const states: Coordinate[] = [];
    let i = DIRECTIONS.length;
    return function recursive(origin: Coordinate): Coordinate[] {
      i--;
      const queue = [];
      const pattern = props.isTurnWhite ? ["⚫", "⚫", "⚪"] : ["⚪", "⚪", "⚫"];
      for (let radius = 1; radius < 4; radius++) {
        const target = getCoordinate(origin, DIRECTIONS[i], radius);
        if (target && board.value[target[0]][target[1]].textContent === pattern[radius - 1]) queue.push(target);
      }
      if (queue.length === 3) states.push(queue[0], queue[1]);
      return i > 0 ? recursive(origin) : states;
    };
  }

  function FiveInRowChecker() {
    type SameColorStacks = { [key in Directions]: Coordinate[] };
    const stacks: SameColorStacks = { NW: [], N: [], NE: [], W: [], E: [], SW: [], S: [], SE: [] };
    let i = DIRECTIONS.length;
    return function recursive(origin: Coordinate): Coordinate[][] {
      i--;
      let radius = 0;
      let sameColor = true;
      while (sameColor) {
        radius++;
        const target = getCoordinate(origin, DIRECTIONS[i], radius);
        if (!target) break;
        sameColor = board.value[origin[0]][origin[1]].textContent === board.value[target[0]][target[1]].textContent;
        if (sameColor) stacks[DIRECTIONS[i]].push(target);
      }
      return i > 0
        ? recursive(origin)
        : [
            [...stacks.E, origin, ...stacks.W],
            [...stacks.NE, origin, ...stacks.SW],
            [...stacks.N, origin, ...stacks.S],
            [...stacks.NW, origin, ...stacks.SE],
          ].filter((e) => e.length >= 5);
    };
  }

  function getCoordinate(origin: Coordinate, direction: Directions, radius: number): Coordinate | undefined {
    const [row, col] = origin;
    let result: Coordinate;
    switch (direction) {
      case "NW":
        result = [row - radius, col - radius];
        break;
      case "N":
        result = [row - radius, col];
        break;
      case "NE":
        result = [row - radius, col + radius];
        break;
      case "W":
        result = [row, col - radius];
        break;
      case "E":
        result = [row, col + radius];
        break;
      case "SW":
        result = [row + radius, col - radius];
        break;
      case "S":
        result = [row + radius, col];
        break;
      case "SE":
        result = [row + radius, col + radius];
        break;
      default:
        result = [-1, -1];
        break;
    }
    const isInRange = result.every((xy) => xy >= 0 && xy < props.size);
    return isInRange ? result : undefined;
  }

  function formatBoardIndex(row: number, col: number): string {
    if (col > 26) return `${col}-${row}`;
    else return String.fromCodePoint(64 + col) + row;
  }

  function onFadeDone(event: TransitionEvent) {
    const cell = event.target as HTMLButtonElement;
    if (cell.classList.contains("fade-out")) {
      cell.textContent = "";
      cell.disabled = false;
      cell.classList.remove("fade-out");
    }
  }
  onMounted(() => {
    const mid = Math.floor(props.size / 2);
    if (props.gameType === "pente") {
      board.value[mid][mid].textContent = "⚪";
      board.value[mid][mid].disabled = true;
    }
  });
</script>
<template>
  <div
    class="board-view"
    @click="onCellClick"
    @transitionend="onFadeDone"
  >
    <template
      v-for="row in props.size"
      :key="row"
    >
      <template
        v-for="col in props.size"
        :key="col"
      >
        <div class="cell">
          <span
            v-show="indexEnabled"
            class="index-tags"
          >
            {{ formatBoardIndex(row, col) }}
          </span>
          <button
            :data-coordinate="`${row - 1}-${col - 1}`"
            :ref="(e) => (board[row - 1][col - 1] = e)"
            :disabled="!!props.winner"
          ></button>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
  .board-view {
    height: 100%;
    aspect-ratio: 1/1;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(var(--board-size), 1fr);
    grid-template-rows: repeat(var(--board-size), 1fr);
    margin: 0 auto;
  }
  .cell {
    position: relative;
    background: url("../assets/wood.png") center;
    button {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 1;
      border: none;
      background: none;
      font-size: 1.75rem;
      padding: 0;
      cursor: pointer;
      color: black;
      transition: all 0.3s ease-out;
      &[data-bingo="true"] {
        background: linear-gradient(-45deg, var(--orange), var(--pink), var(--skyblue), var(--primary));
        background-size: 400% 400%;
        animation: AnimeGrade 15s ease infinite;
      }
      @media screen and (max-width: 1200px) {
        font-size: 1.25rem;
      }
    }
  }

  .fade-out {
    opacity: 0;
    transform: scale(3);
  }
  .index-tags {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 12px;
    font-weight: bold;
  }
</style>
