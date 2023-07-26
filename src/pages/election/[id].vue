<script setup lang="ts">
import { FullElection } from '~/types/election';
import { useTimeAgo, useNow, useDateFormat } from '@vueuse/core';
import { useAxiosInstance } from '~/composables/useAxiosInstance';

const api = useAxiosInstance()
const route = useRoute()
const router = useRouter()
const isFetching = ref(false)
const url = computed(() => {
    return `/election/${route.params.id}`
})
const election = ref<FullElection>()

onMounted(() => {
    isFetching.value = true
    api.value.get(url.value).then((res) => {
        election.value = res.data.data
    }).catch((err) => {
        console.error(err)
    }).finally(() => isFetching.value = false)
});

const currentDate = computed(() => {
    return useDateFormat(useNow(), 'YYYY-MM-DD (ddd)', { locales: 'en-US' })
})
</script>

<template>
    <section class="pt-6 h-full">
        <div class="max-w-screen-xl px-4 lg:px-0 mx-auto h-full">
            <Loader v-if="isFetching" />
            <div v-else class="grid">
                <h1 class="text-center text-xl text-gray-900 font-semibold">{{ election?.title }}</h1>
                <p class="text-base text-gray-800 font-medium">Election type: <span class="font-normal">{{ election?.election_type }}</span></p>
                <p class="text-base text-gray-800 font-medium">Department: <span class="font-normal">{{ election?.department_eligibility }}</span></p>
                <p v-if="currentDate.value < election?.start!" class="text-base text-gray-800 font-medium">Starts: <span class="font-normal">{{ useTimeAgo(election?.start!).value }}</span></p>
                <p v-if="currentDate.value < election?.end!" class="text-base text-gray-800 font-medium">Ends: <span class="font-normal">{{ useTimeAgo(election?.end!).value }}</span></p>
                <div v-if="!election?.posts.length" class="mt-5 w-full text-center text-gray-600 text-base">No posts available</div>
                <div v-else class="mt-5 grid divide-y divide-gray-300">
                    <div v-for="post in election.posts" :key="post._id" class="flex items-center justify-between py-3 px-2 transition-color ease hover:bg-gray-50">
                        <span class="font-medium text-base text-gray-900">{{ post.title }}</span>
                        <Button v-if="currentDate.value < election?.end!" label="View result" rounded @click="router.push(`/election/${election._id}/${post._id}/result`)" />
                        <Button v-else label="Vote now" rounded @click="router.push(`/election/${post._id}/result`)" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>

</style>