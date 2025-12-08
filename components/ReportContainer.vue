<template>
  <div class="mt-12 w-full" v-if="reportData">
    <!-- Stats Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
      <div class="flex flex-col gap-2">
        <p class="text-2xl font-brand text-light-on-surface uppercase tracking-wide">EARNINGS POTENTIAL</p>
        <div class="flex items-baseline gap-2">
          <p class="text-3xl font-brand text-light-on-surface">{{ reportData.earnings_potential }}</p>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <p class="text-2xl font-brand text-light-on-surface uppercase tracking-wide">COMPETITIVE SCORE</p>
        <p class="text-5xl font-brand text-light-on-surface">{{ reportData.competitive_score }}<span
            class="text-3xl opacity-60">/10</span></p>
      </div>
    </div>

    <!-- Steps Section -->
    <div class="flex flex-col">
      <div v-for="(step, index) in displayedSteps" :key="index" :class="[stepStyles[index % 10].bg, 'p-4']">
        <!-- Step Chip Badge -->
        <div
          :class="[stepStyles[index % 10].text, 'inline-block px-4 py-2 mb-5 text-s font-plain font-medium border rounded-lg']"
          :style="{ borderColor: 'currentColor' }">
          Step {{ step.step_number || index + 1 }}
        </div>

        <div class="flex flex-col gap-7">
          <h3 :class="[stepStyles[index % 10].text, 'text-3xl font-brand leading-tight']">{{ step.title }}</h3>
          <p :class="[stepStyles[index % 10].text, 'text-base font-plain leading-relaxed opacity-90']">
            {{ step.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Show More/Less Button -->
    <div class="flex justify-center mt-12" v-if="reportData.steps.length > 3">
      <button @click="toggleShowAllSteps"
        class="group flex items-center gap-3 px-6 py-3 rounded-full bg-light-surface-variant/10 hover:bg-light-surface-variant/20 transition-all duration-300">
        <p class="text-lg font-bold text-light-onsur">
          {{ showAllSteps ? 'Show less steps' : `Show all ${reportData.steps.length} steps` }}
        </p>
        <img src="~/assets/arrow-right.svg" alt="Toggle steps" class="w-5 h-5 transition-transform duration-300"
          :class="{ 'transform -rotate-90': showAllSteps, 'transform rotate-90': !showAllSteps }" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const stepStyles = [
  { bg: 'bg-primary-90', text: 'text-primary-20' },  // Step 1
  { bg: 'bg-primary-80', text: 'text-primary-25' },  // Step 2
  { bg: 'bg-primary-70', text: 'text-primary-30' },  // Step 3
  { bg: 'bg-primary-60', text: 'text-primary-35' },  // Step 4
  { bg: 'bg-primary-50', text: 'text-primary-10' },  // Step 5
  { bg: 'bg-primary-40', text: 'text-primary-90' },  // Step 6
  { bg: 'bg-primary-35', text: 'text-primary-98' },  // Step 7
  { bg: 'bg-primary-30', text: 'text-primary-95' },  // Step 8
  { bg: 'bg-primary-25', text: 'text-primary-90' },  // Step 9
  { bg: 'bg-primary-20', text: 'text-primary-80' },  // Step 10
];

const props = defineProps({
  reportData: {
    type: Object,
    required: true,
  },
});

const showAllSteps = ref(false);

const displayedSteps = computed(() => {
  if (showAllSteps.value) {
    return props.reportData.steps;
  }
  return props.reportData.steps.slice(0, 3);
});

const toggleShowAllSteps = () => {
  showAllSteps.value = !showAllSteps.value;
};
</script>
