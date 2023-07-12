<script setup>
  // @ts-check
  import { onMounted, ref } from "vue";
  const props = defineProps({
    size: { type: Number, required: true },
    isTurnWhite: Boolean,
    winner: String,
    indexEnabled: Boolean,
    gameType: String,
    players: {
      type: Array,
      default: ["p1", "p2"],
    },
  });
  const emit = defineEmits({ played: String, win: String, capture: Number });
  const board = ref(Array.from({ length: props.size }, () => new Array(props.size))); // size*size array
  function onCellClick(event) {
    event.target.disabled = true;
    const coordinate = event.target.dataset.coordinate;
    const [row, col] = coordinate.split("-").map((e) => ~~e);
    const formattedIndex = formatBoardIndex(row + 1, col + 1);
    board.value[row][col].textContent = props.isTurnWhite ? "⚪" : "⚫";
    emit("played", formattedIndex);
    const findFiveInRow = FiveInRowChecker();
    const results = findFiveInRow([row, col]);
    if (results.length) {
      results.flat(1).forEach((e) => {
        board.value[e[0]][e[1]].dataset.bingo = true;
      });
      emit("win", props.isTurnWhite ? props.players[1] : props.players[0]);
    } else if (!board.value.flat(1).some((elm) => elm.textContent === "")) {
      emit("win", "沒有人");
    }
    if (props.gameType === "pente") {
      const findCaptures = CaptureChecker();
      const captures = findCaptures([row, col]);
      if (captures.length) {
        const logs = captures.map(([row, col]) => formatBoardIndex(row + 1, col + 1));
        console.log(`${props.isTurnWhite ? props.players[1] : props.players[0]}捕獲 @ :${logs}`);
        emit("capture", captures.length);
        captures.forEach(([row, col]) => {
          board.value[row][col].textContent = "";
          board.value[row][col].disabled = false;
        });
      }
    }
  }

  /**
   * @typedef {[Number ,Number]} Coordinate
   */

  function CaptureChecker() {
    const states = [];
    const directions = ["NW", "N", "NE", "W", "E", "SW", "S", "SE"];
    let i = directions.length;
    /**
     * @param {Coordinate} origin 原點座標陣列
     * @returns {Array} 捕獲的座標陣列
     */
    return function recursive(origin) {
      i--;
      const queue = [];
      const pattern = props.isTurnWhite ? ["⚫", "⚫", "⚪"] : ["⚪", "⚪", "⚫"];
      for (let radius = 1; radius < 4; radius++) {
        const target = getCoordinate(origin, directions[i], radius);
        if (target.length && board.value[target[0]][target[1]].textContent === pattern[radius - 1]) queue.push(target);
      }
      if (queue.length === 3) states.push(queue[0], queue[1]);
      return i > 0 ? recursive(origin) : states;
    };
  }

  function FiveInRowChecker() {
    const states = { NW: [], N: [], NE: [], W: [], E: [], SW: [], S: [], SE: [] };
    const directions = Object.keys(states);
    let i = directions.length;
    /**
     * @param {Coordinate} origin 原點座標陣列
     * @returns {Array} 五連珠的座標陣列
     */
    return function recursive(origin) {
      i--;
      let radius = 0;
      let sameColor = true;
      while (sameColor) {
        radius++;
        const target = getCoordinate(origin, directions[i], radius);
        if (!target.length) break;
        sameColor = board.value[origin[0]][origin[1]].textContent === board.value[target[0]][target[1]].textContent;
        if (sameColor) states[directions[i]].push(target);
      }
      return i > 0
        ? recursive(origin)
        : [
            [...states.E, origin, ...states.W],
            [...states.NE, origin, ...states.SW],
            [...states.N, origin, ...states.S],
            [...states.NW, origin, ...states.SE],
          ].filter((e) => e.length >= 5);
    };
  }
  /**
   *
   * @param {Array} origin 原點座標陣列
   * @param {String} direction "NW", "N", "NE", "W", "E", "SW", "S", "SE"
   * @param {Number} radius 半徑
   */
  function getCoordinate(origin, direction, radius) {
    const [row, col] = origin;
    const result =
      direction === "E"
        ? [row + radius, col]
        : direction === "NE"
        ? [row + radius, col + radius]
        : direction === "N"
        ? [row, col + radius]
        : direction === "NW"
        ? [row - radius, col + radius]
        : direction === "W"
        ? [row - radius, col]
        : direction === "SW"
        ? [row - radius, col - radius]
        : direction === "S"
        ? [row, col - radius]
        : direction === "SE"
        ? [row + radius, col - radius]
        : [];
    const isInRange = result.every((xy) => xy >= 0 && xy < props.size);
    return isInRange ? result : [];
  }

  /**@type {( row:Number , col:Number )=> String} */
  function formatBoardIndex(row, col) {
    if (col > 26) return `${col}-${row}`;
    else return String.fromCodePoint(64 + col) + row;
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
  <div class="board">
    <template v-for="row in props.size" :key="row">
      <template v-for="col in props.size" :key="col">
        <div class="cell-wrap">
          <span v-show="indexEnabled" class="tags">
            {{ formatBoardIndex(row, col) }}
          </span>
          <button
            class="cell"
            :data-coordinate="`${row - 1}-${col - 1}`"
            :ref="(e) => (board[row - 1][col - 1] = e)"
            :disabled="!!props.winner"
            @click="onCellClick"
          >
            {{ board[row - 1][col - 1]?.textContent }}
          </button>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
  .board {
    display: grid;
    grid-template-columns: repeat(var(--board-size), 1fr);
    margin: 0 auto;
    width: calc(100vh - 225px);
    height: calc(100vh - 225px);
  }
  .cell {
    width: 105%;
    height: 105%;
    border: 0px solid transparent;
    background: no-repeat center url("wood.png");
    font-size: 1.25rem;
    line-height: 0;
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .cell[data-bingo="true"] {
    background: linear-gradient(-45deg, var(--orange), var(--pink), var(--skyblue), var(--primary));
    background-size: 400% 400%;
    animation: AnimeGrade 15s ease infinite;
  }
  .cell-wrap {
    width: calc((100vh - 230px) / var(--board-size));
    height: calc((100vh - 230px) / var(--board-size));
    position: relative;
  }
  .tags {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    text-align: center;
    background-color: black;
    color: white;
    font-size: 12px;
    font-weight: bold;
  }
  @media screen and (width > 1200px) {
    .board {
      width: 100vh;
      height: 100vh;
    }
    .cell {
      font-size: 1.75rem;
    }
    .cell-wrap {
      width: calc(100vh / var(--board-size));
      height: calc(100vh / var(--board-size));
    }
    .tags {
      font-size: 12px;
    }
  }
</style>
