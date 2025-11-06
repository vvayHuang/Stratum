<template>
  <div ref="heroContainer" class="bg-[#00A160] rounded-[15px] p-6">
    <div class="flex items-center gap-4">
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
