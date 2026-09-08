<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="dismiss">
    <div class="flex flex-col items-start text-left bg-light-surface-bright p-6 rounded-[28px] max-w-[312px]">
      <div v-if="options.icon" class="mb-4 text-light-on-surface-variant">
        <MaterialIcon :name="options.icon" size="24" />
      </div>
      <h2 class="text-1xl font-bold mb-4 font-brand text-light-on-surface leading-tight">{{ options.title }}</h2>
      <p class="text-light-on-surface-variant mb-8 leading-relaxed">{{ options.message }}</p>

      <div class="flex gap-3 w-full justify-end">
        <!-- 沒有 cancelLabel 就是單一按鈕的提示型 dialog -->
        <Button v-if="options.cancelLabel" variant="text" customClass="py-2.5 px-6 font-bold" @click="dismiss">
          {{ options.cancelLabel }}
        </Button>
        <Button :variant="options.confirmVariant" customClass="py-2.5 px-6 font-bold" @click="confirm">
          {{ options.confirmLabel }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from './Button.vue';
import MaterialIcon from './MaterialIcon.vue';

const defaults = {
  icon: null,
  title: '',
  message: '',
  confirmLabel: 'OK',
  confirmVariant: 'primary',
  cancelLabel: null,
};

const isOpen = ref(false);
const options = ref({ ...defaults });
let settleResult = null;

// open() 回傳 Promise：確認為 true，取消或關閉為 false。
// 呼叫端不必額外管理「待確認的目標」這種中間狀態。
const open = (opts = {}) => {
  settle(false); // 若前一個 dialog 還開著，先讓它的 Promise 有結果
  options.value = { ...defaults, ...opts };
  isOpen.value = true;
  return new Promise((resolve) => {
    settleResult = resolve;
  });
};

const settle = (result) => {
  isOpen.value = false;
  if (settleResult) {
    settleResult(result);
    settleResult = null;
  }
};

const confirm = () => settle(true);
const dismiss = () => settle(false);

defineExpose({ open, close: dismiss });
</script>

<style scoped></style>
