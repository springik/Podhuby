<template>
  <div>
    <label :for=name class="input-label">{{ label }}</label>
    <input @input="validate" v-model=input class="input-field default-state" :type="type" value="" :name=name :placeholder=placeholder>
    <span class="err-msg"></span>
  </div>
</template>

<script>
export default {
    name: 'InputField',
    props: ['name', 'label', 'type', 'placeholder', 'pattern'],
    data() {
      return {
         input: '',
         isValid: false
      }
    },
    methods: {
      validate(event) {
         console.log(this.pattern);
         console.log(event.target.value.match(this.pattern))
         if(event.target.value.match(this.pattern) === null) {
            this.isValid = false
         }
         else {
            this.isValid = true
         }
         this.$emit('onValidate')
      }
    }
}
</script>

<style>
 label.input-label {
    display: block;
    color: white;
    font-family: 'Comfortaa', sans-serif;
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 5px;
 }
 input.input-field {
    border-radius: 0%;
    font-size: 16px;
    width: 100%;
    height: auto;
    border: none;
    background-color: white;
    margin-bottom: 10px;
    padding: 10px;
    box-sizing: border-box;
 }
 input.default-state {
    box-shadow: 6px 6px 0 0 var(--accent-color);
 }
</style>