<script setup lang="ts">
  import { ref, onMounted, reactive, computed, watchEffect, onUnmounted } from "vue";
  import Board from "../components/Board.vue";
  import Modal from "../components/Modal.vue";
  import MenuBtn from "../components/MenuBtn.vue";
  import { RouterLink } from "vue-router";
  import { useTimer } from "../helpers/countDownTimer";
  import { formatSecToMMSS } from "../helpers/utils";
  import { Game } from "../typedef";
  const scoreMap = {
    "one-round": 1,
    "two-out-of-three": 2,
    "three-out-of-five": 3,
  };
  const props = defineProps<Game.Setup>();
  const game = reactive<Game.Status>({
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
    goalScore: scoreMap[props.roundType],
  });

  const isGameOver = computed(() => game.winCounts.some((value) => value >= game.goalScore));
  const isMenuEnabled = ref(false);
  const timer = reactive(useTimer(props.sec));

  function onCountDown(time: number) {
    if (time <= 0) {
      const winner = game.isTurnWhite ? game.players[0] : game.players[1];
      game.isTimeOut = true;
      onWin(winner);
    }
  }
  function onCapture(point: number) {
    const i = game.isTurnWhite ? 0 : 1;
    game.captures[i] += point;
    if (game.captures.some((value) => value >= 10)) onWin(game.players[i]);
  }
  function onTurnChange(index: string) {
    game.isTurnWhite = !game.isTurnWhite;
    game.lastPlacement = index;
    timer.restart();
  }
  function onWin(winner: string) {
    game.winner = winner;
    timer.pause();
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
    timer.resume();
    console.log(`棋盤大小：${props.size}`);
    const app = document.getElementById("app");
    if (app instanceof HTMLElement) app.style.setProperty("--board-size", `${props.size}`);
    if (props.gameType === "pente") game.players.reverse();
  });
  onUnmounted(() => {
    timer.pause();
  });
  watchEffect(() => {
    onCountDown(timer.sec);
  });
</script>

<template>
  <div class="view">
    <div class="panel">
      <MenuBtn
        class="btn-menu"
        :show="isMenuEnabled"
        :ruleGuide="gameType"
        @open="isMenuEnabled = true"
        @close="isMenuEnabled = false"
      >
      </MenuBtn>
      <h2
        class="round-info"
        v-if="!!game.winner"
      >
        {{ game.winner }}獲勝
      </h2>
      <h2
        class="round-info"
        v-else
      >
        第{{ game.round }}回合
      </h2>
      <div class="score-info">
        <span>
          {{ game.players[0] }} ⚫
          <br />
          {{ `${game.winCounts[0]}勝` }}
          <strong class="player-point">{{ gameType === "pente" ? `  (補獲${game.captures[0]}/10)` : "" }}</strong>
        </span>
        <span>
          {{ game.players[1] }} ⚪
          <br />
          {{ `${game.winCounts[1]}勝` }}
          <strong class="player-point">{{ gameType === "pente" ? `  (補獲${game.captures[1]}/10)` : "" }}</strong>
        </span>
      </div>
      <button
        class="timer"
        :disabled="!!game.winner"
        @click="timer.isCountingDown ? timer.pause() : timer.resume()"
      >
        <h2>{{ formatSecToMMSS(timer.sec) }}</h2>
        <svg
          v-if="timer.isCountingDown"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-pause-circle-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-play-circle-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"
          />
        </svg>
      </button>
      <div class="btn-group">
        <button
          class="btn-index"
          @pointerdown="game.indexEnabled = true"
          @pointerup="game.indexEnabled = false"
          @pointerleave="game.indexEnabled = false"
        >
          {{ game.isTurnWhite ? game.players[0] : game.players[1] }} @ {{ game.lastPlacement }}
        </button>
        <button
          v-if="game.winner"
          class="btn-turn"
          data-bingo="true"
          @click="onNextRound"
        >
          進入下一局
        </button>
        <button
          v-else
          class="btn-turn"
          disabled
        >
          {{ game.isTurnWhite ? "⚪" : "⚫" }} 的回合
        </button>
      </div>
    </div>
    <div class="play-area">
      <Board
        class="board"
        :size="size"
        v-bind="game"
        @win="onWin"
        @played="onTurnChange"
        @capture="onCapture"
        :key="game.round"
      />
    </div>
    <Teleport to="body">
      <Modal
        :show="game.isTimeOut"
        @close="game.isTimeOut = false"
      >
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
          <RouterLink
            to="/"
            class="btn-modal"
          >
            回到主畫面
          </RouterLink>
        </template>
      </Modal>
    </Teleport>
  </div>
</template>
<style scoped>
  .view {
    height: 100vh;
    height: 100svh;
    display: flex;
    align-items: stretch;
    @media screen and (max-width: 1200px) {
      flex-direction: column;
    }
  }
  .play-area {
    overflow: scroll;
    width: 100%;
    height: 100%;
  }
  .panel {
    min-width: 300px;
    background-color: #fff;
    padding: 2rem;
    position: relative;
    text-align: center;
    /* flex-shrink: 0; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1.5rem;
    @media screen and (max-width: 1200px) {
      padding: 16px 0 0 0;
      gap: 0;
    }
  }
  .timer {
    padding: 0.5rem 1rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    background-color: var(--light);
    border: 5px solid var(--skyblue);
    border-radius: var(--radius-size);
    cursor: pointer;
    &:hover {
      background-color: var(--gray-300);
    }
    @media screen and (max-width: 1200px) {
      border-radius: 0;
    }
  }
  .btn-group {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    @media screen and (max-width: 1200px) {
      gap: 0;
      flex-direction: row;
      button {
        width: 100%;
      }
    }
  }
  .btn-index {
    border: 5px solid rgba(0, 0, 0, 0.1);
    border-radius: var(--radius-size);
    background-color: var(--light);
    color: black;
    padding: 0.5em 1em;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      background-color: var(--gray-300);
    }
    @media screen and (max-width: 1200px) {
      border-radius: 0;
    }
  }

  .btn-turn {
    border: 5px solid rgba(0, 0, 0, 0.1);
    border-radius: var(--radius-size);
    background-color: var(--gray-600);
    color: #fff;
    padding: 0.5em 1em;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    &[data-bingo="true"] {
      color: white;
      background: linear-gradient(-90deg, var(--orange), var(--pink), var(--skyblue), var(--primary));
      background-size: 400% 400%;
      animation: AnimeGrade 15s ease infinite;
    }
    @media screen and (max-width: 1200px) {
      border-radius: 0;
    }
  }
  .btn-menu {
    position: absolute;
    width: 24px;
    height: 24px;
    top: 0;
    left: 0;
  }
  .btn-modal {
    float: right;
    padding: 0.25rem 1rem;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    color: #000;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      background-color: lightgray;
      transition: 0.3s;
    }
  }
  .round-info {
    margin-bottom: 6rem;
    @media screen and (max-width: 1200px) {
      font-size: 18px;
      margin: 0;
    }
  }
  .score-info {
    display: flex;
    justify-content: space-around;
    padding: 8px 0;
  }

  .bi {
    width: 25px;
    height: 25px;
    color: var(--skyblue);
  }
</style>
../global ../typedef
