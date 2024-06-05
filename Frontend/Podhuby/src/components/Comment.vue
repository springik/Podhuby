<template>
        <div class="lg:mb-16 mb-8">
            <div>
                <div class="flex flex-col justify-center items-center text-center"><!-- root comm -->
                    <div class="text-center flex flex-col lg:flex-row justify-center items-center mb-5">
                        <div class="flex flex-row gap-2">
                            <img class="w-10 h-10 lg:w-20 lg:h-20 rounded-full" :src="pfp" alt="profile">
                            <div class="pt-3">
                                <h3 class="inline underline decoration-wavy lg:decoration-dotted text-lg lg:pb-0.5 pb-2.5">
                                    {{ data.author.nickname }}
                                </h3>
                                <p class="text-sm text-left text-accentColor">
                                    {{ formattedDate }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="w-11/12 lg:w-1/2">
                            <p class="text-sm text-left">
                                {{ content }}
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
                            <img class="w-6 h-6" :src="editBtnSrc" alt="edit">
                        </button>
                    </div>
                </div>
                <div v-if="userStore.user !== null && this.userStore.user.id == data.author_id || this.userStore.getPermisionLevel('admin')" class="gap-4 flex justify-center flex-row">
                    <div>
                        <button title="Delete Comment" class="submit-btn-min p-2" @click="deleteComment">
                            <img class="w-6 h-6" :src="deleteBtnSrc" alt="delete">
                        </button>
                    </div>
                </div>
                <div v-if="showingReport && userStore.user !== null" class="gap-4 flex justify-center flex-row">
                    <div>
                        <button title="Report Comment" class="submit-btn-min p-2" @click="showReport">
                            <img class="w-6 h-6" :src="reportBtnSrc" alt="report">
                        </button>
                    </div>
                </div>
                </div>
                <div v-if="userStore.user !== null && showReply" class="flex flex-col justify-center items-center">
                    <textarea v-model="commentReplyContent" class="h-48 lg:w-96 w-64 outline-white outline-dotted outline-2 bg-mainColor outline-offset-8 m-8 resize-none text-white text-base" />
                    <button title="Reply to Comment" :disabled="disableReplyBtn" @click="reply" class="submit-btn-min mb-4 lg:mb-8 p-2">
                        Reply
                    </button>
                </div>
                <div v-if="userStore.user !== null && showEdit" class="flex flex-col justify-center items-center">
                    <textarea v-model="commentEditContent" class="h-48 lg:w-96 w-64 outline-white outline-dotted outline-2 bg-mainColor outline-offset-8 m-8 resize-none text-white text-base" />
                    <button title="Edit Comment" :disabled="disableEditBtn" @click="edit" class="submit-btn-min mb-4 lg:mb-8 p-2">
                        Edit
                    </button>
                </div>
                <Modal ref="reportModal">
                    <InputField ref="reasonInput" name="Reason" label="Reason" type="text" placeholder="Irrelevant" :pattern="reportRegex" errmsg="Invalid input" />
                    <div class="flex justify-center items-center">
                        <button title="Report Comment" class="p-2" @click="report">
                            <img class="w-6 h-6" src="/check-circle.svg" alt="report">
                        </button>
                    </div>
                </Modal>
            </div>
            <!-- toggle --->
            <button v-if="comments.length > 0" title="Show Replies" @click="toggle" class="text-white ml-5 lg:ml-80">
                <img :class="{ 'rotate-n-90' : !showSub }" class="w-7 h-7" src="/arrow-down.svg" alt="toggle arrow">
            </button>
            <div v-if="showSub" class="flex justify-center">
                <hr class="my-4 lg:my-6 w-3/4 lg:w-2/3 separator-col">
            </div>
            <div v-if="showSub" class="flex flex-col gap-4">
                <div v-for="(reply, index) in comments" :key="index" >
                    <Comment v-bind="{ data: reply }"  @deleteMe="handleDeleteMe"/>
                </div>
                <div v-if="lastGetCount >= 10" class="flex justify-center">
                    <button title="Get More Comments" @click="getComments" class="submit-btn-min mb-4 lg:mb-8 p-2">
                        Show more comments
                    </button>
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
import Modal from './Modal.vue'
import InputField from './InputField.vue';
import { useToast } from 'vue-toastification'
import moment from 'moment';

export default {
    name: 'Comment',
    components: { Modal, InputField },
    props: {
        data: {
            type: Object,
            require: true
        }
    },
    data() {
        return {
            showSub: false,
            pfp: 'http://localhost:8080' + this.data.author.pfp_path,
            showReply: false,
            commentReplyContent: '',
            commentEditContent: '',
            replyBtnSrc: '/reply.png',
            deleteBtnSrc: '/delete-icon.svg',
            editBtnSrc: '/edit-icon.svg',
            reportBtnSrc: '/report-icon.png',
            disableReplyBtn: false,
            disableEditBtn: false,
            limit: 10,
            showEdit: false,
            lastGetCount: null,
            reportRegex: /^[a-zA-Z0-9_\s]{0,200}$/,
            showingReport: true,
            reportTimeoutMs: 10000
        }
    },
    setup(props) {
        const comments = ref([])
        const userStore = useUserStore()
        const content = ref(props.data.content)
        const toast = useToast()

        return {
            userStore,
            comments,
            content,
            toast
        }
    },
    computed: {
        lastSeenString() {
            return this.comments[this.comments.length - 1]?.createdAt || ''
        },
        formattedDate() {
            return moment(new Date(this.data.createdAt)).fromNow()
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
            this.disableEditBtn = true
            try
            {
                const formData =
                {
                    content: this.commentEditContent,
                    commentId: this.data.id
                }

                const result = await axios.patch('/podcasts/edit/comment', formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded', withCredentials: true }, baseURL: '/api'})
                console.log(result);
                this.content = this.commentEditContent
                this.toast.success(result.data.message)
            }
            catch (err)
            {
                console.log(err);
                this.toast.error(err.response.data.message)
            }
            finally
            {
                this.disableEditBtn = false
            }
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
                this.toast.success(result.data.message)
            }
            catch (err)
            {
                console.log(err);
                this.toast.error(err.response.data.message)
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
                console.log(data);

                const url = `/podcasts/get-comments/${this.data.podcast_id}`
                const result = await axios.get(url, { header: { withCredentials: true }, params: data, baseURL: '/api' })
                console.log(result);
                this.pageCount = result.data.count / this.limit
                this.lastGetCount = result.data.rows.length
                this.comments = this.comments.concat(result.data.rows)
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
                this.toast.success(result.data.message)
            }
            catch (err)
            {
                console.log(err);
                this.toast.error(err.response.data.message)
            }
            finally
            {
                this.disableReplyBtn = false
            }
        },
        showReport() {
            this.$refs.reportModal.showing = true
        },
        async report() {
            try
            {
                const data = 
                    {
                        commentId: this.data.id,
                        reason: this.$refs.reasonInput.input
                    }
                
                const result = await axios.post('/podcasts/report/comment', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded', withCredentials: true }, baseURL: '/api'})
                console.log(result);
                console.log(result.data.message);
                this.$refs.reportModal.showing = false
                this.toast.success(result.data.message)
                this.timeoutReport()
            }
            catch (err)
            {
                console.log(err);
                this.toast.error(err.response.data.message)
            }
        },
        timeoutReport() {
            this.showingReport = false

            setTimeout(() => {
                this.showingReport = true
            }, this.reportTimeoutMs)
        }
    }
}
</script>

<style src="../styles/styles.css" scoped></style>
