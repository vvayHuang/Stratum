<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-8 rounded-lg shadow-xl relative w-full max-w-md mx-auto">
      <button @click="closeModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
      <h2 class="text-3xl font-extrabold mb-2 text-center text-gray-800 py-4">Welcome</h2>
      <p class="text-gray-600 text-center mb-8">Sign in with your Google account to continue</p>
      <div class="flex justify-center">
        <button @click="signInWithGoogle" class="bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-3">
          <img src="~/assets/google-g-logo.svg" alt="Google logo" class="w-6 h-6">
          <span>Sign in with Google</span>
        </button>
      </div>
      <p class="text-gray-500 text-xs text-center mt-6">
        By clicking 'Sign in with Google', you agree to our
        <a href="#" class="text-blue-600 hover:underline font-medium">Terms of Service</a> and
        <a href="#" class="text-blue-600 hover:underline font-medium">Privacy Policy</a>.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);

const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
};

const signInWithGoogle = () => {
  console.log('Placeholder for Google Sign-In');
  // In a real scenario, this would initiate the Google Auth flow
  // For now, we'll just close the modal after a simulated delay
  setTimeout(() => {
    closeModal();
    // Optionally, emit an event to indicate successful login (for placeholder purposes)
    // emit('login-success');
  }, 1000);
};

defineExpose({
  openModal,
  closeModal,
});
</script>

<style scoped>
/* You can add more styling here if needed */
</style>
