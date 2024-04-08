import { defineStore } from "pinia";

export const useUserStore = defineStore('user-store', {
    state: () => ({
        user: null
    }),
    actions: {
        setUser(user) {
            this.user = user
        }
    }
})