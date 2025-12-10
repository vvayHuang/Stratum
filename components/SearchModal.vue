<template>
    <Teleport to="body">
        <div @click="$emit('close')"
            class="fixed inset-0 z-50 flex items-start justify-center md:items-center bg-light-inverse-surface bg-opacity-95 backdrop-blur-sm">
            <div @click.stop
                class="w-full max-w-2xl mt-4 mx-4 md:mt-0 overflow-hidden rounded-3xl bg-light-surface-container-high shadow-xl border border-light-outline-variant">
                <!-- Header / Search Bar -->
                <div class="flex items-center gap-2 p-4 border-b border-light-outline-variant">
                    <button @click="$emit('close')"
                        class="p-2 rounded-full hover:bg-light-on-surface hover:bg-opacity-10 transition-colors text-light-on-surface">
                        <MaterialIcon name="arrow_back" class="text-2xl" />
                    </button>

                    <input ref="searchInput" v-model="searchQuery" type="text" placeholder="Search prompts..."
                        class="flex-grow bg-transparent text-xl text-light-on-surface placeholder-light-on-surface-variant focus:outline-none"
                        @input="handleInput" @keydown.esc="$emit('close')" />

                    <button v-if="searchQuery" @click="clearSearch"
                        class="p-2 rounded-full hover:bg-light-on-surface hover:bg-opacity-10 transition-colors text-light-on-surface">
                        <MaterialIcon name="close" class="text-2xl" />
                    </button>
                </div>

                <!-- Body / List Items -->
                <div v-if="results.length > 0" class="p-0">
                    <div v-for="(item, index) in results" :key="item.id || index" @click="handleResultClick(item)"
                        class="flex items-center gap-4 p-4 hover:bg-light-on-surface hover:bg-opacity-5 cursor-pointer border-b border-light-outline-variant last:border-b-0">
                        <div
                            class="flex-shrink-0 w-10 h-10 rounded-full bg-light-tertiary-container flex items-center justify-center text-light-on-tertiary-container font-medium overflow-hidden">
                            <img v-if="item.user?.avatar_url" :src="item.user.avatar_url" :alt="item.user.full_name"
                                class="w-full h-full object-cover" />
                            <MaterialIcon v-else name="person" class="text-xl" />
                        </div>
                        <div class="flex-col">
                            <div class="text-l font-medium text-light-on-surface line-clamp-1">{{ item.prompt }}</div>
                            <div class="text-m text-light-on-surface-variant">{{ item.user?.full_name || 'Anonymous' }}
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="searchQuery && !loading" class="p-8 text-center text-light-on-surface-variant">
                    No results found.
                </div>
                <div v-else class="p-8 text-center text-light-on-surface-variant">
                    Start typing to search...
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSupabaseClient, useRouter } from '#imports';

const emit = defineEmits(['close']);
const searchQuery = ref('');
const searchInput = ref(null);
const client = useSupabaseClient();
const results = ref([]);
const loading = ref(false);
let debounceTimeout = null;

const handleInput = () => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    loading.value = true;
    debounceTimeout = setTimeout(performSearch, 500);
};

const clearSearch = () => {
    searchQuery.value = '';
    results.value = [];
    if (searchInput.value) searchInput.value.focus();
};

const performSearch = async () => {
    if (!searchQuery.value.trim()) {
        results.value = [];
        loading.value = false;
        return;
    }

    try {
        const { data, error } = await client
            .from('prompts')
            .select(`
        id,
        prompt,
        user:users(full_name, avatar_url)
      `)
            .ilike('prompt', `%${searchQuery.value}%`)
            .limit(5); // Limit results for performance

        if (error) {
            console.error('Search error:', error);
            results.value = [];
        } else {
            // Map the data to a more usable format if needed, or use directly
            results.value = data || [];
        }
    } catch (e) {
        console.error('Search exception:', e);
    } finally {
        loading.value = false;
    }
};

const router = useRouter();

const handleResultClick = (item) => {
    emit('close');
    router.push(`/prompts/${item.id}`);
};

onMounted(() => {
    if (searchInput.value) {
        searchInput.value.focus();
    }
});
</script>
