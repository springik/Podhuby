import {createRouter, createWebHistory} from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: LoginForm
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterForm
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
