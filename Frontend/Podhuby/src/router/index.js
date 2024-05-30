import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../components/LoginForm.vue'),
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../components/RegisterForm.vue'),
    },
    {
        path: '/',
        name: 'Main',
        component: () => import('../components/MainPage.vue'),
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../components/Profile.vue'),
    },
    {
        path: '/podcast/:title',
        name: 'PodcastByTitle',
        component: () => import('../components/Podcast.vue')
    },
    {
        path: '/podcast/submit',
        name: 'SubmitPodcast',
        component: () => import('../components/PodcastSubmitForm/PodcastForm.vue')
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
