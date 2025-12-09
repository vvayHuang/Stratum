<template>
    <div
        class="fixed inset-0 z-50 flex items-start justify-center bg-light-surface-container-high bg-opacity-95 backdrop-blur-sm">
        <div
            class="w-full max-w-2xl mt-4 mx-4 md:mt-20 overflow-hidden rounded-3xl bg-light-surface-container-high shadow-xl border border-light-outline-variant">
            <!-- Header / Search Bar -->
            <div class="flex items-center gap-2 p-4 border-b border-light-outline-variant">
                <button @click="$emit('close')"
                    class="p-2 rounded-full hover:bg-light-on-surface hover:bg-opacity-10 transition-colors text-light-on-surface">
                    <MaterialIcon name="arrow_back" class="text-2xl" />
                </button>

                <input ref="searchInput" v-model="searchQuery" type="text" placeholder="Input text"
                    class="flex-grow bg-transparent text-xl text-light-on-surface placeholder-light-on-surface-variant focus:outline-none"
                    @keydown.esc="$emit('close')" />

                <button v-if="searchQuery" @click="searchQuery = ''"
                    class="p-2 rounded-full hover:bg-light-on-surface hover:bg-opacity-10 transition-colors text-light-on-surface">
                    <MaterialIcon name="close" class="text-2xl" />
                </button>
            </div>

            <!-- Body / List Items -->
            <div v-if="mockItems.length > 0" class="p-0">
                <div v-for="(item, index) in mockItems" :key="index"
                    class="flex items-center gap-4 p-4 hover:bg-light-on-surface hover:bg-opacity-5 cursor-pointer border-b border-light-outline-variant last:border-b-0">
                    <div
                        class="flex-shrink-0 w-10 h-10 rounded-full bg-light-tertiary-container flex items-center justify-center text-light-on-tertiary-container font-medium">
                        {{ item.title.charAt(0) }}
                    </div>
                    <div class="flex-col">
                        <div class="text-l font-medium text-light-on-surface">{{ item.title }}</div>
                        <div class="text-m text-light-on-surface-variant">{{ item.description }}</div>
                    </div>
                </div>
            </div>
            <div v-else class="p-8 text-center text-light-on-surface-variant">
                Start typing to search...
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['close']);
const searchQuery = ref('');
const searchInput = ref(null);

// Mock Data for display purposes as shown in the design
const mockItems = ref([
    { title: 'List item', description: 'Supporting line text lorem ipsum dolor si...' },
    { title: 'List item', description: 'Supporting line text lorem ipsum dolor si...' },
    { title: 'List item', description: 'Supporting line text lorem ipsum dolor si...' },
]);

onMounted(() => {
    if (searchInput.value) {
        searchInput.value.focus();
    }
});
</script>
