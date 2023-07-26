<script setup lang="ts">
import { useAxiosInstance } from '~/composables/useAxiosInstance';
import useNotifications from '~/composables/useToast';
const { createNotification } = useNotifications();

provide("create-notification", createNotification);

const api = useAxiosInstance()
const route = useRoute()
const isFetching = ref(false)
const result = ref<any[]>([])

onMounted(() => {
    isFetching.value = true
    api.value.get(`/election/${route.params.election}/posts/${route.params.post}/result`).then((res) => {
        result.value = res.data.data[`${route.params.election}`]
    }).catch((err) => {
        createNotification({
            type: 'error',
            message: err.response.data.message
        });
    }).finally(() => isFetching.value = false)
});

</script>

<template>
    <section class="pt-6 h-full">
        <div class="max-w-screen-xl px-4 lg:px-0 mx-auto h-full">
            <Loader v-if="isFetching" />
            <div v-else class="border border-[#EAECF0] rounded-lg shadow-none lg:shadow-md">
                <div class="flex w-full items-center justify-between px-6 py-4 border-b border-b-[#EAECF0]">
                    <h1 class="font-medium text-lg text-gray-900">Result</h1>
                </div>
                <div class="lg:w-full lg:left-auto lg:relative lg:right-auto lg:overflow-x-hidden left-0 right-0 overflow-x-scroll">
                    <table v-if="result.length" class="table-auto w-full">
                        <thead>
                            <tr class="text-gray-500 text-left text-xs">
                                <th class="px-6 py-4 font-normal">Fullname</th>
                                <th class="px-6 py-4 font-normal">Post</th>
                                <th class="px-6 py-4 font-normal">Votes</th>
                            </tr>
                        </thead>
                        <tbody class="border-y">
                            <tr v-for="(candidate, n) in result" :key="n" class="even:bg-white odd:bg-gray-50 text-sm">
                                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                                  <div class="flex items-center gap-2">
                                      <img v-if="candidate?.image" :src="candidate?.image" class="w-10 h-10 rounded-full" />
                                      <div v-else class="w-10 h-10 rounded-full bg-blue-50 text-blue-700 font-semibold text-base grid content-center justify-items-center">{{ candidate.candidateName.split(' ')[0].charAt(0) }}{{ candidate.candidateName.split(' ')[1].charAt(0) }}</div>
                                      <span class="font-medium text-base text-gray-900 capitalize">{{ candidate.candidateName }}</span>
                                  </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                                    <span class="font-normal text-base text-gray-600 capitalize">{{ candidate.electionType }}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                                    <span class="font-normal text-base text-gray-600 capitalize">{{ candidate.voteCount }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-else class="w-full flex items-center justify-center border-b py-5">No result.</div>
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