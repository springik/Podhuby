<template>
  <nav class="lg:mr-20 gap-y-2 lg:gap-x-3 lg:gap-y-0 navbar flex flex-col lg:flex-row my-8 place-content-center lg:justify-end lg:items-end items-center lg:flex-nowrap flex-wrap">
    <router-link class="border-b-2 border-tertiaryColor border-dotted text-center place-content-center text-tertiaryColor" to="/">Home</router-link>
    <div class="lg:inline-flex flex lg:gap-x-3 place-content-center lg:flex-row flex-col gap-y-2 lg:gap-x-3 lg:gap-y-0">
      <router-link class="border-b-2 border-tertiaryColor border-dotted text-center place-content-center text-tertiaryColor" to="/register">Register</router-link>
      <router-link class="border-b-2 border-tertiaryColor border-dotted text-center text-tertiaryColor" v-if="userStore.user == null" to="/login">Login</router-link>
        <div v-else>
          <Dropdown />
        </div>
  </div>
  </nav>
            
          
</template>

<script>
import { useUserStore } from '../stores/userStore'
import Dropdown from './Dropdown.vue'
//import '../assets/styles.css'

export default {
  name: 'Navbar',
  components: { Dropdown },
  setup() {
    const userStore = useUserStore()

      return {
        userStore
      }
  },
  data() {
    return {

    }
  }
}
</script>

<style src="../styles/styles.css" scoped>
a {
  text-decoration: none;
  border-bottom: 2px dotted var(--tertiary-color);
 }
 .navbar {
  width: 100%;
}
</style>