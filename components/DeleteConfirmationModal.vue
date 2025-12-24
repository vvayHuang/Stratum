<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="flex flex-col items-start text-left bg-light-surface-bright p-6 rounded-[28px] max-w-[312px]">
      <div class="mb-4 text-light-on-surface-variant">
        <MaterialIcon name="warning" size="24" />
      </div>
      <h2 class="text-1xl font-bold mb-4 font-brand text-light-on-surface leading-tight">Are you sure you want to delete
        this idea?</h2>
      <p class="text-light-on-surface-variant mb-8 leading-relaxed">
        This action cannot be undone. This will permanently delete the idea and remove it from your dashboard.
      </p>

      <div class="flex gap-3 w-full justify-end">
        <Button variant="text" customClass="py-2.5 px-6 font-bold" @click="closeModal">
          Cancel
        </Button>
        <Button variant="error" customClass="py-2.5 px-6 font-bold" @click="confirmDelete">
          Delete
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from './Button.vue';
import MaterialIcon from './MaterialIcon.vue';

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

<style scoped></style>
