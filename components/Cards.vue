<template>
  <div class="w-full overflow-hidden py-10">
    <div ref="marqueeContainer" class="flex gap-8">
      <!-- Render the list of prompts twice for a seamless loop -->
      <div
        v-for="(prompt, index) in [...prompts, ...prompts]"
        :key="index"
        @click="handleCardClick(prompt)"
        class="w-[320px] h-[200px] shrink-0 bg-light-primary p-6 rounded-lg border border-light-outline-variant hover:opacity-75 transition-colors cursor-pointer flex flex-col justify-between"
      >
        <h3 class="text-light-on-primary font-semibold text-xl">
          "{{ prompt.prompt }}"
        </h3>
        <div class="inline-flex items-center bg-light-primary-container rounded px-3 py-1 self-start">
          <span class="text-light-on-primary-container text-sm font-semibold">GET IDEAS</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps, defineEmits } from 'vue';
import gsap from 'gsap';

const props = defineProps({
  prompts: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(['prompt-click']);

const marqueeContainer = ref(null);
let marqueeAnimation;

onMounted(() => {
  if (props.prompts.length > 0) {
    setupMarquee();
  }
});

onUnmounted(() => {
  if (marqueeAnimation) {
    marqueeAnimation.kill();
  }
});

const setupMarquee = () => {
  const container = marqueeContainer.value;
  if (!container) return;

  const cards = container.children;
  const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(container).gap);
  const totalWidth = cardWidth * props.prompts.length;

  gsap.set(container, { x: 0 });

  marqueeAnimation = gsap.to(container, {
    x: `-=${totalWidth}`,
    duration: 60, // Adjust duration for speed
    ease: 'none',
    repeat: -1, // Infinite loop
    modifiers: {
      x: gsap.utils.unitize(x => parseFloat(x) % totalWidth),
    },
  });
};

const handleCardClick = (promptObj) => {
  emit('prompt-click', promptObj.prompt, promptObj.id);
};

const playCardsAnimation = () => {
  const tl = gsap.timeline();
  tl.to(marqueeContainer.value.children, {
    y: 100,
    autoAlpha: 0,
    duration: 0.5,
    stagger: 0.1,
    delay: 0.2,
  });
  return tl;
};

defineExpose({ playCardsAnimation });

// Watch for prompts to be loaded
watch(() => props.prompts, (newPrompts) => {
  if (newPrompts.length > 0) {
    nextTick(() => {
      setupMarquee();
    });
  }
}, { immediate: true });
</script>
