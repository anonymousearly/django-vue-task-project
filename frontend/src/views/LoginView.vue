<template>
  <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <router-link to="/register" class="font-medium text-primary-600 hover:text-primary-500">
          create a new account
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="username" class="form-label">Username or Email</label>
            <div class="mt-1">
              <input
                id="username"
                v-model="usernameOrEmail"
                type="text"
                required
                class="form-input"
                placeholder="Enter your username or email"
              />
            </div>
          </div>

          <div>
            <label for="password" class="form-label">Password</label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="form-input"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">{{ errorMessage }}</h3>
              </div>
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              class="w-full btn btn-primary flex justify-center items-center"
              :disabled="isLoading"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const usernameOrEmail = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  errorMessage.value = ''
  isLoading.value = true
  
  try {
    await authStore.login(usernameOrEmail.value, password.value)
    toast.success(`Welcome back, ${authStore.user?.first_name || authStore.user?.username}!`)
    const redirectPath = route.query.redirect as string || '/'
    router.push(redirectPath)
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || 'Invalid username/email or password'
    toast.error(errorMessage.value)
  } finally {
    isLoading.value = false
  }
}
</script> 