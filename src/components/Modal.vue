<script setup lang="ts">
interface ModalProps {
    isOpen: boolean
    title: string
    subTitle: string
}

defineProps<ModalProps>()
const baseModalEmits = defineEmits<{
    (e: 'close'): void
}>()
</script>

<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="baseModalEmits('close')" class="relative z-10">
        <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
        >
            <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
            <div
            class="flex min-h-full items-center justify-center p-4 text-center"
            >
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
            >
                <DialogPanel
                class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                >
                <DialogTitle
                    as="h3"
                    class="text-lg font-medium leading-6 text-gray-900"
                >
                    {{ title }}
                </DialogTitle>
                <div class="mt-2">
                    <p class="text-sm text-gray-500">
                    {{ subTitle }}
                    </p>
                </div>

                <div class="mt-6">
                    <slot/>
                </div>
                </DialogPanel>
            </TransitionChild>
            </div>
        </div>
        </Dialog>
    </TransitionRoot>
</template>

<style scoped>

</style>