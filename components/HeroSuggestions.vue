<template>
  <div class="w-full mt-6">
    <p class="text-sm text-light-inverse-on-surface mb-3 font-medium opacity-80">
      Try these examples:
    </p>
    <div class="flex flex-wrap gap-3">
      <button
        v-for="(item, index) in suggestions"
        :key="index"
        @click="$emit('select', item.text)"
        class="group relative overflow-hidden px-4 py-2 rounded-xl bg-light-surface-container-high hover:bg-light-primary-container transition-all duration-300 border border-light-outline-variant/20 hover:border-light-primary/30"
      >
        <span class="relative z-10 text-sm font-medium text-light-on-surface group-hover:text-light-on-primary-container transition-colors">
          {{ item.text }}
        </span>
        <div class="absolute inset-0 bg-light-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
    </div>
  </div>
</template>

<script setup>
const suggestions = [
  { text: "Digital Content Creation" },
  { text: "Sustainable E-commerce" },
  { text: "Smart Home Consulting" },
  { text: "Vintage Reselling" },
];

defineEmits(['select']);
</script>
