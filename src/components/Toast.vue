<script setup lang="ts">
import { computed, onMounted, provide, ref } from "vue"
import useNotifications from '~/composables/useToast'

const {
  createNotification,
} = useNotifications();

provide("create-notification", createNotification);

// Props for our component,
// these are the same as Notitfication interface.
const baseToastProps = defineProps({
  id: { type: String, required: true },
  type: {
    type: String,
    default: "success",
    required: true,
  },
  title: { type: String, default: null, required: false },
  message: {
    type: String,
    default: "Ooops! A message was not provided.",
    required: true,
  },
  autoClose: { type: Boolean, default: true, required: false },
  duration: { type: Number, default: 5, required: false },
  icon: { type: Boolean, default: false, required: false }
});

// Defining emits
// for closing a notification
const emit = defineEmits<{
  (e: "close"): void;
}>();

// some reactive values to manage the notification
const startedAt = ref<number>(0);
const delay = ref<number>(0);

// setting up the automatic
// dismissing of notificaton
// after the specified duration
onMounted(() => {
  if (baseToastProps.autoClose) {
    startedAt.value = Date.now();
    delay.value = baseToastProps.duration * 1000;
    setTimeout(close, delay.value);
  }
});

// a method to close the
// notification and emit the action
const close = () => {
  emit("close");
};

const classes = computed(() => ({
    "ks-toast": true,
    [`ks-toast--${baseToastProps.type}`]: true,
}))
</script>

<template>
    <div :class="classes">
        <span class="ks-toast--message">{{ message }}</span>
    </div>
</template>

<style scoped>
.ks-toast {
    @apply flex items-start gap-3 font-normal text-base rounded-[5px] border px-5 py-[18px] w-full md:w-fit
}

.ks-toast--success {
    @apply text-green-600 border-green-600 bg-green-50
}

.ks-toast--info {
    @apply text-yellow-600 border-yellow-600 bg-yellow-50
}

.ks-toast--error {
    @apply text-red-600 border-red-600 bg-red-50
}

.ks-toast--block {
    @apply w-full
}

.ks-toast--message {
    @apply flex-1
}
</style>

