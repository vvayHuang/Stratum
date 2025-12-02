<template>
  <div class="min-h-screen bg-light-surface text-light-on-surface flex flex-col">
    <header>
      <div class="mx-auto max-w-[1440px] px-6 flex items-center justify-between">
        <Navbar @open-login-modal="loginModal.openModal()" />
      </div>
    </header>

    <main class="flex-grow flex flex-col pb-10 overflow-hidden">
      <div class="flex-grow flex justify-center">
        <div class="my-10 w-full">
          <PromptLayout :prompt="prompt" :ideas="ideas" :isLoading="isLoading" :error="error" @reset="handleReset" @update:idea="handleUpdateIdea" />
        </div>
      </div>
    </main>

    <LoginModal ref="loginModal" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSupabaseClient } from '#imports';
import { navigateTo } from '#app'; // Add this import
import Navbar from '~/components/Navbar.vue';
import PromptLayout from '~/components/PromptLayout.vue';
import LoginModal from '~/components/LoginModal.vue';

definePageMeta({ auth: false });

const route = useRoute();
const supabase = useSupabaseClient();
const promptId = route.params.id;

const prompt = ref('');
const ideas = ref([]);
const isLoading = ref(true);
const error = ref(null);
const loginModal = ref(null);

const fetchPromptAndIdeas = async () => {
  try {
    // Fetch the prompt string
    const { data: promptData, error: promptError } = await supabase
      .from('prompts')
      .select('prompt')
      .eq('id', promptId)
      .single();

    if (promptError || !promptData) {
      throw new Error('Prompt not found.');
    }
    prompt.value = promptData.prompt;

    // Fetch ideas associated with the prompt_id, including reports and steps
    const { data: fetchedIdeas, error: ideasError } = await supabase
      .from('ideas')
      .select(`
        *,
        reports (
          *,
          steps (*)
        )
      `)
      .eq('prompt_id', promptId);

    if (ideasError) {
      throw new Error('Failed to fetch ideas.');
    }
    ideas.value = fetchedIdeas;

  } catch (e) {
    console.error('Error fetching prompt and ideas:', e);
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
};

const handleUpdateIdea = (updatedIdea) => {
  const index = ideas.value.findIndex(idea => idea.id === updatedIdea.id);
  if (index !== -1) {
    ideas.value[index] = updatedIdea;
  }
};

const handleReset = () => {
  // For a dynamic route, resetting means navigating back to home or reloading
  // For now, let's navigate to the home page.
  navigateTo('/');
};

onMounted(() => {
  if (promptId) {
    fetchPromptAndIdeas();
  } else {
    error.value = 'Invalid prompt ID.';
    isLoading.value = false;
  }
});
</script>
