<template>
  <div ref="container" class="w-full bg-light-surface">
    <div class="flex justify-between lg:items-end mb-8">
      <h2 class="text-3xl lg:text-6xl font-brand text-light-on-surface">
        From the Community
      </h2>
      <a href="#" class="text-light-primary font-medium hover:underline mb-2">
        <span class="hidden lg:inline">View all</span>
        <IconButton name="navigate_next" size="16" customClass="border-0 text-light-on-surface lg:hidden" />
      </a>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <!-- Skeleton Cards -->
      <div v-if="isLoading" v-for="n in 16" :key="'skeleton-' + n"
        class="relative p-4 rounded-lg flex flex-col justify-between h-[229px] border border-light-outline overflow-hidden bg-light-surface-container">
        <div class="relative z-10 space-y-3">
          <div class="skeleton-shimmer h-6 w-full rounded"></div>
          <div class="skeleton-shimmer h-6 w-4/5 rounded"></div>
          <div class="skeleton-shimmer h-6 w-3/4 rounded"></div>
        </div>
        <div class="relative z-10 flex items-center gap-3 mt-auto">
          <div class="skeleton-shimmer w-8 h-8 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="skeleton-shimmer h-4 w-20 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Actual Cards -->
      <div v-else v-for="(item, index) in displayItems" :key="index" @click="handleCardClick(item)"
        class="group relative p-4 rounded-lg flex flex-col justify-between h-[229px] hover:shadow-xl transition-all duration-300 cursor-pointer border border-light-outline overflow-hidden bg-light-surface-container">
        <!-- Hover Gradient Overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-b from-transparent to-light-tertiary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0">
        </div>

        <!-- Quote Content -->
        <div class="relative z-10">
          <h3 class="text-2xl font-brand text-neutral-25 leading-1xl tracking-tight"
            style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
            “{{ item.prompt }}”
          </h3>
        </div>

        <!-- Author Info -->
        <div class="relative z-10 flex items-center gap-3 mt-auto">
          <div
            class="w-8 h-8 rounded-full overflow-hidden border border-neutral-25/20 group-hover:border-white/20 shrink-0 transition-colors duration-300">
            <img :src="item.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id || index}`"
              alt="Author" class="w-full h-full object-cover" />
          </div>
          <div class="flex items-center gap-2 overflow-hidden">
            <span
              class="text-s font-medium text-neutral-25/90 group-hover:text-white/90 shrink-0 transition-colors duration-300">by</span>
            <span
              class="text-s font-medium text-neutral-25 group-hover:text-white truncate transition-colors duration-300">
              {{ item.author }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Show More -->
    <div v-if="hasMore" class="flex justify-center">
      <button @click="showMore"
        class="px-6 py-3 rounded-full border border-light-outline/20 bg-light-surface/30 text-sm font-medium text-light-on-surface-variant hover:bg-light-surface/50 transition-colors">
        Show more
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import gsap from 'gsap';

const container = ref(null);

const props = defineProps({
  prompts: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['prompt-click']);

// Detect if mobile screen
const isMobile = ref(false);

// Check screen size on mount and resize
if (process.client) {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024; // lg breakpoint
  };

  checkMobile();
  window.addEventListener('resize', checkMobile);
}

// Pagination state
const visibleCount = ref(16);

// Display items based on visible count and screen size
const displayItems = computed(() => {
  const maxItems = isMobile.value ? 6 : visibleCount.value;
  return props.prompts.slice(0, maxItems);
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

const animateOut = () => {
  if (!container.value) return Promise.resolve();

  const tl = gsap.timeline();
  tl.to(container.value, {
    y: 100,
    autoAlpha: 0,
    duration: 0.5,
    ease: "power2.in"
  });
  return tl;
};


defineExpose({ animateOut });
</script>

<style scoped>
.skeleton-shimmer {
  background: #E3C0A7;
  /* secondary-80 from palette as base */
  background-image: linear-gradient(to right,
      #E3C0A7 0%,
      #FFDCC4 20%,
      /* secondary-90 highlight */
      #E3C0A7 40%,
      #E3C0A7 100%);
  background-repeat: no-repeat;
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }

  100% {
    background-position: -100% 0;
  }
}
</style>
