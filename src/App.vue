<script setup>
  // @ts-check
  /**
   * @typedef {[number,number]} Coordinate
   */
  import { ref, onMounted } from "vue";
  import { computed } from "@vue/reactivity";

  /**@type { function (number) : array[] } */
  const BoardLists = (size) => new Array(size).fill("").map(() => new Array(size).fill(""));
  const boardSize = 5;
  const board = ref(BoardLists(boardSize));
  const flags = ref({
    whiteTurn: true,
    winner: "",
  });
  const playerNow = computed(() => (flags.value.whiteTurn ? "⚪" : "⚫"));
  const restart = () => location.reload();
  console.log(`棋盤大小：${boardSize}`);

  function onCellClick(event) {
    event.target.disabled = true;
    const [row, col] = event.target.dataset.coordinate.split("-").map((e) => ~~e);
    board.value[row][col] = playerNow.value;
    const bingos = getBingos([row, col]);
    if (bingos.length) {
      flags.value.winner = playerNow.value;
      bingos.flat(1).forEach((e) => {
        document.querySelector(`[data-coordinate="${e[0]}-${e[1]}"]`).classList += " rainbow";
      });
    } else if (!board.value.flat().some((e) => e === "")) {
      flags.value.winner = "平手";
    } else {
      flags.value.whiteTurn = !flags.value.whiteTurn;
    }
  }

  /**
   * @param {Coordinate} origin 中心點
   * @returns {array} 有賓果就回傳每條賓果的座標集合，沒有就空陣列
   */
  function getBingos(origin, state = { NW: [], N: [], NE: [], W: [], E: [], SW: [], S: [], SE: [] }, radius = 1) {
    for (let direction in state) {
      const target = findIndexBySameColor(origin, direction, radius);
      if (target.length && state[direction].length === radius - 1) state[direction].push(target);
    }
    return Object.values(state).some((e) => e.length === radius)
      ? getBingos(origin, state, radius + 1)
      : [
          [...state.E, origin, ...state.W],
          [...state.NE, origin, ...state.SW],
          [...state.N, origin, ...state.S],
          [...state.NW, origin, ...state.SE],
        ].filter((e) => e.length >= 5);
  }

  /**
   * @param {Coordinate} origin 中心點
   * @param {string} direction N, NE, W, E, SW, S, SE
   * @param {number} radius 半徑
   * @returns {Coordinate | array} 跟原點同色的座標，找不到則[]
   */
  function findIndexBySameColor(origin, direction, radius) {
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
    const inRange = result.every((xy) => xy >= 0 && xy < boardSize);
    if (!inRange) return [];
    const isContentMatch = board.value[row][col] === board.value[result[0]][result[1]];
    return isContentMatch ? result : [];
  }
  onMounted(() => {
    document.getElementById("app").style.setProperty("--board-size", `${boardSize}`);
  });
</script>

<template>
  <main class="window">
    <aside class="panel">
      <h1 class="panel__title">五子棋遊戲</h1>
      <button v-if="flags.winner" class="panel__info rainbow" @click="restart">
        獲勝者是 {{ flags.winner }} <br />👉重新開始遊戲👈
      </button>
      <button v-else class="panel__info">{{ playerNow }} 的回合</button>
    </aside>

    <div class="board">
      <template v-for="row in boardSize" :key="row - 1">
        <button
          v-for="col in boardSize"
          class="board__cells"
          :key="col"
          :disabled="!!flags.winner"
          :data-coordinate="`${row - 1}-${col - 1}`"
          @click="onCellClick"
        >
          {{ board[row - 1][col - 1] }}
        </button>
      </template>
    </div>
  </main>
</template>

<style></style>
