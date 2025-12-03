<template>
  <div class="flex flex-col">
    <header>
      <div class="mx-auto max-w-[1440px] md:px-6 flex items-center justify-between">
        <Navbar />
      </div>
    </header>

    <main class="flex-grow flex flex-col pb-10 overflow-hidden">
      <div class="mx-auto max-w-[1440px] px-6 w-full py-10">
        <div class="mb-10">
          <h1 class="text-5xl font-bold mb-2 font-brand">My Ideas</h1>
        </div>


        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div v-for="i in 16" :key="i" class="bg-light-surface-container-low p-6 rounded-xl border border-light-outline flex flex-col justify-between h-[229px] relative">
            <div>
              <!-- Prompt text skeleton -->
              <div class="space-y-3 mb-4">
                <div class="h-8 w-full rounded skeleton-shimmer"></div>
                <div class="h-8 w-5/6 rounded skeleton-shimmer"></div>
                <div class="h-8 w-4/6 rounded skeleton-shimmer"></div>
              </div>
            </div>
            <div class="flex items-center gap-2 mt-4">
              <!-- Clock icon skeleton -->
              <div class="h-5 w-5 rounded-full skeleton-shimmer"></div>
              <!-- Date skeleton -->
              <div class="h-5 w-32 rounded skeleton-shimmer"></div>
            </div>
          </div>
        </div>
        <div v-else-if="error" class="text-center text-xl text-light-error">Error: {{ error }}</div>
        <div v-else-if="userPrompts.length === 0" class="text-center text-xl">You haven't generated any ideas yet.</div>
        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div
              v-for="prompt in displayedPrompts"
              :key="prompt.id"
              class="group relative bg-light-surface-container-low p-4 rounded-xl border border-light-outline flex flex-col justify-between h-[229px] transition-colors overflow-hidden"
            >
              <!-- Delete Button (Hover) -->
              <button 
                class="absolute top-4 right-4 w-8 h-8 rounded-full bg-light-on-surface/10 hover:bg-light-on-surface/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                @click.stop.prevent="deletePrompt(prompt.id)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-light-on-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <NuxtLink :to="`/prompts/${prompt.id}`" class="flex-grow flex flex-col justify-between">
                <div>
                  <h3 class="text-light-on-surface font-brand text-2xl leading-tight mb-4">“{{ prompt.prompt }}”</h3>
                </div>
                <div class="flex items-center gap-2 mt-4 text-light-on-surface-variant">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-m font-medium">
                    Edited {{ formatTimeAgo(prompt.created_at) }}
                  </span>
                </div>
              </NuxtLink>
            </div>
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
    <DeleteConfirmationModal ref="deleteModal" @confirm="confirmDelete" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useSupabaseUser, useSupabaseClient } from '#imports';
import Navbar from '~/components/Navbar.vue';
import LoginModal from '~/components/LoginModal.vue';
import DeleteConfirmationModal from '~/components/DeleteConfirmationModal.vue';

definePageMeta({
  middleware: ['auth'] // Protect this route
});

const user = useSupabaseUser();
const supabase = useSupabaseClient();

const userPrompts = ref([]);
const isLoading = ref(true);
const error = ref(null);
const displayLimit = ref(16);
const deleteModal = ref(null);
const promptToDeleteId = ref(null);

const displayedPrompts = computed(() => {
  return userPrompts.value.slice(0, displayLimit.value);
});

const showMore = () => {
  displayLimit.value += 16;
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

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

const deletePrompt = (id) => {
  promptToDeleteId.value = id;
  deleteModal.value.openModal();
};

const confirmDelete = async () => {
  if (!promptToDeleteId.value) return;

  try {
    const { error: deleteError } = await supabase
      .from('prompts')
      .delete()
      .eq('id', promptToDeleteId.value);

    if (deleteError) throw deleteError;

    // Remove from local state
    userPrompts.value = userPrompts.value.filter(p => p.id !== promptToDeleteId.value);
    
    // Reset state
    promptToDeleteId.value = null;
  } catch (e) {
    console.error('Error deleting prompt:', e);
    // Optionally show an error toast here
  }
};
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
