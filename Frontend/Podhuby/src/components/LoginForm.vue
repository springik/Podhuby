<template>
    <div>
        <h2 class="form-heading">Login</h2>
        <InputField v-model="userEmail" name="userEmail" label="Email" type="email" placeholder="gmail@gmail.com" />
        <InputField v-model="userName" name="userName" label="Username" type="text" placeholder="username" />
        <InputField v-model="userPassword" name="userPassword" label="Password" type="text" placeholder="he!w1af6" />
        <button @click="login" type="submit" class="submit-btn">Login</button>
    </div>
</template>

<script>
import InputField from './InputField.vue'
import axios from 'axios';
export default {
    name: 'LoginForm',
    components: { InputField },
    data() {
        return {
            userEmail: '',
            userName: '',
            userPassword: ''
        }
    },
    methods: {
        login() {
            console.log('clicked on login')
            
            axios.post('https://localhost:8080/login')
            .then(function(res) {
                console.log(res)
            })
            .catch(function(err) {
                console.log(err)
            })
        }
    }
}
</script>

<style>
h2.form-heading {
    font-family: 'Oswald', sans-serif;
    text-transform: uppercase;
    border-bottom: 1px dotted white;
    color: white;
}
button.submit-btn {
    font-family: 'Comfortaa', sans-serif;

    box-shadow: 4px 4px 0 0 var(--accent-color);
    background-color: black;
    color: white;
    border: none;
    padding: 10px;
    font-size: 14px;
    font-weight: 700;
    width: 5vw;
}
</style>