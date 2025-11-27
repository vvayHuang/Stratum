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


        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="bg-light-surface-container p-5 rounded-lg border border-light-outline flex flex-col justify-between h-[229px]">
            <div>
              <!-- Prompt text skeleton -->
              <div class="space-y-2 mb-4">
                <div class="h-5 w-full rounded skeleton-shimmer"></div>
                <div class="h-5 w-3/4 rounded skeleton-shimmer"></div>
              </div>
            </div>
            <div class="flex justify-between items-end mt-4">
              <!-- Badge skeleton -->
              <div class="h-7 w-20 rounded-md skeleton-shimmer"></div>
              <!-- Date skeleton -->
              <div class="h-6 w-24 rounded skeleton-shimmer"></div>
            </div>
          </div>
        </div>
        <div v-else-if="error" class="text-center text-xl text-light-error">Error: {{ error }}</div>
        <div v-else-if="userPrompts.length === 0" class="text-center text-xl">You haven't generated any ideas yet.</div>
        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <NuxtLink
              v-for="prompt in displayedPrompts"
              :key="prompt.id"
              :to="`/prompts/${prompt.id}`"
              class="block bg-light-surface-container p-5 rounded-lg border border-light-outline hover:border-light-primary transition-colors cursor-pointer flex flex-col justify-between h-[229px]"
            >
              <div>
                <h3 class="text-light-on-surface-container font-brand text-xl leading-tight mb-4">"{{ prompt.prompt }}"</h3>
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
          
          <!-- Show More Button -->
          <div v-if="userPrompts.length > displayLimit" class="flex justify-center mt-8">
            <button
              @click="showMore"
              class="bg-light-primary text-light-on-primary font-bold px-8 py-3 rounded-md text-lg hover:opacity-90 transition-opacity"
            >
              Show More
            </button>
          </div>
        </div>
      </div>
    </main>

    <LoginModal ref="loginModal" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useSupabaseUser, useSupabaseClient } from '#imports';
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
const displayLimit = ref(8);

const displayedPrompts = computed(() => {
  return userPrompts.value.slice(0, displayLimit.value);
});

const showMore = () => {
  displayLimit.value += 8;
};

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

<style scoped>
.skeleton-shimmer {
  background: #E3C0A7; /* secondary-80 from palette as base */
  background-image: linear-gradient(
    to right,
    #E3C0A7 0%,
    #FFDCC4 20%, /* secondary-90 highlight */
    #E3C0A7 40%,
    #E3C0A7 100%
  );
  background-repeat: no-repeat;
  background-size: 200% 100%; 
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
