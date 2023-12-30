<script setup lang="ts">
  import { ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import GoBack from "../components/GoBack.vue";
  import NavTabs from "../components/NavTabs.vue";
  import RuleGuideClassic from "../views/RuleGuideClassic.vue";
  import RuleGuidePente from "../views/RuleGuidePente.vue";
  import { Game, ROUND_TYPES } from "../typedef";
  import { isGameType } from "../helpers/utils";
  const router = useRouter();
  const route = useRoute();
  const gameTypeStr = route.query?.gameType?.toString();
  if (!isGameType(gameTypeStr)) throw new Error(`Invalid gameType: ${gameTypeStr}`);

  const rule = ref<Game.Setup>({
    size: 15,
    sec: 120,
    players: ["玩家一", "玩家二"],
    roundType: ROUND_TYPES[0],
    gameType: gameTypeStr,
  });
  const sizeRange = [5, 20];
  const timeRange = [60, 600];
  function onSubmit() {
    if (rule.value.size > sizeRange[1] || rule.value.size < sizeRange[0])
      window.alert(`棋盤大小必須介於${sizeRange}之間`);
    else if (rule.value.sec > timeRange[1] || rule.value.sec < timeRange[0])
      window.alert(`遊戲時間必須介於${timeRange}秒之間`);
    else router.push({ name: "game", query: rule.value });
  }
</script>
<template>
  <div class="view">
    <NavTabs
      class="container"
      :tab-names="['遊戲規則', '遊戲設定']"
    >
      <GoBack class="btn-back">←</GoBack>
      <template #tab1>
        <RuleGuidePente v-if="route.query.gameType === 'pente'"></RuleGuidePente>
        <RuleGuideClassic v-else></RuleGuideClassic>
      </template>
      <template #tab2>
        <form class="container">
          <ul
            class="setting-lists"
            role="list"
          >
            <li>
              <label for="size">棋盤大小:</label>
              <input
                type="number"
                id="size"
                name="size"
                required
                :min="sizeRange[0]"
                :max="sizeRange[1]"
                v-model="rule.size"
              />
            </li>
            <li>
              <label for="sec">回合時間:</label>
              <input
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
            <li>
              <label for="player1">先手玩家:</label>
              <input
                id="player1"
                name="player1"
                required
                maxlength="10"
                v-model="rule.players[0]"
                placeholder="請輸入名稱"
              />
            </li>
            <li>
              <label for="player2">後手玩家:</label>
              <input
                id="player2"
                name="player2"
                required
                maxlength="10"
                v-model="rule.players[1]"
                placeholder="請輸入名稱"
              />
            </li>
            <li>
              <label for="round">選擇回合數:</label>
              <select
                name="round"
                id="round"
                v-model="rule.roundType"
              >
                <option :value="ROUND_TYPES[0]">單回合決勝負</option>
                <option :value="ROUND_TYPES[1]">三戰兩勝</option>
                <option :value="ROUND_TYPES[2]">五戰三勝</option>
              </select>
            </li>
          </ul>
          <div class="setting-footer">
            <a
              class="btn-play"
              @click="onSubmit"
              >開始遊戲
            </a>
          </div>
        </form>
      </template>
    </NavTabs>
  </div>
</template>
<style scoped>
  .container {
    max-width: 1440px;
    margin-right: auto;
    margin-left: auto;
    padding-left: 12px;
    padding-right: 12px;
  }
  .view {
    height: 100vh;
    height: 100svh;
    padding: 160px 0;
    background-image: url("../assets/bg.svg");
    background-position: center center;
    background-size: 5%;
  }
  .setting-lists {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 1.5rem;
    column-gap: 5rem;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    input,
    select {
      width: 11em;
    }
    label {
      margin-right: 1rem;
    }
    @media screen and (max-width: 768px) {
      grid-template-columns: 1fr;
      input,
      select {
        width: 100px;
      }
    }
  }
  .setting-footer {
    padding-top: 2rem;
    display: flex;
    justify-content: center;
  }
  .btn-play {
    border: 5px solid rgba(0, 0, 0, 0.1);
    border-radius: var(--radius-size);
    padding: 0.5em 1em;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    display: block;
    background-color: var(--primary);
    font-weight: bold;
    letter-spacing: 0.25em;
    color: darkslategrey;
    &:hover {
      background-color: var(--secondary);
    }
  }
  .btn-back {
    border-top: 1px solid #999;
    background-color: #fff;
    border-radius: 10px 10px 0 0;
    margin-right: auto;
    font-size: 1.5rem;
    padding: 0 2rem;
    cursor: pointer;
    &:hover {
      background-color: var(--light);
    }
  }
</style>
../typedef
