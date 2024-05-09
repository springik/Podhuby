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
                <div class="gap-4 flex justify-center flex-row">
                    <div>
                        <button class="submit-btn-min p-2" @click="reply">
                            <img class="w-6 h-6" src="/reply.png" alt="reply">
                        </button>
                    </div>
                </div>
            </div>
            <!-- toggle --->
            <button @click="toggle" class="text-white ml-5 lg:ml-80">
                <img :class="{ 'rotate-n-90' : !showSub }" class="w-7 h-7" src="/arrow-down.svg" alt="toggle arrow">
            </button>
            <div v-if="showSub" class=" flex flex-col gap-4">
                <SubComment v-for="index in 20" :key="index" username="Username" useradd="@wafeadd" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere." userImage="/meowdy.jpg" />
            </div>
            <div v-if="showSub" class="flex justify-center">
                <hr class="my-4 lg:my-6 w-3/4 lg:w-2/3 separator-col">
            </div>
        </div>
</template>

<script>
import SubComment from '../components/SubComment.vue'

export default {
    name: 'Comment',
    components: { SubComment },
    props: [ 'data' ],
    data() {
        return {
            showSub: false,
            comments: [],
            pfp: 'http://localhost:8080/pfps' + this.data.author.pfp_path
        }
    },
    methods: {
        toggle() {
            this.showSub = !this.showSub
        },
        reply() {
            //TODO: implement
        }
    }
}
</script>

<style src="../styles/styles.css" scoped></style>
