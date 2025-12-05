<template>
    <button
        class="flex items-center justify-center rounded-full p-4 transition-colors hover:bg-light-surface-variant/8 active:bg-light-surface-variant/12 disabled:opacity-30 disabled:cursor-not-allowed border border-light-outline"
        :class="customClass" :disabled="disabled" @click="$emit('click')">
        <MaterialIcon :name="name" :size="size" />
    </button>
</template>

<script setup>
import MaterialIcon from './MaterialIcon.vue';

defineProps({
    name: {
        type: String,
        required: true,
    },
    size: {
        type: [Number, String],
        default: 24,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    customClass: {
        type: String,
        default: '',
    },
});

defineEmits(['click']);
</script>
