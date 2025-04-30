<template>
  <div>
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h1 class="text-3xl font-bold text-gray-900">Welcome to the Blog</h1>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Discover the latest posts and join the conversation
        </p>
      </div>
    </div>

    <!-- Recent Posts Section -->
    <div class="mt-8">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900">Recent Posts</h2>
        <router-link to="/posts" class="text-primary-600 hover:text-primary-900">
          View all posts
        </router-link>
      </div>
      <div v-if="loading" class="mt-4 animate-pulse">
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
      <div v-else-if="error">
        <NetworkError 
          :message="errorMessage" 
          @retry="fetchData" 
        />
      </div>
      <div v-else-if="blogStore.posts.length === 0" class="mt-4 text-center py-10">
        <p class="text-gray-500">No posts found.</p>
      </div>
      <div v-else class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="post in blogStore.posts.slice(0, 3)"
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
                </div>
              </div>
            </div>
          </router-link>
        </article>
      </div>
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

    <!-- Call to Action -->
    <div class="mt-12 bg-primary-700 rounded-lg shadow-lg overflow-hidden">
      <div class="px-6 py-12 sm:px-12">
        <div class="lg:flex lg:items-center lg:justify-between">
          <div>
            <h2 class="text-2xl font-extrabold text-white sm:text-3xl">
              Ready to start blogging?
            </h2>
            <p class="mt-3 text-lg leading-6 text-primary-200">
              Create an account to start sharing your thoughts with the world.
            </p>
          </div>
          <div class="mt-8 lg:mt-0 lg:flex-shrink-0">
            <div class="flex space-x-4">
              <router-link 
                v-if="!authStore.isAuthenticated"
                to="/register" 
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-700 bg-white hover:bg-primary-50"
              >
                Sign up
              </router-link>
              <router-link 
                v-if="authStore.isAuthenticated"
                to="/posts/create" 
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-700 bg-white hover:bg-primary-50"
              >
                Create a post
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useBlogStore } from '@/stores/blog'
import { useAuthStore } from '@/stores/auth'
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

const blogStore = useBlogStore()
const authStore = useAuthStore()
const toast = useToast()

const loading = ref(true)
const error = ref(false)
const errorMessage = ref('Failed to load posts. Please try again.')
const confirmingDelete = ref(false)
const postToDelete = ref<Post | null>(null)

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
    // Refetch posts after deletion
    fetchData();
  } catch (error) {
    toast.error('Failed to delete post');
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