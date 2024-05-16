<template>
  <div class="relative">
    <!-- Dropdown btn -->
    <button @click="toggle" ref="dropdownBtn">
      <slot name="btn" />
    </button>

    <!-- Menu container -->
    <div v-if="show" ref="dropdownMenu" class="absolute top-full mt-1 bg-accentColor rounded text-sm p-2 left-1/2 -translate-x-1/2">
      <slot name="menu" />
    </div>
  </div>
</template>

<script>
export default {
    name: 'Dropdown',
    props: ['title'],
    data() {
      return {
        show: false
      }
    },
    mounted() {
      document.addEventListener('click', this.handleClickOutside)
    },
    beforeDestroy() {
      document.removeEventListener('click', this.handleClickOutside)
    },
    methods: {
      toggle() {
        this.show = !this.show
      },
      preventDefault(event) {
        event.preventDefault()
      },
      handleClickOutside(event) {
        if (this.$refs.dropdownBtn && this.$refs.dropdownBtn.contains(event.target) || this.$refs.dropdownMenu && this.$refs.dropdownMenu.contains(event.target)) {
          return
        }
        if (this.$refs.dropdownMenu && !this.$refs.dropdownMenu.contains(event.target)) {
          this.show = false
        }
      }
    }
}
</script>

<style src="../styles/styles.css" scoped>
.btn {
  font-family: 'Comfortaa', sans-serif;
  border-bottom: 2px dotted var(--tertiary-color);
  background-color: var(--main-color);
  color: var(--tertiary-color);
  border-top: none;
  border-right: none;
  border-left: none;
  text-decoration: none;
  font-weight: 400;
  font-size: 16px;
}
</style>