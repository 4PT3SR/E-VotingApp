<script setup lang="ts">

</script>

<template>
  <header class="border-b border-b-gray-300 shadow-sm">
    <nav class="py-3 container max-w-screen-2xl mx-auto">
      <ul class="flex items-center justify-center gap-3">
        <li><RouterLink to="/" class="hover:bg-blue-50 text-base px-2.5 py-1.5 rounded-lg select-none">Home</RouterLink></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.router-link-active {
  @apply text-blue-600;
}
</style>
