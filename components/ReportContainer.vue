<template>
  <div class="mt-16" v-if="reportData">
    <div class="flex justify-between items-center mb-8">
      <div class="flex flex-col gap-3.5">
        <div class="flex flex-col gap-6">
          <p class="text-2xl font-semibold text-[#00FF98]">EARNINGS POTENTIAL</p>
          <p class="text-4xl font-semibold text-white">{{ reportData.earnings_potential }}</p>
        </div>
        <p class="text-sm font-semibold text-white">PER MONTH</p>
      </div>
      <div class="flex flex-col gap-3.5">
        <div class="flex flex-col gap-6">
          <p class="text-2xl font-semibold text-[#00FF98]">COMPETITIVE SCORE</p>
          <p class="text-4xl font-semibold text-white">{{ reportData.competitive_score }}/10</p>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-8">
      <div v-for="(step, index) in displayedSteps" :key="index" class="flex flex-col gap-7">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2.5 bg-[#00FF98] rounded-md px-2 py-1 self-start">
            <p class="text-lg font-bold text-[#006E42]">STEP {{ step.step_number || index + 1 }}</p>
          </div>
          <p class="text-2xl font-semibold text-white">{{ step.title }}</p>
        </div>
        <p class="text-lg text-white">
          {{ step.description }}
        </p>
      </div>
    </div>
    <div class="flex justify-center mt-8">
      <button @click="toggleShowAllSteps" class="flex items-center gap-2.5">
        <img src="~/assets/arrow-right-green.svg" alt="Toggle steps" :class="{ 'transform -rotate-180': showAllSteps }" />
        <p class="text-2xl font-semibold text-white">
          {{ showAllSteps ? 'Show less steps' : `Show all ${reportData.steps.length} steps` }}
        </p>
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
