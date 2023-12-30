<script setup lang="ts">
  import { ref } from "vue";
  import Modal from "../components/Modal.vue";
  import RuleGuideClassic from "../views/RuleGuideClassic.vue";
  import RuleGuidePente from "../views/RuleGuidePente.vue";
  defineProps({
    show: Boolean,
    ruleGuide: String,
  });
  const emit = defineEmits(["open", "close"]);

  const isShowRule = ref(false);
</script>
<template>
  <button
    class="menu-btn"
    @click="emit('open')"
  >
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
    <Transition name="menu">
      <div
        v-if="show"
        class="mask"
        @click="emit('close')"
      >
        <ul class="menu-lists">
          <li>
            <RouterLink
              to="/"
              class="btn-list"
              >返回主頁
            </RouterLink>
          </li>
          <li>
            <a
              class="btn-list"
              @click="isShowRule = true"
              >規則說明</a
            >
          </li>
        </ul>
      </div>
    </Transition>
    <Modal
      :show="isShowRule"
      @close="isShowRule = false"
    >
      <template #header> 規則 </template>
      <template #body>
        <RuleGuidePente v-if="ruleGuide === 'pente'"></RuleGuidePente>
        <RuleGuideClassic v-else></RuleGuideClassic>
      </template>
    </Modal>
  </Teleport>
</template>
<style scoped>
  .menu-btn {
    width: 40px;
    height: 40px;
    line-height: 1em;
    border: none;
    background-color: white;
    border-radius: 20px;
    cursor: pointer;
    z-index: 1;
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    &:hover {
      background-color: lightgray;
    }
  }
  .mask {
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    transition: opacity 0.3s ease;
  }
  .menu-lists {
    padding: 0;
    margin: auto auto;
    list-style: none;
    transition: all 0.3s ease;
    .btn-list {
      border: 5px solid rgba(0, 0, 0, 0.1);
      border-radius: var(--radius-size);
      padding: 0.5em 1em;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      display: block;
      background-color: var(--primary);
      font-weight: bold;
      letter-spacing: 0.25em;
      color: darkslategrey;
      &:hover {
        background-color: var(--secondary);
      }
    }
    & > * + * {
      margin-top: 2rem;
    }
  }

  .menu-enter-from,
  .menu-leave-to {
    opacity: 0;
  }
</style>
