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
            placeholder="What is an interest or hobby that you enjoy?"
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
import { ref, onMounted } from "vue";
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

defineExpose({ playHeroAnimation, resetAnimation });
</script>

<style scoped>
/* Scoped styles can be removed as they are no longer used. */
</style>
