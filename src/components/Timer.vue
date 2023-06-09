<script setup>
  import { computed, onMounted, onUnmounted, ref, watch } from "vue";
  const props = defineProps({ sec: Number, player: String, winner: String });
  const emit = defineEmits(["timeout"]);

  class Timer {
    constructor(time) {
      this.sec = time;
      this.id = 0;
    }
    pause() {
      clearInterval(this.id);
      this.id = 0;
    }
    resume(callback) {
      this.id = setInterval(() => {
        callback(this.sec, this.id);
        this.sec > 0 ? this.sec-- : this.pause();
      }, 1000);
    }
  }
  const timer = ref(new Timer(props.sec));
  const formattedTime = computed(
    () => `
        ${Math.floor(timer.value.sec / 60 / 10)}${Math.floor((timer.value.sec / 60) % 10)}:
        ${Math.floor((timer.value.sec % 60) / 10)}${Math.floor((timer.value.sec % 60) % 10)}
        `
  );

  function checkTimeOut(time, id) {
    if (time <= 0) emit("timeout");
  }
  watch(props, () => {
    if (timer.value.id) timer.value.pause();
    if (!props.winner) {
      timer.value.sec = props.sec;
      timer.value.resume(checkTimeOut);
    }
  });
  onMounted(() => {
    timer.value.resume(checkTimeOut);
  });
  onUnmounted(() => {
    timer.value.pause();
  });
</script>
<template>
  <div class="timer">
    <h1 class="display">{{ formattedTime }}</h1>
    <button class="btn-media" :disabled="!!props.winner" @click="timer.id ? timer.pause() : timer.resume(checkTimeOut)">
      {{ timer.id === 0 ? "▶️" : "⏸️" }}
    </button>
  </div>
</template>
<style scoped>
  .timer {
    border: 5px solid var(--skyblue);
    border-radius: 20px;
    display: flex;
    gap: 0.25rem;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
  }
  .display {
    width: 80px;
  }
  .btn-media {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1.5rem;
  }
</style>
