<script setup>
  import { ref, onMounted } from "vue";
  import Board from "./components/Board.vue";
  import Panel from "./components/Panel.vue";
  import Timer from "./components/Timer.vue";
  import Modal from "./components/Modal.vue";

  const boardSize = 10;
  const showModal = ref(false);
  const flags = ref({
    whiteTurn: true,
    winner: "",
    get player() {
      return this.whiteTurn ? "⚪" : "⚫";
    },
  });

  function onBoardCheck(payload) {
    if (["⚪", "⚫", "平手"].includes(payload)) {
      flags.value.winner = payload;
    } else {
      flags.value.whiteTurn = !flags.value.whiteTurn;
    }
    console.log("BoardCheck: ", payload);
  }
  function onTimeout() {
    flags.value.winner = flags.value.whiteTurn ? "⚫" : "⚪";
    showModal.value = true;
  }
  onMounted(() => {
    console.log(`棋盤大小：${boardSize}`);
    document.getElementById("app").style.setProperty("--board-size", `${boardSize}`);
  });
</script>

<template class="container-fluid">
  <div class="row">
    <aside class="col-xl-3 col-12">
      <Panel v-bind="flags" @timeout="onTimeout">
        <template #timer>
          <Timer :sec="20" v-bind="flags" @timeout="onTimeout" />
        </template>
      </Panel>
    </aside>
    <main class="col-xl-9 col-12">
      <Board :size="boardSize" v-bind="flags" @check="onBoardCheck" />
    </main>
  </div>
  <Teleport to="body">
    <Modal :show="showModal" @close="showModal = false">
      <template #header>
        <h3>超時落敗</h3>
      </template>
      <template #footer>
        <p>想太久嘍σ ﾟ∀ ﾟ&#41; ﾟ∀ﾟ&#41;σ</p>
      </template>
    </Modal>
  </Teleport>
</template>

<style>
  @import "./assets/css/reset.css";
  @import "./assets/css/bootstrap-grid.css";
  :root {
    --board-size: 19; /*預設19*/
    --orange: #ee7752;
    --pink: #e73c7e;
    --skyblue: #23a6d5;
    --lightgreen: #23d5ab;
  }
  body {
    background-color: rgb(51, 51, 51);
    font-family: "Noto Sans TC", sans-serif;
  }
  @keyframes AnimeGrade {
    0% {
      background-position: 1% 50%;
    }
    50% {
      background-position: 99% 50%;
    }
    100% {
      background-position: 1% 50%;
    }
  }
</style>
