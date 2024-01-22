<template>
  <section class="navbar-placeholder">
    <router-link to="/login">Login</router-link>
    <router-link to="/">Home</router-link>
    <router-link to="/register">Register</router-link>
  </section>
</template>

<script>
export default {

}
</script>

<style scoped>
a {
    text-decoration: none;
    border-bottom: 2px dotted var(--tertiary-color);
    color: var(--tertiary-color);
 }
</style>