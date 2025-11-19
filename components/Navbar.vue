<template>
  <div class="relative flex items-center justify-between w-full">
    <!-- Left side: Hamburger Menu + Logo -->
    <div class="flex items-center gap-4">
      <!-- Hamburger Menu (visible on tablet/mobile) -->
      <div class="lg:hidden">
        <button @click="isMenuOpen = true" class="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Logo -->
      <NuxtLink to="/">
        <img src="/assets/logo.svg" alt="logo" class="h-12 w-auto" />
      </NuxtLink>
    </div>

    <!-- Right side: Desktop Navigation + User Info -->
    <div class="hidden lg:flex items-center gap-8">
      <!-- Desktop Navigation -->
      <nav class="flex gap-8 items-center">
        <NuxtLink to="/" class="font-semibold text-xl">Home</NuxtLink>
        <button class="font-semibold text-xl">FAQ</button>
        <NuxtLink v-if="user" to="/my-ideas" class="font-semibold text-xl">My Ideas</NuxtLink>
      </nav>

      <!-- User Info / Login -->
      <div class="flex items-center">
        <!-- Authenticated State -->
        <div v-if="user" class="relative">
          <button ref="dropdownButtonRef" @click="isDropdownOpen = !isDropdownOpen" class="flex items-center gap-2">
            <img :src="user.user_metadata.avatar_url" alt="User Avatar" class="h-8 w-8 rounded-full" />
            <span class="font-semibold hidden lg:block">{{ user.user_metadata.full_name }}</span>
          </button>
          
          <!-- Dropdown Menu -->
          <div ref="dropdownMenuRef" v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-[#00A160] rounded-md shadow-lg py-1 z-20">
            <button @click="handleSignOut" class="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#00D37E]">
              Sign out
            </button>
          </div>
        </div>
        <!-- Unauthenticated State -->
        <button v-else @click="() => emit('open-login-modal')" class="font-semibold text-xl">Login</button>
      </div>
    </div>
    
    <!-- User Info / Login (for mobile) -->
    <div class="lg:hidden flex items-center">
        <!-- Authenticated State -->
        <div v-if="user" class="relative">
          <button ref="dropdownButtonRefMobile" @click="isDropdownOpen = !isDropdownOpen" class="flex items-center gap-2">
            <img :src="user.user_metadata.avatar_url" alt="User Avatar" class="h-8 w-8 rounded-full" />
          </button>
          
          <!-- Dropdown Menu (for mobile) -->
          <div ref="dropdownMenuRef" v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-[#00A160] rounded-md shadow-lg py-1 z-20">
            <button @click="handleSignOut" class="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#00D37E]">
              Sign out
            </button>
          </div>
        </div>
         <!-- Unauthenticated State (No login button on mobile header, it is in offcanvas) -->
      </div>


    <!-- Off-canvas Menu -->
    <transition name="slide">
      <div v-if="isMenuOpen" class="fixed inset-0 bg-black bg-opacity-50 z-30" @click="isMenuOpen = false">
        <div @click.stop class="fixed left-0 top-0 h-full w-64 bg-[#00A160] text-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out" 
             :class="isMenuOpen ? 'translate-x-0' : '-translate-x-full'">
          <div class="flex justify-between items-center mb-8">
            <span class="font-bold text-lg">Menu</span>
            <button @click="isMenuOpen = false" class="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav class="flex flex-col gap-6">
            <NuxtLink to="/" @click="isMenuOpen = false" class="font-semibold text-xl">Home</NuxtLink>
            <button class="font-semibold text-xl text-left">FAQ</button>
            <NuxtLink v-if="user" to="/my-ideas" @click="isMenuOpen = false" class="font-semibold text-xl">My Ideas</NuxtLink>
            <button v-if="!user" @click="openLoginAndCloseMenu" class="font-semibold text-xl text-left">Login</button>
          </nav>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useSupabaseUser, useSupabaseClient, useRoute } from '#imports';

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const emit = defineEmits(['open-login-modal']);
const isDropdownOpen = ref(false);
const isMenuOpen = ref(false);
const route = useRoute();

const dropdownButtonRef = ref(null);
const dropdownMenuRef = ref(null);
const dropdownButtonRefMobile = ref(null);

const handleSignOut = async () => {
  await supabase.auth.signOut();
  isDropdownOpen.value = false;
  isMenuOpen.value = false; // Close mobile menu on sign out
};

const openLoginAndCloseMenu = () => {
  emit('open-login-modal');
  isMenuOpen.value = false;
};

// Close mobile menu on route change
watch(() => route.path, () => {
  isMenuOpen.value = false;
});

// Click outside to close dropdown
const handleClickOutside = (event) => {
  if (isDropdownOpen.value && 
      !dropdownButtonRef.value?.contains(event.target) && 
      !dropdownMenuRef.value?.contains(event.target) &&
      !dropdownButtonRefMobile.value?.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style>
/* For the off-canvas menu slide transition */
.slide-enter-active, .slide-leave-active {
  transition: opacity 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
}
</style>
