<script setup>
  // @ts-check
  import { computed, ref } from "vue";
  const props = defineProps({
    size: { type: Number, required: true },
    whiteTurn: Boolean,
    winner: String,
    indexEnabled: Boolean,
    players: {
      type: Array,
      default: ["p1", "p2"],
    },
  });
  const emit = defineEmits(["played", "win"]);
  const board = ref(Array.from({ length: props.size }, () => new Array(props.size))); // size*size array

  function onCellClick(event) {
    event.target.disabled = true;
    const coordinate = event.target.dataset.coordinate;
    const [row, col] = coordinate.split("-").map((e) => ~~e);
    const formattedIndex = formatBoardIndex(row + 1, col + 1);
    board.value[row][col].textContent = props.whiteTurn ? "⚪" : "⚫";
    emit("played", formattedIndex);
    const results = findFiveInRow([row, col]);
    if (results.length) {
      results.flat(1).forEach((e) => {
        board.value[e[0]][e[1]].dataset.bingo = true;
      });
      emit("win", props.whiteTurn ? props.players[1] : props.players[0]);
    } else if (!board.value.flat(1).some((elm) => elm.textContent === "")) {
      emit("win", "沒有人");
    }
  }

  /**
   * @typedef {[number,number]} Coordinate
   * @param {Coordinate} origin 中心點
   * @returns {array} 有賓果就回傳每條賓果的座標陣列集合，沒有就空陣列
   */
  function findFiveInRow(origin, states = { NW: [], N: [], NE: [], W: [], E: [], SW: [], S: [], SE: [] }, radius = 1) {
    for (let direction in states) {
      const target = findContentMatch(origin, direction, radius);
      if (target.length && states[direction].length === radius - 1) states[direction].push(target);
    }
    return Object.values(states).some((e) => e.length === radius)
      ? findFiveInRow(origin, states, radius + 1)
      : [
          [...states.E, origin, ...states.W],
          [...states.NE, origin, ...states.SW],
          [...states.N, origin, ...states.S],
          [...states.NW, origin, ...states.SE],
        ].filter((e) => e.length >= 5);
  }

  /** @type {(origin:Coordinate, direction:String, radius:Number)=> Array} */
  function findContentMatch(origin, direction, radius) {
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
    const inRange = result.every((xy) => xy >= 0 && xy < props.size);
    if (!inRange) return [];
    const isContentMatch = board.value[row][col].textContent === board.value[result[0]][result[1]].textContent;
    return isContentMatch ? result : [];
  }

  /**@type {( row:Number , col:Number )=> String} */
  function formatBoardIndex(row, col) {
    if (col > 26) return `${col}-${row}`;
    else return String.fromCodePoint(64 + col) + row;
  }
</script>
<template>
  <div class="board">
    <template v-for="row in props.size" :key="row">
      <template v-for="col in props.size" :key="col">
        <div class="cell-wrap">
          <span v-show="indexEnabled" class="index">
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
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0px solid transparent;
    background: no-repeat center url("wood.png");
    line-height: 0;
    font-size: 1.5rem;
    cursor: pointer;
    position: absolute;
  }
  .cell[data-bingo="true"] {
    background: linear-gradient(-45deg, var(--orange), var(--pink), var(--skyblue), var(--primary));
    background-size: 400% 400%;
    animation: AnimeGrade 15s ease infinite;
  }
  .cell-wrap {
    width: calc((100vh - 225px) / var(--board-size));
    height: calc((100vh - 225px) / var(--board-size));
    position: relative;
  }
  .index {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    text-align: center;
    background-color: black;
    color: white;
    font-size: 8px;
    font-weight: bold;
  }
  @media screen and (width > 1200px) {
    .board {
      width: 100vh;
      height: 100vh;
    }
    .cell {
      font-size: 1.5rem;
    }
    .cell-wrap {
      width: calc(100vh / var(--board-size));
      height: calc(100vh / var(--board-size));
    }
    .index {
      font-size: 12px;
    }
  }
</style>
