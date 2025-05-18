import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Import base styles
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')