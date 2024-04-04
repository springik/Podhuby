<template>
  <div @click="toggle" class="rounded-full p-2 border-2" :class="[ chosen ? 'bg-accentColor border-transparent' : 'border-dashed border-white' ]">
    <p class="select-none text-center">
        {{ text }}
    </p>
  </div>
</template>

<script>
export default {
    name: 'Toggle',
    props: ['toggleText'],
    data() {
        return {
            chosen: false,
            text: this.toggleText
        }
    },
    methods: {
        toggle() {
            this.chosen = !this.chosen
        }
    }
}
</script>

<style src="../styles/styles.css" scoped></style>
