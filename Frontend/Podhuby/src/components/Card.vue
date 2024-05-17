<template>
  <div class ="hover-highlight card-root" @click="navigateToPodcast">
    <div class="card-heading">
        <img :src="imgPath" alt="Podcast icon">
        <h3>{{ heading }}</h3>
    </div>
    <div class="card-description">
        <p class="text-ellipsis overflow-hidden max-h-64">
            {{ description }}
        </p>
    </div>
    <div class="card-reactions">
        <span>{{ favouriteCount }}</span>
        <button class="ml-1 lg:ml-3" :disabled="disFavBtn" @click.stop="toggleFavourite">
            <img class="card-heart" :src="iconSource" alt="heart icon" >
        </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useUserStore } from '../stores/userStore.js'
import { useToast } from 'vue-toastification'

export default {
    name: "Card",
    props: ['heading', 'imgPath', 'description', 'initialFavouriteCount', 'podcast_id'],
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
            iconSource: "/heart.svg",
            state: false,
            disableFavBtn: false,
            favouriteCount: this.initialFavouriteCount
        }
    },
    mounted() {
        if(this.userStore.user !== null) {
            this.checkState()
        }
        this.getCount()
    },
    computed: {
        disFavBtn() {
            if(this.userStore.user === null)
                return true
            return this.disableFavBtn
        }
    },
    methods: {
        async toggleFavourite() {
            this.disableFavBtn = true
            if(this.iconSource === "/heart.svg") {
                this.iconSource = "/heart-fill.svg"
            }
            else {
                this.iconSource = "/heart.svg"
            }

            try
            {
                const url = `/podcasts/favourite/${this.podcast_id}`
                const results = await axios.post(url, {}, { header: { withCredentials: true }, baseURL: '/api' })
                console.log(results);
                console.log(results.data.message);
                await this.getCount()
                this.toast.success(results.data.message)
            }
            catch (err)
            {
                console.log(err);
                this.toast.error(err.message)
            }
            finally
            {
                this.disableFavBtn = false
            }
        },
        async getCount() {
            console.log('getting count...');
            try
            {
                const url = `/api/podcasts/favourite/count/${this.podcast_id}`
                const results = await axios.get(url, {}, { header: { withCredentials: true } })
                console.log(results.data);
                this.favouriteCount = results.data.count
            }
            catch (err)
            {
                console.log(err);
                this.toast.error(err.message)
            }
        },
        async checkState() {
            console.log('getting state...');
            try
            {
                const url = `/podcasts/favourite/state/${this.podcast_id}`
                const results = await axios.get(url, { header: { withCredentials: true }, baseURL: '/api' })
                console.log(results);
                this.state = results.data.state
                if(results.data.state)
                    this.iconSource = '/heart-fill.svg'
                else
                    this.iconSource = '/heart.svg'

            }
            catch (err)
            {
                console.log(err);
                this.toast.error(err.message)
            }
        },
        navigateToPodcast() {
            this.$router.push({ name: 'PodcastByTitle', params: { title: this.heading } })
        }
    }
}
</script>
<style src="../styles/styles.css" scoped></style>
