<template>
  <div class="min-h-screen w-full flex relative lg:static">
    <!-- Background Image -->
    <!-- Mobile: Absolute full screen. Desktop: Right 50% -->
    <div class="absolute inset-0 z-0 lg:static lg:w-1/2 lg:order-2 lg:block">
      <img 
        src="~/assets/background-Image.png" 
        alt="Background" 
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Content Side -->
    <!-- Mobile: Centered overlay. Desktop: Left 50% -->
    <div class="absolute inset-0 z-10 flex items-center justify-center p-6 lg:static lg:w-1/2 lg:order-1 lg:bg-light-surface-container-high lg:p-12">
      
      <!-- Card Container (Mobile only styles) -->
      <!-- Mobile: w-full, max-w-none (controlled by padding on parent), rounded, shadow -->
      <!-- Desktop: w-full, max-w-md, no shadow, no rounded, transparent bg, flex-col justify-between h-full -->
      <div class="bg-light-surface-container-high p-6 rounded-xl shadow-xl w-full flex flex-col items-center lg:shadow-none lg:rounded-none lg:items-start lg:text-left lg:bg-transparent lg:p-0 lg:h-full lg:justify-between lg:mx-auto">
        
        <!-- Logo (Desktop only) -->
        <!-- Desktop: Top Left -->
        <div class="hidden lg:block">
          <NuxtLink to="/">
            <img src="/logo_horizontal.svg" alt="Stratum Logo" class="h-8" />
          </NuxtLink>
        </div>

        <!-- Main Content -->
        <!-- Desktop: Vertically centered (via justify-between on parent, this is the middle element) -->
        <div class="flex flex-col items-start w-full">
          <h1 class="text-1xl leading-2xl lg:text-5xl lg:leading-4xl font-brand text-light-on-surface mb-4">
            Welcome to Stratum
          </h1>
          <p class="text-light-on-surface-variant text-sm mb-8 lg:mb-10">
            Sign in to get personalized career advice and unlock full features.
          </p>

          <button
            @click="signInWithGoogle"
            class="w-full flex items-center justify-center gap-3 bg-light-secondary-container hover:bg-light-secondary-container/80 transition-colors text-light-on-secondary-container font-medium py-3 px-6 rounded-full mb-8 lg:mb-0"
          >
            <img src="/assets/google-g-logo.svg" alt="Google" class="w-5 h-5" />
            Sign in With Google
          </button>
        </div>

        <!-- Footer Text -->
        <!-- Desktop: Bottom Left -->
        <p class="text-s text-light-outline lg:text-light-on-surface-variant lg:mt-0">
          By signing in, you agree to our 
          <a href="#" class="underline hover:text-light-on-surface">Privacy Policy</a> 
          and 
          <a href="#" class="underline hover:text-light-on-surface">Terms of Service</a>.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSupabaseClient } from '#imports';

definePageMeta({
  layout: false
});

const supabase = useSupabaseClient();

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
</script>
