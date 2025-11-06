<template>
  <div ref="heroContainer" class="bg-[#00A160] rounded-[15px] p-6">
    <div v-if="!isLoading" class="flex items-center gap-4">
      <div class="relative w-full">
        <div class="relative flex-grow">
          <input
            id="hobby-input"
            v-model="inputValue"
            type="text"
            class="w-full bg-transparent text-white px-5 py-8 outline-none border border-[#00D37E] rounded-md peer text-lg font-bold"
            placeholder=" "
          />
          <label
            for="hobby-input"
            class="absolute left-5 top-8 text-white text-2xl font-semibold transition-all duration-200 px-1 -mx-1 peer-placeholder-shown:text-2xl peer-placeholder-shown:top-8 peer-placeholder-shown:bg-transparent peer-focus:text-xl peer-focus:top-2 peer-focus:bg-[#00A160] peer-not-placeholder-shown:text-xl peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:bg-[#00A160] cursor-text"
          >
            What is an interest or hobby that you enjoy?
          </label>
        </div>
      </div>
      <button
        @click="handleClick"
        :disabled="inputValue.trim() === ''"
        class="min-w-[286px] h-[86px] bg-white rounded-md flex items-center justify-center gap-3 px-4 disabled:bg-gray-200 disabled:cursor-not-allowed"
      >
        <img src="/assets/icon-money.svg" alt="money" class="w-7 h-7" />
        <span class="font-bold text-[#009358]">Show me the money</span>
      </button>
    </div>
    <div v-else class="flex items-center justify-center h-[86px]">
      <svg class="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  </div>
  <p ref="descriptionText" class="mt-4 text-white text-base opacity-80">
    "I like reading romance novels"
  </p>
</template>

<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";

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

const playHeroAnimation = () => {
  const tl = gsap.timeline();
  tl.to(heroContainer.value, { y: 100, opacity: 0, duration: 0.5 });
  tl.to(descriptionText.value, { opacity: 0, duration: 0.5 }, "<");
};

defineExpose({ playHeroAnimation });
</script>

<style scoped>
.peer:focus ~ label,
.peer:not(:placeholder-shown) ~ label {
  transform: translateY(-1.5rem) scale(0.75);
  transform-origin: left top;
}
</style>
