<template>
  <div class="flex flex-col">
    <header>
      <div class="mx-auto max-w-[1440px] md:px-6 flex items-center justify-between">
        <Navbar />
      </div>
    </header>

    <main class="flex-grow flex flex-col pb-10 overflow-hidden">
      <div class="mx-auto max-w-[1440px] px-12 w-full py-20">
        <div class="mb-10">
          <h1 class="text-5xl font-bold mb-2 font-brand">My Ideas</h1>
        </div>


        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          <div v-for="i in 16" :key="i"
            class="bg-light-surface-dim p-4 rounded-xl border border-light-outline flex flex-col justify-between h-[229px] relative">
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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
            <div v-for="prompt in displayedPrompts" :key="prompt.id"
              class="group relative bg-light-surface-container p-4 rounded-xl border border-light-outline overflow-hidden h-[229px] transition-all duration-300">
              <!-- Gradient Overlay -->
              <div
                class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FFDCC4] to-transparent pointer-events-none z-20">
                <div
                  class="absolute bottom-4 left-0 w-full px-4 flex items-center gap-2 text-light-on-surface-variant z-10">
                  <span class="material-symbols-outlined text-[20px]">
                    schedule
                  </span>
                  <span class="text-s font-medium tracking-wider">
                    Edited {{ formatTimeAgo(prompt.created_at) }}
                  </span>
                </div>
              </div>

              <!-- Delete Button (Hover) -->
              <IconButton @click.stop.prevent="deletePrompt(prompt.id)" name="close"
                custom-class="absolute top-4 right-4 rounded-full bg-light-surface-dim opacity-0 group-hover:opacity-100 z-20 cursor-pointer border-0 transition-colors">
              </IconButton>
              <NuxtLink :to="`/prompts/${prompt.id}`" class="block relative z-10 h-full">
                <div class="h-full flex flex-col justify-between">
                  <h3 class="text-light-on-surface font-brand text-2xl leading-tight mb-4 break-words">"{{
                    prompt.prompt }}"</h3>


                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Show More Button -->
          <div v-if="userPrompts.length > displayLimit" class="flex justify-center mt-8">
            <button @click="showMore"
              class="bg-light-primary text-light-on-primary font-bold px-8 py-3 rounded-md text-lg hover:opacity-90 transition-opacity">
              Show More
            </button>
          </div>
        </div>
      </div>
    </main>


    <DeleteConfirmationModal ref="deleteModal" @confirm="confirmDelete" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useSupabaseUser, useSupabaseClient } from '#imports';
import Navbar from '~/components/Navbar.vue';
import IconButton from '~/components/IconButton.vue';
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
  const userId = user.value?.id || user.value?.sub; // Get the correct user ID
  if (!user.value || !userId) { // Check for user.value or userId
    error.value = 'User not logged in or user ID not available.';
    isLoading.value = false;
    return;
  }

  try {
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
  } catch (e) {
    console.error('Error fetching user prompts:', e);
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
};



watch(user, (newUser) => {
  if (newUser && (newUser.id || newUser.sub)) { // Check for newUser.id or newUser.sub
    fetchUserPrompts();
  } else {
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
  background: #E3C0A7;
  /* secondary-80 from palette as base */
  background-image: linear-gradient(to right,
      #E3C0A7 0%,
      #FFDCC4 20%,
      /* secondary-90 highlight */
      #E3C0A7 40%,
      #E3C0A7 100%);
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
