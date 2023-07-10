<script setup lang="ts">
import { useAxiosInstance } from '~/composables/useAxiosInstance';
import type { FullElection } from '~/types/election';
import { useTimeAgo, useNow } from '@vueuse/core';

const api = useAxiosInstance()
const isFetching = ref(false)
const elections = ref<FullElection[]>([])

const fetchElections = async() => {
    await api.value.get('/election').then((res) => {
        elections.value = res.data.data
    }).catch((err) => {
        console.error(err)
    })
}

onMounted(async () => {
    isFetching.value = true
    await fetchElections()
    isFetching.value = false
})
</script>

<template>
    <section class="pt-6 h-full">
        <div class="max-w-screen-xl px-5 lg:px-0 mx-auto h-full">
            <Loader v-if="isFetching" />
            <div v-else class="border border-[#EAECF0] rounded-lg shadow-none lg:shadow-md">
                <div class="flex w-full items-center justify-between px-6 py-4 border-b border-b-[#EAECF0]">
                    <h1 class="font-medium text-lg text-gray-900">Elections</h1>
                    <Button label="Create election" rounded size="small" />
                </div>
                <div class="lg:w-full lg:left-auto lg:relative lg:right-auto lg:overflow-x-hidden left-0 right-0 overflow-x-scroll">
                    <table class="table-auto w-full">
                        <thead>
                            <tr class="text-gray-500 text-left text-xs">
                                <th class="px-6 py-4 font-normal">Title</th>
                                <th class="px-6 py-4 font-normal">Type</th>
                                <th class="px-6 py-4 font-normal">Eligibility</th>
                                <th class="px-6 py-4 font-normal">Posts</th>
                                <th class="px-6 py-4 font-normal">Starts</th>
                                <th class="px-6 py-4 font-normal">Ends</th>
                                <th class="px-6 py-4 font-normal"/>
                            </tr>
                        </thead>
                        <tbody class="border-y">
                            <tr v-for="election in elections" :key="election._id" class="even:bg-white odd:bg-gray-50 text-sm">
                                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{{ election.title }}</td>
                                <td class="px-6 py-4 text-gray-600">{{ election.election_type }}</td>
                                <td class="px-6 py-4 text-gray-600">{{ election.department_eligibility ?? '-' }}</td>
                                <td class="px-6 py-4 text-gray-600">{{ election.posts.length }} {{ election.posts.length == 1 ? 'post' : 'posts' }}</td>
                                <td class="px-6 py-4 text-gray-600 capitalize">{{ useTimeAgo(election.start).value }}</td>
                                <td class="px-6 py-4 text-gray-600 capitalize">{{ useTimeAgo(election.end).value }}</td>
                                <td class="px-6 py-4 text-gray-600"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="flex items-center justify-between px-6 pb-4 pt-2.5">
                    <div class="flex items-center space-x-3">
                        <Button label="Previous" rounded inverted />
                        <Button label="Next" rounded inverted />
                    </div>
                    <span class="text-gray-700 font-medium text-sm">Page 1 of 10</span>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>

</style>

<route lang="yaml">
meta:
  layout: admin
</route>