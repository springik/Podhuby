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
    props: ['toggleText', 'type'],
    emits: [ 'choiceChange' ],
    data() {
        return {
            chosen: false,
            text: this.toggleText,
            type: this.type
        }
    },
    methods: {
        toggle() {
            console.log('Toggle toggled');
            this.chosen = !this.chosen
            this.$emit('choiceChange', { type: this.type, chosen: this.chosen, text: this.text })
        }
    }
}
</script>

<style src="../styles/styles.css" scoped></style>
