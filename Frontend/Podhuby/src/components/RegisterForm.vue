<template>
    <div>
        <h2 class="form-heading">Register</h2>
        <InputField name="userEmail" label="Email" type="email" placeholder="gmail@gmail.com" />
        <InputField name="userName" label="Username" type="text" placeholder="username" />
        <InputField name="userPassword" label="Password" type="text" placeholder="he!w1af6" />
        <button @click="testClick" type="submit" class="submit-btn">Register</button>
    </div>
</template>

<script>
import InputField from './InputField.vue'
export default {
    name: 'LoginForm',
    components: { InputField },
    methods: {
        testClick() {
            console.log("clicked");
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