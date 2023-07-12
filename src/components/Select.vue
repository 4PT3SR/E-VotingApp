<script setup lang="ts">
defineProps<{
    modelValue: string
    options: string[]
    label: string
    error?: string
}>()

const baseSelectEmits = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const handleInputChange = (event: Event) => 
      (event.target as HTMLSelectElement).value

const classes = computed(() => ({
    "ks-select": true,
}))
</script>

<template>
    <div class="ks-select--outer">
        <label v-if="label" class="ks-select--label">{{ label }}</label>
        <div class="ks-select--container">
            <select v-bind="$attrs" @change="baseSelectEmits('update:modelValue', handleInputChange($event))" :value="modelValue" :class="classes">
                <option v-for="option in options" :key="option" :value="option" :selected="option === modelValue">{{ option }}</option>
            </select>
        </div>
        <p v-if="error" class="ks-select--error">
            {{ error }}
        </p>
    </div>
</template>

<style scoped>
.ks-select {
    @apply w-full bg-transparent border-gray-300 focus:border-blue-600 focus:ring-blue-200 focus:ring-2 rounded-lg capitalize disabled:bg-gray-100 disabled:cursor-not-allowed
}

.ks-select--outer {
    @apply p-0 border-none shadow-none text-left outline-none grid gap-[5px]
}

.ks-select--label {
    @apply text-sm text-gray-700 font-medium
}

.ks-select--error {
    @apply pt-1 font-medium text-sm text-red-600
}

.ks-select--container {
    @apply relative block
}
</style>