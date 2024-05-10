<template>
        <div>
            <div>
                <div class="flex flex-col justify-center items-center text-center"><!-- root comm -->
                    <div class="text-center flex flex-col lg:flex-row justify-center items-center mb-5">
                        <div class="flex flex-row gap-2">
                            <img class="w-10 h-10 lg:w-20 lg:h-20 rounded-full" :src="pfp" alt="profile">
                            <h3 class="underline decoration-wavy lg:decoration-dotted text-lg pt-3.5 lg:pb-0.5 pb-2.5">
                                {{ data.author.nickname }}
                            </h3>
                        </div>
                    </div>
                    <div class="w-11/12 lg:w-1/2">
                            <p class="text-sm text-left">
                                {{ data.content }}
                            </p>
                    </div>
                </div>
                <div class="flex flex-row items-center justify-center gap-4">
                    <div v-if="userStore.user !== null" class="gap-4 flex justify-center flex-row">
                    <div>
                        <button class="submit-btn-min p-2" @click="toggleReply">
                            <img class="w-6 h-6" :src="replyBtnSrc" alt="reply">
                        </button>
                    </div>
                </div>
                <div v-if="userStore.user !== null && this.userStore.user.id == data.author_id" class="gap-4 flex justify-center flex-row">
                    <div>
                        <button class="submit-btn-min p-2" @click="toggleEdit">
                            <img class="w-6 h-6" :src="editBtnSrc" alt="reply">
                        </button>
                    </div>
                </div>
                <div v-if="userStore.user !== null && this.userStore.user.id == data.author_id" class="gap-4 flex justify-center flex-row">
                    <div>
                        <button class="submit-btn-min p-2" @click="deleteComment">
                            <img class="w-6 h-6" :src="deleteBtnSrc" alt="reply">
                        </button>
                    </div>
                </div>
                </div>
                <div v-if="userStore.user !== null && showReply" class="flex flex-col justify-center items-center">
                    <textarea v-model="commentReplyContent" class="h-48 lg:w-96 w-64 outline-white outline-dotted outline-2 bg-mainColor outline-offset-8 m-8 resize-none text-white text-base" />
                    <button :disabled="disableReplyBtn" @click="reply" class="submit-btn-min mb-4 lg:mb-8 p-2">
                        Submit
                    </button>
                </div>
                <div v-if="userStore.user !== null && showEdit" class="flex flex-col justify-center items-center">
                    <textarea v-model="commentEditContent" class="h-48 lg:w-96 w-64 outline-white outline-dotted outline-2 bg-mainColor outline-offset-8 m-8 resize-none text-white text-base" />
                    <button :disabled="disableEditBtn" @click="reply" class="submit-btn-min mb-4 lg:mb-8 p-2">
                        Submit
                    </button>
                </div>
            </div>
            <!-- toggle --->
            <button @click="toggle" class="text-white ml-5 lg:ml-80">
                <img :class="{ 'rotate-n-90' : !showSub }" class="w-7 h-7" src="/arrow-down.svg" alt="toggle arrow">
            </button>
            <div v-if="showSub" class="flex justify-center">
                <hr class="my-4 lg:my-6 w-3/4 lg:w-2/3 separator-col">
            </div>
            <div v-if="showSub" class="flex flex-col gap-4">
                <div v-for="(reply, index) in comments" :key="index" >
                    <Comment v-bind="{ data: reply }"  @deleteMe="handleDeleteMe"/>
                </div>
            </div>
            <div v-if="showSub" class="flex justify-center">
                <hr class="my-4 lg:my-6 w-3/4 lg:w-2/3 separator-col">
            </div>
        </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../stores/userStore'
import { ref } from 'vue'

export default {
    name: 'Comment',
    props: {
        data: {
            type: Object,
            require: true
        }
    },
    data() {
        return {
            showSub: false,
            pfp: 'http://localhost:8080/pfps' + this.data.author.pfp_path,
            showReply: false,
            commentReplyContent: '',
            commentEditContent: '',
            replyBtnSrc: '/reply.png',
            deleteBtnSrc: '/delete-icon.svg',
            editBtnSrc: '/edit-icon.svg',
            disableReplyBtn: false,
            disableEditBtn: false,
            lastSeenString: "",
            limit: 10,
            showEdit: false,
            //comments: []
        }
    },
    setup() {
        const comments = ref([])
        const userStore = useUserStore()

        return {
            userStore,
            comments
        }
    },
    mounted() {
        this.getComments()
    },
    methods: {
        toggle() {
            this.showSub = !this.showSub
        },
        toggleReply() {
            this.showReply = !this.showReply

            if(this.showReply)
                this.replyBtnSrc = '/cross-circle.svg'
            else
                this.replyBtnSrc = '/reply.png'
        },
        toggleEdit() {
            this.showEdit = !this.showEdit

            if(this.showEdit)
                this.editBtnSrc = '/cross-circle.svg'
            else
                this.editBtnSrc = '/edit-icon.svg'
        },
        async edit() {
            
        },
        async deleteComment() {
            console.log('deleting comment');

            try
            {
                const requestData =
                {
                    commentId: this.data.id
                }

                const result = await axios.delete( '/podcasts/comment',  { data: requestData, header: { 'Content-Type': 'application/json' , withCredentials: true }, baseURL: '/api' } )
                console.log(result);
                this.$emit('deleteMe', this.data.id)
            }
            catch (err)
            {
                console.log(err);
            }
        },
        handleDeleteMe(commId) {
            console.log('handling delete');
            this.comments = this.comments.filter(c => c.id !== commId)
        },
        async getComments() {
            console.log('getting comments');
            try
            {
                const data = {
                    lastSeenString: this.lastSeenString,
                    rootId: this.data.id,
                    limit: this.limit
                }

                const url = `/podcasts/get-comments/${this.data.podcast_id}`
                const result = await axios.get(url, { header: { withCredentials: true }, params: data, baseURL: '/api' })
                console.log(result);
                this.pageCount = result.data.count / this.limit
                this.comments = result.data.rows
            }
            catch (err)
            {
                console.log(err);
            }
        },
        async reply() {
            console.log('replying to comment');
            this.disableReplyBtn = true
            const formData =
            {
                podcastId: this.data.podcast_id,
                rootId: this.data.id,
                content: this.commentReplyContent
            }

            try
            {
                const result = await axios.post('/podcasts/submit/comment', formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded', withCredentials: true }, baseURL: '/api'})
                console.log(result);
                this.comments.unshift(result.data.comment)
            }
            catch (err)
            {
                console.log(err);
            }


            this.disableReplyBtn = false
        }
    }
}
</script>

<style src="../styles/styles.css" scoped></style>
