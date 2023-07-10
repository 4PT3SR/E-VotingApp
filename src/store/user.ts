import { acceptHMRUpdate, defineStore } from "pinia";
import type { User } from "~/types/user";

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
    
