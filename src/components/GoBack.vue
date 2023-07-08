<script setup>
  import { useRouter } from "vue-router";
  const router = useRouter();
</script>
<template>
  <a @click="router.go(-1)">
    <slot>返回上一頁</slot>
  </a>
</template>
