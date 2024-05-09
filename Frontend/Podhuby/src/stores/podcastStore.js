import { defineStore } from "pinia";

export const usePodcastStore = defineStore('podcast-store', {
    state: () => ({
        podcasts: []
    }),
    actions: {
        init(podcasts) {
            this.podcasts = this.podcasts.concat(podcasts)
        },
        addPodcast(podcast) {
            Array.isArray(this.podcasts) ? this.podcasts.push(podcast) : console.log("Podcasts isn't an array somehow");
        },
        removePodcastAt(index) {
            Array.isArray(this.podcasts) ? this.podcasts.splice(index, 1) : console.log("Podcasts isn't an array somehow");
        }
    },
    getters: {
        getByName: (state) => {
            return (name) => {
                if(state.podcasts.length > 0)
                    state.podcasts.find((podcast) => podcast.title === name)
                else
                    return null
            }
        }
    }
})