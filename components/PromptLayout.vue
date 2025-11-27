<template>
  <div>
    <div class="text-light-on-primary max-w-[1440px] px-6 mx-auto">
      <div class="flex justify-center items-center mb-16 min-h-[60px]">
        <div v-if="false" class="text-center">
          <div class="inline-block bg-light-error-container/10 p-4 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-light-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-2xl font-semibold mb-2">Oops! Something went wrong.</h3>
          <p class="text-light-error mb-6">
            {{ isOverloadError ? '錯誤請稍後再試' : props.error }}
          </p>
          <button @click="$emit('reset')" class="flex items-center justify-center gap-2 bg-light-primary text-light-on-primary font-bold rounded-md px-6 py-3 text-lg">
            <img src="~/assets/arrow-right.svg" alt="Return" class="transform rotate-180" />
            返回
          </button>
        </div>
        <p
          v-else-if="!isLoading"
          class="text-center text-3xl font-brand text-light-on-surface italic"
        >
          “{{ prompt }}”
        </p>
      </div>
    </div>

    <!-- Main content area with consistent height -->
    <div v-if="!props.error" class="min-h-[796px] flex flex-col items-center mx-auto max-w-[1440px] w-full px-6">
      <div
        v-if="isLoading && ideas.length === 0"
        class="container-centered w-full"
      >
        <!-- Skeleton Navigation Buttons -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div class="h-[52px] w-full md:w-[140px] rounded-md skeleton-shimmer"></div>
          <div class="h-[52px] w-full md:w-[140px] rounded-md skeleton-shimmer"></div>
        </div>

        <!-- Skeleton Card -->
        <div class="bg-secondary-35 rounded-[6px] p-8 md:p-16 relative overflow-hidden min-h-[600px]">
          <div class="flex justify-between items-start mb-4">
            <div class="w-full">
              <!-- Label Skeleton -->
              <div class="h-[28px] w-[120px] rounded-md mb-6 skeleton-shimmer"></div>

              <!-- Title Skeleton -->
              <div class="h-[56px] w-3/4 rounded-md mb-6 skeleton-shimmer"></div>
            </div>
          </div>

          <!-- Description Skeleton -->
          <div class="space-y-4 mb-16">
            <div class="h-[20px] w-full rounded-md skeleton-shimmer"></div>
            <div class="h-[20px] w-full rounded-md skeleton-shimmer"></div>
            <div class="h-[20px] w-2/3 rounded-md skeleton-shimmer"></div>
          </div>

          <!-- Button Skeleton -->
          <div class="h-[64px] w-full md:w-[240px] rounded-[4px] skeleton-shimmer"></div>
          
          <!-- Helper Text Skeleton -->
           <div class="h-[24px] w-full md:w-[400px] rounded-md mt-6 mx-auto skeleton-shimmer"></div>
        </div>
      </div>

      <div v-else-if="ideas.length > 0" class="container-centered w-full">
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <button
            @click="prevIdea"
            :disabled="currentIndex === 0"
            class="flex items-center justify-center gap-2 px-6 py-3 bg-light-secondary-container text-light-on-secondary-container font-bold rounded-md text-lg disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto transition-colors hover:opacity-90"
          >
            <img
              src="~/assets/arrow-right.svg"
              alt="Previous"
              class="transform rotate-180 w-5 h-5"
            />
            Prev Idea
          </button>
          <button
            @click="nextIdea"
            :disabled="currentIndex === ideas.length - 1"
            class="flex items-center justify-center gap-2 px-6 py-3 bg-light-secondary-container text-light-on-secondary-container font-bold rounded-md text-lg disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto transition-colors hover:opacity-90"
          >
            Next Idea
            <img src="~/assets/arrow-right.svg" alt="Next" class="w-5 h-5" />
          </button>
        </div>

        <div
          ref="cardContainer"
          class="bg-secondary-35 text-white rounded-[6px] p-8 md:p-16 relative overflow-hidden min-h-[600px]"
        >
          <div v-if="currentIdea">
            <div class="flex justify-between items-start mb-4">
              <div>
                <div
                  ref="ideaLabelWrapper"
                  class="bg-light-tertiary-container text-light-on-tertiary-container rounded-md px-3 py-1 inline-block mb-6 overflow-hidden"
                >
                  <p class="font-bold text-sm tracking-wider uppercase">
                    IDEA {{ currentIndex + 1 }} OF {{ ideas.length }}
                  </p>
                </div>

                <div ref="cardTitleWrapper" class="overflow-hidden">
                  <h2 class="text-[40px] md:text-[56px] font-brand font-normal leading-[1.1] mb-6 text-light-on-secondary">
                    {{ currentIdea.title }}
                  </h2>
                </div>
              </div>
            </div>

            <div ref="cardDescriptionWrapper" class="overflow-hidden">
              <p class="text-[18px] md:text-[20px] leading-[1.6] mb-16 text-light-on-secondary">
                {{ currentIdea.description }}
              </p>
            </div>

            <div
              v-if="!isGenerating && !currentIdea.reports"
              class="relative flex flex-col items-center justify-center py-12 overflow-hidden"
            >
              <!-- Background Decoration (Steps Placeholder Marquee) -->
              <div ref="marqueeContainer" class="absolute inset-0 flex flex-col gap-8 opacity-20 pointer-events-none select-none">
                <!-- Sequence 1 -->
                <div class="flex items-center gap-6">
                  <div class="w-16 h-16 rounded-full bg-light-surface-variant shrink-0"></div>
                  <div class="flex flex-col gap-3 w-full">
                    <div class="h-5 w-full rounded-full bg-light-surface-variant"></div>
                    <div class="h-5 w-3/4 rounded-full bg-light-surface-variant"></div>
                  </div>
                </div>
                <div class="flex items-center gap-6">
                  <div class="w-16 h-16 rounded-full bg-light-surface-variant shrink-0"></div>
                  <div class="flex flex-col gap-3 w-full">
                    <div class="h-5 w-full rounded-full bg-light-surface-variant"></div>
                    <div class="h-5 w-3/4 rounded-full bg-light-surface-variant"></div>
                  </div>
                </div>
                <div class="flex items-center gap-6">
                  <div class="w-16 h-16 rounded-full bg-light-surface-variant shrink-0"></div>
                  <div class="flex flex-col gap-3 w-full">
                    <div class="h-5 w-full rounded-full bg-light-surface-variant"></div>
                    <div class="h-5 w-3/4 rounded-full bg-light-surface-variant"></div>
                  </div>
                </div>
                
                <!-- Sequence 2 (Duplicate for loop) -->
                <div class="flex items-center gap-6">
                  <div class="w-16 h-16 rounded-full bg-light-surface-variant shrink-0"></div>
                  <div class="flex flex-col gap-3 w-full">
                    <div class="h-5 w-full rounded-full bg-light-surface-variant"></div>
                    <div class="h-5 w-3/4 rounded-full bg-light-surface-variant"></div>
                  </div>
                </div>
                <div class="flex items-center gap-6">
                  <div class="w-16 h-16 rounded-full bg-light-surface-variant shrink-0"></div>
                  <div class="flex flex-col gap-3 w-full">
                    <div class="h-5 w-full rounded-full bg-light-surface-variant"></div>
                    <div class="h-5 w-3/4 rounded-full bg-light-surface-variant"></div>
                  </div>
                </div>
                <div class="flex items-center gap-6">
                  <div class="w-16 h-16 rounded-full bg-light-surface-variant shrink-0"></div>
                  <div class="flex flex-col gap-3 w-full">
                    <div class="h-5 w-full rounded-full bg-light-surface-variant"></div>
                    <div class="h-5 w-3/4 rounded-full bg-light-surface-variant"></div>
                  </div>
                </div>
              </div>

              <div ref="generateGuideBtnWrapper" class="overflow-hidden z-10 relative">
                <button
                  @click="generateGuide"
                  class="flex items-center justify-center gap-3 bg-light-tertiary text-light-on-tertiary px-8 py-5 rounded-[4px] font-bold text-[20px] shadow-lg hover:opacity-90 transition-opacity w-full md:w-auto"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor"/>
                  </svg>
                  GENERATE GUIDE
                </button>
              </div>

              <div ref="generateGuideTextWrapper" class="overflow-hidden z-10 mt-6 relative">
                <p class="text-center text-[16px] text-light-surface-variant font-medium">
                  This will provide you with every bling-worthy step required to pull this off.
                </p>
              </div>
            </div>
            <div v-else-if="isGenerating" class="flex flex-col items-center justify-center h-[400px]">
              <svg class="animate-spin h-10 w-10 text-light-secondary-container mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-light-secondary-container text-xl font-semibold">Generating Guide...</p>
            </div>
            <ReportContainer v-if="currentIdea.reports && !isGenerating" :reportData="currentIdea.reports" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import gsap from "gsap";

import ReportContainer from "./ReportContainer.vue";

const props = defineProps({
  prompt: {
    type: String,
    required: true,
  },
  ideas: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["reset", "update:idea"]);

const currentIndex = ref(0);

const cardContainer = ref(null);
const ideaLabelWrapper = ref(null);
const cardTitleWrapper = ref(null);
const cardDescriptionWrapper = ref(null);
const generateGuideBtnWrapper = ref(null);
const generateGuideTextWrapper = ref(null);
const isGenerating = ref(false);

const marqueeContainer = ref(null);

const currentIdea = computed(() => {
  return props.ideas.length > 0 ? props.ideas[currentIndex.value] : null;
});

const isOverloadError = computed(() => {
  return props.error && props.error.includes('The model is currently overloaded');
});

const animateCardIn = (direction) => {
  if (!cardContainer.value) return;

  const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } });

  const elementsToStagger = [
    ideaLabelWrapper.value?.children[0],
    cardTitleWrapper.value?.children[0],
    cardDescriptionWrapper.value?.children[0],
    generateGuideBtnWrapper.value?.children[0],
    generateGuideTextWrapper.value?.children[0],
  ].filter(Boolean); // Filter out null/undefined elements

  // Animate card container in
  tl.fromTo(
    cardContainer.value,
    { x: direction === "next" ? 100 : -100, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
  );

  // Staggered mask animation for inner elements
  tl.fromTo(
    elementsToStagger,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.1 },
    "<0.2" // Start after card container animation
  );
  return tl;
};

const startMarqueeAnimation = () => {
  // Approximate height of one sequence block + gap
  // Each block has 3 items. Each item is 64px (h-16) + 24px gap (gap-6) = 88px?
  // Wait, flex-col gap-8 (32px).
  // Item: h-16 (64px).
  // 3 items + 2 gaps of 32px? No, the items themselves have gap-6 (24px) inside? No, the items are the rows.
  // The container has `gap-8` (32px).
  // Each row is `h-16` (64px).
  // So one sequence of 3 items:
  // Item 1 (64px) + Gap (32px) + Item 2 (64px) + Gap (32px) + Item 3 (64px) + Gap (32px) (to next sequence)
  // Total height of one sequence = 3 * 64 + 3 * 32 = 192 + 96 = 288px.
  
  const singleSequenceHeight = 288; 

  if (marqueeContainer.value) {
    // Ensure the container starts at 0
    gsap.set(marqueeContainer.value, { y: 0 });

    const tl = gsap.timeline({
      repeat: -1, // Infinite loop
      ease: "none", // Linear movement
      delay: 0, // No initial delay
    });

    // Animate up by the height of one sequence
    tl.to(marqueeContainer.value, {
      y: -singleSequenceHeight, 
      duration: 10, // Adjust duration for desired speed
      ease: "none",
    });
  }
};

const nextIdea = () => {
  if (currentIndex.value < props.ideas.length - 1) {
    gsap.to(cardContainer.value, {
      x: -100,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        currentIndex.value++;
        nextTick(() => {
          animateCardIn("next");
        });
      },
    });
  }
};

const prevIdea = () => {
  if (currentIndex.value > 0) {
    gsap.to(cardContainer.value, {
      x: 100,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        currentIndex.value--;
        nextTick(() => {
          animateCardIn("prev");
        });
      },
    });
  }
};

const generateGuide = async () => {
  if (!currentIdea.value) return;
  isGenerating.value = true;
  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        generateGuide: true,
        idea: currentIdea.value,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Invalid JSON response" }));
      throw new Error(errorData.error || "Failed to fetch response from Gemini");
    }

    const data = await res.json();
    // Ensure data structure is consistent by always using a 'reports' object
    emit('update:idea', { ...currentIdea.value, reports: data.guide });
  } catch (e) {
    console.error("Error in generateGuide:", e);
    // Optionally, set an error state to show in the UI
  } finally {
    isGenerating.value = false;
  }
};

// Watch for changes in currentIdea to trigger animations
watch(
  currentIdea,
  (newIdea) => {
    if (newIdea) {
      nextTick(() => {
        if (!newIdea.reports && marqueeContainer.value) {
          startMarqueeAnimation();
        }
      });
    }
  },
  { deep: true }
);

// Initial animation when component is mounted and an idea is already present
onMounted(() => {
  if (currentIdea.value && !currentIdea.value.reports && marqueeContainer.value) {
    startMarqueeAnimation();
  }
});
</script>

<style scoped>
.skeleton-shimmer {
  background: #E3C0A7; /* secondary-80 from palette as base */
  background-image: linear-gradient(
    to right,
    #E3C0A7 0%,
    #FFDCC4 20%, /* secondary-90 highlight */
    #E3C0A7 40%,
    #E3C0A7 100%
  );
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
