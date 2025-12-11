<template>
    <button :class="[
        'flex items-center justify-center gap-3 rounded-full  transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses,
        customClass
    ]" :disabled="disabled" @click="$emit('click')">
        <MaterialIcon v-if="icon && !iconRight" :name="icon" :size="iconSize" />
        <slot />
        <MaterialIcon v-if="icon && iconRight" :name="icon" :size="iconSize" />
    </button>
</template>

<script setup>
import { computed } from 'vue';
import MaterialIcon from './MaterialIcon.vue';

const props = defineProps({
    variant: {
        type: String,
        default: 'primary',
        validator: (value) => ['primary', 'secondary', 'tertiary', 'secondary-container', 'error', 'text'].includes(value),
    },
    icon: {
        type: String,
        default: null,
    },
    iconRight: {
        type: Boolean,
        default: false,
    },
    iconSize: {
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

const variantClasses = computed(() => {
    switch (props.variant) {
        case 'primary':
            return 'bg-light-primary text-light-on-primary hover:opacity-90';
        case 'secondary':
            return 'bg-light-secondary text-light-on-secondary hover:opacity-90';
        case 'tertiary':
            return 'bg-light-tertiary text-light-on-tertiary hover:opacity-90';
        case 'secondary-container':
            return 'bg-light-secondary-container text-light-on-secondary-container hover:opacity-90';
        case 'error':
            return 'bg-light-error text-light-on-error hover:opacity-90';
        case 'text':
            return 'bg-transparent text-light-on-surface-variant hover:bg-light-surface-variant';
        default:
            return 'bg-light-primary text-light-on-primary';
    }
});
</script>
