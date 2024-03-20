<template>
  <div class="dropdown">
    <button @click="toggle" class="btn">
      Account
    </button>
    <div v-if="show" class="dropdown-content">
      <ul>
        <li>
          <router-link to='/profile'>Profile</router-link>
        </li>
        <li>

        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Dropdown',
    data() {
      return {
        show: false
      }
    },
    methods: {
      toggle() {
        this.show = !this.show
      }
    }
}
</script>

<style>
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