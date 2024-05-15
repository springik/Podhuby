<template>
  <section class="main-page-content">
    <Modal ref="filter_modal">
        <fieldset class="mb-4">
            <legend class="mb-2">Genres</legend>
            <div class="grid lg:grid-cols-4 grid-cols-2 lg:gap-4 gap-2">
                <Toggle v-for="genre in genres" type="genre" :toggleText="genre.name" :key="genre.id" @choiceChange="handleChoiceChange" />
            </div>
        </fieldset>
    </Modal>
    <button class="lg:w-10 lg:h-10 w-7 h-7 mb-3 lg:mb-0" @click.prevent="showModal">
        <img src="/filter.png" alt="filter">
    </button>

    <div class="main-grid">
        <Card v-for="(podcast, index) in filteredPodcasts" :key="index" :heading="podcast.title" :imgPath="podcast.image_path" :description="podcast.description" :initialFavouriteCount="podcast.favourite_count" :podcast_id="podcast.id" />
    </div>
  </section>
</template>

<script>
import Card from "./Card.vue"
import Modal from './Modal.vue'
import axios from 'axios'
import { usePodcastStore } from '../stores/podcastStore'
import Toggle from './Toggle.vue'
import { useToast } from 'vue-toastification'

export default {
    name: "MainPage",
    components: { Card, Modal, Toggle },
    setup() {
        const podcastStore = usePodcastStore()
        const toast = useToast()

        return {
            podcastStore,
            toast
        }
    },
    data() {
        return {
            podcasts: [],
            filters: { genres: [] },
            genres: [ ]
        }
    },
    computed: {
        filteredPodcasts() {
            return this.podcasts.filter(podcast => {
                return (
                    (this.filters.genres.length === 0 || this.filters.genres.some(genre => podcast.genres.includes(genre)))
                )
            })
        }
    },
    methods: {
        async getPodcasts(count, offset) {
            try {
                const url = `/podcasts/all/${count}`
                const results = await axios.get(url, { header: { withCredentials: true }, baseURL: '/api' })
                console.log(results);
                console.log(results);
                this.podcasts = results.data
                this.podcastStore.init(this.podcasts)
            }
            catch(err) {
                console.log(err);
                this.toast.error(err.message)
            }
        },
        showModal() {
            this.$refs.filter_modal.showing = true
        },
        handleChoiceChange(data) {
            if(data.chosen) {
                if(data.type === 'genre') {
                    this.filters.genres.push(data.text.toLowerCase())
                }
            }
            else if (data.type === 'genre')
                this.filters.genres = this.filters.genres.filter((g) => g !== data.text.toLowerCase())
        },
        async getGenres() {
            try
            {
                const results = await axios.get('/genres/all', { header: { withCredentials: true }, baseURL: '/api' })
                console.log(results);
                return results.data
            }
            catch (err)
            {
                console.log(err);
                this.toast.error(err.message)
            }
        }
    },
    async mounted() {
        this.getPodcasts(50, 0)
        this.genres = await this.getGenres()
    }
}
</script>

<style src="../styles/styles.css" scoped></style>