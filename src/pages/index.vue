<script setup lang="ts">
import { useBaseFetch } from '~/composables/fetch';
import { useTimeAgo } from '@vueuse/core';
import { Election } from '~/types/election'

const elections = ref<Election[]>([])

const {
    get,
    data,
    error,
    onFetchResponse,
    onFetchError
} = useBaseFetch<string>('/election', { immediate: false }).json()

onFetchResponse(async () => {
  elections.value = data.value.data
})

onFetchError(async () => {
  console.log(error.value)
})

get().execute()
</script>

<template>
  <section class="pt-6">
    <div class="max-w-screen-xl px-5 lg:px-0 mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="election in elections" :key="election._id" class="grid gap-4 p-6 rounded-2xl bg-blue-600">
          <div class="flex items-center justify-between">
            <span class="bg-blue-50 border border-blue-200 text-blue-700 rounded-full py-0.5 px-2.5 text-xs font-medium">{{ election.election_type }}</span>
            <span class="text-xs font-medium text-white">Ends: {{ useTimeAgo(election.end).value }}</span>
          </div>
          <div class="grid">
            <h1 class="text-white text-lg font-semibold">{{ election.title }}</h1>
            <p class="text-gray-50 text-sm line-clamp-2 text-ellipsis">{{ election.department_eligibility }}</p>
          </div>
          <div class="flex justify-end">
            <Button label="Vote now" size="small" rounded inverted />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<route lang="yaml">
meta:
  layout: default
</route>