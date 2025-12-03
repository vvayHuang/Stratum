<template>
  <div class="min-h-screen bg-light-surface text-light-on-surface flex flex-col">
    <div class="flex-grow flex flex-col">
      <slot />
    </div>
    <FooterSmall />
  </div>
</template>

<script setup>
import FooterSmall from '~/components/FooterSmall.vue';
</script>
