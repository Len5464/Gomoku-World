<script setup>
  import { ref } from "vue";
  import GoBack from "../components/GoBack.vue";
  import NavTabs from "../components/NavTabs.vue";
  const show = ref(false);
</script>
<template>
  <div class="view row">
    <a
      class="title | text-align-center mt-auto"
      @pointerdown="show = true"
      @pointerup="show = false"
      @pointerleave="show = false"
    >
      ...建設中{{ show ? "🏗️" : "..." }}
    </a>
    <!-- <div>
      <NavTabs :tab-names="['A', 'B', 'C', 'D']">
        <h2 class="me-auto">標題！！！！</h2>
        <template #tab1>Apple</template>
        <template #tab2>Bee</template>
        <template #tab3>Cat</template>
        <template #tab4>Dog</template>
      </NavTabs>
    </div> -->
    <GoBack class="btn btn-primary | mx-auto mb-auto col-6"></GoBack>
  </div>
</template>
<style scoped>
  .view {
    height: 100vh;
    background-color: darkgrey;
  }
  .title {
    font-size: 5rem;
    cursor: pointer;
  }
</style>
