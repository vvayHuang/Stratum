<template>
  <div>
    <div class="text-white w-[1152px] px-6 mx-auto">
      <div class="flex justify-center items-center mb-16 min-h-[60px]">
        <div v-if="props.error" class="text-center">
          <div class="inline-block bg-red-500/10 p-4 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-2xl font-semibold mb-2">Oops! Something went wrong.</h3>
          <p class="text-red-400 mb-6">
            {{ isOverloadError ? '錯誤請稍後再試' : props.error }}
          </p>
          <button @click="$emit('reset')" class="flex items-center justify-center gap-2 bg-[#00D37E] text-[#006E42] font-bold rounded-md px-6 py-3 text-lg">
            <img src="~/assets/arrow-right.svg" alt="Return" class="transform rotate-180" />
            返回
          </button>
        </div>
        <p
          v-else-if="!isLoading"
          class="text-center text-3xl font-semibold"
        >
          “{{ prompt }}”
        </p>
      </div>
    </div>

    <!-- Main content area with consistent height -->
    <div v-if="!props.error" class="min-h-[796px] flex flex-col justify-center items-center">
      <div
        v-if="isLoading && ideas.length === 0"
        class="flex flex-col items-center justify-center"
      >
        <svg
          class="animate-spin h-10 w-10 text-white mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="text-white text-xl font-semibold">Loading...</p>
      </div>

      <div v-else-if="ideas.length > 0" class="container-centered">
        <div class="flex justify-between items-center mb-10">
          <button
            @click="prevIdea"
            :disabled="currentIndex === 0"
            class="flex items-center gap-2 px-5 py-3 bg-[#00D37E] text-[#006E42] font-bold rounded-md text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img
              src="~/assets/arrow-right.svg"
              alt="Previous"
              class="transform rotate-180"
            />
            PREV IDEA
          </button>
          <button
            @click="nextIdea"
            :disabled="currentIndex === ideas.length - 1"
            class="flex items-center gap-2 px-5 py-3 bg-[#00D37E] text-[#006E42] font-bold rounded-md text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            NEXT IDEA
            <img src="~/assets/arrow-right.svg" alt="Next" />
          </button>
        </div>

        <div
          ref="cardContainer"
          class="border border-[#00D37E] rounded-[6px] p-16 relative"
        >
          <div v-if="currentIdea">
            <div class="flex justify-between items-start mb-4">
              <div>
                <div
                  ref="ideaLabelWrapper"
                  class="border border-[#00D37E] rounded-md px-2 py-1 inline-block mb-4 overflow-hidden"
                >
                  <p class="text-[#00FF98] font-bold text-[18px] leading-[1.44]">
                    IDEA {{ currentIndex + 1 }} OF {{ ideas.length }}
                  </p>
                </div>

                <div ref="cardTitleWrapper" class="overflow-hidden">
                  <h2 class="text-[62px] font-semibold leading-[1.19] mb-4">
                    {{ currentIdea.title }}
                  </h2>
                </div>
              </div>
            </div>

            <div ref="cardDescriptionWrapper" class="overflow-hidden">
              <p class="text-[22px] leading-[1.5] mb-12">
                {{ currentIdea.description }}
              </p>
            </div>

            <div
              v-if="!isGenerating && !currentIdea.report"
              class="p-12 rounded-lg flex flex-col items-center gap-[17px] relative overflow-hidden"
            >
              <div ref="marqueeContainer" class="absolute inset-0">
                <img
                  src="~/assets/group1.svg"
                  alt="decoration"
                  class="absolute w-full left-1/2 -translate-x-1/2 top-[38px]"
                />

                <img
                  src="~/assets/group2.svg"
                  alt="decoration"
                  class="absolute w-full left-1/2 -translate-x-1/2 top-[138px]"
                />

                <img
                  src="~/assets/group3.svg"
                  alt="decoration"
                  class="absolute w-full left-1/2 -translate-x-1/2 top-[238px]"
                />

                <img
                  src="~/assets/group1.svg"
                  alt="decoration"
                  class="absolute w-full left-1/2 -translate-x-1/2 top-[338px]"
                />

                <img
                  src="~/assets/group2.svg"
                  alt="decoration"
                  class="absolute w-full left-1/2 -translate-x-1/2 top-[438px]"
                />

                <img
                  src="~/assets/group3.svg"
                  alt="decoration"
                  class="absolute w-full left-1/2 -translate-x-1/2 top-[538px]"
                />
              </div>

              <div ref="generateGuideBtnWrapper" class="overflow-hidden z-10">
                <button
                  @click="generateGuide"
                  class="flex items-center justify-center gap-[10px] bg-white text-[#009358] px-[24px] py-[17px] rounded-[4px] font-semibold text-[22px] h-[74px]"
                >
                  <img src="~/assets/ai-icon.svg" alt="AI" class="w-6 h-6" />

                  GENERATE GUIDE
                </button>
              </div>

              <div ref="generateGuideTextWrapper" class="overflow-hidden z-10">
                <p class="text-center text-[18px] font-bold leading-[1.44]">
                  This will provide you with every bling-worthy step required to
                  pull this off.
                </p>
              </div>
            </div>
            <div v-else-if="isGenerating" class="flex flex-col items-center justify-center h-[400px]">
              <svg class="animate-spin h-10 w-10 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-white text-xl font-semibold">Generating Guide...</p>
            </div>
            <ReportContainer v-if="currentIdea.report && !isGenerating" :reportData="currentIdea.report" />
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

const marqueeContainer = ref(null); // Declare marqueeContainer ref

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
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.1 },
    "<0.2" // Start after card container animation
  );
  return tl;
};

const startMarqueeAnimation = () => {
  const imageHeight = 62; // Height of a single SVG image
  const gapHeight = 38; // Gap between images
  const singleSequenceHeight = 3 * imageHeight + 2 * gapHeight; // Height of one sequence (group1, group2, group3 + 2 gaps)

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
      y: -(singleSequenceHeight + gapHeight), // Adjust target to include gapHeight at the end for seamless loop
      duration: 8, // Adjust duration for desired speed
      ease: "none", // Explicitly set ease to none here as well
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
    emit('update:idea', { ...currentIdea.value, report: data.guide });
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
    // The card animations are handled by the nextIdea/prevIdea functions.
    // We just need to handle the marquee animation here.
    if (newIdea) {
      nextTick(() => {
        if (!newIdea.report && marqueeContainer.value) {
          startMarqueeAnimation();
        }
      });
    }
  },
  { deep: true }
); // Deep watch for changes within the idea object if needed

// Initial animation when component is mounted and an idea is already present
onMounted(() => {
  if (currentIdea.value) {
    // animateCardIn('next'); // This will be handled by the watch
  }
});
</script>
