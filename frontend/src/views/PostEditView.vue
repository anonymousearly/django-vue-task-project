<template>
  <div class="max-w-3xl mx-auto">
    <div class="card">
      <div class="card-header">
        <h1 class="text-xl font-medium text-gray-900">Edit Post</h1>
      </div>
      <div v-if="loading" class="card-body">
        <div class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div class="h-10 bg-gray-200 rounded mb-6"></div>
          <div class="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div class="h-40 bg-gray-200 rounded mb-6"></div>
          <div class="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div class="h-10 bg-gray-200 rounded mb-6"></div>
          <div class="flex justify-end">
            <div class="h-10 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
      <div v-else-if="error">
        <NetworkError 
          :message="errorMessage" 
          @retry="loadPost" 
        />
      </div>
      <div v-else class="card-body">
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
              {{ submitting ? 'Updating...' : 'Update Post' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import NetworkError from '@/components/NetworkError.vue'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()
const authStore = useAuthStore()
const toast = useToast()

const loading = ref(true)
const error = ref(false)
const submitting = ref(false)
const errorMessage = ref('Failed to load post. Please try again.')

const postData = ref({
  title: '',
  content: '',
  status: 'published'
})

const handleSubmit = async () => {
  if (!blogStore.currentPost) return
  
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
    await blogStore.updatePost(blogStore.currentPost.id, {
      ...postData.value
    })
    
    toast.success('Post updated successfully')
    router.push(`/posts/${blogStore.currentPost.id}`)
  } catch (error: any) {
    toast.error(error.response?.data?.detail || 'Error updating post')
  } finally {
    submitting.value = false
  }
}

const canEdit = () => {
  const post = blogStore.currentPost
  if (!post || !authStore.isAuthenticated) return false
  return authStore.user?.id === post.author.id || authStore.isAdmin
}

const loadPost = async () => {
  const postId = parseInt(route.params.id as string)
  if (isNaN(postId)) {
    router.push('/posts')
    return
  }
  
  loading.value = true
  error.value = false
  
  try {
    await blogStore.fetchPost(postId)
    
    if (!blogStore.currentPost) {
      toast.error('Post not found')
      router.push('/posts')
      return
    }
    
    if (!canEdit()) {
      toast.error('You do not have permission to edit this post')
      router.push(`/posts/${postId}`)
      return
    }
    
    postData.value = {
      title: blogStore.currentPost.title,
      content: blogStore.currentPost.content,
      status: blogStore.currentPost.status
    }
  } catch (err) {
    error.value = true
    if (err instanceof Error) {
      errorMessage.value = `Failed to load post: ${err.message}`
    }
    toast.error('Error loading post')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPost()
})
</script> 