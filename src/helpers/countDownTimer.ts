import { Ref, computed, ref } from "vue";

export interface Timer {
  sec: Ref<number>;
  isCountingDown: Ref<boolean>;
  resume: () => void;
  pause: () => void;
  restart: () => void;
}

export function useTimer(duration: number): Timer {
  const currentTime = ref(duration);
  const token = ref(0);
  const isCountingDown = computed(() => token.value > 0);
  const timer = {
    sec: currentTime,
    isCountingDown: isCountingDown,
    resume() {
      token.value = setInterval(() => {
        currentTime.value > 0 ? currentTime.value-- : this.pause();
      }, 1000);
    },
    pause() {
      clearInterval(token.value);
      token.value = 0;
    },
    restart() {
      this.pause();
      currentTime.value = duration;
      this.resume();
    },
  };

  return timer;
}
