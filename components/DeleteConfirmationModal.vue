<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-light-surface p-10 rounded-lg shadow-lg text-center relative max-w-lg w-full mx-4">
      <button @click="closeModal" class="absolute top-2 right-4 text-light-outline hover:text-light-on-surface text-2xl">&times;</button>
      <h2 class="text-3xl font-bold mb-6 text-light-on-surface">Are you sure you want to delete this idea?</h2>
      
      <div class="flex gap-4 justify-center">
        <button
          @click="closeModal"
          class="flex-1 bg-transparent border border-light-outline text-light-on-surface font-bold py-3 px-6 rounded-full hover:bg-light-surface-variant transition-colors"
        >
          Cancel
        </button>
        <button
          @click="confirmDelete"
          class="flex-1 bg-light-error text-light-on-error font-bold py-3 px-6 rounded-full hover:opacity-90 transition-opacity"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);
const emit = defineEmits(['confirm', 'close']);

const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
  emit('close');
};

const confirmDelete = () => {
  emit('confirm');
  closeModal();
};

defineExpose({
  openModal,
  closeModal,
});
</script>

<style scoped>
</style>
