<script setup>
  import { ref, reactive, onMounted } from "vue";
  import { computed } from "@vue/reactivity";
  const boardSize = 19;
  const BoardLists = (size) => new Array(parseInt(size)).fill().map(() => new Array(parseInt(size)).fill(""));
  const board = ref(BoardLists(boardSize));
  const flags = ref({
    whiteTurn: true,
    winner: null,
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
  function getBingos(origin, state = { NW: [], N: [], NE: [], W: [], E: [], SW: [], S: [], SE: [] }, radius = 1) {
    if (!Array.isArray(origin)) throw "origin必須是陣列";
    for (let direction in state) {
      const target = getIndexBySameColor(origin, direction, radius);
      if (target && state[direction].length === radius - 1) state[direction].push(target);
    }
    // 八方向末端都不是同色 則結算，否則loop下一階
    return Object.values(state).some((e) => e.length === radius)
      ? getBingos(origin, state, radius + 1)
      : [
          [...state.E, origin, ...state.W],
          [...state.NE, origin, ...state.SW],
          [...state.N, origin, ...state.S],
          [...state.NW, origin, ...state.SE],
        ].filter((e) => e.length >= 5);
  }
  function getIndexBySameColor(origin, direction, radius) {
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
        : null;
    if (result.every((e) => e >= 0 && e < board.value.length)) {
      return board.value[row][col] === board.value[result[0]][result[1]] ? result : null;
    }
  }
  onMounted(() => {
    document.getElementById("app").style.setProperty("--board-size", boardSize);
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
      <template v-for="row in board.length" :key="row - 1">
        <button
          v-for="col in board.length"
          class="board__cells"
          :key="col"
          :disabled="flags.winner"
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
