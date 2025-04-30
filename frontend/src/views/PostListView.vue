<template>
  <div>
    <div class="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
      <h3 class="text-2xl leading-6 font-medium text-gray-900">Blog Posts</h3>
      <div class="mt-3 sm:mt-0 sm:ml-4">
        <router-link
          v-if="authStore.isAuthenticated"
          to="/posts/create"
          class="btn btn-primary"
        >
          Create New Post
        </router-link>
      </div>
    </div>

    <NetworkError 
      v-if="error" 
      :message="errorMessage" 
      @retry="fetchData" 
    />

    <div v-if="loading" class="mt-6 flex justify-center">
      <div class="animate-pulse text-center">
        <div class="h-4 w-32 bg-gray-200 rounded mb-6 mx-auto"></div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 3" :key="i" class="card overflow-hidden">
            <div class="p-6">
              <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div class="h-4 bg-gray-200 rounded mb-2"></div>
              <div class="h-4 bg-gray-200 rounded mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="blogStore.posts.length === 0 && !error" class="mt-6 text-center">
      <p class="text-gray-500">No posts found.</p>
    </div>

    <div v-else class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="post in blogStore.posts"
        :key="post.id"
        class="card overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <router-link :to="'/posts/' + post.id" class="block h-full">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-sm text-gray-500">
                    {{ new Date(post.publish_date).toLocaleDateString() }}
                  </p>
                </div>
                <div class="mt-2">
                  <div class="flex items-center justify-between">
                    <p class="text-xl font-semibold text-gray-900">{{ post.title }}</p>
                    <div v-if="isAuthor(post) || authStore.isAdmin" class="flex space-x-2 ml-2">
                      <router-link :to="`/posts/${post.id}/edit`" class="p-1 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </router-link>
                      <button 
                        @click.prevent="confirmDelete(post)" 
                        class="p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p class="mt-3 text-base text-gray-500 line-clamp-3">
                    {{ post.content }}
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-6 flex items-center">
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">
                  By {{ post.author.username }}
                </p>
                <div class="flex space-x-1 text-sm text-gray-500">
                  <span>{{ post.comments ? post.comments.length : 0 }} comments</span>
                </div>
              </div>
            </div>
          </div>
        </router-link>
      </article>
    </div>

    <div v-if="confirmingDelete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900">Confirm Delete</h3>
        <p class="mt-2 text-gray-500">Are you sure you want to delete this post? This action cannot be undone.</p>
        <div class="mt-4 flex justify-end space-x-3">
          <button @click="confirmingDelete = false" class="btn btn-secondary">Cancel</button>
          <button @click="handleDelete" class="btn bg-red-600 text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="blogStore.posts.length > 0 && totalPages > 1" class="mt-6 flex justify-center">
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <button
          @click="handlePageChange(blogStore.currentPage - 1)"
          :disabled="blogStore.currentPage === 1"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': blogStore.currentPage === 1 }"
        >
          Previous
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="handlePageChange(page)"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
          :class="page === blogStore.currentPage ? 'text-primary-600 border-primary-500' : 'text-gray-700 hover:bg-gray-50'"
        >
          {{ page }}
        </button>
        <button
          @click="handlePageChange(blogStore.currentPage + 1)"
          :disabled="blogStore.currentPage === totalPages"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': blogStore.currentPage === totalPages }"
        >
          Next
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBlogStore } from '@/stores/blog'
import { useToast } from 'vue-toastification'
import NetworkError from '@/components/NetworkError.vue'

// Interfaces
interface Author {
  id: number;
  username: string;
  email?: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: Author;
  publish_date: string;
  comments?: any[];
}

const authStore = useAuthStore()
const blogStore = useBlogStore()
const toast = useToast()

const loading = ref(true)
const error = ref(false)
const errorMessage = ref('Failed to load posts. Please try again.')
const confirmingDelete = ref(false)
const postToDelete = ref<Post | null>(null)

const totalPages = computed(() => blogStore.getTotalPages)

const isAuthor = (post: Post) => {
  return authStore.isAuthenticated && authStore.user?.id === post.author.id;
}

const confirmDelete = (post: Post) => {
  postToDelete.value = post;
  confirmingDelete.value = true;
}

const handleDelete = async () => {
  if (!postToDelete.value) return;
  
  try {
    await blogStore.deletePost(postToDelete.value.id);
    toast.success('Post deleted successfully');
    confirmingDelete.value = false;
    postToDelete.value = null;
  } catch (error) {
    toast.error('Failed to delete post');
  }
}

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    loading.value = true
    error.value = false
    blogStore.fetchPosts(page)
      .then(() => {
        loading.value = false
      })
      .catch(() => {
        loading.value = false
        error.value = true
      })
  }
}

const fetchData = async () => {
  loading.value = true
  error.value = false
  
  try {
    await blogStore.fetchPosts()
  } catch (err) {
    error.value = true
    if (err instanceof Error) {
      errorMessage.value = `Failed to load data: ${err.message}`
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script> 