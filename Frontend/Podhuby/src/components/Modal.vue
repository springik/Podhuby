<template>
  <div class="text-white fixed inset-0 flex justify-center items-center w-full h-full" v-show="showing">
    <div class="bg-mainColor p-6 rounded-lg">
        <button @click="hide">
            <img src="/cross.png" alt="cancel">
        </button>
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