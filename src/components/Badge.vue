<script setup lang="ts">
interface BadgeProps {
    type: string
    label: string
}

const badgeProps = defineProps<BadgeProps>()

const classes = computed(() => ({
    'badge': true,
    [`badge-${badgeProps.type}`]: true
}))
</script>

<template>
    <div :class="classes">
        {{ label }}
    </div>
</template>

<style scoped>
.badge {
    @apply text-xs font-medium px-2 py-0.5 rounded-2xl w-fit;
}
.badge-success {
    @apply bg-green-100 text-green-700;
}
.badge-default {
    @apply bg-gray-100 text-gray-700;
}
</style>