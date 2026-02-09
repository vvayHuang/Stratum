<template>
  <div>
    <div v-if="!isLoading" ref="heroContainer"
      class="w-full h-screen flex flex-col justify-center items-center relative overflow-hidden isolate">
      <ClientOnly>
        <MeshGradientBackground :distortion="0.8" :swirl="0.1" :grainMixer="0" :grainOverlay="0" />
      </ClientOnly>
      <div class="flex flex-col items-center gap-8 w-full max-w-[800px] px-4 relative z-10">
        <h1 class="font-brand text-4xl leading-3xl text-light-on-secondary-container lg:text-center">
          Dive In: Discover Your Next Big Idea!
        </h1>

        <div
          class="w-full bg-light-inverse-surface rounded-3xl p-4 relative min-h-[172px] flex flex-col justify-between">
          <input id="hobby-input" v-model="inputValue" type="text" autocomplete="off"
            class="w-full h-auto bg-transparent outline-none text-l font-regular text-light-inverse-on-surface placeholder:text-light-inverse-on-surface placeholder:opacity-70 resize-none p-2"
            :placeholder="placeholderText" />

          <div class="flex justify-end">
            <button @click="handleClick" :disabled="inputValue.trim() === ''"
              class="flex items-center justify-center w-12 h-12 transition-colors bg-light-primary rounded-full disabled:bg-light-primary-50 disabled:cursor-not-allowed">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="white" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Skeleton Loader -->
    <div v-else class="min-h-[796px] flex flex-col items-center mx-auto max-w-[1440px] w-full">
      <div class="flex-grow flex items-center md:justify-center w-full p-8 md:p-16">
        <h2
          class="text-3xl font-brand font-medium italic leading-tight text-start md:text-center text-shimmer max-w-4xl">
          {{ inputValue }}
        </h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import MeshGradientBackground from "./MeshGradientBackground.vue";

const heroContainer = ref(null);

const props = defineProps({
  isLoading: Boolean,
});

const inputValue = ref("");
const emit = defineEmits(["show-money"]);

const handleClick = () => {
  emit("show-money", inputValue.value);
};



const playHeroAnimation = () => {
  const tl = gsap.timeline();
  if (heroContainer.value) {
    tl.to(heroContainer.value, { y: 100, autoAlpha: 0, duration: 0.5 });
  }
  return tl;
};

const resetAnimation = () => {
  if (heroContainer.value) {
    gsap.set(heroContainer.value, { y: 0, autoAlpha: 1 });
  }
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
