<script setup>
  import { ref } from "vue";
  import Modal from "../components/Modal.vue";
  import RuleGuideClassic from "../views/RuleGuideClassic.vue";
  import RuleGuidePente from "../views/RuleGuidePente.vue";
  const props = defineProps({
    show: Boolean,
    ruleGuide: String,
  });

  const isShowRule = ref(false);
</script>
<template>
  <button class="hamburger" @click="$emit('open')">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      class="bi bi-list"
      viewBox="0 0 16 16"
    >
      <path
        fill-rule="evenodd"
        d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
      />
    </svg>
  </button>
  <Teleport to="body">
    <Transition>
      <div v-if="show" class="wrap">
        <ul class="lists">
          <li><RouterLink to="/" class="btn btn-primary">返回主頁</RouterLink></li>
          <li><a class="btn btn-primary" @click="isShowRule = true">規則說明</a></li>
        </ul>
        <button @click="$emit('close')" style="color: red">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            class="bi bi-x-lg"
            viewBox="0 0 16 16"
          >
            <path
              d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
            />
          </svg>
        </button>
      </div>
    </Transition>
    <Modal :show="isShowRule" @close="isShowRule = false">
      <template #header> 規則 </template>
      <template #body>
        <RuleGuidePente v-if="ruleGuide === 'pente'"></RuleGuidePente>
        <RuleGuideClassic v-else></RuleGuideClassic>
      </template>
    </Modal>
  </Teleport>
</template>
<style scoped>
  button {
    width: 40px;
    height: 40px;
    line-height: 1em;
    border: none;
    background-color: white;
    border-radius: var(--radius-size, 20px);
    cursor: pointer;
    z-index: 1;
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
  }
  button:hover {
    background-color: lightgray;
  }
  .wrap {
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
  }
  .lists {
    padding: 0;
    margin: auto auto;
    list-style: none;
  }
  .lists > * + * {
    margin-top: 2rem;
  }
</style>
