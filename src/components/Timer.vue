<script setup>
  // @ts-check
  import { onMounted, onUnmounted, ref } from "vue";
  const props = defineProps({
    time: { type: Number, required: true },
  });
  const emit = defineEmits({ countdown: Number });
  const currentTime = ref(props.time);
  const id = ref(0);
  function resume() {
    id.value = setInterval(() => {
      emit("countdown", currentTime.value);
      currentTime.value > 0 ? currentTime.value-- : pause();
    }, 1000);
  }
  function pause() {
    clearInterval(id.value);
    id.value = 0;
  }
  function reset() {
    pause();
    currentTime.value = props.time;
    resume();
  }
  defineExpose({
    resume,
    pause,
    reset,
  });
  onMounted(() => {
    resume();
  });

  onUnmounted(() => {
    pause();
  });
</script>
<template>
  <slot :time="currentTime" :isRunning="id > 0" :pause="pause" :resume="resume" :reset="reset"></slot>
</template>
