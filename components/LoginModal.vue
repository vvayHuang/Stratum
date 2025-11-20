<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-10 rounded-lg shadow-lg text-center relative max-w-lg">
      <button @click="closeModal" class="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
      <h2 class="text-4xl font-bold mb-2 text-gray-800">Welcome to SideBling</h2>
      <p class="mb-6 text-gray-600">Sign in to get personalized career advice and unlock full features.</p>
      <button
        @click="signInWithGoogle"
        class="bg-white border border-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full flex items-center justify-center w-full mb-4"
      >
        <img src="/assets/google-g-logo.svg" alt="Google logo" class="w-5 h-5 mr-2" />
        Sign in with Google
      </button>
      <p class="text-xs text-gray-500">By signing in, you agree to our <a href="#" class="underline">Privacy Policy</a> and <a href="#" class="underline">Terms of Service</a>.</p>
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
