<script setup lang="ts">
import * as yup from 'yup';
import { useField, useForm } from 'vee-validate';
import { useAxiosInstance } from '~/composables/useAxiosInstance';
import { userStore } from '~/store/user';
import useNotifications from '~/composables/useToast';
const { createNotification } = useNotifications();

provide("create-notification", createNotification);

const api = useAxiosInstance()
const user = userStore()
const router = useRouter()
const isLoggingIn = ref(false)
const { handleSubmit, resetForm } = useForm({
  validationSchema: yup.object({
    matric_number: yup.string().required('Please enter your matric number'),
    password: yup.string().required('Please enter your password')
  }),
  initialValues: {
    matric_number: '',
    password: ''
  },
})

const { value: matricNumber } = useField<string>('matric_number')
const { value: password } = useField<string>('password')

const submitForm = handleSubmit(async (values: any) => {
  isLoggingIn.value = true
  await api.value.post('/user/login', values).then(res => {
    const { __v, createdAt, updatedAt, ...obj } = res.data.user
    user.$patch({
      user: obj,
      token: res.data.authToken
    })
    resetForm()
    router.push('/admin')
  }).catch(err => {
    createNotification({
      type: 'error',
      message: err.response.data.message
    });
  })
  isLoggingIn.value = false
})
</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 h-full">
        <div class="bg-gray-100 hidden lg:block">
            <img src="/assets/person_voting.jpg" class="object-cover object-center h-screen w-full">
        </div>
        <div class="grid content-center justify-items-center px-5 md:px-10 md:max-w-screen-sm w-full mx-auto">
            <form class="grid gap-8 w-full" @submit.prevent="submitForm">
                <div class="grid gap-1">
                    <h1 class="text-2xl text-gray-900 font-semibold">Admin Login</h1>
                    <p class="text-base text-gray-600 font-normal">Enter your matriculation number and password to access your admin account.</p>
                </div>
                <div class="grid gap-5">
                    <TextInput v-model.trim="matricNumber" name="email" type="text" label="Matriculation number" />
                    <TextInput v-model.trim="password" name="password" type="password" label="Password" />
                    <Button type="submit" label="Log in" :loading="isLoggingIn" block />
                </div>
            </form>
        </div>
    </div>
</template>

<route lang="yaml">
meta:
  layout: auth
</route>