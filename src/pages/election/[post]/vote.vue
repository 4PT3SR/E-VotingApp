<script setup lang="ts">
import { useAxiosInstance } from '~/composables/useAxiosInstance';
import { Post } from '~/types/election';

const api = useAxiosInstance()
const route = useRoute()
const router = useRouter()
const isFetching = ref(false)
const url = computed(() => {
    return `/election/posts/${route.params.post}`
})
const post = ref<Post>()

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
        <div class="max-w-screen-xl px-5 lg:px-0 mx-auto h-full">
            <Loader v-if="isFetching" />
            <div v-else class="grid">
                <h1 class="text-center text-xl text-gray-900 font-semibold">{{ post?.title }}</h1>
                <div v-if="!post?.candidates.length" class="mt-5 w-full text-center text-gray-600 text-base">No posts available</div>
                <div v-else class="mt-5 grid divide-y divide-gray-300">
                    <div v-for="candidate in post.candidates" :key="candidate._id" class="flex items-center justify-between py-3 px-2 transition-color ease hover:bg-gray-50">
                        <span class="font-medium text-base text-gray-900">{{ candidate.fullname }}</span>
                        <span class="font-medium text-base text-gray-900">{{ candidate.votes == 1 ? `${candidate.votes} vote` : `${candidate.votes} votes` }}</span>
                        <Button label="Vote" rounded @click="router.push(`/election/${candidate._id}/vote`)" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>

</style>