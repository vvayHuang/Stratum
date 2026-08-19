<template>
  <div>
    <!-- Main content area with consistent height -->
    <div v-if="!props.error" class="min-h-[796px] flex flex-col items-center mx-auto max-w-[1440px] w-full">
      <div v-if="isLoading && ideas.length === 0"
        class="flex-grow flex items-center md:justify-center w-full p-8 md:p-16">
        <h2
          class="text-3xl font-brand font-medium italic leading-tight text-start md:text-center text-shimmer max-w-4xl">
          {{ props.prompt }}
        </h2>
      </div>

      <div v-else-if="ideas.length > 0" class="container-centered w-full">
        <!-- Main Card -->
        <div ref="cardContainer"
          class="bg-light-surface text-light-on-surface py-8 px-4 md:p-16 relative overflow-hidden ">
          <div v-if="currentIdea">
            <!-- Header: Title and Nav Buttons -->
            <div class="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
              <div ref="cardTitleWrapper" class="overflow-hidden flex-1">
                <h2 class="text-[57px] font-brand font-normal leading-[64px] mb-2 text-light-on-surface">
                  {{ currentIdea.title }}
                </h2>
              </div>

              <!-- Navigation Buttons -->
              <div class="flex gap-3 shrink-0">
                <IconButton name="navigate_before" :disabled="currentIndex === 0" @click="prevIdea" size="24" />
                <IconButton name="navigate_next" :disabled="currentIndex === ideas.length - 1" @click="nextIdea"
                  size="24" />
              </div>
            </div>

            <div ref="cardDescriptionWrapper" class="overflow-hidden">
              <p class="text-[18px] md:text-[20px] leading-[1.6] mb-12 text-light-on-surface">
                {{ currentIdea.description }}
              </p>
            </div>

            <!-- Content Area / Marquee -->
            <div v-if="!isGenerating && !currentIdea.reports"
              class="relative flex flex-col items-center justify-center px-4 py-12 overflow-hidden h-[412px] md:h-[712px]">
              <!-- Background Decoration (Steps Placeholder Marquee) -->
              <div ref="marqueeContainer"
                class="absolute inset-0 flex flex-col gap-4 md:gap-8 opacity-50 pointer-events-none select-none">
                <!-- Sequence of items (7 repeated blocks to fill space) -->
                <div v-for="n in 14" :key="n" class="flex items-center gap-6">
                  <div class="w-16 h-16 rounded-full skeleton-shimmer shrink-0"></div>
                  <div class="flex flex-col gap-3 w-full">
                    <div class="h-5 w-full rounded-full skeleton-shimmer"></div>
                    <div class="h-5 w-3/4 rounded-full skeleton-shimmer"></div>
                  </div>
                </div>
              </div>

              <!-- Center Button -->
              <div ref="generateGuideBtnWrapper" class="overflow-hidden z-10 relative">
                <Button @click="generateGuide" variant="secondary-container" icon="emoji_objects"
                  customClass="px-6 py-4 md:px-16 md:py-8 md:text-xl md:font-brand w-full md:w-auto">
                  GENERATE GUIDE
                </Button>
              </div>

              <div ref="generateGuideTextWrapper" class="overflow-hidden z-10 mt-6 relative">
                <p class="text-center text-[16px] text-light-on-surface-variant font-medium">
                  This will provide you with every bling-worthy step required to pull this off.
                </p>
              </div>
            </div>

            <div v-else-if="isGenerating" class="flex flex-col items-center justify-center h-[712px]">
              <svg class="animate-spin h-10 w-10 text-light-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <p class="text-light-primary text-xl font-semibold">Generating Guide...</p>
            </div>
            <ReportContainer v-if="currentIdea.reports && !isGenerating" :reportData="currentIdea.reports" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount } from "vue";
import gsap from "gsap";

import ReportContainer from "./ReportContainer.vue";
import Button from "./Button.vue";
import IconButton from "./IconButton.vue";

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
// ideaLabelWrapper not used in new design
const cardTitleWrapper = ref(null);
const cardDescriptionWrapper = ref(null);
const generateGuideBtnWrapper = ref(null);
const generateGuideTextWrapper = ref(null);
const isGenerating = ref(false);

const marqueeContainer = ref(null);
let marqueeTimeline = null; // Store timeline reference

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
    // ideaLabelWrapper.value?.children[0], // Removed in new design
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

const stopMarqueeAnimation = () => {
  if (marqueeTimeline) {
    marqueeTimeline.kill();
    marqueeTimeline = null;
  }
};

const startMarqueeAnimation = () => {
  stopMarqueeAnimation(); // Ensure clean slate

  // 14 items in loop. Each item: 64px height + 32px gap = 96px.
  // We want to scroll half of them to create a seamless loop?
  // If we have 14 items, and we scroll 7 items worth of height, it might be seamless if the list repeats?
  // 7 * 96 = 672px.

  if (marqueeContainer.value) {
    // Reset position immediately
    gsap.set(marqueeContainer.value, { y: 0 });

    marqueeTimeline = gsap.timeline({
      repeat: -1, // Infinite loop
      defaults: { ease: "none" }
    });

    // Animate up by 672px (height of 7 items)
    marqueeTimeline.to(marqueeContainer.value, {
      y: -672,
      duration: 15, // Slower, consistent speed
      ease: "none",
    });
  }
};

const nextIdea = () => {
  if (currentIndex.value < props.ideas.length - 1) {
    stopMarqueeAnimation();
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
    stopMarqueeAnimation();
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
  stopMarqueeAnimation(); // Stop animation while generating? Or keep it? User didn't specify, but usually good to stop if it gets replaced.
  // Actually, while generating, the block is replaced by the spinner, so it's fine.

  try {
    const res = await fetch("/api/guide", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ideaId: currentIdea.value.id,
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

// Watch for changes in currentIdea to trigger marquee if needed
watch(
  () => currentIdea.value,
  (newIdea) => {
    if (newIdea) {
      nextTick(() => {
        // Only start if reports are missing (placeholder mode) AND container exists
        if (!newIdea.reports && marqueeContainer.value) {
          startMarqueeAnimation();
        } else {
          stopMarqueeAnimation();
        }
      });
    }
  },
  { deep: true }
);

// Also watch marqueeContainer ref specifically, in case it renders later
watch(marqueeContainer, (newVal) => {
  if (newVal && currentIdea.value && !currentIdea.value.reports) {
    startMarqueeAnimation();
  }
});

// Initial animation when component is mounted and an idea is already present
onMounted(() => {
  if (currentIdea.value && !currentIdea.value.reports && marqueeContainer.value) {
    startMarqueeAnimation();
  }
});

onBeforeUnmount(() => {
  stopMarqueeAnimation();
});
</script>

<style scoped>
.skeleton-shimmer {
  background: #E2E7AF;
  /* secondary-80 from palette as base */
  background-image: linear-gradient(to right,
      #E2E7AF 0%,
      #FFDCC4 20%,
      /* secondary-90 highlight */
      #E2E7AF 40%,
      #E2E7AF 100%);
  background-repeat: no-repeat;
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

.text-shimmer {
  background: linear-gradient(to right,
      #221A14 0%,
      #89511F 20%,
      #221A14 40%,
      #221A14 100%);
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: shimmer 3s linear infinite;
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
