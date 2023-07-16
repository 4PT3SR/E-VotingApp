<script setup lang="ts">
import { useAxiosInstance } from '~/composables/useAxiosInstance';

const api = useAxiosInstance()
const route = useRoute()
const isFetching = ref(false)

const fetchPosts = () => {
    api.value.get(`/election/${route.params.id}`).then((res) => {
        console.log(res)
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

onMounted(() => {
    fetchPosts()
});
</script>

<template>
    <section class="pt-6 h-full">
        <div class="max-w-screen-xl px-4 lg:px-0 mx-auto h-full">
            <Loader v-if="isFetching" />
            <div v-else class="border border-[#EAECF0] rounded-lg shadow-none lg:shadow-md">
                <div class="flex w-full items-center justify-between px-6 py-4 border-b border-b-[#EAECF0]">
                    <h1 class="font-medium text-lg text-gray-900">Posts</h1>
                    <Button label="Create election" rounded size="small" @click="openModal" />
                </div>
                <!-- <div class="lg:w-full lg:left-auto lg:relative lg:right-auto lg:overflow-x-hidden left-0 right-0 overflow-x-scroll">
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
                                <td class="px-6 py-4 text-gray-600">{{ election.department_eligibility ?? election.college_eligibility }}</td>
                                <td class="px-6 py-4 text-gray-600">{{ election.posts.length }} {{ election.posts.length == 1 ? 'post' : 'posts' }}</td>
                                <td class="px-6 py-4 text-gray-600 capitalize">{{ useTimeAgo(election.start).value }}</td>
                                <td class="px-6 py-4 text-gray-600 capitalize">{{ useTimeAgo(election.end).value }}</td>
                                <td class="px-6 py-4 text-gray-600">
                                    <div class="flex items-center justify-end">
                                        <RouterLink :to="`/admin/elections/${election._id}/posts`" class="text-sm font-semibold text-gray-700">View</RouterLink>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div> -->
                <div class="flex items-center justify-between px-6 pb-4 pt-2.5">
                    <div class="flex items-center space-x-3">
                        <Button label="Previous" rounded inverted />
                        <Button label="Next" rounded inverted />
                    </div>
                    <span class="text-gray-700 font-medium text-sm">Page 1 of 10</span>
                </div>
            </div>
        </div>
        <!-- <Modal :is-open="isOpen" title="Create an election" sub-title="Fill the form below to create an election." @close="closeModal">
            <form class="grid gap-4" @submit.prevent="submitForm">
                <TextInput label="Election Title" name="title" type="text" v-model="title" :error="errors.title" />
                <Select v-model="type" :options="types" name="type" :error="errors.election_type" label="Type of election" />
                <template v-if="type == 'College'">
                    <Select v-model="college" :options="filteredColleges" name="college" :error="errors.college_eligibility" :disabled="fetchingCollege" label="College" />
                </template>
                <template v-if="type == 'Department'">
                    <Select v-model="department" :options="filteredDepartments" name="department" :error="errors.department_eligibility" :disabled="fetchingDepartment" label="Department" />
                </template>
                <div class="flex items-start gap-2">
                    <TextInput label="Start time" name="start" type="datetime-local" v-model="start" :error="errors.start" />
                    <TextInput label="End time" name="end" type="datetime-local" v-model="end" :error="errors.end" />
                </div>
                <div class="flex items-center gap-2">
                    <Button label="Create" type="submit" block :loading="isSubmitting" />
                    <Button label="Cancel" inverted block :disabled="isSubmitting" @click="[resetForm(), closeModal()]" />
                </div>
            </form>
            <p v-if="apiError" class="text-red-600 font-medium text-sm">{{ apiError }}</p>
        </Modal> -->
    </section>
</template>

<style scoped>

</style>

<route lang="yaml">
meta:
  layout: admin
</route>