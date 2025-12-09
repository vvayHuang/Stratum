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
      <Button @click="toggleShowAllSteps" variant="secondary-container"
        customClass="px-4 py-2.5 md:px-6 md:py-4 gap-2 group transition-all duration-300"
        :icon="showAllSteps ? 'keyboard_arrow_up' : 'keyboard_arrow_down'">
        <p class="text-lg font-bold">
          {{ showAllSteps ? 'Show less steps' : `Show all ${reportData.steps.length} steps` }}
        </p>
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Button from './Button.vue';

const stepStyles = [
  { bg: 'bg-light-inverse-surface', text: 'text-light-inverse-on-surface' },  // Step 1
  { bg: 'bg-light-primary', text: 'text-light-on-primary' },  // Step 2
  { bg: 'bg-light-primary-container', text: 'text-light-on-primary-container' },  // Step 3
  { bg: 'bg-light-primary-fixed', text: 'text-light-on-primary-fixed' },  // Step 4
  { bg: 'bg-light-secondary', text: 'text-light-on-secondary' },  // Step 5
  { bg: 'bg-light-secondary-container', text: 'text-light-on-secondary-container' },  // Step 6
  { bg: 'bg-light-secondary-fixed', text: 'text-light-on-secondary-fixed' },  // Step 7
  { bg: 'bg-light-tertiary', text: 'text-light-on-tertiary' },  // Step 8
  { bg: 'bg-light-tertiary-container', text: 'text-light-on-tertiary-container' },  // Step 9
  { bg: 'bg-light-tertiary-fixed', text: 'text-light-on-tertiary-fixed' },  // Step 10
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
