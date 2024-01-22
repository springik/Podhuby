<template>
    <div class="form-container">
        <h2 class="form-heading">Login</h2>
        <InputField @onValidate="validationHandler" ref="email" name="userEmail" label="Email" type="email" placeholder="gmail@gmail.com" :pattern="emailRegex" errmsg="Enter a valid email address!" />
        <InputField @onValidate="validationHandler" ref="password" name="userPassword" label="Password" type="password" placeholder="he!w1Af6" :pattern="passwordRegex" errmsg="A password can only be alphanumeric and between 6 to 22 characters!" />
        <span v-show="results.message !== ''" class="result-msg"> {{ results.message }} </span>
        <button :disabled="isValid === 'false'" @click="login" type="submit" class="submit-btn hover-highlight">Login</button>
        <!-- <router-link class="form-other" to="/register">Register</router-link> -->
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
            results: [],
            userEmail: '',
            userPassword: '',
            isValid: 'false',
            emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            passwordRegex: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,22}$/
        }
    },
    methods: {
        login() {
            console.log('clicked on login')
            this.userEmail = this.$refs.email.input
            this.userPassword = this.$refs.password.input

            if(!this.userEmail || !this.userPassword) {
                return
            }
            const formData = {
                userEmail: this.userEmail,
                userPassword:this.userPassword
            }
            
            axios.post('/login', formData, {headers: {'Content-Type': 'application/x-www-form-urlencoded', withCredentials: true}, baseURL: '/users'})
            .then((res) => {
                if(res.status == 200)
                    this.$router.push('/')
                this.results = res.data
            })
            .catch((err) => {
                console.log(err);
            })
        },
        validationHandler() {
            if(this.$refs.email.isValid === true && this.$refs.password.isValid === true) {
                this.isValid = 'true';
            }
            else {
                this.isValid = 'false';
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
    margin-top: 20px;
}
span.result-msg {
    color: var(--accent-color);
    border-bottom: 1px dotted var(--accent-color);
    display: block;
}
a.form-other {
    margin-left: 20px;
    text-decoration: none;
    border-bottom: 2px dotted var(--tertiary-color);
    color: var(--tertiary-color);
}
</style>