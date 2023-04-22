<script setup>
  import { ref } from "vue";
  import { computed } from "@vue/reactivity";
  const boardSize = ref(getComputedStyle(document.documentElement).getPropertyValue("--board-size"));
  const boardIndexs = computed(() => getBoardIndexs(boardSize.value));
  let whiteTurn = ref(true);
  let winner = ref(null);
  const playerNow = computed(() => (whiteTurn.value ? "⚪" : "⚫"));
  const restart = () => location.reload();
  console.log(`棋盤大小：${boardSize.value}`);
  function getBoardIndexs(size) {
    let result = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const index = String.fromCodePoint(65 + (j % size)) + (size - i);
        result.push(index);
      }
    }
    return result;
  }
  function onCellClick(event) {
    const cell = event.target;
    cell.innerText = playerNow.value;
    cell.disabled = true;
    const bingos = getBingos(cell.id);
    if (bingos.length) {
      winner.value = playerNow.value;
      bingos.forEach((e) => heightlightCells(e));
    } else {
      whiteTurn.value = !whiteTurn.value;
    }
  }
  function heightlightCells(cellsArr) {
    cellsArr.forEach((e) => {
      document.querySelector(`#${e}`).classList += " rainbow";
    });
  }
  function getBingos(origin, state = { NW: [], N: [], NE: [], W: [], E: [], SW: [], S: [], SE: [] }, radius = 1) {
    const nextState = Object.entries(state).reduce((acc, [dirStr, dirArr]) => {
      const target = getIndexBySameColor(origin, dirStr, radius);
      if (target && dirArr.length === radius - 1) acc[dirStr] = [...dirArr, target];
      else acc[dirStr] = dirArr;
      return acc;
    }, {});
    // 八方向末端都不是同色 則結算，否則loop下一階
    return Object.values(nextState).some((e) => e.length === radius)
      ? getBingos(origin, nextState, radius + 1)
      : [
          [...state.E, origin, ...state.W],
          [...state.NE, origin, ...state.SW],
          [...state.N, origin, ...state.S],
          [...state.NW, origin, ...state.SE],
        ].filter((e) => e.length >= 5);
  }
  function getIndexBySameColor(origin, direction, radius) {
    const x = origin.codePointAt(0);
    const y = ~~origin.substr(1);
    const result =
      direction === "E"
        ? String.fromCodePoint(x + radius) + y
        : direction === "NE"
        ? String.fromCodePoint(x + radius) + (y + radius)
        : direction === "N"
        ? String.fromCodePoint(x) + (y + radius)
        : direction === "NW"
        ? String.fromCodePoint(x - radius) + (y + radius)
        : direction === "W"
        ? String.fromCodePoint(x - radius) + y
        : direction === "SW"
        ? String.fromCodePoint(x - radius) + (y - radius)
        : direction === "S"
        ? String.fromCodePoint(x) + (y - radius)
        : direction === "SE"
        ? String.fromCodePoint(x + radius) + (y - radius)
        : null;
    if (boardIndexs.value.includes(result)) {
      return document.querySelector(`#${result}`).textContent === document.querySelector(`#${origin}`).textContent
        ? result
        : null;
    }
  }
</script>

<template>
  <main class="window">
    <aside class="panel">
      <h1 class="panel__title">五子棋遊戲</h1>
      <button v-if="winner" class="panel__info rainbow" @click="restart">
        獲勝者是 {{ winner }} <br />👉重新開始遊戲👈
      </button>
      <button v-else class="panel__info">{{ playerNow }} 的回合</button>
    </aside>

    <div class="board">
      <button
        class="board__cells"
        :id="index"
        v-for="index of boardIndexs"
        :disabled="winner"
        @click="onCellClick"
      ></button>
    </div>
  </main>
</template>

<style></style>
