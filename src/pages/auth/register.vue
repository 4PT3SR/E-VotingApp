<script setup lang="ts">
import * as yup from 'yup';
import { useField, useForm } from 'vee-validate';
import { userStore } from '~/store/user';
import useNotifications from '~/composables/useToast';
const { createNotification } = useNotifications();

provide("create-notification", createNotification);

const api = useAxiosInstance()

const user = userStore()
const router = useRouter()
const { handleSubmit, resetForm, isSubmitting } = useForm({
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
  await api.value.post('/user/login', values).then(res => {
    const { __v, createdAt, updatedAt, ...obj } = res.data.user
    user.$patch({
      user: obj,
      token: res.data.authToken
    })
    resetForm()
    router.push('/')
  }).catch(err => {
    createNotification({
      type: 'error',
      message: err.response.data.message
    });
  })
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
                    <h1 class="text-2xl text-gray-900 font-semibold">Register</h1>
                    <p class="text-base text-gray-600 font-normal">Enter your matriculation number and password to create your account.</p>
                </div>
                <div class="grid gap-5">
                    <TextInput v-model.trim="matricNumber" name="email" type="text" label="Matriculation number" />
                    <TextInput v-model.trim="password" name="password" type="password" label="Password" />
                    <div class="grid gap-2 justify-items-center">
                        <Button type="submit" label="Register" :loading="isSubmitting" block />
                        <p class="text-gray-600 text-base">Already have an account? <RouterLink to="/auth/login" class="font-semibold text-blue-600">Log in</RouterLink></p>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<route lang="yaml">
meta:
  layout: auth
</route>