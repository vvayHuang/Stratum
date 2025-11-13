<template>
  <div class="flex items-center w-full">
    <a href="#"
      ><img src="/assets/logo.svg" alt="logo" class="h-12 w-auto"
    /></a>
    <nav class="ml-auto flex gap-8 items-center">
      <button class="font-semibold text-xl">Home</button>
      <button class="font-semibold text-xl">FAQ</button>
      
      <!-- Authenticated State -->
      <div v-if="user" class="relative">
        <button @click="isDropdownOpen = !isDropdownOpen" class="flex items-center gap-2">
          <img :src="user.user_metadata.avatar_url" alt="User Avatar" class="h-8 w-8 rounded-full" />
          <span class="font-semibold">{{ user.user_metadata.full_name }}</span>
        </button>
        
        <!-- Dropdown Menu -->
        <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
          <button 
            @click="handleSignOut" 
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      </div>

      <!-- Unauthenticated State -->
      <button v-else @click="() => emit('open-login-modal')" class="font-semibold text-xl">Login</button>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSupabaseUser, useSupabaseClient } from '#imports';

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const emit = defineEmits(['open-login-modal']);
const isDropdownOpen = ref(false);

const handleSignOut = async () => {
  await supabase.auth.signOut();
  isDropdownOpen.value = false;
};
</script>
