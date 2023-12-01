<script setup>
  import { RouterView } from "vue-router";
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="page">
      <component
        :is="Component"
        :key="$route.path"
      ></component>
    </Transition>
  </RouterView>
</template>

<style>
  @import "css/reset.css";
  @import "css/base.css";

  /* 切換頁面過場 */
  .page-enter-active,
  .page-leave-active {
    transition: opacity 0.2s;
  }
  .page-enter-from,
  .page-leave-to {
    opacity: 0;
  }
</style>
