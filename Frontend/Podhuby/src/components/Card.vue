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
        <img class="card-heart" :src="iconSource" alt="heart icon" @click.stop="toggleFavourite">
        <span>{{ favCountTmp }}</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name: "Card",
    props: ['heading', 'imgPath', 'description', 'favouriteCount', 'podcast_id'],
    data() {
        return {
            iconSource: "/heart.svg",
            favCountTmp: this.favouriteCount
        }
    },
    methods: {
        async toggleFavourite() {
            if(this.iconSource === "/heart.svg") {
                this.iconSource = "/heart-fill.svg"
                this.favCountTmp++
            }
            else {
                this.iconSource = "/heart.svg"
                this.favCountTmp--
            }

            try {
                const axiosIns = axios.create({
                    baseURL: '/api',
                    withCredentials: true
                })
                const url = `podcasts/favourite/${this.podcast_id}`
                //const result = await axios.post(url, { header: { withCredentials: true }, baseURL: '/api' })
                const result = await axiosIns.post(url)
                //TODO: popup modal with returned message
                if(result.status === 401 || result.status === 500) {
                    this.$router.push('/login')
                }
                console.log(result);
            }
            catch(err)
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
