<script setup>
  import { ref, onMounted, reactive, watch, watchEffect, computed } from "vue";
  import Board from "../components/Board.vue";
  import Timer from "../components/Timer.vue";
  import Modal from "../components/Modal.vue";
  import MenuBtn from "../components/MenuBtn.vue";
  import { RouterLink } from "vue-router";
  const props = defineProps({
    size: Number,
    sec: Number,
    players: Array,
    roundType: String,
  });
  const initialData = {
    whiteTurn: false,
    winner: "",
    lastPlacement: "",
    isTimeOut: false,
    indexEnabled: false,
  };
  const game = reactive({
    ...initialData,
    players: props.players,
    winCounts: [0, 0],
    round: 1,
    goalScore: props.roundType === "three-out-of-five" ? 3 : props.roundType === "two-out-of-three" ? 2 : 1,
  });
  const isGameOver = computed(() => game.winCounts.some((value) => value >= game.goalScore));
  const menuEnabled = ref(false);
  const timer = ref(null);
  const formatMMSS = (sec) => `
    ${Math.floor(sec / 60 / 10)}${Math.floor((sec / 60) % 10)}
    :
    ${Math.floor((sec % 60) / 10)}${Math.floor((sec % 60) % 10)}
  `;

  function onCountDown(time) {
    if (time <= 0) {
      const winner = game.whiteTurn ? game.players[0] : game.players[1];
      game.isTimeOut = true;
      onWin(winner, game.lastPlacement);
    }
  }
  function onTurnChange(index) {
    game.whiteTurn = !game.whiteTurn;
    game.lastPlacement = index;
    timer.value.reset();
  }
  function onWin(winner) {
    game.winner = winner;
    timer.value.pause();
    const i = game.players.indexOf(game.winner);
    if (i >= 0) game.winCounts[i]++;
  }
  function onNextRound() {
    game.round++;
    Object.assign(game, initialData);
    game.players.reverse();
    game.winCounts.reverse();
  }
  onMounted(() => {
    console.log(`棋盤大小：${props.size}`);
    document.getElementById("app").style.setProperty("--board-size", `${props.size}`);
  });
</script>

<template>
  <div class="container-fluid">
    <main class="row align-items-stretch">
      <section class="panel | col-xl-3 col-12 row p-3 flex-xl-column align-items-center g-0 flow">
        <MenuBtn :show="menuEnabled" @open="menuEnabled = true" @close="menuEnabled = false"></MenuBtn>
        <h3 class="col-6 col-xl-8 my-auto" v-if="!!game.winner">{{ game.winner }}得分</h3>
        <h3 v-else class="col-6 col-xl-8 my-auto">第{{ game.round }}回合</h3>
        <div class="col-6 col-xl-8 p-3">
          ⚫: {{ game.players[0] }} {{ game.winCounts[0] }}分 <br />
          ⚪: {{ game.players[1] }} {{ game.winCounts[1] }}分
        </div>
        <Timer
          ref="timer"
          :time="sec"
          v-slot="{ time, isRunning, pause, resume }"
          @countdown="onCountDown"
          :key="game.round"
        >
          <button
            class="btn btn-sky | col-12 col-xl-8"
            :disabled="!!game.winner"
            @click="isRunning ? pause() : resume()"
          >
            <h2>{{ formatMMSS(time) }}</h2>
            <span>
              {{ isRunning ? "⏸️" : "▶️" }}
            </span>
          </button>
        </Timer>
        <button
          class="btn btn-primary | col-6 col-xl-8"
          @pointerdown="game.indexEnabled = true"
          @pointerup="game.indexEnabled = false"
          @pointerleave="game.indexEnabled = false"
        >
          {{ game.whiteTurn ? "⚫" : "⚪" }}@{{ game.lastPlacement }}
        </button>
        <button v-if="game.winner" class="btn btn-gray | col-6 col-xl-8 mb-auto" data-bingo="true" @click="onNextRound">
          進入下一局
        </button>
        <button v-else class="btn btn-gray | col-6 col-xl-8 mb-auto">
          {{ game.whiteTurn ? game.players[1] : game.players[0] }}的回合
        </button>
      </section>
      <section class="board | row col-xl-9 col-12 g-0">
        <Board :size="size" v-bind="game" @win="onWin" @played="onTurnChange" :key="game.round" />
      </section>
    </main>
  </div>
  <Teleport to="body">
    <Modal :show="game.isTimeOut" @close="game.isTimeOut = false">
      <template #header>
        <h3>超時落敗</h3>
      </template>
      <template #body>
        <p>想太久嘍σ ﾟ∀ ﾟ&#41; ﾟ∀ﾟ&#41;σ</p>
      </template>
    </Modal>
    <Modal :show="isGameOver">
      <template #header>
        <h3>恭喜！</h3>
      </template>
      <template #body>
        <p>{{ game.winner }}獲勝</p>
      </template>
      <template #footer>
        <RouterLink to="/" class="modal-default-button">回到主畫面</RouterLink>
      </template>
    </Modal>
  </Teleport>
</template>
<style scoped>
  .btn-gray[data-bingo="true"] {
    color: white;
    background: linear-gradient(-90deg, var(--orange), var(--pink), var(--skyblue), var(--primary));
    background-size: 400% 400%;
    animation: AnimeGrade 15s ease infinite;
  }
  .panel {
    text-align: center;
    background-color: white;
  }
  .board {
    overflow: scroll;
  }
  @media screen and (width < 1200px) {
    .panel {
      --flow-space: 0;
      --radius-size: 0;
    }
  }
</style>
