<template>
  <div class="min-h-screen bg-[#009358] text-white flex flex-col">
    <header class="py-6">
      <div class="container-centered flex items-center justify-between">
        <Navbar @open-login-modal="loginModal.openModal()" />
      </div>
    </header>

    <main class="flex-grow flex flex-col pb-10 overflow-hidden">
      <div class="flex-grow flex items-center justify-center">
        <!-- Hero component, only shown when not loading and no ideas -->
        <div v-if="!isLoading && ideas.length === 0" class="container-centered w-full overflow-hidden">
          <Hero
            ref="heroComponent"
            @show-money="handleShowMoney"
            :is-loading="isLoading"
          />
        </div>

        <!-- PromptLayout component, only shown when loading or ideas are present -->
        <div
          v-if="isLoading || ideas.length > 0 || error"
          ref="loaderContainer"
          class="my-10"
        >
          <PromptLayout :prompt="prompt" :ideas="ideas" :isLoading="isLoading" :error="error" @reset="handleReset" />
        </div>
      </div>

      <section class="mt-auto" v-show="!isLoading && ideas.length === 0">
        <Cards ref="cardsComponent" />
      </section>
    </main>

    <LoginModal ref="loginModal" />
  </div>
</template>

<script setup>
definePageMeta({ auth: false });
import { ref, watch, computed, nextTick, watchEffect } from "vue";
import { useSupabaseUser } from '#imports';
import gsap from "gsap";
import Navbar from "~/components/Navbar.vue";
import Hero from "~/components/Hero.vue";
import Cards from "~/components/Cards.vue";
import PromptLayout from "~/components/PromptLayout.vue";
import LoginModal from "~/components/LoginModal.vue"; // Import LoginModal

const user = useSupabaseUser();
const geminiResponse = ref("");
const cardsComponent = ref(null);
const heroComponent = ref(null);
const loaderContainer = ref(null);
const isLoading = ref(false);
const prompt = ref("");
const loginModal = ref(null); // Ref for LoginModal

watchEffect(() => {
  if (user.value && loginModal.value) {
    loginModal.value.closeModal();
  }
});

watch(isLoading, (newValue) => {
  if (newValue) {
    nextTick(() => {
      if (loaderContainer.value) {
        gsap.fromTo(
          loaderContainer.value,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 }
        );
      }
    });
  }
});
const error = ref(null);

const ideas = computed(() => {
  if (!geminiResponse.value) return [];

  const regex = /\d+\.\s*\*\*(.*?)\*\*:\s*([\s\S]*?)(?=\d+\.\s*\*\*|$)/g;
  let match;
  const allIdeas = [];
  while ((match = regex.exec(geminiResponse.value)) !== null) {
    allIdeas.push({ title: match[1].trim(), description: match[2].trim() });
  }
  return allIdeas;
});

const handleShowMoney = async (p) => {
  console.log("handleShowMoney called!");
  prompt.value = p;
  error.value = null;
  geminiResponse.value = "";

  const heroAnim = heroComponent.value ? heroComponent.value.playHeroAnimation() : null;
  const cardsAnim = cardsComponent.value ? cardsComponent.value.playAnimation() : null;

  await Promise.all([
    heroAnim ? heroAnim : Promise.resolve(),
    cardsAnim ? cardsAnim : Promise.resolve(),
  ]);

  isLoading.value = true;

  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: p }),
    });

    if (!res.ok) {
      console.error("Fetch response not OK:", res);
      const errorData = await res.json().catch(() => ({ error: "Invalid JSON response" }));
      throw new Error(errorData.error || "Failed to fetch response from Gemini");
    }

    const data = await res.json();
    geminiResponse.value = data.text;

  } catch (e) {
    console.error("Error in handleShowMoney:", e);
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
};

const handleReset = () => {
  geminiResponse.value = "";
  prompt.value = "";
  if (heroComponent.value) {
    heroComponent.value.resetAnimation();
  }
};
</script>
