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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <div
        v-for="(item, index) in displayItems"
        :key="index"
        @click="handleCardClick(item)"
        class="group relative p-4 rounded-lg flex flex-col justify-between h-[229px] hover:shadow-xl transition-all duration-300 cursor-pointer border border-light-outline overflow-hidden bg-light-surface-container"
      >
        <!-- Hover Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-light-tertiary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>

        <!-- Quote Content -->
        <div class="relative z-10">
          <h3 
            class="text-2xl font-brand text-neutral-25 leading-1xl tracking-tight"
            style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;"
          >
            “{{ item.prompt }}”
          </h3>
        </div>

        <!-- Author Info -->
        <div class="relative z-10 flex items-center gap-3 mt-auto">
          <div class="w-8 h-8 rounded-full overflow-hidden border border-neutral-25/20 group-hover:border-white/20 shrink-0 transition-colors duration-300">
             <img 
              :src="item.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id || index}`" 
              alt="Author"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex items-center gap-2 overflow-hidden">
            <span class="text-s font-medium text-neutral-25/90 group-hover:text-white/90 shrink-0 transition-colors duration-300">by</span>
            <span class="text-s font-medium text-neutral-25 group-hover:text-white truncate transition-colors duration-300">
              {{ item.author }}
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
