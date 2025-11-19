<template>
  <div>
    <div v-if="!isLoading" ref="heroContainer" class="bg-[#00A160] rounded-[15px] p-6">
      <div class="flex flex-col md:flex-row items-center gap-4">
        <div class="relative w-full">
          <div class="relative flex-grow">
            <input
              id="hobby-input"
              v-model="inputValue"
              type="text"
              autocomplete="off"
              class="w-full bg-transparent text-white px-5 py-8 outline-none border border-[#00D37E] rounded-md peer text-lg font-bold"
              placeholder=" "
            />
            <label
              ref="promptLabel"
              for="hobby-input"
              class="absolute left-5 top-4 md:top-8 text-white text-xl md:text-base lg:text-2xl font-semibold transition-all duration-200 px-1 -mx-1 peer-placeholder-shown:text-xl md:peer-placeholder-shown:text-base lg:peer-placeholder-shown:text-2xl peer-placeholder-shown:top-4 md:peer-placeholder-shown:top-8 peer-placeholder-shown:bg-transparent peer-focus:text-base md:peer-focus:text-sm lg:peer-focus:text-xl peer-focus:top-2 peer-focus:bg-[#00A160] peer-not-placeholder-shown:text-base md:peer-not-placeholder-shown:text-sm lg:peer-not-placeholder-shown:text-xl peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:bg-[#00A160] cursor-text"
            >
              What is an interest or hobby that you enjoy?
            </label>
          </div>
        </div>
        <button
          @click="handleClick"
          :disabled="inputValue.trim() === ''"
          class="w-full md:w-auto md:min-w-[286px] h-[86px] bg-white rounded-md flex items-center justify-center gap-3 px-4 disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          <img src="/assets/icon-money.svg" alt="money" class="w-7 h-7" />
          <span class="font-bold text-[#009358]">Show me the money</span>
        </button>
      </div>
    </div>
    <p v-if="!isLoading" ref="descriptionText" class="mt-4 text-white text-base opacity-80">
      "I like reading romance novels"
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";

const heroContainer = ref(null);
const descriptionText = ref(null);
const promptLabel = ref(null);

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
  tl.to(heroContainer.value, { y: 100, autoAlpha: 0, duration: 0.5 });
  tl.to(promptLabel.value, { y: 50, autoAlpha: 0, duration: 0.4 }, "<0.1");
  tl.to(descriptionText.value, { autoAlpha: 0, duration: 0.5 }, "<");
  return tl;
};

const resetAnimation = () => {
  gsap.set([heroContainer.value, descriptionText.value, promptLabel.value], { y: 0, autoAlpha: 1 });
};

defineExpose({ playHeroAnimation, resetAnimation });
</script>

<style scoped>
.peer:focus ~ label,
.peer:not(:placeholder-shown) ~ label {
  transform: translateY(-1.5rem) scale(0.75);
  transform-origin: left top;
}
</style>
