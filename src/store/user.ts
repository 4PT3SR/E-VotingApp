import { acceptHMRUpdate, defineStore } from "pinia";
import { router } from "~/router";

interface User {
    _id: string
    first_name: string
    last_name: string
    matric_number: string
    email: string
    role: string
    isAdmin: boolean
    posts: any[]
    tokens: any[]
}

export const userStore = defineStore('user', {
    state: () => ({
        user: ref<User | null>(null),
        token: ''
    }),
    actions: {
        async logout() {
            return;
        }
    },
    persist: true
})

if (import.meta.hot) 
    import.meta.hot?.accept(acceptHMRUpdate(userStore, import.meta.hot))
    
