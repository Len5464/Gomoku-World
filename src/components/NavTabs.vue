<script setup>
  import { ref } from "vue";
  const props = defineProps({
    tabNames: {
      type: Array,
      default: ["tab1", "tab2", "tab3"],
    },
  });
  const checked = ref(1);
</script>
<template>
  <div class="head">
    <slot></slot>
    <template v-for="index in tabNames.length" :key="index">
      <input type="radio" name="tabs" :id="`tab${index}`" :value="index" v-model="checked" />
      <label :for="`tab${index}`"> {{ tabNames[index - 1] }} </label>
    </template>
  </div>
  <template v-for="index in tabNames.length" :key="index">
    <div class="tab" v-show="checked === index">
      <slot :name="`tab${index}`">請將內容添加到插槽#tab{{ index }}</slot>
    </div>
  </template>
</template>
<style scoped>
  input {
    display: none;
  }
  input + label {
    display: inline-block;
    border: 1px solid #00000030;
    border-radius: 10px 10px 0 0;
    background: #eee;
    padding: 4px 12px;
    position: relative;
    top: 1px;
    font-size: 1.25rem;
  }
  input:checked + label {
    background: #fff;
    border-bottom: 1px solid transparent;
  }
  .head {
    display: flex;
  }
  .tab {
    border-top: 1px solid #999;
    background-color: #fff;
    border-radius: 0 0 10px 10px;
    padding: 2rem;
  }
</style>
