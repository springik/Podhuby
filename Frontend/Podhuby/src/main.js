import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast, { POSITION } from 'vue-toastification'
import "vue-toastification/dist/index.css"
import App from './App.vue'
import router from './router'

const app = createApp(App).use(router).use(createPinia()).use(Toast, { position: POSITION.BOTTOM_RIGHT })
app.mount('#app')
