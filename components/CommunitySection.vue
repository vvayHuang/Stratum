<template>
  <div ref="container" class="w-full bg-light-surface">
    <div class="flex justify-between lg:items-end mb-8">
      <h2 class="text-3xl lg:text-6xl font-brand text-light-on-surface">
        From the Community
      </h2>
      <NuxtLink to="/community" class="text-light-primary font-medium hover:underline mb-2">
        <span class="hidden lg:inline">View all</span>
        <IconButton name="navigate_next" size="16" customClass="border-0 text-light-on-surface lg:hidden" />
      </NuxtLink>
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
      <CommunityCard v-else v-for="(item, index) in displayItems" :key="index" :item="item"
        @click="handleCardClick(item)" />
    </div>

    <!-- Show More -->
    <div v-if="hasMore" class="flex justify-center">
      <Button @click="showMore" variant="outline" customClass="px-6 py-3 text-sm font-medium">Show more</Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import gsap from 'gsap';
import CommunityCard from '~/components/CommunityCard.vue';
import Button from './Button.vue';

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
