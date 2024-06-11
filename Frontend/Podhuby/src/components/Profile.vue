<template>
  <section class="text-white flex flex-col lg:flex-row items-center gap-4">
    <img class="w-20 h-20 rounded-full" :src="pfpUrl" alt="profile">
    <div>
        <h2>
            Email:
            <p class="text-accentColor">
                {{ user.email }}
            </p>
        </h2>
        <h3>
            Username:
            <p class="text-accentColor">
                {{ user.nickname }}
            </p>
        </h3>
        <h4>
            Joined on:
            <p class="text-accentColor">
                {{ formattedJoin }}
            </p>
        </h4>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../stores/userStore.js';
import moment from 'moment';
import { useToast } from 'vue-toastification';

export default {
    name: 'Profile',
    setup() {
        const userStore = useUserStore()
        const toast = useToast()

        return {
            userStore,
            toast
        }
    },
    data() {
        return {
            user: {}
        }
    },
    async mounted() {
        this.getUserData()
    },
    methods: {
        async getUserData() {
            const url = `/api/users/current-user`
            try
            {
                const response = await axios.get(url, { withCredentials: true } )
                console.log(response.data);
                this.user = response.data
            }
            catch (err)
            {
                console.log(err);
                this.toast.error('Failed to load user data')
            }
        }
    },
    computed: {
        formattedJoin() {
            return moment(new Date(this.user.createdAt)).format('MMMM Do YYYY')
        },
        pfpUrl() {
            //const proxy = import.meta.env.VITE_PROXY_URL
            //console.log(proxy);
            return 'http://localhost:8080' + this.user.pfp_path
        }
    }
}
</script>

<style src="../styles/styles.css" scoped></style>