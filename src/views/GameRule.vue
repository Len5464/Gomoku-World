<script setup>
  import { onMounted, ref, watchEffect } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import GoBack from "../components/GoBack.vue";
  import NavTabs from "../components/NavTabs.vue";
  import RuleGuideClassic from "../views/RuleGuideClassic.vue";
  import RuleGuidePente from "../views/RuleGuidePente.vue";
  const router = useRouter();
  const route = useRoute();
  const rule = ref({
    size: 15,
    sec: 120,
    players: ["玩家一", "玩家二"],
    roundType: "only-one",
    gameType: route.query?.gameType || "classic",
  });
  const sizeRange = [5, 30];
  const timeRange = [60, 600];
  function onSubmit() {
    if (rule.value.size > sizeRange[1] || rule.value.size < sizeRange[0])
      window.alert(`棋盤大小必須介於${sizeRange}之間`);
    else if (rule.value.sec > timeRange[1] || rule.value.sec < timeRange[0])
      window.alert(`遊戲時間必須介於${timeRange}秒之間`);
    else router.push({ name: "game", query: rule.value });
  }
  onMounted(() => {
    console.log();
  });
</script>
<template>
  <div class="view">
    <nav class="window | container">
      <NavTabs :tab-names="['遊戲規則', '遊戲設定']">
        <GoBack class="btn-back | me-auto">←</GoBack>
        <template #tab1>
          <RuleGuidePente v-if="route.query.gameType === 'pente'"></RuleGuidePente>
          <RuleGuideClassic v-else></RuleGuideClassic>
        </template>
        <template #tab2>
          <form class="container">
            <ul class="row align-items-center g-3 mt-5">
              <li class="d-flex col-lg-6">
                <label class="me-auto" for="size">棋盤大小:</label>
                <input
                  class="col-6 me-4"
                  type="number"
                  id="size"
                  name="size"
                  required
                  :min="sizeRange[0]"
                  :max="sizeRange[1]"
                  v-model="rule.size"
                />
              </li>
              <li class="d-flex col-lg-6">
                <label class="me-auto" for="sec">回合時間:</label>
                <input
                  class="col-6 me-4"
                  type="number"
                  id="sec"
                  name="sec"
                  required
                  :min="timeRange[0]"
                  :max="timeRange[1]"
                  v-model="rule.sec"
                  placeholder="秒"
                />
              </li>
              <li class="d-flex col-lg-6">
                <label class="me-auto" for="player1">先手玩家:</label>
                <input
                  class="col-6 me-4"
                  id="player1"
                  name="player1"
                  required
                  maxlength="10"
                  v-model="rule.players[0]"
                  placeholder="請輸入名稱"
                />
              </li>
              <li class="d-flex col-lg-6">
                <label class="me-auto" for="player2">後手玩家:</label>
                <input
                  class="col-6 me-4"
                  id="player2"
                  name="player2"
                  required
                  maxlength="10"
                  v-model="rule.players[1]"
                  placeholder="請輸入名稱"
                />
              </li>
              <li class="d-flex col-lg-6">
                <label class="me-auto" for="round">選擇回合數</label>
                <select class="me-4" name="round" id="round" v-model="rule.roundType">
                  <option value="only-one">單回合決勝負</option>
                  <option value="two-out-of-three">三戰兩勝</option>
                  <option value="three-out-of-five">五戰三勝</option>
                </select>
              </li>
            </ul>
            <div class="row mt-5">
              <a class="btn btn-primary | col-6 col-lg-4 mx-auto" @click="onSubmit">開始遊戲</a>
            </div>
          </form>
        </template>
      </NavTabs>
    </nav>
  </div>
</template>
<style scoped>
  .view {
    width: 100vw;
    height: 100vh;
    background-image: url("bg.svg");
    background-position: center center;
    background-size: 5%;
  }
  .tab {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .window {
    position: relative;
    top: 20%;
  }
  .btn-back {
    border-radius: 10px 10px 0px 0px;
    background-color: #fff;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  .btn-back:hover {
    background-color: lightgrey;
  }

  input:invalid {
    box-shadow: 0px 0px 10px var(--pink);
  }
  @media screen and (width < 625px) {
    ul {
      padding: 0;
    }
  }
</style>
