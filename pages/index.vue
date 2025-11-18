<template>
  <div class="min-h-screen bg-[#009358] text-white flex flex-col">
    <header class="py-6">
      <div class="mx-auto max-w-6xl px-6 flex items-center justify-between">
        <Navbar @open-login-modal="loginModal.openModal()" />
      </div>
    </header>

    <main class="flex-grow flex flex-col pb-10 overflow-hidden">
      <div class="flex-grow flex items-center justify-center">
        <!-- Hero component, only shown when not loading and no ideas -->
        <div class="mx-auto max-w-6xl px-6 w-full overflow-hidden">
          <Hero
            ref="heroComponent"
            @show-money="handleShowMoney"
          />
        </div>
      </div>
      <section class="mt-auto">
        <Cards ref="cardsComponent" :prompts="recentPrompts" @prompt-click="(promptText, promptId) => navigateTo(`/prompts/${promptId}`)" />
      </section>
    </main>

    <LoginModal ref="loginModal" />
  </div>
</template>

<script setup>
definePageMeta({ auth: false });
import { ref, watchEffect, onMounted } from "vue";
import { navigateTo } from '#app';
import { useSupabaseUser, useSupabaseClient } from '#imports';
import gsap from "gsap";
import Navbar from "~/components/Navbar.vue";
import Hero from "~/components/Hero.vue";
import Cards from "~/components/Cards.vue";

import LoginModal from "~/components/LoginModal.vue"; // Import LoginModal

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const recentPrompts = ref([]);
const cardsComponent = ref(null);
const heroComponent = ref(null);
const loginModal = ref(null); // Ref for LoginModal

onMounted(async () => {
  const { data, error } = await supabase
    .from('prompts')
    .select('id, prompt') // Select both id and prompt
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching recent prompts:', error);
  } else {
    recentPrompts.value = data;
  }
});

watchEffect(() => {
  if (user.value && loginModal.value) {
    loginModal.value.closeModal();
  }
});

const handleShowMoney = async (p) => {
  console.log("handleShowMoney called!");

  const heroAnim = heroComponent.value ? heroComponent.value.playHeroAnimation() : null;
  const cardsAnim = cardsComponent.value ? cardsComponent.value.playCardsAnimation() : null;

  await Promise.all([
    heroAnim ? heroAnim : Promise.resolve(),
    cardsAnim ? cardsAnim : Promise.resolve(),
  ]);

  try {
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
  } finally {
  }
};


</script>
