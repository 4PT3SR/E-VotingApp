import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import { userStore } from './store/user'

const routes = setupLayouts(generatedRoutes)

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from) => {
    const user = userStore()
    const authRoutes = [
        "/auth/login",
        "/auth/register",
        "/admin/auth/login"
    ]

    if (authRoutes.includes(to.path) && user.token) {
        return from.path;
    }

    if (!authRoutes.includes(to.path) && !user.token) {
        return router.push('/auth/login');
    }

    // if (!authRoutes.includes(to.path) && user.user?.isAdmin) {
    //     return router.push('/admin');
    // }

    // if (!authRoutes.includes(to.path) && !user.user?.isAdmin) {
    //     return router.push('/');
    // }
})