<template>
  <div v-if="isLoading" class="loader-overlay">
    <div class="loader"></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isLoading: {
    type: Boolean,
    required: true
  }
})
</script>

<style scoped>
.loader {
  margin: 200px auto;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  background: linear-gradient(0deg, rgba(240, 12, 12, 0.2) 33%, var(--red-color) 100%);
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
.loader::after {
  content: '';
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--background-color);
}
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
