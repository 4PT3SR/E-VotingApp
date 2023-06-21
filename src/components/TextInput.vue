<script setup lang="ts">
interface InputProps {
    modelValue: string | number
    error?: string
    label: string
}

defineProps<InputProps>()

const baseInputEmits = defineEmits<{
    (e: 'update:modelValue', value: string | number): void
}>()

const handleInputChange = (event: Event) => (event.target as HTMLInputElement).value
</script>

<template>
    <div class="border-none p-0 relative grid gap-1">
        <label class="e-label">{{ label }}</label>
        <input v-bind="$attrs" :value="modelValue" @change="baseInputEmits('update:modelValue', handleInputChange($event))" class="e-input" />
    </div>
</template>

<style scoped>
@import url("~/form.css");
.e-input {
    @apply w-full border-gray-300;
}

.e-label {
    @apply text-sm text-gray-700 font-medium;
}
</style>