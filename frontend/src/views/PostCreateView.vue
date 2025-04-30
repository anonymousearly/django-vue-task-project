<template>
  <div class="max-w-3xl mx-auto">
    <div class="card">
      <div class="card-header">
        <h1 class="text-xl font-medium text-gray-900">Create New Post</h1>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="title" class="form-label">Title</label>
            <input 
              id="title" 
              v-model="postData.title" 
              type="text" 
              class="form-input" 
              required
            />
          </div>

          <div>
            <label for="content" class="form-label">Content</label>
            <textarea 
              id="content" 
              v-model="postData.content" 
              rows="10" 
              class="form-input" 
              required
            ></textarea>
          </div>

          <div>
            <label for="status" class="form-label">Status</label>
            <select id="status" v-model="postData.status" class="form-input">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div class="flex justify-end space-x-3">
            <router-link to="/posts" class="btn btn-secondary">
              Cancel
            </router-link>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              {{ submitting ? 'Creating...' : 'Create Post' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import { useToast } from 'vue-toastification'

const router = useRouter()
const blogStore = useBlogStore()
const toast = useToast()

const submitting = ref(false)
const postData = ref({
  title: '',
  content: '',
  status: 'published'
})

const handleSubmit = async () => {
  if (!postData.value.title.trim()) {
    toast.error('Title is required')
    return
  }
  
  if (!postData.value.content.trim()) {
    toast.error('Content is required')
    return
  }
  
  submitting.value = true
  
  try {
    const response = await blogStore.createPost({
      ...postData.value
    })
    
    toast.success('Post created successfully')
    router.push(`/posts/${response.data.id}`)
  } catch (error: any) {
    toast.error(error.response?.data?.detail || 'Error creating post')
  } finally {
    submitting.value = false
  }
}
</script> 