<template>
  <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a new account</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
          sign in to your account
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="first_name" class="form-label">First Name</label>
              <div class="mt-1">
                <input
                  id="first_name"
                  v-model="firstName"
                  type="text"
                  required
                  class="form-input"
                  placeholder="John"
                />
              </div>
            </div>

            <div>
              <label for="last_name" class="form-label">Last Name</label>
              <div class="mt-1">
                <input
                  id="last_name"
                  v-model="lastName"
                  type="text"
                  required
                  class="form-input"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          <div>
            <label for="username" class="form-label">Username</label>
            <div class="mt-1">
              <input
                id="username"
                v-model="username"
                type="text"
                required
                class="form-input"
                placeholder="johndoe"
              />
            </div>
          </div>

          <div>
            <label for="email" class="form-label">Email address</label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="form-input"
                placeholder="john.doe@example.com"
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
                placeholder="Choose a secure password"
              />
            </div>
          </div>

          <div>
            <label for="password2" class="form-label">Confirm Password</label>
            <div class="mt-1">
              <input
                id="password2"
                v-model="password2"
                type="password"
                required
                class="form-input"
                placeholder="Confirm your password"
              />
            </div>
            <p v-if="passwordMismatch" class="mt-1 text-sm text-red-600">
              Passwords do not match
            </p>
          </div>

          <div v-if="Object.keys(formErrors).length > 0" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Please correct the following errors:</h3>
                <div class="mt-2 text-sm text-red-700">
                  <ul class="list-disc pl-5 space-y-1">
                    <li v-for="(errorMessages, field) in formErrors" :key="field">
                      {{ field }}: {{ Array.isArray(errorMessages) ? errorMessages.join(', ') : errorMessages }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              class="w-full btn btn-primary flex justify-center items-center"
              :disabled="isLoading || passwordMismatch"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Registering...' : 'Register' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const username = ref('')
const email = ref('')
const password = ref('')
const password2 = ref('')
const firstName = ref('')
const lastName = ref('')
const formErrors = ref<Record<string, string | string[]>>({})
const isLoading = ref(false)

const passwordMismatch = computed(() => {
  return password.value && password2.value && password.value !== password2.value
})

const handleSubmit = async () => {
  if (passwordMismatch.value) return

  formErrors.value = {}
  isLoading.value = true
  
  try {
    await authStore.register(
      email.value,
      username.value,
      password.value,
      password2.value,
      firstName.value,
      lastName.value
    )
    toast.success('Registered successfully! Please log in.')
    router.push('/login')
  } catch (error: any) {
    const errors = error.response?.data
    if (typeof errors === 'object') {
      formErrors.value = errors
      Object.entries(errors).forEach(([field, messages]) => {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')
        toast.error(`${fieldName}: ${messages}`)
      })
    } else {
      toast.error('Error registering. Please try again.')
    }
  } finally {
    isLoading.value = false
  }
}
</script> 