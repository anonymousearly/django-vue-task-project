import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './assets/main.css'

import App from './App.vue'
import router from './router'
import axios from 'axios'

// Configure axios
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Token ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error)
    if (error.response) {
      // Server responded with error status
      console.error('Status:', error.response.status)
      console.error('Data:', error.response.data)
      console.error('Headers:', error.response.headers)
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request)
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message)
    }
    return Promise.reject(error)
  }
)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast, {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 20,
  newestOnTop: true,
})

app.mount('#app')
