<template>
        <div>
            <div>
                <div class="flex flex-row justify-center items-center text-center"><!-- root comm -->
                    <div class="text-center flex flex-col lg:flex-row justify-center items-center mb-5">

                        <div class="flex flex-row gap-2">
                            <img class="w-20 h-20 rounded-full" src="/meowdy.jpg" alt="">
                        <div>
                            <h3 class="underline decoration-wavy lg:decoration-dotted text-lg pt-3.5 lg:pb-0.5 pb-2.5">
                                Username
                            </h3>
                            <h4 class="py-1 text-accentColor text-sm">
                                @Useradd
                            </h4>
                        </div>
                        </div>
                        <div class="w-11/12 lg:w-1/2 ml-1.5">
                            <p class="text-sm text-left">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- toggle --->
            <button @click="toggle" class="text-white ml-5 lg:ml-80">
                <img :class="{ 'rotate-n-90' : !showSub }" class="w-7 h-7" src="/arrow-down.svg" alt="toggle arrow">
            </button>
            <div v-if="showSub" class="flex flex-col gap-4">
                <SubComment v-for="index in 20" :key="index" username="Username" useradd="@wafeadd" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere." userImage="/meowdy.jpg" />
            </div>
        </div>
</template>

<script>
import SubComment from '../components/SubComment.vue'

export default {
    name: 'Comment',
    components: { SubComment },
    data() {
        return {
            showSub: false
        }
    },
    methods: {
        toggle() {
            this.showSub = !this.showSub
        }
    }
}
</script>

<style src="../styles/styles.css" scoped></style>
