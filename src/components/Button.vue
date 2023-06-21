<script setup lang="ts">
const buttonProps = defineProps<{ label: string; block?: boolean; loading?: boolean; }>()

const buttonClass = computed(() => ({
    'e-button': true,
    'e-button--block': buttonProps.block
}))
</script>

<template>
    <button type="button" :class="buttonClass" :disabled="loading">
        <svg v-if="loading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-else>{{ label }}</span>
    </button>
</template>

<style scoped>
@import url("~/style.css");
.e-button {
    @apply flex justify-center items-center w-fit bg-blue-600 rounded-lg py-2.5 px-4 text-base text-white disabled:cursor-not-allowed font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 ease-out
}

.e-button--block {
    @apply w-full;
}
</style>