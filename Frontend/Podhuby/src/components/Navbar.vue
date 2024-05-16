<template>
  <nav class="lg:mr-20 gap-y-2 lg:gap-x-3 lg:gap-y-0 navbar flex flex-col lg:flex-row my-8 place-content-center lg:justify-end lg:items-end items-center lg:flex-nowrap flex-wrap">
    <router-link class="border-b-2 border-tertiaryColor border-dotted text-center place-content-center text-tertiaryColor" to="/">Home</router-link>
    <div class="lg:inline-flex flex lg:gap-x-3 place-content-center lg:flex-row flex-col gap-y-2 lg:gap-x-3 lg:gap-y-0">
      <router-link class="border-b-2 border-tertiaryColor border-dotted text-center place-content-center text-tertiaryColor" to="/register">Register</router-link>
      <router-link class="border-b-2 border-tertiaryColor border-dotted text-center text-tertiaryColor" v-if="userStore.user == null" to="/login">Login</router-link>
        <div v-else>
          <Dropdown title="Logout">
            <template #btn>
              <p class="border-b-2 border-tertiaryColor border-dotted text-center text-tertiaryColor">
                Account
              </p>
            </template>
            <template #menu>
              <ul class="text-white">
                <li class="py-0.5">
                  <button @click="logout">
                    Logout
                  </button>
                </li>
                <li class="py-0.5">
                  <button @click="navToProfile">
                    Profile
                  </button>
                </li>
              </ul>
            </template>
          </Dropdown>
          <!--<a class="border-b-2 border-tertiaryColor border-dotted text-center place-content-center text-tertiaryColor" href="#" @click.prevent="logout">
            Logout
          </a>-->
        </div>
  </div>
  </nav>
            
          
</template>

<script>
import { useUserStore } from '../stores/userStore'
import Dropdown from './Dropdown.vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'

export default {
  name: 'Navbar',
  components: { Dropdown },
  setup() {
    const userStore = useUserStore()
    const toast = useToast()

      return {
        userStore,
        toast
      }
  },
  data() {
    return {

    }
  },
  methods: {
    async logout() {
      console.log('logging out...');
      const url = `/api/users/logout`
      try
      {
        const results = await axios.post(url, { header: { withCredentials: true } })
        console.log(results);
        this.deleteUserFromStore()
        this.toast.success(results.data.message)
      }
      catch (err)
      {
        console.log(err);
        this.toast.error(err?.response?.data.message)
      }
    },
    deleteUserFromStore() {
      this.userStore.logout()
    },
    navToProfile() {
      this.$router.push('/profile')
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