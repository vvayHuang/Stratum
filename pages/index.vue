<template>
  <div class="min-h-screen bg-[#009358] text-white flex flex-col">
    <header class="py-6">
      <div class="container-centered flex items-center justify-between">
        <Navbar />
      </div>
    </header>

    <main class="flex-grow flex flex-col pb-10 overflow-hidden">
      <div class="flex-grow flex items-center justify-center">
        <div class="container-centered w-full">
          <Hero ref="heroComponent" @show-money="handleShowMoney" :is-loading="isLoading" />
        </div>
      </div>

      <div v-if="isLoading" ref="loaderContainer" class="container-centered mt-10 flex items-center justify-center">
        <svg class="animate-spin h-16 w-16 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="ml-4 text-lg">Loading...</p>
      </div>
      <div v-if="error" class="container-centered mt-10">
        <p class="text-red-500">{{ error }}</p>
      </div>
      <div v-if="openAIResponse" class="container-centered mt-10">
        <h2 class="text-2xl font-bold mb-4">Here are some ideas:</h2>
        <pre class="whitespace-pre-wrap">{{ openAIResponse }}</pre>
      </div>

      <section class="mt-auto">
        <Cards ref="cardsComponent" />
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import gsap from "gsap";
import Navbar from "~/components/Navbar.vue";
import Hero from "~/components/Hero.vue";
import Cards from "~/components/Cards.vue";

const openAIResponse = ref("");
const cardsComponent = ref(null);
const heroComponent = ref(null);
const loaderContainer = ref(null);
const isLoading = ref(false);

watch(isLoading, (newValue) => {
  if (newValue) {
    gsap.from(loaderContainer.value, { opacity: 0, duration: 0.5 });
  }
});
const error = ref(null);

const handleShowMoney = async (prompt) => {
  isLoading.value = true;
  error.value = null;
  openAIResponse.value = "";

  if (heroComponent.value) {
    heroComponent.value.playHeroAnimation();
  }
  if (cardsComponent.value) {
    cardsComponent.value.playAnimation();
  }

  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch response from OpenAI");
    }

    const data = await res.json();
    openAIResponse.value = data.response;
    if (cardsComponent.value) {
      cardsComponent.value.playAnimation();
    }
  } catch (e) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
};
</script>
