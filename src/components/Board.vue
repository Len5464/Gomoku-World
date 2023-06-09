<script setup>
  // @ts-check
  import { ref } from "vue";
  const props = defineProps({
    size: {
      type: Number,
      default: 19,
    },
    player: String,
    winner: String,
  });
  const emit = defineEmits({
    check: String,
  });
  const board = ref(new Array(props.size).fill("").map(() => new Array(props.size).fill("")));
  function onCellClick(event) {
    event.target.disabled = true;
    const coordinate = event.target.dataset.coordinate;
    const [row, col] = coordinate.split("-").map((e) => ~~e);
    board.value[row][col].textContent = props.player;
    const bingos = getBingos([row, col]);
    if (bingos.length) {
      bingos.flat(1).forEach((e) => {
        board.value[e[0]][e[1]].dataset.bingo = true;
      });
      emit("check", props.player);
    } else if (!board.value.flat(1).some((elm) => elm.textContent === "")) {
      emit("check", "平手");
    } else {
      emit("check", coordinate);
    }
  }

  /**
   * @typedef {[number,number]} Coordinate
   * @param {Coordinate} origin 中心點
   * @returns {array} 有賓果就回傳每條賓果的座標陣列集合，沒有就空陣列
   */
  function getBingos(origin, states = { NW: [], N: [], NE: [], W: [], E: [], SW: [], S: [], SE: [] }, radius = 1) {
    for (let direction in states) {
      const target = findContentMatch(origin, direction, radius);
      if (target.length && states[direction].length === radius - 1) states[direction].push(target);
    }
    return Object.values(states).some((e) => e.length === radius)
      ? getBingos(origin, states, radius + 1)
      : [
          [...states.E, origin, ...states.W],
          [...states.NE, origin, ...states.SW],
          [...states.N, origin, ...states.S],
          [...states.NW, origin, ...states.SE],
        ].filter((e) => e.length >= 5);
  }

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
</script>
<template>
  <div class="board">
    <template v-for="row in props.size" :key="row">
      <button
        v-for="col in props.size"
        class="cell"
        :data-coordinate="`${row - 1}-${col - 1}`"
        :ref="(e) => (board[row - 1][col - 1] = e)"
        :disabled="!!props.winner"
        @click="onCellClick"
      >
        {{ board[row - 1][col - 1].textContent }}
      </button>
    </template>
  </div>
</template>

<style scoped>
  .board {
    display: grid;
    grid-template-columns: repeat(var(--board-size), 1fr);
    margin: 0 auto;
    width: 100vw;
    height: 100vw;
  }
  @media screen and (min-width: 1200px) {
    .board {
      width: 100vh;
      height: 100vh;
    }
  }
  .cell {
    width: auto;
    height: auto;
    padding: 0;
    border: 0px solid transparent;
    background: no-repeat center url("wood.png");
    line-height: 0;
    font-size: 1.5rem;
    cursor: pointer;
  }
  .cell[data-bingo="true"] {
    background: linear-gradient(-45deg, var(--orange), var(--pink), var(--skyblue), var(--lightgreen));
    background-size: 400% 400%;
    animation: AnimeGrade 15s ease infinite;
  }
</style>
