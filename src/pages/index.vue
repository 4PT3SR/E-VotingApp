<script setup lang="ts">
import { useBaseFetch } from '~/composables/fetch';

const {
    get,
    data,
    error,
    onFetchResponse,
    onFetchError
} = useBaseFetch<string>('/election', { immediate: false }).json()

onFetchResponse(async () => {
  console.log(data.value)
})

onFetchError(async () => {
  console.log(error.value)
})

get().execute()
</script>

<template>
    <div class="grid grid-cols-2 h-full">
      
    </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>