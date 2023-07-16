import { defineStore } from 'pinia'

export interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    autoClose: boolean;
    duration: number;
    icon: boolean;
}

export const useToasts = defineStore('toasts', {
    state: () => {
        return {
            // all these properties will have their type inferred automatically
            notifications: ref<Notification[]>([]),
        }
    },
})
