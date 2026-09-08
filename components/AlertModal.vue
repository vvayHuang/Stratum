<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="close">
    <div class="flex flex-col items-start text-left bg-light-surface-bright p-6 rounded-[28px] max-w-[312px]">
      <div class="mb-4 text-light-on-surface-variant">
        <MaterialIcon :name="icon" size="24" />
      </div>
      <h2 class="text-1xl font-bold mb-4 font-brand text-light-on-surface leading-tight">{{ title }}</h2>
      <p class="text-light-on-surface-variant mb-8 leading-relaxed">{{ message }}</p>

      <div class="flex gap-3 w-full justify-end">
        <Button variant="primary" customClass="py-2.5 px-6 font-bold" @click="close">
          {{ confirmLabel }}
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
const icon = ref('error');
const title = ref('Something went wrong');
const message = ref('');
const confirmLabel = ref('OK');

const emit = defineEmits(['close']);

const open = (options = {}) => {
  icon.value = options.icon ?? 'error';
  title.value = options.title ?? 'Something went wrong';
  message.value = options.message ?? '';
  confirmLabel.value = options.confirmLabel ?? 'OK';
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
  emit('close');
};

defineExpose({ open, close });
</script>

<style scoped></style>
