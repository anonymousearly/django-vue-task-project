<template>
  <div>
    <div class="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
      <h3 class="text-2xl leading-6 font-medium text-gray-900">Categories</h3>
    </div>

    <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="category in blogStore.categories" :key="category.id" class="card overflow-hidden">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900">{{ category.name }}</h3>
          <p class="mt-1 text-sm text-gray-500">{{ category.slug }}</p>
        </div>
      </div>
    </div>

    <!-- Add New Category (only for authenticated users) -->
    <div v-if="authStore.isAuthenticated" class="mt-8">
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900">Add New Category</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label for="name" class="form-label">Category Name</label>
              <input 
                id="name" 
                v-model="categoryData.name" 
                type="text" 
                class="form-input" 
                required
              />
            </div>

            <div class="flex justify-end">
              <button type="submit" class="btn btn-primary">
                Create Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBlogStore } from '@/stores/blog'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const blogStore = useBlogStore()
const authStore = useAuthStore()
const toast = useToast()

const categoryData = ref({
  name: ''
})

const handleSubmit = async () => {
  try {
    await blogStore.createCategory({
      name: categoryData.value.name
    })
    
    categoryData.value.name = ''
    toast.success('Category created successfully')
  } catch (error: any) {
    toast.error(error.response?.data?.detail || 'Error creating category')
  }
}

onMounted(async () => {
  await blogStore.fetchCategories()
})
</script> 