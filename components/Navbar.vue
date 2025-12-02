<template>
  <div class="relative flex items-center justify-between w-full p-4 text-light-on-surface">
    <!-- Left side: Hamburger Menu + Logo -->
    <div class="flex items-center gap-4">
      <!-- Hamburger Menu (visible on tablet/mobile) -->
      <div class="lg:hidden">
        <button @click="isMenuOpen = true" class="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Logo -->
      <NuxtLink to="/" class="px-2 py-1">
        <img src="/logo_horizontal.svg" alt="Stratum Logo" class="w-auto h-12" />
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="hidden lg:flex gap-8 items-center">
        <NuxtLink to="/" class="font-medium text-m">Community</NuxtLink>
        <button class="font-medium text-m">Contact</button>
      </nav>
    </div>

    <!-- Right side: User Info / Login -->
    <div class="flex items-center gap-8">

      <!-- User Info / Login -->
      <div class="flex items-center">
        <!-- Authenticated State -->
        <div v-if="user" class="relative">
          <button ref="dropdownButtonRef" @click="isDropdownOpen = !isDropdownOpen" class="flex items-center gap-2">
            <img :src="user.user_metadata.avatar_url" alt="User Avatar" class="w-10 h-10 rounded-full" />
            <span class="hidden font-medium lg:block text-m">{{ user.user_metadata.full_name }}</span>
          </button>
          
          <!-- Dropdown Menu -->
          <div ref="dropdownMenuRef" v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-light-surface text-light-on-surface rounded-md shadow-lg py-1 z-20 border border-light-outline-variant">
            <NuxtLink to="/my-ideas" class="block w-full px-4 py-2 text-sm text-left hover:bg-light-surface-variant" @click="isDropdownOpen = false">
              My Ideas
            </NuxtLink>
            <button @click="handleSignOut" class="block w-full px-4 py-2 text-sm text-left hover:bg-light-surface-variant">
              Sign out
            </button>
          </div>
        </div>
        <!-- Unauthenticated State -->
        <button v-else @click="() => emit('open-login-modal')" class="px-4 py-2.5 font-medium text-m bg-light-primary text-light-on-primary rounded-xl hover:bg-opacity-90 transition-colors">
          Login
        </button>
      </div>
    </div>
    
    


    <!-- Off-canvas Menu -->
    <transition name="slide">
      <div v-if="isMenuOpen" class="fixed inset-0 z-30 bg-black bg-opacity-50" @click="isMenuOpen = false">
        <div @click.stop class="fixed top-0 left-0 h-full w-64 p-4 shadow-lg bg-light-primary text-light-on-primary transform transition-transform duration-300 ease-in-out" 
             :class="isMenuOpen ? 'translate-x-0' : '-translate-x-full'">
          <div class="flex items-center justify-between mb-8">
            <span class="text-lg font-bold">Menu</span>
            <button @click="isMenuOpen = false" class="text-light-on-primary">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav class="flex flex-col gap-6">
            <NuxtLink to="/" @click="isMenuOpen = false" class="font-medium text-m">Home</NuxtLink>
            <button class="text-left font-medium text-m">FAQ</button>
            <NuxtLink v-if="user" to="/my-ideas" @click="isMenuOpen = false" class="font-medium text-m">My Ideas</NuxtLink>
            <button v-if="!user" @click="openLoginAndCloseMenu" class="text-left font-medium text-m">Login</button>
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
