<template>
    <section>
        <span class="text-tertiaryColor">
            {{ this.$route.params.title }}
        </span>
    </section>
</template>

<script>
export default {
    mounted() {
        console.log("W");
    }
}
</script>

<style src="../styles/styles.css" scoped>

</style>