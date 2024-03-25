import { defineStore } from "pinia";

export const usePodcastStore = defineStore('podcast-store', {
    state: () => ({
        podcasts: undefined
    }),
    actions: {
        init(podcasts) {
            this.podcasts = podcasts
        },
        addPodcast(podcast) {
            Array.isArray(this.podcasts) ? this.podcasts.push(podcast) : console.log("Podcasts isn't an array somehow");
        },
        removePodcastAt(index) {
            Array.isArray(this.podcasts) ? this.podcasts.splice(index, 1) : console.log("Podcasts isn't an array somehow");
        }
    }
})