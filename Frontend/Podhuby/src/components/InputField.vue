<template>
  <div>
    <label :for=name class="input-label">{{ label }}</label>
    <input class="input-field default-state" :type="type" value="" :name=name :placeholder=placeholder>
  </div>
</template>

<script>
export default {
    name: 'InputField',
    props: ['name', 'label', 'type', 'placeholder']
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