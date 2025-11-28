<template>
  <div>
    <div v-if="!isLoading" ref="heroContainer" class="p-4 rounded-3xl bg-light-inverse-surface">
      <div class="flex flex-col items-end gap-3">
        <div class="relative w-full">
          <input
            id="hobby-input"
            v-model="inputValue"
            type="text"
            autocomplete="off"
            class="w-full h-20 px-4 py-3 bg-transparent rounded-lg outline-none text-l font-regular text-light-inverse-on-surface placeholder:text-light-inverse-on-surface placeholder:opacity-70"
            :placeholder="placeholderText"
          />
        </div>
        
        <HeroSuggestions @select="handleSuggestionSelect" />

        <button
          @click="handleClick"
          :disabled="inputValue.trim() === ''"
          class="flex items-center justify-center w-full gap-3 px-4 transition-colors bg-light-primary md:w-auto h-12 rounded-full disabled:bg-light-primary-50 disabled:cursor-not-allowed"
        >
          <span class="font-medium text-m text-light-on-primary">Give me some shit</span>
        </button>
      </div>
    </div>

    <!-- Skeleton Loader -->
    <div v-else class="w-full max-w-[1440px] mx-auto">
      <!-- Skeleton Navigation Buttons (Hidden/Placeholder to match layout if needed, but here we just want the card) -->
      <!-- Actually, PromptLayout has buttons above the card. Hero is just the input. 
           The user asked for "same effect as PromptLayout". PromptLayout has a big card skeleton.
           Hero is usually smaller, but maybe we want to transition TO the big card skeleton?
           The user said "waiting for gemini... loading screen... like PromptLayout".
           So we should probably show the big card skeleton here to make the transition seamless.
      -->
       <div class="container-centered w-full">
        <!-- Skeleton Navigation Buttons -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 opacity-0"> <!-- Hidden but taking space if we want exact match, or just omit -->
           <!-- Omitted for now as Hero doesn't have nav buttons usually, but let's stick to the card -->
        </div>

        <!-- Skeleton Card -->
        <div class="bg-secondary-35 rounded-[6px] p-8 md:p-16 relative overflow-hidden min-h-[600px] w-full ">
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import HeroSuggestions from "./HeroSuggestions.vue";

const heroContainer = ref(null);
const descriptionText = ref(null);

const props = defineProps({
  isLoading: Boolean,
});

const inputValue = ref("");
const emit = defineEmits(["show-money"]);

const handleClick = () => {
  emit("show-money", inputValue.value);
};

const handleSuggestionSelect = (text) => {
  inputValue.value = text;
};

const playHeroAnimation = () => {
  const tl = gsap.timeline();
  tl.to(heroContainer.value, { y: 100, autoAlpha: 0, duration: 0.5 });
  tl.to(descriptionText.value, { autoAlpha: 0, duration: 0.5 }, "<");
  return tl;
};

const resetAnimation = () => {
  gsap.set([heroContainer.value, descriptionText.value], { y: 0, autoAlpha: 1 });
};

// Placeholder Animation Logic
const placeholderText = ref("");
const phrases = [
  "What is an interest or hobby that you enjoy?",
  "I like reading romance novels",
  "I enjoy hiking in the mountains",
  "I want to learn pottery",
  "I love baking sourdough bread",
  "I'm interested in astrophotography"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeTimeout = null;

const typePlaceholder = () => {
  const currentPhrase = phrases[phraseIndex];
  
  if (isDeleting) {
    placeholderText.value = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    placeholderText.value = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let typeSpeed = 50;

  if (!isDeleting && charIndex === currentPhrase.length) {
    // Finished typing phrase, pause before deleting
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Finished deleting, move to next phrase
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeSpeed = 500;
  }

  typeTimeout = setTimeout(typePlaceholder, typeSpeed);
};

onMounted(() => {
  typePlaceholder();
});

onUnmounted(() => {
  if (typeTimeout) clearTimeout(typeTimeout);
});

defineExpose({ playHeroAnimation, resetAnimation });
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
