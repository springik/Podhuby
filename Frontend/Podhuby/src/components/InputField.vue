<template>
  <div class="input-container">
    <label :for=name class="input-label">{{ label }}</label>
    <input
    :class="{ 'success-state': isValid, 'error-state': !isValid && inputed }"
    @input="validate" v-model=input
    class="w-96 input-field default-state text-black"
    :type="type" value="" :name=name :placeholder=placeholder
    >
    <span v-show="!isValid && inputed" class="err-msg w-96 block">
      {{ errmsg }}
    </span>
  </div>
</template>

<script>
export default {
    name: 'InputField',
    props: ['name', 'label', 'type', 'placeholder', 'pattern', 'errmsg'],
    data() {
      return {
         input: '',
         isValid: false,
         inputed: false
      }
    },
    methods: {
      validate(event) {
         if(event.target.value === '')
            this.inputed = false
         this.inputed = true
         if(event.target.value.match(this.pattern) === null) {
            this.isValid = false
         }
         else {
            this.isValid = true
         }
         this.$emit('onValidate', this.isValid)
      }
    }
}
</script>
<style src="../styles/styles.css" scoped></style>
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
 input.error-state {
    box-shadow: 6px 6px 0 0 var(--on-fail);
 }
 input.success-state {
    box-shadow: 6px 6px 0 0 var(--on-success);
 }
span.err-msg {
   color: var(--on-fail);
   border-bottom: 2px dotted var(--on-fail);
}
div.input-container {
   margin-bottom: 10px;
}
</style>