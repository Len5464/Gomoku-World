<script setup>
  import { RouterView } from "vue-router";
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition>
      <component :is="Component" :key="$route.path"></component>
    </Transition>
  </RouterView>
</template>

<style>
  @import "css/reset.css";
  @import "css/bootstrap-grid.css";
  @import "css/variable.css";
  @import "css/global.css";
</style>
