<script setup>
  const props = defineProps({
    show: Boolean,
  });
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
          <slot name="header">default header</slot>
        </div>

        <div class="modal-body">
          <slot name="body">default body</slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            <button class="modal-default-button" @click="$emit('close')">OK</button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    transition: opacity 0.3s ease;
  }

  .modal-container {
    min-width: 300px;
    max-width: 600px;
    margin: auto;
    padding: 20px 30px;
    background-color: #fff;
    border: 5px solid var(--primary);
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
  }

  .modal-header h3 {
    margin-top: 0;
    color: var(--primary);
  }

  .modal-body {
    margin: 20px 0;
    max-height: 50vh;
    overflow: scroll;
  }

  .modal-default-button {
    float: right;
    padding: 0.25rem 1rem;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }
  .modal-default-button:hover {
    background-color: lightgray;
    transition: 0.3s;
  }
  .modal-enter-from {
    opacity: 0;
  }

  .modal-leave-to {
    opacity: 0;
  }

  .modal-enter-from .modal-container,
  .modal-leave-to .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>
