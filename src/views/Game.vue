<script setup>
  import { ref, onMounted, reactive, computed } from "vue";
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
    gameType: String,
  });

  const game = reactive({
    winner: "",
    lastPlacement: "",
    gameType: props.gameType,
    isTurnWhite: false,
    isTimeOut: false,
    indexEnabled: false,
    players: props.players,
    winCounts: [0, 0],
    captures: [0, 0],
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
      const winner = game.isTurnWhite ? game.players[0] : game.players[1];
      game.isTimeOut = true;
      onWin(winner);
    }
  }
  function onCapture(point) {
    const i = game.isTurnWhite ? 0 : 1;
    game.captures[i] += point;
    if (game.captures.some((value) => value >= 10)) onWin(game.players[i]);
  }
  function onTurnChange(index) {
    game.isTurnWhite = !game.isTurnWhite;
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
    Object.assign(game, {
      isTurnWhite: false,
      winner: "",
      lastPlacement: "",
      isTimeOut: false,
      indexEnabled: false,
      captures: [0, 0],
    });
    game.players.reverse();
    game.winCounts.reverse();
    game.captures.reverse();
  }
  onMounted(() => {
    console.log(`棋盤大小：${props.size}`);
    document.getElementById("app").style.setProperty("--board-size", `${props.size}`);
    if (props.gameType === "pente") game.players.reverse();
  });
</script>

<template>
  <div class="view | container-fluid">
    <main class="row align-items-stretch">
      <section class="panel | col-xl-3 col-12 row flex-xl-column align-items-center pt-3 g-0 flow">
        <MenuBtn
          :show="menuEnabled"
          :ruleGuide="gameType"
          @open="menuEnabled = true"
          @close="menuEnabled = false"
        ></MenuBtn>
        <h2 class="my-auto" v-if="!!game.winner">{{ game.winner }}獲勝</h2>
        <h2 v-else class="my-auto">第{{ game.round }}回合</h2>
        <div class="row col-10 col-xl-8 mx-auto px-0 py-3">
          <span class="col-6">
            {{ game.players[0] }} ⚫
            <br />
            {{ `${game.winCounts[0]}勝` }}
            <strong class="player-point">{{ gameType === "pente" ? `  (補獲${game.captures[0]}/10)` : "" }}</strong>
          </span>
          <span class="col-6">
            {{ game.players[1] }} ⚪
            <br />
            {{ `${game.winCounts[1]}勝` }}
            <strong class="player-point">{{ gameType === "pente" ? `  (補獲${game.captures[1]}/10)` : "" }}</strong>
          </span>
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
            <span style="font-size: 1.25rem">
              {{ isRunning ? "⏸️" : "▶️" }}
            </span>
          </button>
        </Timer>
        <button
          class="btn btn-gray | col-6 col-xl-8"
          @pointerdown="game.indexEnabled = true"
          @pointerup="game.indexEnabled = false"
          @pointerleave="game.indexEnabled = false"
        >
          {{ game.isTurnWhite ? game.players[0] : game.players[1] }} @ {{ game.lastPlacement }}
        </button>
        <button v-if="game.winner" class="btn btn-gray | col-6 col-xl-8 mb-auto" data-bingo="true" @click="onNextRound">
          進入下一局
        </button>
        <button v-else class="btn btn-gray | col-6 col-xl-8 mb-auto" disabled>
          {{ game.isTurnWhite ? "⚪" : "⚫" }} 的回合
        </button>
      </section>
      <section class="board | row col-xl-9 col-12 g-0">
        <Board :size="size" v-bind="game" @win="onWin" @played="onTurnChange" @capture="onCapture" :key="game.round" />
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
  .view {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  .btn-gray[data-bingo="true"] {
    color: white;
    background: linear-gradient(-90deg, var(--orange), var(--pink), var(--skyblue), var(--primary));
    background-size: 400% 400%;
    animation: AnimeGrade 15s ease infinite;
  }
  .panel {
    background-color: white;
    text-align: center;
  }
  .board {
    overflow-x: scroll;
  }
  .player-point {
  }
  @media screen and (width < 1200px) {
    h2 {
      font-size: 18px;
    }
    .panel {
      --flow-space: 0;
      --radius-size: 0;
    }
  }
</style>
