<template>
    <div>
        <InputField @onValidate="handleValidation" ref="handleInput" name="podcast-id-input" label="Podcast Id" type="text" placeholder="01VLhetHCoW2FyhFIeE56m" :pattern="channelHandleRegex" :errmsg="channelHandleErrMsg"/>
        <ListInput ref="genres" class="mb-3" label="Genres" placeholder="Technology" @itemChange="handleGenresChanged"/>
    </div>
</template>

<script>
import InputField from '../InputField.vue'
import ListInput from '../ListInput.vue'

export default {
    name: 'Spotify',
    components: { InputField, ListInput },
    emits: ['onValidate'],
    data() {
        return {
            channelHandleRegex: '^[\\w]+$',
            channelHandleErrMsg: 'This must be a spotify show id',
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