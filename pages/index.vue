<template>
  <div class="min-h-screen bg-light-surface text-light-on-surface flex flex-col">
    <!-- Loading Overlay Removed -->
    <!-- <div v-if="isLoading" class="fixed inset-0 bg-light-surface flex flex-col items-center justify-center z-50"> ... </div> -->

    <header class="sticky top-0 z-50 bg-light-surface/80 backdrop-blur-md border-light-outline-variant">
      <div class="mx-auto max-w-[1440px] lg:px-6 flex items-center justify-between">
        <Navbar />
      </div>
    </header>

    <main class="flex-grow flex flex-col overflow-hidden">
      <div class="flex-grow flex items-center justify-center">
        <!-- Hero component, only shown when not loading and no ideas -->
        <div class="mx-auto w-full overflow-hidden">
          <Hero ref="heroComponent" :isLoading="isLoading" @show-money="handleShowMoney" />
        </div>
      </div>
      
      
      <div class="mx-auto max-w-[1440px] px-4 md:px-12 py-6 w-full lg:my-20">
        <CommunitySection 
          ref="communitySection"
          :prompts="recentPrompts"
          :isLoading="isFetchingPrompts"
          @prompt-click="(promptText, promptId) => router.push(`/prompts/${promptId}`)"
        />
      </div>

      

      <Footer />
      
    </main>


  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRouter } from 'vue-router'; // Import useRouter
import { useSupabaseUser, useSupabaseClient } from '#imports';
import gsap from "gsap";
import Navbar from "~/components/Navbar.vue";
import Hero from "~/components/Hero.vue";
import CommunitySection from "~/components/CommunitySection.vue";
import Cards from "~/components/Cards.vue";
import Footer from "~/components/Footer.vue";
// import LoginModal from "~/components/LoginModal.vue";
import type { Database } from '~/types/database.types';

definePageMeta({
  layout: false
});

const user = useSupabaseUser();
const router = useRouter(); // Initialize router
const cardsComponent = ref(null);
const heroComponent = ref(null);
const communitySection = ref(null);
// const loginModal = ref(null);
const isLoading = ref(false);

const recentPrompts = ref([]);
const fetchError = ref(null);
const isFetchingPrompts = ref(true);

onMounted(async () => {
  try {
    const supabase = useSupabaseClient<Database>();
    
    const { data: prompts, error: promptsError } = await supabase
      .from('prompts')
      .select(`
        id,
        prompt,
        created_at,
        ideas:ideas(count),
        user:users(full_name, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .limit(200);
    
    if (promptsError) throw promptsError;

    if (prompts && prompts.length > 0) {
      recentPrompts.value = prompts.map(p => ({
        id: p.id,
        prompt: p.prompt,
        created_at: p.created_at,
        ideas_count: Array.isArray(p.ideas) ? p.ideas.length : (p.ideas?.count || 0),
        author: p.user?.full_name || 'Anonymous',
        avatar: p.user?.avatar_url,
      }));
    }
  } catch (e) {
    console.error("Failed to fetch public prompts:", e);
    fetchError.value = e;
  } finally {
    isFetchingPrompts.value = false;
  }
});

// watchEffect(() => {
//   if (user.value && loginModal.value) {
//     loginModal.value.closeModal();
//   }
// });

const handleShowMoney = async (p) => {
  console.log("handleShowMoney called!");

  const heroAnim = heroComponent.value ? heroComponent.value.playHeroAnimation() : null;
  const communityAnim = communitySection.value ? communitySection.value.animateOut() : null;
  // const cardsAnim = cardsComponent.value ? cardsComponent.value.playCardsAnimation() : null;

  try {
    // Wait for animations to complete before showing skeleton (isLoading = true)
    await Promise.all([
      heroAnim ? heroAnim : Promise.resolve(),
      communityAnim ? communityAnim : Promise.resolve(),
      // cardsAnim ? cardsAnim : Promise.resolve(),
    ]);
    
    isLoading.value = true; // Show skeleton now

    let apiBody = { prompt: p };

    // Add timeout for fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiBody),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error("Fetch response not OK:", res);
      const errorData = await res.json().catch(() => ({ error: "Invalid JSON response" }));
      throw new Error(errorData.error || "Failed to fetch response from Gemini");
    }

    const data = await res.json();
    console.log("API Response:", data); // Debug log

    if (data.error) {
      throw new Error(data.error);
    }
    const newPromptId = data.promptId; 

    if (newPromptId) {
      console.log("Navigating to:", `/prompts/${newPromptId}`);
      try {
        await router.push(`/prompts/${newPromptId}`);
      } catch (navError) {
        console.error("Router push failed, falling back to window.location:", navError);
        window.location.href = `/prompts/${newPromptId}`;
      }
    } else {
      console.error("No promptId returned from API");
      isLoading.value = false;
    }

  } catch (e) {
    console.error("Error in handleShowMoney:", e);
    // If something fails, reset the loading state so the user isn't stuck
    isLoading.value = false;
    // Optionally show an error message to the user
    alert("An error occurred: " + e.message);
  }
};
</script>
```
