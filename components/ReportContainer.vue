<template>
  <div class="mt-16 w-full" v-if="reportData">
    <!-- Stats Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <div class="flex flex-col gap-2">
        <p class="text-xl font-brand text-light-tertiary-container uppercase tracking-wide">EARNINGS POTENTIAL</p>
        <div class="flex items-baseline gap-2">
          <p class="text-5xl font-brand text-light-on-secondary">{{ reportData.earnings_potential }}</p>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <p class="text-xl font-brand text-light-tertiary-container uppercase tracking-wide">COMPETITIVE SCORE</p>
        <p class="text-5xl font-brand text-light-on-secondary">{{ reportData.competitive_score }}<span class="text-3xl opacity-60">/10</span></p>
      </div>
    </div>

    <!-- Steps Section -->
    <div class="flex flex-col gap-10">
      <div v-for="(step, index) in displayedSteps" :key="index" class="relative pl-8 border-l-2 border-light-outline-variant">
        <!-- Step Badge -->
        <div class="absolute -left-[11px] top-0 bg-light-tertiary-container text-light-on-tertiary-container rounded-full w-5 h-5 flex items-center justify-center">
           <div class="w-2 h-2 rounded-full bg-light-on-tertiary-container"></div>
        </div>
        
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3 mb-1">
             <span class="font-brand text-2xl text-light-tertiary-container">STEP {{ step.step_number || index + 1 }}</span>
          </div>
          <h3 class="text-3xl font-brand text-light-on-secondary leading-tight">{{ step.title }}</h3>
          <p class="text-lg text-light-on-secondary leading-relaxed opacity-90">
            {{ step.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Show More/Less Button -->
    <div class="flex justify-center mt-12" v-if="reportData.steps.length > 3">
      <button @click="toggleShowAllSteps" class="group flex items-center gap-3 px-6 py-3 rounded-full bg-light-surface-variant/10 hover:bg-light-surface-variant/20 transition-all duration-300">
        <p class="text-lg font-bold text-light-on-secondary">
          {{ showAllSteps ? 'Show less steps' : `Show all ${reportData.steps.length} steps` }}
        </p>
        <img src="~/assets/arrow-right.svg" alt="Toggle steps" 
             class="w-5 h-5 transition-transform duration-300" 
             :class="{ 'transform -rotate-90': showAllSteps, 'transform rotate-90': !showAllSteps }" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

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
