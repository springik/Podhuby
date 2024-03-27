<template>
    <section>
        <!-- Content section -->
        <section>
            <div class="flex justify-center items-stretch">
                <div class="flex flex-col justify-center items-center lg:w-3/4">
                    <h2 class="my-12 p-4 text-white md:text-6xl text-2xl text-center uppercase outline-dashed outline-4 outline-accentColor podcast-header header-border">
                        {{ this.$route.params.title }}
                    </h2>
                    <p class="p-4 mb-2.5 w-3/4 text-xs md:text-base text-center font-medium text-white podcast-p-shadow">
                        {{ this.podcastData.description }}
                    </p>
                </div>
            </div>
            <div class="flex flex-col lg:flex-row justify-center items-stretch text-white">
            <div class="lg:w-3/4 flex-col flex justify-center items-center">
                <div>
                    <h2 class="py-5 text-xl lg:text-3xl ">
                    Genres:
                    </h2>
                </div>
                <div class="text-lg lg:flex lg:flex-row gap-4 lg:justify-center items-center grid grid-cols-3">
                    <div v-for="name in podcastData.genre_names" :key="name" class="rounded-full bg-accentColor p-2 lg:p-3">
                        <p>
                            {{ name }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="lg:w-3/4 flex-col flex justify-center items-center">
                <div>
                    <h2 class="py-5 text-xl lg:text-3xl ">
                    Tags:
                    </h2>
                </div>
                <div class="text-lg lg:flex lg:flex-row gap-4 lg:ustify-center lg:items-center grid grid-cols-3">
                    <div v-for="name in podcastData.tag_names" :key=name class="rounded-full bg-accentColor p-2 lg:p-3">
                        <p>
                            {{ name }}
                        </p>
                    </div>
                </div>
            </div>
            </div>
            <div class="flex flex-row justify-center items-top gap-12 p-4">
                <div v-if="podcastData.youtube_link != null" class="py-4">
                    <a :href="podcastData.youtube_link">
                        <img class="w-28" src="C:\Users\risaf\Downloads/meowdy.jpg" alt="youtube link">
                    </a>
                </div>
                <div v-if="podcastData.spotify_link != null" class="py-4">
                    <a href="#">
                        <img class="w-28" src="C:\Users\risaf\Downloads/meowdy.jpg" alt="spotify link">
                    </a>
                </div>
            </div>
            <div class="text-white flex flex-row justify-center items-stretch gap-2">
                <div class="flex flex-row justify-center items-center">
                    <h3 class="lg:text-2xl">
                        3.6
                    </h3>
                    <img class="lg:w-8 w-4 mb-1 lg:mb-2.5" src="/star.svg" alt="">
                </div>
                <div>
                    <h3 class="text-xs">
                        Placeholder for rating element
                    </h3>
                </div>
            </div>
        </section>
        <!-- separator -->
        <div class="flex justify-center">
            <hr class="my-4 lg:my-6 w-3/4 lg:w-2/3 separator-col">
        </div>
        <!-- Comment section -->
        <section class="text-white">
            <Comment />
        </section>
    </section>
</template>

<script>
import axios from 'axios';
import Comment from '../components/Comment.vue'
import { usePodcastStore } from '../stores/podcastStore'

export default {
    name: 'Podcast',
    components: { Comment },
    data() {
        return {
            podcastData: {  }
        }
    },
    setup() {
        const podcastStore = usePodcastStore()

        return {
            podcastStore
        }
    },
    mounted() {
        const isInStore = this.podcastStore.getByName(this.$route.params.title) === undefined

        if(isInStore)
            this.getPodcast();

        this.podcastData = this.podcastStore.getByName(this.$route.params.title)
    },
    methods: {
        async getPodcast() {
            try
            {
                const url = `/podcasts/${ this.$route.params.title }`

                const result = await axios.get(url, { header: { withCredentials: true }, baseURL: '/api' })
                this.podcastStore.addPodcast(result.data[0])
            }
            catch (err)
            {
                console.log(err);
            }
        }
    }
}
</script>

<style src="../styles/styles.css" scoped></style>