<template>
  <div class="min-h-screen bg-light-surface text-light-on-surface flex flex-col">
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-light-surface flex flex-col items-center justify-center z-50">
      <svg
        class="animate-spin h-10 w-10 text-white mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p class="text-white text-xl font-semibold">Loading...</p>
    </div>

    <header class="py-6">
      <div class="mx-auto max-w-[1440px] px-6 flex items-center justify-between">
        <Navbar @open-login-modal="loginModal.openModal()" />
      </div>
    </header>

    <main class="flex-grow flex flex-col overflow-hidden">
      <div class="flex-grow flex items-center justify-center">
        <!-- Hero component, only shown when not loading and no ideas -->
        <div class="mx-auto max-w-3xl py-64 w-full overflow-hidden">
          <Hero ref="heroComponent" @show-money="handleShowMoney" />
        </div>
      </div>
      
      
      <div class="mx-auto max-w-[1440px] px-4 w-full mt-12 mb-20">
        <CommunitySection 
          :prompts="recentPrompts"
          @prompt-click="(promptText, promptId) => navigateTo(`/prompts/${promptId}`)"
        />
      </div>

      

      <div class="w-full">
        <Footer />
      </div>
    </main>

    <LoginModal ref="loginModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { navigateTo } from '#app';
import { useSupabaseUser, useSupabaseClient } from '#imports';
import gsap from "gsap";
import Navbar from "~/components/Navbar.vue";
import Hero from "~/components/Hero.vue";
import CommunitySection from "~/components/CommunitySection.vue";
import Cards from "~/components/Cards.vue";
import Footer from "~/components/Footer.vue";
import LoginModal from "~/components/LoginModal.vue";
import type { Database } from '~/types/database.types';

const user = useSupabaseUser();
const cardsComponent = ref(null);
const heroComponent = ref(null);
const loginModal = ref(null);
const isLoading = ref(false);

const { data: recentPrompts, error: fetchError } = await useAsyncData('public-prompts', async () => {
  const supabase = useSupabaseClient<Database>();
  
  // Fetch prompts with created_at and count of ideas
  const { data: prompts, error: promptsError } = await supabase
    .from('prompts')
    .select(`
      id,
      prompt,
      created_at,
      ideas:ideas(count)
    `)
    .order('created_at', { ascending: false })
    .limit(200);
  
  if (promptsError) throw promptsError;
  if (!prompts || prompts.length === 0) return [];

  // Map to final structure with ideas count
  return prompts.map(p => ({
    id: p.id,
    prompt: p.prompt,
    created_at: p.created_at,
    ideas_count: Array.isArray(p.ideas) ? p.ideas.length : 0,
  })) || [];
}, {
  default: () => []
});

if (fetchError.value) {
  console.error("Failed to fetch public prompts for cards:", fetchError.value);
}

watchEffect(() => {
  if (user.value && loginModal.value) {
    loginModal.value.closeModal();
  }
});

const handleShowMoney = async (p) => {
  isLoading.value = true;
  console.log("handleShowMoney called!");

  const heroAnim = heroComponent.value ? heroComponent.value.playHeroAnimation() : null;
  const cardsAnim = cardsComponent.value ? cardsComponent.value.playCardsAnimation() : null;

  try {
    await Promise.all([
      heroAnim ? heroAnim : Promise.resolve(),
      cardsAnim ? cardsAnim : Promise.resolve(),
    ]);

    let apiBody = { prompt: p };

    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiBody),
    });

    if (!res.ok) {
      console.error("Fetch response not OK:", res);
      const errorData = await res.json().catch(() => ({ error: "Invalid JSON response" }));
      throw new Error(errorData.error || "Failed to fetch response from Gemini");
    }

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }
    const newPromptId = data.promptId; // Assuming promptId is returned from API

    if (newPromptId) {
      navigateTo(`/prompts/${newPromptId}`);
    }

  } catch (e) {
    console.error("Error in handleShowMoney:", e);
    // If something fails, reset the loading state so the user isn't stuck
    isLoading.value = false;
  }
};
</script>

