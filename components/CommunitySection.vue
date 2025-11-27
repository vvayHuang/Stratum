<template>
  <div class="w-full bg-light-tertiary-container rounded-[32px] p-8 md:p-12">
    <h2 class="text-6xl font-brand text-light-on-tertiary-container mb-8">
      From the Community
    </h2>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-10">
      <button
        v-for="filter in filters"
        :key="filter"
        class="px-4 py-2 rounded-full border border-light-outline/20 bg-light-surface/30 text-sm font-medium text-light-on-surface-variant hover:bg-light-surface/50 transition-colors"
      >
        {{ filter }}
      </button>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      <div
        v-for="(item, index) in displayItems"
        :key="index"
        @click="handleCardClick(item)"
        class="bg-light-surface-container p-8 rounded-xl flex flex-col justify-between h-[320px] hover:shadow-lg transition-all cursor-pointer border border-light-outline"
      >
        <p class="text-xl font-bold text-light-on-surface leading-tight">
          "{{ item.prompt }}"
        </p>
        <div class="flex items-end justify-start mt-auto">
          <div class="bg-light-primary-container px-4 py-2 rounded-lg">
            <span class="text-md font-bold text-light-on-primary-container uppercase tracking-wide">
              {{ getIdeasCount(item) }} IDEAS
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Show More -->
    <div v-if="hasMore" class="flex justify-center">
      <button 
        @click="showMore"
        class="px-6 py-3 rounded-full border border-light-outline/20 bg-light-surface/30 text-sm font-medium text-light-on-surface-variant hover:bg-light-surface/50 transition-colors"
      >
        Show more
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  prompts: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['prompt-click']);

const filters = [
  "Brainstorming",
  "Concept Development",
  "User Research",
  "Market Analysis",
  "Prototype Testing",
  "Feedback Gathering",
  "Iterative Design",
  "Feature Prioritization",
  "Final Presentation",
];

// Pagination state
const visibleCount = ref(16);

// Display items based on visible count
const displayItems = computed(() => {
  return props.prompts.slice(0, visibleCount.value);
});

// Check if there are more items to show
const hasMore = computed(() => {
  return visibleCount.value < props.prompts.length;
});

// Show more function
const showMore = () => {
  visibleCount.value += 16;
};

const handleCardClick = (item) => {
  emit('prompt-click', item.prompt, item.id);
};

// Get ideas count - placeholder for now, will need to fetch from database
const getIdeasCount = (item) => {
  // For now, return a random number between 1-5
  // In production, this should come from the database
  return item.ideas_count || Math.floor(Math.random() * 5) + 1;
};

// Format date to YYYY/MM/DD
const formatDate = (dateString) => {
  if (!dateString) {
    return new Date().toLocaleDateString('en-CA').replace(/-/g, '/');
  }
  const date = new Date(dateString);
  return date.toLocaleDateString('en-CA').replace(/-/g, '/');
};
</script>
