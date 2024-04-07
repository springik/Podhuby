<template>
  <section class="main-page-content">
    <Modal ref="filter_modal">
        <fieldset class="mb-4">
            <legend class="mb-2">Genres</legend>
            <div class="grid lg:grid-cols-4 grid-cols-2 lg:gap-4 gap-2">
                <Toggle v-for="(genre, index) in genres" type="genre" :toggleText="genre.name" :key="index" @choiceChange="handleChoiceChange" />
            </div>
        </fieldset>
        <fieldset class="mb-4">
            <legend class="mb-2">Tags</legend>
            <div class="grid lg:grid-cols-4 grid-cols-2 lg:gap-4 gap-2">
                <Toggle v-for="(tag, index) in tags" type="tag" :toggleText="tag.name" :key="index" @choiceChange="handleChoiceChange" />
            </div>
        </fieldset>
        <!--<div class="flex justify-between items-center">
            <button>
                <img class="lg:w-12 lg:h-12" src="/check-circle.svg" alt="apply">
            </button>
            <button>
                <img class="lg:w-12 lg:h-12" src="/cross-circle.svg" alt="reset">
            </button>
        </div>-->

    </Modal>
    <button class="lg:w-10 lg:h-10 w-7 h-7 mb-3 lg:mb-0" @click.prevent="showModal">
        <img src="/filter.png" alt="filter">
    </button>

    <div class="main-grid">
        <Card v-for="(podcast, index) in filteredPodcasts" :key="index" :heading="podcast.title" :imgPath="podcast.image_path" :description="podcast.description" :favouriteCount="index" :podcast_id="podcast.id" />
    </div>
  </section>
</template>

<script>
import Card from "./Card.vue"
import Modal from './Modal.vue'
import axios from 'axios'
import { usePodcastStore } from '../stores/podcastStore'
import Toggle from './Toggle.vue'

export default {
    name: "MainPage",
    components: { Card, Modal, Toggle },
    setup() {
        const podcastStore = usePodcastStore()

        return {
            podcastStore
        }
    },
    data() {
        return {
            lorem: "This should be a description!Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nulla est. Pellentesque ipsum. Etiam posuere lacus quis dolor. Proin pede metus, vulputate nec, fermentum fringilla, vehicula vitae, justo.",
            podcasts: [],
            filters: { genres: [], tags: [] },
            genres: [ { id: 1, name: "True Crime" }, {id: 2, name: "News"} ],
            tags: [ {id:1, name: "Banter"}, {id:2, name: "Interview"}, {id:3, name: "Comedy"} ]
        }
    },
    computed: {
        filteredPodcasts() {
            return this.podcasts.filter(podcast => {
                return (
                    (this.filters.genres.length === 0 || this.filters.genres.some(genre => podcast.genre_names.includes(genre))) &&
                    (this.filters.tags.length === 0 || podcast.tag_names.some(tag => this.filters.tags.includes(tag)))
                )
            })
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
        },
        showModal() {
            this.$refs.filter_modal.showing = true
        },
        handleChoiceChange(data) {
            if(data.chosen) {
                if(data.type === 'genre') {
                    this.filters.genres.push(data.text.toLowerCase())
                }
                if(data.type === 'tag') {
                    this.filters.tags.push(data.text.toLowerCase())
                }
            }
            else if (data.type === 'genre')
                //console.log(this.filters.genres);
                this.filters.genres = this.filters.genres.filter((g) => g !== data.text.toLowerCase())
            else if (data.type === 'tag')
                //console.log(this.filters.tags);
                this.filters.tags = this.filters.tags.filter((t) => t !== data.text.toLowerCase())
        }
    },
    mounted() {
        this.getPodcasts(24, 0)
    }
}
</script>

<style src="../styles/styles.css" scoped></style>