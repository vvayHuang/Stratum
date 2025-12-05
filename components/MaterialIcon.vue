<template>
    <span class="material-symbols-outlined" :class="customClass"
        :style="{ fontSize: size + 'px', width: size + 'px', height: size + 'px', overflow: 'hidden' }">
        {{ name }}
    </span>
</template>

<script setup>
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    size: {
        type: [String, Number],
        default: 24,
    },
    customClass: {
        type: String,
        default: '',
    },
});
</script>
