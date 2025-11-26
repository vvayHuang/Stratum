<template>
  <div class="relative w-full overflow-hidden rounded-t-[24px] h-[845px] flex flex-col justify-between p-8 md:p-12">
    <!-- Background Image -->
    <img
      src="~/assets/background-Image.png"
      alt="Footer Background"
      class="absolute inset-0 w-full h-full object-cover object-top z-0"
    />

    <!-- Overlay content -->
    <div class="relative z-10 flex-grow flex items-center justify-center">
      <h2 class="text-4xl md:text-6xl lg:text-7xl font-serif text-left text-[#FDFCF4] leading-tight max-w-4xl">
        Smart Surfing:<br />
        Where<br />
        Browsing Meets<br />
        Brainpower!
      </h2>
    </div>

    <!-- Bottom Bar -->
    <div class="relative z-10 flex flex-col md:flex-row justify-between items-center text-[#FDFCF4] text-[16px] font-medium tracking-wide uppercase gap-4 md:gap-0">
      <div class="opacity-80">
        &copy;2025 Stratum
      </div>

      <div class="flex items-center gap-8">
        <a href="#" class="flex gap-1 hover:opacity-80 transition-opacity group">
          X
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <a href="#" class="flex gap-1 hover:opacity-80 transition-opacity group">
          INSTAGRAM
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <a href="#" class="flex gap-1 hover:opacity-80 transition-opacity group">
          LEGAL
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script logic needed for this static footer
</script>

<style scoped>
/* Ensure the font-serif uses a nice serif font if not already configured globally */
.font-serif {
  font-family: 'Times New Roman', Times, serif; /* Fallback, ideally should use a custom font like GT Alpina or similar if available */
}
</style>
