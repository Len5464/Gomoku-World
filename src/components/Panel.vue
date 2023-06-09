<script setup>
  // @ts-check
  const props = defineProps({ winner: String, player: String });
  const restart = () => location.reload();
</script>
<template>
  <div class="panel">
    <h1 class="title d-none d-lg-block">五子棋遊戲</h1>
    <slot name="timer"></slot>
    <button v-if="props.winner" class="btn-monitor" data-bingo="true" @click="restart">
      獲勝者是 {{ props.winner }} <br />重新開始遊戲
    </button>
    <button v-else class="btn-monitor">{{ player }} 的回合</button>
  </div>
</template>
<style scoped>
  .panel {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-color: whitesmoke;
    padding: 1rem 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .title {
    text-align: center;
    padding: 1rem;
  }
  .btn-monitor {
    padding: 0.5em 2em;
    line-height: 2.5rem;
    background-color: gray;
    color: #fff;
    border: 5px solid rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    cursor: pointer;
  }
  .btn-monitor[data-bingo="true"] {
    background: linear-gradient(-90deg, var(--orange), var(--pink), var(--skyblue), var(--lightgreen));
    background-size: 400% 400%;
    animation: AnimeGrade 15s ease infinite;
  }
  @media screen and (width > 1200px) {
    .panel {
      flex-direction: column;
      height: 100%;
    }
    .btn-monitor {
      font-size: 1.25rem;
    }
  }
</style>
