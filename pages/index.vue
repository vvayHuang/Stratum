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
          <Hero ref="heroComponent" @show-money="handleShowMoney" />
        </div>
      </div>

      <div v-if="isLoading" class="container-centered mt-10">
        <p>Loading...</p>
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
import { ref } from "vue";
import Navbar from "~/components/Navbar.vue";
import Hero from "~/components/Hero.vue";
import Cards from "~/components/Cards.vue";

const openAIResponse = ref("");
const cardsComponent = ref(null);
const heroComponent = ref(null);
const isLoading = ref(false);
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
