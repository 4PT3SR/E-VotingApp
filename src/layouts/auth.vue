<script setup lang="ts">
import { useToasts } from '~/store/toasts'
import useNotifications from "~/composables/useToast"

const {
  createNotification,
  removeNotifications,
  stopBodyOverflow,
  allowBodyOverflow,
} = useNotifications();

provide("create-notification", createNotification);
const store = useToasts()

</script>

<template>
    <RouterView />
    <transition-group
      name="toast-notification"
      tag="div"
      class="toast-notifications"
      @before-enter="stopBodyOverflow"
      @after-enter="allowBodyOverflow"
      @before-leave="stopBodyOverflow"
      @after-leave="allowBodyOverflow"
    >
      <Toast
        v-for="item in store.notifications"
        :key="item.id"
        :id="item.id"
        :type="item.type"
        :title="item.title"
        :message="item.message"
        :auto-close="item.autoClose"
        :duration="item.duration"
        :icon="item.icon"
        @close="
          () => {
            removeNotifications(item.id);
          }
        "
      ></Toast>
    </transition-group>
</template>

<style scoped>

</style>