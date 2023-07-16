<script setup lang="ts">
import { useAxiosInstance } from '~/composables/useAxiosInstance';
import type { User } from "~/types/user";
import { userStore } from '~/store/user';
import useNotifications from '~/composables/useToast';
const { createNotification } = useNotifications();

provide("create-notification", createNotification);

const api = useAxiosInstance()
const store = userStore()
const isFetching = ref(false)
const users = ref<User[]>([])

const getAllUsers = async() => {
    isFetching.value = true
    api.value.get('/admin/users').then((res) => {
        users.value = res.data.data
    }).catch((err) => {
        console.error(err)
    }).finally(() => isFetching.value = false)
}

const activateUser = async (id: string) => {
    isFetching.value = true
    api.value.patch(`/admin/users/${id}/addadmin`).then((res) => {
        createNotification({
            type: 'success',
            message: res.data.status
        });
        getAllUsers()
    }).catch((err) => {
        console.error(err)
    })
}

const deactivateUser = async (id: string) => {
    isFetching.value = true
    api.value.patch(`/admin/users/${id}/removeadmin`).then((res) => {
        createNotification({
            type: 'success',
            message: res.data.status
        });
        getAllUsers()
    }).catch((err) => {
        console.error(err)
    })
}

onMounted(async() => {
    await getAllUsers()
})
</script>

<template>
    <section class="pt-6 h-full">
        <div class="max-w-screen-xl px-4 lg:px-0 mx-auto h-full">
            <Loader v-if="isFetching" />
            <div v-else class="border border-[#EAECF0] rounded-lg shadow-none lg:shadow-md">
                <div class="flex w-full items-center justify-between px-6 py-4 border-b border-b-[#EAECF0]">
                    <h1 class="font-medium text-lg text-gray-900">Users</h1>
                    <!-- <Button label="Add user" rounded size="small" /> -->
                </div>
                <div class="lg:w-full lg:left-auto lg:relative lg:right-auto lg:overflow-x-hidden left-0 right-0 overflow-x-scroll">
                    <table class="table-auto w-full">
                        <thead>
                            <tr class="text-gray-500 text-left text-xs">
                                <th class="px-6 py-4 font-normal">Name</th>
                                <th class="px-6 py-4 font-normal">Email</th>
                                <th class="px-6 py-4 font-normal">Matric No</th>
                                <th class="px-6 py-4 font-normal">Department</th>
                                <th class="px-6 py-4 font-normal">Role</th>
                                <th class="px-6 py-4 font-normal"/>
                            </tr>
                        </thead>
                        <tbody class="border-y">
                            <tr v-for="user in users" :key="user._id" class="even:bg-white odd:bg-gray-50 text-sm">
                                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{{ user.first_name }} {{ user.last_name }}</td>
                                <td class="px-6 py-4 text-gray-600">{{ user.email }}</td>
                                <td class="px-6 py-4 text-gray-600">{{ user.matric_number }}</td>
                                <td class="px-6 py-4 text-gray-600"><span class="line-clamp-2 text-ellipsis overflow-hidden">{{ user.department }}</span></td>
                                <td class="px-6 py-4"><Badge :type="user.isAdmin ? 'success' : 'default'" :label="user.role" /></td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center justify-end gap-3">
                                        <button v-if="!user.isAdmin" type="button" class="text-sm font-semibold text-green-700" @click="activateUser(user._id)">Activate</button>
                                        <button v-else type="button" class="text-sm font-semibold text-red-700 disabled:cursor-not-allowed" :disabled="user._id === store.user?._id" @click="deactivateUser(user._id)">Deactivate</button>
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
    </section>
</template>

<style scoped>

</style>

<route lang="yaml">
meta:
  layout: admin
</route>