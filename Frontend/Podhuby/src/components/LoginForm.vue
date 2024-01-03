<template>
    <div>
        <h2 class="form-heading">Login</h2>
        <InputField @onValidate="validationHandler" ref="email" name="userEmail" label="Email" type="email" placeholder="gmail@gmail.com" :pattern="emailRegex" />
        <InputField @onValidate="validationHandler" ref="name" name="userName" label="Username" type="text" placeholder="username" :pattern="nameRegex" />
        <InputField @onValidate="validationHandler" ref="password" name="userPassword" label="Password" type="text" placeholder="he!w1Af6" :pattern="passwordRegex" />
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
            userEmail: '',
            userName: '',
            userPassword: '',
            isValid: 'false',
            emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            nameRegex: /^[a-zA-Z0-9_]{4,12}$/,
            passwordRegex: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/
        }
    },
    methods: {
        login() {
            console.log('clicked on login')
            this.userEmail = this.$refs.email.value
            this.userName = this.$refs.name.value
            this.userPassword = this.$refs.password.value
            
            axios.post('/login', {userEmail: this.userEmail, userName: this.userName, userPassword: this.userPassword}, {headers: {'Content-Type': 'application/x-www-form-urlencoded', withCredentials: true}, baseURL: '/users'})
            .then(function(res) {
                console.log(res)
            })
            .catch(function(err) {
                console.log(err)
            })
        },
        validationHandler() {
            console.log(this.$refs.email.isValid);
            console.log(this.$refs.name.isValid);
            console.log(this.$refs.password.isValid);
            if(this.$refs.email.isValid === true && this.$refs.name.isValid === true && this.$refs.password.isValid === true) {
                this.isValid = 'true';
                console.log("input is valid");
            }
            else {
                this.isValid = 'false';
                console.log("input is invalid");
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