<script setup lang="ts">
import { useAxiosInstance } from '~/composables/useAxiosInstance';
import { Post } from '~/types/election';
import useNotifications from '~/composables/useToast';
const { createNotification } = useNotifications();

provide("create-notification", createNotification);

const api = useAxiosInstance()
const route = useRoute()
const isFetching = ref(false)
const url = computed(() => {
    return `/election/posts/${route.params.post}`
})
const post = ref<Post & { election: string }>()

const voteUser = async(id: string) => {
    await api.value.post(`/election/${post.value?.election}/candidate/${id}/vote`).then((res) => {
        createNotification({
            type: 'success',
            message: res.data.status
        });
    }).catch((err) => {
        createNotification({
            type: 'error',
            message: err.response.data.message
        });
    })
}

onMounted(() => {
    isFetching.value = true
    api.value.get(url.value).then((res) => {
        post.value = res.data.data
    }).catch((err) => {
        console.error(err)
    }).finally(() => isFetching.value = false)
});
</script>

<template>
    <section class="pt-6 h-full">
        <div class="max-w-screen-xl px-4 lg:px-0 mx-auto h-full">
            <Loader v-if="isFetching" />
            <div v-else class="grid">
                <h1 class="text-center text-xl text-gray-900 font-semibold">{{ post?.title }}</h1>
                <div v-if="!post?.candidates.length" class="mt-5 w-full text-center text-gray-600 text-base">No posts available</div>
                <div v-else class="mt-5 grid divide-y divide-gray-300">
                    <div v-for="candidate in post.candidates" :key="candidate._id" class="flex items-center justify-between py-3 px-2 transition-color ease hover:bg-gray-50">
                        <div class="flex items-center gap-2">
                            <img v-if="candidate.image" :src="candidate?.image" class="w-10 h-10 rounded-full" />
                            <div v-else class="w-10 h-10 rounded-full bg-blue-50 text-blue-700 font-semibold text-base grid content-center justify-items-center">{{ candidate.fullname.split(' ')[0].charAt(0) }}{{ candidate.fullname.split(' ')[1].charAt(0) }}</div>
                            <span class="font-medium text-base text-gray-900 capitalize">{{ candidate.fullname }}</span>
                        </div>
                        <span class="font-medium text-base text-gray-900">{{ candidate.votes == 1 ? `${candidate.votes} vote` : `${candidate.votes} votes` }}</span>
                        <Button label="Vote" rounded @click="voteUser(candidate._id)" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>

</style>