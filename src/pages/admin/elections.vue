<script setup lang="ts">
import * as yup from 'yup';
import { useAxiosInstance } from '~/composables/useAxiosInstance';
import type { FullElection } from '~/types/election';
import { useTimeAgo } from '@vueuse/core';

const api = useAxiosInstance()
const isFetching = ref(false)
const isOpen = ref(false)
const elections = ref<FullElection[]>([])
const types = ['general', 'department', 'college']

const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: yup.object({
    title: yup.string().required('Please enter the election title'),
    election_type: yup.string().required('Please select the election type'),
    start: yup.string().required('Please select a start time'),
    end: yup.string().required('Please select an end time'),
  }),
  initialValues: {
    title: '',
    election_type: '',
    start: '',
    end: '',
  },
})

const { value: title } = useField<string>('title')
const { value: type } = useField<string>('election_type')
const { value: start } = useField<string>('start')
const { value: end } = useField<string>('end')

const submitForm = handleSubmit(async (values: any) => {
    // await registerUser(values).execute()
})

const fetchElections = async() => {
    await api.value.get('/election').then((res) => {
        elections.value = res.data.data
    }).catch((err) => {
        console.error(err)
    })
}

const openModal = () => {
    isOpen.value = true
}

const closeModal = () => {
    isOpen.value = false
}

onMounted(async () => {
    isFetching.value = true
    await fetchElections()
    isFetching.value = false
})
</script>

<template>
    <section class="pt-6 h-full">
        <div class="max-w-screen-xl px-4 lg:px-0 mx-auto h-full">
            <Loader v-if="isFetching" />
            <div v-else class="border border-[#EAECF0] rounded-lg shadow-none lg:shadow-md">
                <div class="flex w-full items-center justify-between px-6 py-4 border-b border-b-[#EAECF0]">
                    <h1 class="font-medium text-lg text-gray-900">Elections</h1>
                    <Button label="Create election" rounded size="small" @click="openModal" />
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
        <Modal :is-open="isOpen" title="Create an election" sub-title="Fill the form below to create an election." @close="closeModal">
            <form class="grid gap-4" @submit.prevent="submitForm">
                <TextInput label="Election Title" name="title" type="text" v-model="title" :error="errors.title" />
                <Select v-model="type" :options="types" name="type" :error="errors.election_type" label="Type of election" />
                <div class="flex items-start gap-2">
                    <TextInput label="Start time" name="start" type="datetime-local" v-model="start" :error="errors.start" />
                    <TextInput label="End time" name="end" type="datetime-local" v-model="end" :error="errors.end" />
                </div>
                <div class="flex items-center gap-2">
                    <Button label="Create" type="submit" block />
                    <Button label="Cancel" inverted block @click="[resetForm(), closeModal()]" />
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