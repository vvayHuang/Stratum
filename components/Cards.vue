<template>
  <div class="w-full overflow-hidden py-10">
    <div ref="marqueeContainer" class="flex gap-8">
      <!-- Render the list of prompts twice for a seamless loop -->
      <div
        v-for="(prompt, index) in [...prompts, ...prompts]"
        :key="index"
        @click="handleCardClick(prompt.prompt)"
        class="w-[320px] h-[200px] shrink-0 bg-transparent p-6 rounded-lg border border-[#00D37E] hover:bg-background-hover-variable transition-colors cursor-pointer flex flex-col justify-between"
      >
        <h3 class="text-white font-semibold text-xl">
          "{{ prompt.prompt }}"
        </h3>
        <div class="inline-flex items-center bg-[#00A160] rounded px-3 py-1 self-start">
          <span class="text-white text-sm font-semibold">GET IDEAS</span>
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

const handleCardClick = (promptText) => {
  emit('prompt-click', promptText);
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
