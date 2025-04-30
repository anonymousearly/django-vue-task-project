import { defineStore } from 'pinia'
import axios from 'axios'

interface User {
  id: number
  username: string
  email: string
  is_staff?: boolean
  first_name?: string
  last_name?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isAdmin: (state) => state.user?.is_staff || false,
  },

  actions: {
    async register(
      email: string, 
      username: string, 
      password: string, 
      password2: string, 
      first_name: string, 
      last_name: string
    ) {
      try {
        const response = await axios.post('/api/auth/register/', {
          email,
          username,
          password,
          password2,
          first_name,
          last_name
        })
        // Don't automatically log in after registration
        // Just return the response so the user can be redirected to login
        return response
      } catch (error) {
        throw error
      }
    },

    async login(username: string, password: string) {
      try {
        // Ensure the Authorization header is not set for login
        delete axios.defaults.headers.common['Authorization']
        
        const response = await axios.post('/api/auth/login/', {
          username,
          password,
        })
        this.token = response.data.token
        this.user = response.data.user
        this.isAuthenticated = true
        localStorage.setItem('token', response.data.token)
        
        // Set authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`
        
        return response
      } catch (error) {
        throw error
      }
    },

    async logout() {
      try {
        // Need Authorization header for this request
        if (this.token) {
          axios.defaults.headers.common['Authorization'] = `Token ${this.token}`
        }
        
        await axios.post('/api/auth/logout/')
        
        // Clear auth data after successful logout
        this.token = null
        this.user = null
        this.isAuthenticated = false
        localStorage.removeItem('token')
        
        // Remove authorization header
        delete axios.defaults.headers.common['Authorization']
      } catch (error) {
        throw error
      }
    },

    async fetchUser() {
      try {
        // Ensure the Authorization header is set
        if (this.token) {
          axios.defaults.headers.common['Authorization'] = `Token ${this.token}`
        }
        
        const response = await axios.get('/api/auth/profile/')
        this.user = response.data
        this.isAuthenticated = true
        return response
      } catch (error) {
        this.token = null
        this.user = null
        this.isAuthenticated = false
        localStorage.removeItem('token')
        
        // Remove authorization header on error
        delete axios.defaults.headers.common['Authorization']
        
        throw error
      }
    },

    initializeAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        axios.defaults.headers.common['Authorization'] = `Token ${token}`
        this.fetchUser()
          .catch(() => {
            // If fetching user fails, clear auth data
            this.token = null
            this.isAuthenticated = false
            localStorage.removeItem('token')
            delete axios.defaults.headers.common['Authorization']
          })
      }
    },
  },
}) 