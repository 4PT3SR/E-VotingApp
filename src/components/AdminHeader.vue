<script setup lang="ts">
import { userStore } from '~/store/user';

const route = useRoute()
const router = useRouter()
const user = userStore()
const goBack = () => {
  router.go(-1)
}

const logout = () => {
  user.$reset()
  router.push('/admin/auth/login')
}
</script>

<template>
  <header class="border-b border-b-gray-300 shadow-sm">
    <nav class="py-3 px-4 lg:px-0 container max-w-screen-xl mx-auto">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <button v-if="route.fullPath != '/admin'" type="button" class="text-sm" @click="goBack()">Back</button>
        </div>
        <ul class="flex flex-1 items-center justify-center gap-3">
          <li><RouterLink to="/admin" class="hover:bg-gray-50 text-base text-gray-700 font-semibold px-3 py-2 rounded-lg select-none">Home</RouterLink></li>
          <li><RouterLink to="/admin/elections" class="hover:bg-gray-50 text-base text-gray-700 font-semibold px-3 py-2 rounded-lg select-none">Elections</RouterLink></li>
        </ul>
        <div class="flex flex-1 justify-end">
          <button type="button" class="text-sm" @click="logout()">Logout</button>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.router-link-active {
  @apply hover:bg-blue-50 text-blue-600;
}
</style>
