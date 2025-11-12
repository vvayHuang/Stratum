<template>
  <div class="flex items-center w-full">
    <a href="#"
      ><img src="/assets/logo.svg" alt="logo" class="h-12 w-auto"
    /></a>
    <nav class="ml-auto flex gap-8 items-center">
      <button class="font-semibold text-xl">Home</button>
      <button class="font-semibold text-xl">FAQ</button>
      <button v-if="!isLoggedIn" @click="$emit('open-login-modal')" class="font-semibold text-xl">Login</button>
    </nav>
  </div>
</template>

<script setup>
const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['open-login-modal']);
</script>
