<template>
  <div class="text-white">
    <div class="flex justify-center items-center mb-16">
      <p v-if="!isLoading" class="text-center text-3xl font-semibold">
        “{{ prompt }}”
      </p>
    </div>

    <div v-if="isLoading && ideas.length === 0" class="flex flex-col items-center justify-center h-[200px]">
      <svg class="animate-spin h-10 w-10 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-white text-xl font-semibold">Loading...</p>
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-10">
        <button @click="prevIdea" class="flex items-center gap-2 px-5 py-3 bg-[#00D37E] text-[#006E42] font-bold rounded-md text-lg">
          <img src="~/assets/arrow-right.svg" alt="Previous" class="transform rotate-180" />
          PREV IDEA
        </button>
        <button @click="nextIdea" class="flex items-center gap-2 px-5 py-3 bg-[#00D37E] text-[#006E42] font-bold rounded-md text-lg">
          NEXT IDEA
          <img src="~/assets/arrow-right.svg" alt="Next" />
        </button>
      </div>

      <div class="border border-[#00D37E] rounded-lg p-16">
        <div v-if="currentIdea">
          <div class="flex justify-between items-start mb-4">
            <div>
              <div class="border border-[#00D37E] rounded-md px-2 py-1 inline-block mb-4">
                <p class="text-[#00FF98] font-bold text-sm">IDEA {{ currentIndex + 1 }} OF {{ ideas.length }}</p>
              </div>
              <h2 class="text-6xl font-semibold mb-4">{{ currentIdea.title }}</h2>
            </div>
          </div>
          <p class="text-xl leading-relaxed mb-12">
            {{ currentIdea.description }}
          </p>

          <div class="bg-black bg-opacity-25 p-12 rounded-lg flex flex-col items-center">
            <button class="flex items-center gap-4 bg-white text-[#009358] px-8 py-6 rounded-md font-bold text-2xl mb-4">
              <img src="~/assets/ai-icon.svg" alt="AI" />
              GENERATE GUIDE
            </button>
            <p class="text-center text-sm">
              This will provide you with every bling-worthy step required to pull this off.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  prompt: {
    type: String,
    required: true,
  },
  ideas: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['reset']);

const currentIndex = ref(0);

const currentIdea = computed(() => {
  return props.ideas.length > 0 ? props.ideas[currentIndex.value] : null;
});

const nextIdea = () => {
  if (currentIndex.value < props.ideas.length - 1) {
    currentIndex.value++;
  }
};

const prevIdea = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};
</script>
