<script setup></script>
<template>
  <div class="full-screen bg-orange-blocks d-flex flex-column">
    <header class="position-relative d-flex h-50 p-3" style="min-height: 380px">
      <img src="../assets/header.png" alt="Header Image" />
      <h1 class="position-absolute top-100 start-50 translate-middle fs-24px bg-dark text-light px-3 py-1 round">
        單機五子棋
      </h1>
    </header>
    <main
      class="mx-auto h-50 d-flex flex-column justify-content-center align-items-stretch"
      style="gap: 2rem; width: 300px"
    >
      <RouterLink to="rule" class="btn btn-primary">經典規則</RouterLink>
      <RouterLink :to="{ name: 'rule', query: { gameType: 'pente' } }" class="btn btn-primary">玉攻棋</RouterLink>
    </main>
  </div>
</template>

<style scoped>
  img {
    margin: auto auto 0 auto;
    width: 80vw;
    max-width: 920px;
    height: auto;
  }
</style>
