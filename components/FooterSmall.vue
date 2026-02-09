<template>
  <footer class="relative w-full overflow-hidden flex flex-col justify-between px-4 py-8 md:px-8 md:py-12">
    <!-- Background Image -->
    <img :src="backgroundImage" alt="Footer Background"
      class="absolute inset-0 w-full h-full object-none object-left-top md:object-cover z-0" />

    <!-- Bottom Bar -->
    <div
      class="relative z-10 flex flex-col-reverse md:flex-row justify-between md:items-center text-light-inverse-on-surface text-base font-medium tracking-wide uppercase gap-8 md:gap-0">
      <div class="opacity-80">
        &copy;2025 Stratum
      </div>

      <div class="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
        <a href="#" class="flex gap-1 hover:opacity-80 transition-opacity group">
          X
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </a>
        <a href="#" class="flex gap-1 hover:opacity-80 transition-opacity group">
          INSTAGRAM
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </a>
        <a href="#" class="flex gap-1 hover:opacity-80 transition-opacity group">
          LEGAL
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import backgroundImage from '~/assets/background-Image.png';
</script>