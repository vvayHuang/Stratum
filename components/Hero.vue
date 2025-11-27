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
    <p v-if="!isLoading" ref="descriptionText" class="mt-4 text-base opacity-80 text-light-on-primary">
      "I like reading romance novels"
    </p>
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
/* Scoped styles can be removed as they are no longer used. */
</style>
