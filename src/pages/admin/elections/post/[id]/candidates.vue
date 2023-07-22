<script setup lang="ts">
import * as yup from 'yup';
import { useAxiosInstance } from '~/composables/useAxiosInstance';
import useNotifications from '~/composables/useToast';
import { Post } from '~/types/election'
const { createNotification } = useNotifications();

provide("create-notification", createNotification);

const api = useAxiosInstance()
const route = useRoute()
const post = ref<Post>()
const isOpen = ref(false)
const isFetching = ref(false)

const fetchPosts = async() => {
    isFetching.value = true
    await api.value.get(`/election/posts/${route.params.id}`).then((res) => {
        post.value = res.data.data.posts
    }).catch((err) => {
        console.error(err)
    })
    isFetching.value = false
}

const { handleSubmit, resetForm, isSubmitting, errors } = useForm({
  validationSchema: yup.object({
    name: yup.string().required('Please enter the fullname'),
  }),
  initialValues: {
    name: '',
  },
})

const { value: name } = useField<string>('name')

const submitForm = handleSubmit(async (values: any) => {
    await api.value.post(`/election/${route.params.id}/candidate`, values).then((res) => {
        createNotification({
            type: 'success',
            message: res.data.status
        });
        resetForm()
        fetchPosts()
        closeModal()
    }).catch((err) => {
        createNotification({
            type: 'error',
            message: err.response.data.message
        });
    })
})

const openModal = () => {
    isOpen.value = true
}

const closeModal = () => {
    isOpen.value = false
}

onMounted(async() => {
    await fetchPosts()
});
</script>

<template>
    <section class="pt-6 h-full">
        <div class="max-w-screen-xl px-4 lg:px-0 mx-auto h-full">
            <Loader v-if="isFetching" />
            <div v-else class="border border-[#EAECF0] rounded-lg shadow-none lg:shadow-md">
                <div class="flex w-full items-center justify-between px-6 py-4 border-b border-b-[#EAECF0]">
                    <h1 class="font-medium text-lg text-gray-900">Candidates</h1>
                    <Button label="Create candidate" rounded size="small" @click="openModal" />
                </div>
                <div class="lg:w-full lg:left-auto lg:relative lg:right-auto lg:overflow-x-hidden left-0 right-0 overflow-x-scroll">
                    <table v-if="post?.candidates.length" class="table-auto w-full">
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
                            <tr v-for="candidate in post?.candidates" :key="candidate._id" class="even:bg-white odd:bg-gray-50 text-sm">
                                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{{ candidate.fullname }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-else class="w-full flex items-center justify-center border-b py-5">No candidate.</div>
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
        <Modal :is-open="isOpen" title="Create a candidate" sub-title="Fill the form below to create a candidate." @close="closeModal">
            <form class="grid gap-4" @submit.prevent="submitForm">
                <TextInput label="Fullname" name="name" type="text" v-model="name" :error="errors.name" />
                <div class="flex items-center gap-2">
                    <Button label="Create" type="submit" block :loading="isSubmitting" />
                    <Button label="Cancel" inverted block :disabled="isSubmitting" @click="[resetForm(), closeModal()]" />
                </div>
            </form>
        </Modal>
    </section>
</template>

<style scoped>

</style>

<route lang="yaml">
meta:
  layout: admin
</route>