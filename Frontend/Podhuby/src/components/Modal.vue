<template>
  <div class="text-white fixed inset-0 flex justify-center items-center w-full h-full" v-show="showing">
    <div class="relative bg-mainColor p-6 rounded-lg">
        <div class="absolute top-2 right-2">
            <button @click="hide">
                <img class="w-6 h-6" src="/cross.png" alt="cancel">
            </button>
        </div>
        <slot />
    </div>
  </div>
</template>

<script>
export default {
    name: 'Modal',
    data() {
        return {
            showing: false
        }
    },
    methods: {
        hide() {
            this.showing = false
        }
    }
}
</script>

<style src="../styles/styles.css" scoped></style>