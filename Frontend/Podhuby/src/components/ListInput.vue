<template>
    <div>
        <InputField ref="itemInput" name="item-input" :label="label" type="text" :placeholder="placeholder" :pattern="regex" :errmsg="errMsg"/>
        <button type="button" class="submit-btn-min p-2" @click="addItem">
            Add
        </button>

        <ul v-if="this.items.length > 0" class="rounded bg-accentColor p-1 my-4">
            <li v-for="(item, index) in items" :key="index" :value="item">
                <p class="text-center capitalize flex justify-center items-center">
                    {{ item }}
                    <button @click="removeItem(index)">
                        <img class="w-6 h-6" src="/cross.png" alt="remove">
                    </button>
                </p>
            </li>
        </ul>
    </div>
</template>

<script>
import InputField from './InputField.vue'

export default {
    name: 'ListInput',
    components: { InputField },
    props: ['label', 'placeholder'],
    emits: ['itemChange'],
    data() {
        return {
            regex: /^\w+$/,
            errMsg: 'Must be alphanumeric characters',
            items: []
        }
    },
    methods: {
        addItem() {
            this.items.push(this.$refs.itemInput.input)
            this.$emit('itemChange', this.items)
        },
        removeItem(index) {
            this.items = this.items.filter((item, itemIndex) => itemIndex !== index)
            this.$emit('itemChange', this.items)
        }
    }
}
</script>

<style src="../styles/styles.css" scoped></style>