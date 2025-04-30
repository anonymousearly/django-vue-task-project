<template>
  <div v-if="blogStore.currentPost" class="max-w-3xl mx-auto">
    <article class="card">
      <div class="card-header">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ blogStore.currentPost.title }}
            </h1>
            <div class="mt-2 flex items-center">
              <p class="text-sm text-gray-500">
                By {{ blogStore.currentPost.author.username }} on
                {{ new Date(blogStore.currentPost.publish_date).toLocaleDateString() }}
              </p>
            </div>
          </div>
          <div v-if="canEdit" class="flex space-x-2">
            <router-link
              :to="'/posts/' + blogStore.currentPost.id + '/edit'"
              class="btn btn-secondary"
            >
              Edit
            </router-link>
            <button @click="handleDelete" class="btn bg-red-100 text-red-700 hover:bg-red-200">
              Delete
            </button>
          </div>
        </div>
      </div>
      <div class="card-body prose max-w-none">
        {{ blogStore.currentPost.content }}
      </div>
    </article>

    <!-- Comments Section -->
    <section class="mt-8">
      <div class="card">
        <div class="card-header">
          <h2 class="text-lg font-medium text-gray-900">Comments</h2>
        </div>
        <div class="card-body divide-y divide-gray-200">
          <div v-if="authStore.isAuthenticated" class="pb-6">
            <form @submit.prevent="handleCommentSubmit">
              <div>
                <label for="comment" class="sr-only">Comment</label>
                <textarea
                  id="comment"
                  v-model="newComment"
                  rows="3"
                  class="form-input"
                  placeholder="Leave a comment..."
                ></textarea>
              </div>
              <div class="mt-2 flex justify-end">
                <button type="submit" class="btn btn-primary">
                  Post Comment
                </button>
              </div>
            </form>
          </div>
          <div v-else class="pb-6">
            <p class="text-sm text-gray-500">
              Please
              <router-link to="/login" class="text-primary-600 hover:text-primary-500">
                sign in
              </router-link>
              to leave a comment.
            </p>
          </div>
          <div v-if="blogStore.currentPost.comments && blogStore.currentPost.comments.length === 0" class="py-6 text-center">
            <p class="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
          <div v-for="comment in blogStore.currentPost.comments" :key="comment.id" class="py-6">
            <div class="flex space-x-3">
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-medium text-gray-900">
                    {{ comment.author.username }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    {{ new Date(comment.created_at).toLocaleDateString() }}
                  </p>
                </div>
                <div class="mt-2 text-sm text-gray-700">
                  <p>{{ comment.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div v-else-if="loading" class="max-w-3xl mx-auto">
    <div class="animate-pulse">
      <div class="card">
        <div class="card-header">
          <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div class="card-body">
          <div class="h-4 bg-gray-200 rounded mb-4"></div>
          <div class="h-4 bg-gray-200 rounded mb-4"></div>
          <div class="h-4 bg-gray-200 rounded mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="error" class="max-w-3xl mx-auto">
    <NetworkError 
      :message="errorMessage" 
      @retry="loadPost" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBlogStore } from '@/stores/blog'
import { useToast } from 'vue-toastification'
import NetworkError from '@/components/NetworkError.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const blogStore = useBlogStore()
const toast = useToast()

const newComment = ref('')
const loading = ref(true)
const error = ref(false)
const errorMessage = ref('Failed to load post. Please try again.')

const canEdit = computed(() => {
  const post = blogStore.currentPost
  if (!post || !authStore.isAuthenticated) return false
  return authStore.user?.id === post.author.id || authStore.isAdmin
})

const handleCommentSubmit = async () => {
  if (!blogStore.currentPost) return
  
  if (!newComment.value.trim()) {
    toast.error('Comment cannot be empty')
    return
  }

  try {
    await blogStore.createComment(blogStore.currentPost.id, newComment.value)
    newComment.value = ''
    toast.success('Comment posted successfully')
  } catch (error) {
    toast.error('Error posting comment')
  }
}

const handleDelete = async () => {
  if (!blogStore.currentPost) return

  if (confirm('Are you sure you want to delete this post?')) {
    try {
      await blogStore.deletePost(blogStore.currentPost.id)
      toast.success('Post deleted successfully')
      router.push('/posts')
    } catch (error) {
      toast.error('Error deleting post')
    }
  }
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