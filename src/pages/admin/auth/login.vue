<script setup lang="ts">
import * as yup from 'yup';
import { useField, useForm } from 'vee-validate';
import { useBaseFetch } from '~/composables/fetch';
import { userStore } from '~/store/user';

const user = userStore()
const router = useRouter()
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

const {
    post: registerUser,
    data: token,
    error,
    isFetching: isLoggingIn,
    onFetchResponse: onRegisterResponse,
    onFetchError: onRegisterError
} = useBaseFetch<string>('/user/login', { immediate: false }).json()

const submitForm = handleSubmit(async (values: any) => {
    await registerUser(values).execute()
})

onRegisterResponse(async () => {
  const { __v, createdAt, updatedAt, ...obj } = token.value.user
  user.$patch({
    user: obj,
    token: token.value.authToken
  })
  resetForm()
  router.push('/admin')
})

onRegisterError(async () => {
  console.log(error.value)
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
                    <h1 class="text-2xl text-gray-900 font-semibold">Log in</h1>
                    <p class="text-base text-gray-600 font-normal">Enter your matriculation number and password to access your account.</p>
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