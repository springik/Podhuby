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
                <div class="text-lg lg:flex lg:flex-row gap-4 lg:justify-center lg:items-stretch items-center grid grid-cols-2">
                    <div v-for="name in podcastData.genres" :key="name" class="rounded-full bg-accentColor p-2 lg:p-3 text-center overflow-x-auto">
                        <p class="capitalize">
                            {{ name }}
                        </p>
                    </div>
                </div>
            </div>
            </div>
            <div class="flex justify-center">
                <h2 class="pt-4 text-xl lg:text-3xl text-white">
                    Links:
                </h2>
            </div>
            <div class="flex flex-row justify-center items-top gap-12 p-4">
                
                <div v-if="podcastData.youtube_link != null" class="py-4">
                    <a :href="podcastData.youtube_link">
                        <img class="w-28" src="/youtube-logo.png" alt="youtube link">
                    </a>
                </div>
                <div v-if="podcastData.spotify_link != null" class="py-4">
                    <a href="#">
                        <img class="w-28" src="/spotify-logo.png" alt="spotify link">
                    </a>
                </div>
            </div>
            <div class="text-white flex flex-row justify-center items-stretch gap-2">
                <div class="flex flex-row justify-center items-center">
                    <h3 class="lg:text-2xl mr-1 lg:mr-2">
                        {{ podcastData.average_rating }}
                    </h3>
                    <img v-if="podcastData.average_rating != 'No Ratings'" class="lg:w-8 w-4 mb-1 lg:mb-2.5" src="/star.svg" alt="purple star">
                </div>
            </div>
            <div v-if="this.userStore.user !== null" class="flex justify-center items-center">
                <Rating ref="rating" @onRate="handleRate" :initialSelectedIndex="-1" />
            </div>
        </section>
        <!-- separator -->
        <div class="flex justify-center">
            <hr class="my-4 lg:my-6 w-3/4 lg:w-2/3 separator-col">
        </div>
        <!-- Comment add --->
        <div v-if="userStore.user !== null" class="flex flex-col justify-center items-center">
            <textarea v-model="commentAddContent" class="h-48 lg:w-96 w-64 outline-white outline-dotted outline-2 bg-mainColor outline-offset-8 m-8 resize-none text-white text-base" />
            <button title="Add Comment" class="submit-btn-min mb-4 lg:mb-8 p-2" @click="addComment">
                Comment
            </button>
        </div>
        <!-- Comment section -->
        <section class="text-white">
            <Comment v-for="comment in comments" :data="comment" :key="comment.id" @deleteMe="handleDeleteMe">

            </Comment>
            <div v-if="lastGetCount >= 10" class="flex justify-center">
                    <button title="Get More Comments" @click="getComments" class="submit-btn-min mb-4 lg:mb-8 p-2">
                        Show more comments
                    </button>
            </div>
        </section>
    </section>
</template>

<script>
import axios from 'axios';
import Comment from '../components/Comment.vue'
import { usePodcastStore } from '../stores/podcastStore'
import { useUserStore } from '../stores/userStore'
import { useToast } from 'vue-toastification'
import Rating from './Rating.vue';

export default {
    name: 'Podcast',
    components: { Comment, Rating },
    data() {
        return {
            podcastData: { },
            comments: [],
            pageCount: 0,
            limit: 10,
            commentAddContent: '',
            lastGetCount: null,
            currRating: -1
        }
    },
    setup() {
        const podcastStore = usePodcastStore()
        const userStore = useUserStore()
        const toast = useToast()

        return {
            podcastStore,
            userStore,
            toast
        }
    },
    async mounted() {
        const notInStore = this.podcastStore.getByName(this.$route.params.title) !== null || this.podcastStore.getByName(this.$route.params.title) !== undefined
        if(notInStore) {
            const url = `/podcasts/${ this.$route.params.title }`
            const result = await axios.get(url, { header: { withCredentials: true }, baseURL: '/api' })

            this.podcastData = result.data[0]
            this.podcastStore.addPodcast(this.podcastData)
        }
        this.getComments()
        if(this.userStore.user !== null)
            await this.getCurrRating()
    },
    computed: {
        lastSeenString() {
            return this.comments[this.comments.length - 1]?.createdAt || ''
        }
    },
    methods: {
        async getPodcast(stored) {
            if(!stored) {
                try
                {
                    const url = `/podcasts/${ this.$route.params.title }`

                    const result = await axios.get(url, { header: { withCredentials: true }, baseURL: '/api' })
                    console.log(result);
                    this.podcastStore.addPodcast(result.data[0])
                    this.podcastData = result.data[0]
                }
                catch (err)
                {
                    console.log(err);
                }
            }
            
        },
        async handleRate(rating) {
            rating += 1
            console.log(rating, 'this is the rating');
            try
            {
                const url = `/api/podcasts/rate/${this.podcastData.id}`
                const data =
                {
                    score: rating
                }
                const results = await axios.post(url, data, { header: { withCredentials: true } })
                this.toast.success(results.data.message)
                await this.getCurrRating()
                
            }
            catch (err)
            {
                console.log(err);
                this.toast.error(err.response.data.message)
            }
        },
        async getCurrRating() {
            try
            {
                const url = `/podcasts/rate/current`
                const params =
                {
                    podcastId: this.podcastData.id
                }

                const results = await axios.get(url, { params, header: { withCredentials: true }, baseURL: '/api' })
                const index = results.data.score - 1
                this.$refs.rating.setRating(index)
                await this.getAverageRating()
            }
            catch (err)
            {
                console.log(err);
                this.toast.error(err.response?.data?.message)
            }
        },
        async getAverageRating() {
            const url = `/podcasts/rate/avg`
            const params =
            {
                podcastId: this.podcastData.id
            }
            const results = await axios.get(url, { params, header: { withCredentials: true }, baseURL: '/api' })
            console.log(results);
            this.podcastData.average_rating = results.data.average_rating
        },
        handleDeleteMe(commId) {
            console.log('handling delete');
            this.comments = this.comments.filter(c => c.id !== commId)
        },
        async getComments() {
            console.log('getting comments');
            try
            {
                const data =
                {
                    lastSeenString: this.lastSeenString,
                    rootId: '',
                    limit: this.limit
                }
                const url = `/podcasts/get-comments/${this.podcastData.id}`
                const result = await axios.get(url, { header: { withCredentials: true }, params: data, baseURL: '/api' })
                console.log(result);
                this.pageCount = result.count / this.limit
                this.lastGetCount = result.data.rows.length
                this.comments = this.comments.concat(result.data.rows)
            }
            catch (err)
            {
                console.log(err);
                this.toast.error(err.response.data.message)
            }
        },
        async addComment() {
            if(this.commentAddContent.length == 0)
                return

            try
            {
                const formData =
                {
                    content: this.commentAddContent,
                    podcastId: this.podcastData.id
                }
                const result = await axios.post('/podcasts/submit/comment', formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded', withCredentials: true }, baseURL: '/api' })
                console.log(result);
                this.comments.unshift(result.data.comment)
                this.toast.success(result.data.message)
            }
            catch (err)
            {
                console.log(err);
                this.toast.error(err.response.data.message)
            }
        }
    }
}
</script>

<style src="../styles/styles.css" scoped></style>