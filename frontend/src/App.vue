<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-xl font-bold text-primary-600">Blog</router-link>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                to="/posts"
                class="border-transparent text-gray-500 hover:border-primary-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Posts
              </router-link>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <template v-if="authStore.isAuthenticated">
              <div class="mr-3 text-sm font-medium text-gray-700">
                Welcome, <span class="font-semibold text-primary-600">{{ authStore.user?.username }}</span>
              </div>
              <router-link
                to="/posts/create"
                class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                New Post
              </router-link>
              <button
                @click="handleLogout"
                class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Logout
              </button>
            </template>
            <template v-else>
              <router-link
                to="/login"
                class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Login
              </router-link>
              <router-link
                to="/register"
                class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Register
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

onMounted(() => {
  authStore.initializeAuth()
})

const handleLogout = async () => {
  try {
    await authStore.logout()
    toast.success('Logged out successfully')
    router.push('/login')
  } catch (error) {
    toast.error('Error logging out')
  }
}
</script>

<style>
@import '@/assets/main.css';
</style>
