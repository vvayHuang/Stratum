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
        <img src="/logo_horizontal.svg" alt="Stratum Logo" class="w-auto h-8 md:h-12" />
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="hidden lg:flex gap-8 items-center">
        <NuxtLink to="/community" class="font-medium text-m">Community</NuxtLink>
        <button @click="isSearchModalOpen = true" class="font-medium text-m">Search</button>
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
          <div ref="dropdownMenuRef" v-if="isDropdownOpen"
            class="absolute right-0 my-2 w-64 bg-light-surface-container text-light-on-surface rounded-xl shadow-lg z-20 overflow-hidden">
            <NuxtLink to="/my-ideas"
              class="flex items-center w-full px-6 py-4 text-l text-left hover:bg-light-surface-variant hover:bg-opacity-50 transition-colors"
              @click="isDropdownOpen = false">
              <MaterialIcon name="emoji_objects" class="mr-4" />
              My Ideas
            </NuxtLink>
            <button @click="handleSignOut"
              class="flex items-center w-full px-6 py-4 text-l text-left hover:bg-light-surface-variant hover:bg-opacity-50 transition-colors">
              <MaterialIcon name="logout" class="mr-4" />
              Sign out
            </button>
          </div>
        </div>
        <!-- Unauthenticated State -->
        <NuxtLink v-else to="/login"
          class="px-4 py-2.5 font-medium text-m bg-light-primary text-light-on-primary rounded-xl hover:bg-opacity-90 transition-colors">
          Login
        </NuxtLink>
      </div>
    </div>




    <!-- Off-canvas Menu -->
    <transition name="fade">
      <div v-if="isMenuOpen" class="fixed inset-0 z-50 bg-light-surface flex flex-col p-6 h-[100dvh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center gap-2 mb-12">
          <NuxtLink to="/" @click="isMenuOpen = false" class="flex items-center gap-2">
            <img src="/logo_horizontal.svg" alt="Stratum Logo" class="w-auto h-8" />
          </NuxtLink>
        </div>

        <!-- Menu Items -->
        <nav class="flex-grow flex flex-col justify-center gap-8">
          <NuxtLink to="/community" @click="isMenuOpen = false"
            class="text-left text-4xl font-brand text-light-on-surface hover:opacity-70 transition-opacity">Community
          </NuxtLink>
          <button @click="isSearchModalOpen = true; isMenuOpen = false"
            class="text-left text-4xl font-brand text-light-on-surface hover:opacity-70 transition-opacity">Search</button>
          <NuxtLink v-if="user" to="/my-ideas" @click="isMenuOpen = false"
            class="text-4xl font-brand text-light-on-surface hover:opacity-70 transition-opacity">My Ideas</NuxtLink>
          <NuxtLink v-if="!user" to="/login" @click="isMenuOpen = false"
            class="text-left text-4xl font-brand text-light-on-surface hover:opacity-70 transition-opacity">Login
          </NuxtLink>
        </nav>

        <!-- Footer / Close Button -->
        <div class="mt-auto">
          <button @click="isMenuOpen = false"
            class="p-2 -ml-2 text-light-on-surface hover:opacity-70 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <!-- Search Modal -->
    <SearchModal v-if="isSearchModalOpen" @close="isSearchModalOpen = false" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useSupabaseUser, useSupabaseClient, useRoute } from '#imports';

const user = useSupabaseUser();
const supabase = useSupabaseClient();
// const emit = defineEmits(['open-login-modal']);
const isDropdownOpen = ref(false);
const isMenuOpen = ref(false);
const isSearchModalOpen = ref(false);
const route = useRoute();

const dropdownButtonRef = ref(null);
const dropdownMenuRef = ref(null);
const dropdownButtonRefMobile = ref(null);

const handleSignOut = async () => {
  await supabase.auth.signOut();
  isDropdownOpen.value = false;
  isMenuOpen.value = false; // Close mobile menu on sign out
};

// const openLoginAndCloseMenu = () => {
//   emit('open-login-modal');
//   isMenuOpen.value = false;
// };

// Close mobile menu on route change
watch(() => route.path, () => {
  isMenuOpen.value = false;
});

// Prevent body scroll when menu is open
watch([isMenuOpen, isSearchModalOpen], ([menuOpen, searchOpen]) => {
  if (menuOpen || searchOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
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

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.body.style.overflow = ''; // Ensure scroll is restored on unmount
  document.removeEventListener('keydown', handleKeydown);
});

const handleKeydown = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    isSearchModalOpen.value = true;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeydown);
});
</script>

<style>
/* For the full-screen menu fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
