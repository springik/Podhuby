import { defineStore } from "pinia";

export const useUserStore = defineStore('user-store', {
    state: () => ({
        user: null
    }),
    actions: {
        setUser(user) {
            this.user = user
        },
        logout() {
            this.user = null
        }
    },
    getters: {
        getPermisionLevel: (state) => {
            return (level) => {
                if(!state.user)
                    return false

                return state.user.permision_level === level
            }
        }
    }
})