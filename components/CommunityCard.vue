<template>
    <div class="group relative p-4 rounded-lg flex flex-col justify-between h-[229px] hover:shadow-xl transition-all duration-300 cursor-pointer border border-light-outline overflow-hidden bg-light-surface-container"
        @click="$emit('click', item)">
        <!-- Hover Gradient Overlay -->
        <div
            class="absolute inset-0 bg-gradient-to-b from-transparent to-light-tertiary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0">
        </div>

        <!-- Quote Content -->
        <div class="relative z-10">
            <h3 class="text-2xl font-brand text-neutral-25 leading-1xl tracking-tight"
                style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; line-clamp: 3;">
                “{{ item.prompt }}”
            </h3>
        </div>

        <!-- Author Info -->
        <div class="relative z-10 flex items-center gap-3 mt-auto">
            <div
                class="w-8 h-8 rounded-full overflow-hidden border border-neutral-25/20 group-hover:border-white/20 shrink-0 transition-colors duration-300">
                <img :src="item.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id || 'default'}`"
                    alt="Author" class="w-full h-full object-cover" />
            </div>
            <div class="flex flex-col overflow-hidden">
                <span
                    class="text-s font-medium text-neutral-25 group-hover:text-white truncate transition-colors duration-300">
                    {{ item.author }}
                </span>
                <span
                    class="text-xs text-neutral-25/60 group-hover:text-white/60 truncate transition-colors duration-300">
                    {{ formattedTime }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

defineEmits(['click']);

const formattedTime = computed(() => {
    if (!props.item.created_at) return 'Edited recently';

    const date = new Date(props.item.created_at);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return 'Edited just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `Edited ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `Edited ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `Edited ${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `Edited ${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `Edited ${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
});
</script>
