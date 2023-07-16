<script setup lang="ts">
import * as yup from 'yup';
import { useAxiosInstance } from '~/composables/useAxiosInstance';
import type { FullElection } from '~/types/election';
import { useTimeAgo, useNow } from '@vueuse/core';
import useNotifications from '~/composables/useToast';
const { createNotification } = useNotifications();

provide("create-notification", createNotification);

const now = useNow()
const api = useAxiosInstance()
const isFetching = ref(false)
const isOpen = ref(false)
const fetchingCollege = ref(false)
const fetchingDepartment = ref(false)
const apiError = ref('')
const elections = ref<FullElection[]>([])
const types = ref<string[]>(['General', 'Department', 'College'])
const colleges = ref([])
const departments = ref([])
const filteredColleges = computed(() => {
    return colleges.value.map((college:any) => college?.data[0])
})
const filteredDepartments = computed(() => {
    return departments.value.map((department:any) => department?.data[0])
})

const { handleSubmit, resetForm, isSubmitting, errors } = useForm({
  validationSchema: yup.object({
    title: yup.string().required('Please enter the election title'),
    election_type: yup.string().required('Please select the election type'),
    start: yup.string().required('Please select a start time').test(
        'is-valid-time',
        'Start time must be at least 1hr ahead from now',
        (value) => {
            if (new Date(value) >= now.value) {
                let myStart = new Date(value)
                let myNow = new Date(now.value)
                let diff = myStart.getTime() - myNow.getTime()
                let hrs = diff / (1000 * 60 * 60)
                if (hrs >= 1) {
                   return true; 
                }
            }
        }
    ),
    end: yup.string().required('Please select an end time').test(
        'is-valid-end',
        'End time must be greater than start time',
        (value) => {
            if (new Date(value) > new Date(start.value)) {
                return true;
            }
        }
    ),
  }),
  initialValues: {
    title: '',
    election_type: '',
    college_eligibility: '',
    department_eligibility: '',
    start: '',
    end: '',
  },
})

const { value: title } = useField<string>('title')
const { value: type } = useField<string>('election_type')
const { value: college } = useField<string>('college_eligibility')
const { value: department } = useField<string>('department_eligibility')
const { value: start } = useField<string>('start')
const { value: end } = useField<string>('end')

const submitForm = handleSubmit(async (values: any) => {
    let newValues;
    if (values.election_type === types.value[0]) {
        const { college_eligibility, department_eligibility, ...rest } = values
        newValues = {...rest}
    } else if (values.election_type === types.value[1]) {
        const { college_eligibility, ...rest } = values
        newValues = {...rest}
    } else {
        const { department_eligibility, ...rest } = values
        newValues = {...rest}
    }
    await api.value.post('/election', newValues).then((res) => {
        createNotification({
            type: 'success',
            message: res.data.status
        });
        fetchElections()
        closeModal()
    }).catch((err) => {
        console.error(err)
        apiError.value = err.response.data.message
    })
})

const fetchElections = async() => {
    await api.value.get('/election').then((res) => {
        elections.value = res.data.data
    }).catch((err) => {
        console.error(err)
    })
}

const fetchColleges = async () => {
    fetchingCollege.value = true
    await api.value.get('/data/colleges').then((res) => {
        colleges.value = res.data.data
    }).catch((err) => {
        console.error(err)
    })
    fetchingCollege.value = false
}

const fetchDepartments = async () => {
    fetchingDepartment.value = true
    await api.value.get('/data/department').then((res) => {
        departments.value = res.data.data
    }).catch((err) => {
        console.error(err)
    })
    fetchingDepartment.value = false
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

watch(type, () => {
    if (type.value === types.value[2]) {
        fetchColleges()
    } else if (type.value === types.value[1]) {
        fetchDepartments()
    }
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
                                <td class="px-6 py-4 text-gray-600">{{ election.department_eligibility ?? election.college_eligibility ?? '-' }}</td>
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
        </Modal>
    </section>
</template>

<style scoped>

</style>

<route lang="yaml">
meta:
  layout: admin
</route>