<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-light-surface p-10 rounded-lg shadow-lg text-center relative max-w-lg">
      <button @click="closeModal" class="absolute top-2 right-4 text-light-outline hover:text-light-on-surface text-2xl">&times;</button>
      <h2 class="text-4xl font-bold mb-2 text-light-on-surface">Welcome to Stratum</h2>
      <p class="mb-6 text-light-on-surface-variant">Sign in to get personalized career advice and unlock full features.</p>
      <button
        @click="signInWithGoogle"
        class="bg-light-surface border border-light-outline-variant text-light-on-surface font-bold py-3 px-6 rounded-full flex items-center justify-center w-full mb-4"
      >
        <img src="/assets/google-g-logo.svg" alt="Google logo" class="w-5 h-5 mr-2" />
        Sign in with Google
      </button>
      <p class="text-xs text-light-outline">By signing in, you agree to our <a href="#" class="underline">Privacy Policy</a> and <a href="#" class="underline">Terms of Service</a>.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSupabaseClient } from '#imports';

const supabase = useSupabaseClient();
const isOpen = ref(false);

const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) {
    console.error('Error signing in with Google:', error.message);
  }
};

const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
};

defineExpose({
  openModal,
  closeModal,
});
</script>

<style scoped>
/* You can add more specific styling here if needed */
</style>
