<template>
    <div>
        <h2 class="form-heading">Login</h2>
        <InputField @onValidate="validationHandler" ref="email" name="userEmail" label="Email" type="email" placeholder="gmail@gmail.com" />
        <InputField @onValidate="validationHandler" ref="name" name="userName" label="Username" type="text" placeholder="username" />
        <InputField @onValidate="validationHandler" ref="password" name="userPassword" label="Password" type="text" placeholder="he!w1af6" />
        <button :disabled="isValid === 'false'" @click="login" type="submit" class="submit-btn">Login</button>
    </div>
</template>

<script>
import InputField from './InputField.vue'
import axios from 'axios';
export default {
    name: 'LoginForm',
    components: { InputField },
    mounted() {
        console.log(this.$refs.email);
    },
    data() {
        return {
            userEmail: 'me@gmail.com',
            userName: 'me',
            userPassword: 'password123',
            isValid: 'false',
        }
    },
    methods: {
        login() {
            console.log('clicked on login')
            
            axios.post('/login', {userEmail: this.userEmail, userName: this.userName, userPassword: this.userPassword}, {headers: {'Content-Type': 'application/x-www-form-urlencoded', withCredentials: true}, baseURL: '/users'})
            .then(function(res) {
                console.log(res)
            })
            .catch(function(err) {
                console.log(err)
            })
        },
        validationHandler(isValid) {
            this.isValid = isValid
            if(this.$refs.email.isValid === 'true') {
                console.log("input is valid");
            }
            else {
                console.log("input is invalid");
                console.log(this.isValid);
            }
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