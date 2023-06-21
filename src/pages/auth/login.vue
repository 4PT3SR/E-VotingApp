<script setup lang="ts">
const email = ref('')
</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 h-full">
        <div class="bg-gray-100 hidden lg:block">
            <img src="/assets/person_voting.jpg" class="object-cover object-center h-screen w-full">
        </div>
        <div class="grid content-center justify-items-center px-5 md:px-10 md:max-w-screen-sm w-full mx-auto">
            <div class="grid gap-8 w-full">
                <div class="grid gap-1">
                    <h1 class="text-2xl text-gray-900 font-semibold">Log in</h1>
                    <p class="text-base text-gray-600 font-normal">Enter your email and password to access your account.</p>
                </div>
                <div class="grid gap-5">
                    <TextInput v-model="email" type="text" label="Matriculation number" />
                    <TextInput v-model="email" type="password" label="Password" />
                    <Button label="Log in" block />
                </div>
            </div>
        </div>
    </div>
</template>

<route lang="yaml">
meta:
  layout: auth
</route>