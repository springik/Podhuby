<template>
  <nav class="lg:mr-20 gap-y-2 lg:gap-x-3 lg:gap-y-0 navbar flex flex-col lg:flex-row my-8 place-content-center lg:justify-end lg:items-end items-center lg:flex-nowrap flex-wrap">
    <router-link class="hover:border-solid border-b-2 border-tertiaryColor border-dotted text-center place-content-center text-tertiaryColor" to="/podcast/submit">Submit new podcast</router-link>
    <router-link class="hover:border-solid border-b-2 border-tertiaryColor border-dotted text-center place-content-center text-tertiaryColor" to="/">Home</router-link>
    <router-link v-if="userStore.user?.permision_level == 'admin'" class="hover:border-solid border-b-2 border-tertiaryColor border-dotted text-center place-content-center text-tertiaryColor" to="/admin-dashboard">Admin Dashboard</router-link>
    <div class="lg:inline-flex flex lg:gap-x-3 place-content-center lg:flex-row flex-col gap-y-2 lg:gap-x-3 lg:gap-y-0">
      <router-link class="hover:border-solid border-b-2 border-tertiaryColor border-dotted text-center place-content-center text-tertiaryColor" to="/register">Register</router-link>
      <router-link class="hover:border-solid border-b-2 border-tertiaryColor border-dotted text-center text-tertiaryColor" v-if="userStore.user == null" to="/login">Login</router-link>
        <div v-else>
          <Dropdown title="Logout">
            <template #btn>
              <p class="border-b-2 border-tertiaryColor border-dotted text-center text-tertiaryColor">
                Account
              </p>
            </template>
            <template #menu>
              <ul class="text-white text-center w-24">
                <li>
                  <button @click="navToProfile">
                    Profile
                  </button>
                </li>
                <div class="flex justify-center">
                  <hr class="my-1 lg:my-2 w-3/4 lg:w-2/3 separator-col">
                </div>
                <li>
                  <button @click="logout">
                    Logout
                  </button>
                </li>
              </ul>
            </template>
          </Dropdown>
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