<template>
  <div
    class="overflow-x-auto scrollbar-hide -mx-[calc(50vw-50%)] px-[calc(50vw-50%)]"
  >
    <div ref="cardsContainer" class="flex gap-8 min-w-min py-2">
      <div
        v-for="n in 6"
        :key="n"
        class="w-[280px] h-[229px] shrink-0 bg-transparent p-5 rounded-md border border-[#00D37E] hover:border-white transition-colors"
      >
        <h3 class="text-white font-semibold text-xl">
          "I like to find broken things and fix them."
        </h3>
        <div
          class="mt-4 inline-flex items-center bg-[#00A160] rounded px-3 py-1"
        >
          <span class="text-white text-sm font-semibold"
            >11 BUSINESS IDEAS</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  scroll-behavior: smooth;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>

<script setup>
import { ref, onMounted, defineExpose } from "vue";
import gsap from "gsap";

const cardsContainer = ref(null);

onMounted(() => {
  // Cards are visible by default
});

const playAnimation = () => {
  gsap.to(cardsContainer.value.children, {
    y: 100,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    delay: 0.2, // Add a slight delay
  });
};

defineExpose({ playAnimation });
</script>
