<template>
    <div class="min-h-screen bg-light-surface text-light-on-surface flex flex-col">
        <header class="sticky top-0 z-50 bg-light-surface/80 backdrop-blur-md">
            <div class="mx-auto max-w-[1440px] lg:px-6 flex items-center justify-between">
                <Navbar />
            </div>
        </header>

        <main class="flex-grow mx-auto max-w-[1440px] w-full px-4 md:px-12 py-20">
            <h1 class="text-4xl lg:text-5xl font-brand text-light-on-surface mb-12">From the Community</h1>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <CommunityCard v-for="item in prompts" :key="item.id" :item="item" @click="handleCardClick(item)" />

                <!-- Skeletons for loading state -->
                <template v-if="isLoading">
                    <div v-for="n in 4" :key="'skeleton-' + n"
                        class="relative p-4 rounded-lg flex flex-col justify-between h-[229px] border border-light-outline overflow-hidden bg-light-surface-container">
                        <div class="relative z-10 space-y-3">
                            <div class="skeleton-shimmer h-6 w-full rounded"></div>
                            <div class="skeleton-shimmer h-6 w-4/5 rounded"></div>
                        </div>
                        <div class="relative z-10 flex items-center gap-3 mt-auto">
                            <div class="skeleton-shimmer w-8 h-8 rounded-full"></div>
                            <div class="skeleton-shimmer h-4 w-20 rounded"></div>
                        </div>
                    </div>
                </template>
            </div>

            <!-- Sentinel for infinite scroll -->
            <div ref="sentinel" class="h-10 w-full flex justify-center items-center">
                <!-- <span v-if="isLoading" class="text-light-on-surface-variant">Loading more...</span> -->
            </div>

        </main>

        <Footer />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useSupabaseClient } from '#imports';
import { useRouter } from 'vue-router';
import Navbar from '~/components/Navbar.vue';
import Footer from '~/components/Footer.vue';
import CommunityCard from '~/components/CommunityCard.vue';
import type { Database } from '~/types/database.types';

definePageMeta({
    layout: false
});

const supabase = useSupabaseClient<Database>();
const router = useRouter();

const prompts = ref([]);
const isLoading = ref(false);
const hasMore = ref(true);
const sentinel = ref(null);
const isSentinelVisible = ref(false);
let observer = null;

const PAGE_SIZE = 20;

const fetchPrompts = async () => {
    if (isLoading.value || !hasMore.value) return;

    isLoading.value = true;
    const from = prompts.value.length;
    const to = from + PAGE_SIZE - 1;

    try {
        const { data, error } = await supabase
            .from('prompts')
            .select(`
        id,
        prompt,
        created_at,
        ideas:ideas(count),
        user:users(full_name, avatar_url)
      `)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        if (data.length < PAGE_SIZE) {
            hasMore.value = false;
        }

        const formattedPrompts = data.map(p => ({
            id: p.id,
            prompt: p.prompt,
            created_at: p.created_at,
            ideas_count: Array.isArray(p.ideas) ? p.ideas.length : (p.ideas?.count || 0),
            author: p.user?.full_name || 'Anonymous',
            avatar: p.user?.avatar_url,
        }));

        prompts.value.push(...formattedPrompts);
    } catch (e) {
        console.error("Error fetching prompts:", e);
    } finally {
        isLoading.value = false;
    }
};

const handleCardClick = (item) => {
    router.push(`/prompts/${item.id}`);
};

watch([isSentinelVisible, isLoading], ([visible, loading]) => {
    if (visible && !loading && hasMore.value) {
        fetchPrompts();
    }
});

onMounted(() => {
    // Initial fetch relies on watch or manual call?
    // Let's call it manually to be safe, but watch might also trigger if sentinel starts visible.
    // However, sentinel might not be mounted/observed instantly.
    fetchPrompts();

    // Setup observer
    observer = new IntersectionObserver((entries) => {
        isSentinelVisible.value = entries[0].isIntersecting;
    }, { rootMargin: '200px' });

    if (sentinel.value) {
        observer.observe(sentinel.value);
    }
});

onUnmounted(() => {
    if (observer) observer.disconnect();
});
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
