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
        <!-- Comment add --->
        <div v-if="userStore.user !== null" class="flex flex-col justify-center items-center">
            <textarea v-model="commentAddContent" class="h-48 lg:w-96 w-64 outline-white outline-dotted outline-2 bg-mainColor outline-offset-8 m-8 resize-none text-white text-base" />
            <button class="submit-btn-min mb-4 lg:mb-8 p-2" @click="addComment">
                Submit
            </button>
        </div>
        <!-- Comment section -->
        <section class="text-white">
            <Comment v-for="comment in comments" :data="comment" :key="comment.id" @deleteMe="handleDeleteMe">

            </Comment>
        </section>
    </section>
</template>

<script>
import axios from 'axios';
import Comment from '../components/Comment.vue'
import { usePodcastStore } from '../stores/podcastStore'
import { useUserStore } from '../stores/userStore'

export default {
    name: 'Podcast',
    components: { Comment },
    data() {
        return {
            podcastData: {  },
            comments: [],
            lastSeenString: "",
            pageCount: 0,
            limit: 10,
            commentAddContent: ''
        }
    },
    setup() {
        const podcastStore = usePodcastStore()
        const userStore = useUserStore()

        return {
            podcastStore,
            userStore
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

        console.log('getting comments');
            try
            {
                const data = {
                    lastSeenString: this.lastSeenString,
                    rootId: "",
                    limit: this.limit
                }

                const url = `/podcasts/get-comments/${this.podcastData.id}`
                const result = await axios.get(url, { header: { withCredentials: true }, params: data, baseURL: '/api' })
                console.log(result);
                this.pageCount = Math.ceil(result.data.count / this.limit)
                this.comments = result.data.rows
            }
            catch (err)
            {
                console.log(err);
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
        handleDeleteMe(commId) {
            console.log('handling delete');
            this.comments = this.comments.filter(c => c.id !== commId)
        },
        async getComments(limit) {
            console.log('getting comments');
            try
            {
                const data =
                `
                    "lastSeenString": ${ this.lastSeenString },
                    "rootId": ,
                    "limit": ${ limit }
                `
                const url = `/podcasts/get-comments/${this.podcastData.id}`
                const result = await axios.get(url, { header: { withCredentials: true }, params: data, baseURL: '/api' })
                console.log(result);
                this.pageCount = result.count / limit
                this.comments = result.rows
            }
            catch (err)
            {
                //console.log(err);
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