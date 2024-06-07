<template>
    <div>
        <InputField @onValidate="handleValidation" ref="handleInput" name="channel-handle-input" label="Channel Handle" type="text" placeholder="@ChannelHandle" :pattern="channelHandleRegex" :errmsg="channelHandleErrMsg"/>
        <ListInput ref="genres" class="mb-3" label="Genres" placeholder="Technology" @itemChange="handleGenresChanged"/>
    </div>
</template>

<script>
import InputField from '../InputField.vue'
import ListInput from '../ListInput.vue'

export default {
    name: 'Youtube',
    components: { InputField, ListInput },
    emits: ['onValidate'],
    data() {
        return {
            channelHandleRegex: '^@[\\w-]+$',
            channelHandleErrMsg: 'This must be a youtube channel handle (starts with @)',
            isValid: false
        }
    },
    methods: {
        handleGenresChanged(genres) {
            this.genres = genres
        },
        handleValidation(isValid) {
            this.isValid = isValid
            this.$emit('onValidate')
        }
    },
    computed: {
        channelHandle() {
            return this.$refs.handleInput.input
        }
    }
}
</script>

<style src="../../styles/styles.css" scoped></style>