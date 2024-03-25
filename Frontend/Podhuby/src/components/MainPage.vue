<template>
  <section class="main-page-content">
    <div class="filter-menu">

    </div>
    <div class="main-grid">
        <Card v-for="(podcast, index) in podcasts" :key="index" :heading="podcast.title" :imgPath="podcast.image_path" :description="podcast.description" :favouriteCount="index" :podcast_id="podcast.id" />
    </div>
  </section>
</template>

<script>
import Card from "./Card.vue"
import axios from 'axios'
import { usePodcastStore } from '../stores/podcastStore'

export default {
    name: "MainPage",
    components: { Card },
    setup() {
        const podcastStore = usePodcastStore()

        return {
            podcastStore
        }
    },
    data() {
        return {
            lorem: "This should be a description!Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nulla est. Pellentesque ipsum. Etiam posuere lacus quis dolor. Proin pede metus, vulputate nec, fermentum fringilla, vehicula vitae, justo.",
            podcasts: []
        }
    },
    methods: {
        async getPodcasts(count, offset) {
            try {
                const url = `/podcasts/all/${count}`
                const results = await axios.get(url, { header: { withCredentials: true }, baseURL: '/api' })
                this.podcasts = results.data //JSON.parse(results.data)
                this.podcastStore.init(this.podcasts)
            }
            catch(err) {
                console.log(err);
            }
        }
    },
    mounted() {
        this.getPodcasts(24, 0)
    }
}
</script>

<style>
div.filter-menu {
    position: sticky;
}
div.main-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8rem;
    margin-top: 0.3125rem;
}
section.main-page-content {
    margin-left: auto;
    margin-right: auto;
    width: 70%;
}
div.grid-item {
    padding: 1%;
    background-color: var(--accent-color);
}
</style>