import {createRouter, createWebHistory} from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue'
import MainPage from '../components/MainPage.vue'
import Podcast from '../components/Podcast.vue'
import Profile from '../components/Profile.vue'

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
    },
    {
        path: '/',
        name: 'Main',
        component: MainPage
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/podcast/:title',
        name: 'PodcastByTitle',
        component: Podcast
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
