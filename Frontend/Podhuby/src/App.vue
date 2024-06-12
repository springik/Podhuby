<template>
<main>
  <Navbar />
  <router-view />
  <section class="footer-placeholder"></section>
</main>
 
</template>

<script>
import axios from 'axios'
import Navbar from "./components/Navbar.vue"
import { useUserStore } from './stores/userStore'

export default {
  name: 'App',
  components: { Navbar },
  setup() {
    const userStore = useUserStore()

    return {
      userStore
    }
  },
  mounted() {
    this.getCurrUser()
  },
  methods: {
    getCurrUser() {
      const url = `/api/users/current-user`

        axios.get(url, { withCredentials: true })
        .then((result) => {
          console.log('requested user');
          this.userStore.setUser(result.data)
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
}
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400..700');
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700');
:root {
  --main-color: #000000f2;
  --accent-color: #631e8b;
  --on-fail: red;
  --on-success: #00ff19;
  --tertiary-color: #d4c4fb;
  font-size: 16px;
}

body {
  font-family: 'Comfortaa', sans-serif;
  font-weight: 400;
  background-color: var(--main-color);
}

.form-container {
  width: 30vw;
  height: auto;
  margin-left: auto;
  margin-right: auto;
}
.footer-placeholder {
  height: 5rem;
}
.hover-highlight:hover {
    outline: 0.171rem dashed white;
    outline-offset: 0.3125rem;
}
button.hover-highlight:hover {
  outline-offset: 0.1rem;
}
</style>
