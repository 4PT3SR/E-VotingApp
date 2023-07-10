<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core';
import { useAxiosInstance } from '~/composables/useAxiosInstance';
import { Posts } from '~/types/election'

const api = useAxiosInstance()
const isFetching = ref(false)
const elections = ref<Posts[]>([])
const statuses = [
  { name: 'All', value: '/election'},
  { name: 'Active', value: '/election?status=active'},
  { name: 'Ended', value: '/election?status=inactive'},
  { name: 'Upcoming', value: '/election?status=upcoming'},
]
const url = ref<string>('')
const newUrl = computed(() => {
  return url.value
})

const setUrl = (link: string) => {
  url.value = link
}

onMounted(async () => {
  setUrl(statuses[0].value)
});

watch(newUrl, async() => {
  isFetching.value = true
  api.value.get(newUrl.value).then((res) => {
    elections.value = res.data.data
  }).catch((err) => {
    console.error(err)
  }).finally(() => isFetching.value = false )
})
</script>

<template>
  <section class="pt-6 h-full">
    <div class="max-w-screen-xl px-4 lg:px-0 mx-auto h-full">
      <div class="grid gap-4">
        <div class="flex items-center justify-center gap-3">
          <button v-for="status in statuses" :key="status.name" type="button" :class="`flex px-4 py-2 rounded-full text-sm hover:text-blue-600 ${url === status.value ? 'text-blue-600 bg-blue-50 border border-blue-500' : 'text-gray-600'}`" @click="setUrl(status.value)">{{ status.name }}</button>
        </div>
        <Loader v-if="isFetching" />
        <template v-else>
          <div v-if="!elections.length" class="text-gray-600 text-base text-center w-full">No elections found.</div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                <RouterLink :to="`/election/${election._id}`" class="rounded-full py-2 px-3 bg-white text-blue-600 flex justify-center items-center w-fit text-xs font-semibold">View election</RouterLink>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<route lang="yaml">
meta:
  layout: default
</route>