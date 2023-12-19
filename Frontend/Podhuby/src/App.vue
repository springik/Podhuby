<template>
<div>
  <div class=form-container>
    <LoginForm />
    <RegisterForm />
  </div>
</div>
 
</template>

<script>
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'

export default {
  name: 'App',
  components: { LoginForm, RegisterForm },
}
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400..700');
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700');
:root {
  --main-color: #181818;
  --accent-color: #631e8b;
  --on-fail: red;
  --on-success: #00ff19;
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

</style>
