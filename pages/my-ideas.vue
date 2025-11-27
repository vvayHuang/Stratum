<template>
  <div class="min-h-screen bg-light-surface text-light-on-surface flex flex-col">
    <header class="py-6">
      <div class="mx-auto max-w-[1440px] px-6 flex items-center justify-between">
        <Navbar />
      </div>
    </header>

    <main class="flex-grow flex flex-col pb-10 overflow-hidden">
      <div class="mx-auto max-w-[1440px] px-6 w-full py-10">
        <div class="mb-10">
          <h1 class="text-5xl font-bold mb-2 font-brand">My Ideas</h1>
        </div>

        <div v-if="isLoading" class="text-center text-xl">Loading your ideas...</div>
        <div v-else-if="error" class="text-center text-xl text-light-error">Error: {{ error }}</div>
        <div v-else-if="userPrompts.length === 0" class="text-center text-xl">You haven't generated any ideas yet.</div>
        <div v-else ref="cardContainerRef" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="prompt in userPrompts"
            :key="prompt.id"
            :to="`/prompts/${prompt.id}`"
            class="block bg-light-surface-container p-5 rounded-lg border border-light-outline hover:border-light-primary transition-colors cursor-pointer flex flex-col justify-between h-[229px]"
          >
            <div>
              <h3 class="text-light-on-surface-container font-brand text-xl leading-tight mb-4">“{{ prompt.prompt }}”</h3>
            </div>
            <div class="flex justify-between items-end mt-4">
              <span class="bg-light-primary-container text-light-on-primary-container text-sm font-bold px-3 py-1 rounded-md uppercase tracking-wide">
                {{ prompt.ideas ? prompt.ideas.length : 0 }} Ideas
              </span>
              <span class="text-lg font-bold text-light-on-surface-container opacity-80">
                {{ new Date(prompt.created_at).toLocaleDateString('en-CA').replace(/-/g, '/') }}
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </main>

    <LoginModal ref="loginModal" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useSupabaseUser, useSupabaseClient } from '#imports';
import gsap from 'gsap';
import Navbar from '~/components/Navbar.vue';
import LoginModal from '~/components/LoginModal.vue'; // Assuming LoginModal is still needed for some reason, though not directly used here.

definePageMeta({
  middleware: ['auth'] // Protect this route
});

const user = useSupabaseUser();
const supabase = useSupabaseClient();

const userPrompts = ref([]);
const isLoading = ref(true);
const error = ref(null);
const cardContainerRef = ref(null); // Ref for the grid container

const fetchUserPrompts = async () => {
  console.log('fetchUserPrompts called. user.value:', user.value);
  const userId = user.value?.id || user.value?.sub; // Get the correct user ID
  if (!user.value || !userId) { // Check for user.value or userId
    error.value = 'User not logged in or user ID not available.';
    isLoading.value = false;
    console.log('fetchUserPrompts: User not available, isLoading set to false.');
    return;
  }

  try {
    console.log('fetchUserPrompts: Fetching prompts for user ID:', userId);
    const { data, error: fetchError } = await supabase
      .from('prompts')
      .select(`
        id,
        prompt,
        created_at,
        ideas (
          title,
          description
        )
      `)
      .eq('user_id', userId) // Use the correct userId
      .order('created_at', { ascending: false });

    if (fetchError) {
      throw fetchError;
    }
    userPrompts.value = data;
    console.log('fetchUserPrompts: Prompts fetched, count:', userPrompts.value.length);
  } catch (e) {
    console.error('Error fetching user prompts:', e);
    error.value = e.message;
  } finally {
    isLoading.value = false;
    console.log('fetchUserPrompts: Finished, isLoading set to false.');
  }
};

watch(userPrompts, (newPrompts) => {
  if (newPrompts.length > 0) {
    nextTick(() => {
      if (cardContainerRef.value) {
        gsap.fromTo(
          cardContainerRef.value.children,
          { opacity: 0, y: 50 }, // From these properties
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' } // To these properties
        );
      }
    });
  }
});

watch(user, (newUser) => {
  console.log('User watch triggered. newUser:', newUser);
  if (newUser && (newUser.id || newUser.sub)) { // Check for newUser.id or newUser.sub
    fetchUserPrompts();
  } else {
    console.log('User watch: newUser not available or no ID.');
    isLoading.value = false; // Ensure isLoading is false if user is not logged in
  }
}, { immediate: true }); // immediate: true to run once on component setup if user is already available
</script>
