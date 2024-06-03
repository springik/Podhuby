<template>
  <form class="text-center h-screen text-white flex justify-center items-center flex-col gap-2" @submit.prevent="submit">
    <fieldset>
        <legend class="text-xl lg: text-3xl text-center mb-4">
            <p>
                Platform:
            </p>
        </legend>
        <div class="flex lg:flex-row flex-col justify-center items-center gap-4">
            <label class="hover-highlight rounded p-2" :class="{ 'bg-accentColor': platform == 'youtube' }" for="platform-ytb">
                <img class="w-28" src="/youtube-logo.png" alt="youtube choice">
            </label>
            <input class="w-0 h-0 opacity-0" type="radio" name="platform" id="platform-ytb" @change="handleChange" value="youtube">
            <label class="hover-highlight rounded p-2" :class="{ 'bg-accentColor': platform == 'spotify' }" for="platform-spotify">
                <img class="w-28" src="/spotify-logo.png" alt="spotify choice">
            </label>
            <input class="w-0 h-0 opacity-0" type="radio" name="platform" id="platform-spotify" @change="handleChange" value="spotify">
        </div>
    </fieldset>
    <div>
        <Youtube @onValidate="validateHandler" ref="youtube" v-if="platform == 'youtube'" />
        <Spotify @onValidate="validateHandler" ref="spotify" v-if="platform == 'spotify'" />

        <button v-if="platform != '' && isValid" :disabled="!isValid" class="submit-btn-min p-2" type="submit">
            Submit
        </button>
    </div>
  </form>
</template>

<script>
import axios from 'axios';
import Spotify from './Spotify.vue';
import Youtube from './Youtube.vue';
import { useToast } from 'vue-toastification';

export default {
    name: 'PodcastForm',
    components: { Youtube, Spotify },
    setup() {
        const toast = useToast()

        return {
            toast
        }
    },
    data() {
        return {
            platform: '',
            isValid: false
        }
    },
    methods: {
        async submit() {
            console.log('submiting...');
            let ref
            if(this.platform == 'youtube')
                ref = this.$refs.youtube
            if(this.platform == 'spotify')
                ref = this.$refs.spotify

            // I hate this so much, but it gets rid of the proxy wraping just in case axios acts weird
            const gen = JSON.parse(JSON.stringify(ref.genres))

            let data
            let url = ``
            if(this.platform == 'youtube') {
                url = `/api/podcasts/youtube/submit`
                data = {
                    channelHandle: ref.channelHandle,
                    genres: gen
                }
            }
            else if(this.platform == 'spotify') {
                url = `/api/podcasts/spotify/submit`
                data = {
                    podcastId: ref.channelHandle,
                    genres: gen
                }
            }
            console.log(data);

            try
            {
                axios.post(url, data, { header: { withCredentials: true } })
                this.toast.success('Successfully created podcast')

            }
            catch (err)
            {
                console.log(err);
                this.toast.error('Failed to submit podcast')

            }
        },
        handleChange(event) {
            console.log(event.target.value);
            this.platform = event.target.value
        },
        validateHandler() {
            if(this.platform == 'youtube')
                this.isValid = this.$refs.youtube.isValid
            else if(this.platform == 'spotify')
                this.isValid = this.$refs.spotify.isValid
        }
    }
}
</script>

<style src="../../styles/styles.css" scoped></style>