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
        <img v-if="userStore.user !== null" class="card-heart" :src="iconSource" alt="heart icon" @click.stop="toggleFavourite">
        <span>{{ favouriteCount }}</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useUserStore } from '../stores/userStore.js'

export default {
    name: "Card",
    props: ['heading', 'imgPath', 'description', 'favouriteCount', 'podcast_id'],
    setup() {
        const userStore = useUserStore()

        return {
            userStore
        }
    },
    data() {
        return {
            iconSource: "/heart.svg"
        }
    },
    methods: {
        async toggleFavourite() {
            if(this.iconSource === "/heart.svg") {
                this.iconSource = "/heart-fill.svg"
            }
            else {
                this.iconSource = "/heart.svg"
            }

            try
            {
                const url = `/podcasts/favourite/${this.podcast_id}`
                const results = await axios.post(url, { header: { withCredentials: true }, baseURL: '/api' })
                console.log(results);
                console.log(results.data.message);
            }
            catch (err)
            {
                console.log(err);
            }
        },
        navigateToPodcast() {
            this.$router.push({ name: 'PodcastByTitle', params: { title: this.heading } })
        }
    }
}
</script>
<style src="../styles/styles.css" scoped></style>
