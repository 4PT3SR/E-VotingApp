<script setup lang="ts">
import { useAxiosInstance } from '~/composables/useAxiosInstance';
import useNotifications from '~/composables/useToast';
const { createNotification } = useNotifications();

provide("create-notification", createNotification);

const api = useAxiosInstance()
const route = useRoute()
const isFetching = ref(false)

onMounted(() => {
    isFetching.value = true
    api.value.get(`/election/${route.params.election}/posts/${route.params.post}/result`).then((res) => {
        console.log(res)
        // election.value = res.data.data
    }).catch((err) => {
        createNotification({
            type: 'error',
            message: err.response.data.message
        });
    }).finally(() => isFetching.value = false)
});

</script>
<template>
    <div>
Result
    </div>
</template>
<style scoped>

</style>