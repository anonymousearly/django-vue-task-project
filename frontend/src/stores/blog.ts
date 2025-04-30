import { defineStore } from 'pinia'
import axios from 'axios'

interface Author {
  id: number
  username: string
  email: string
}

interface Comment {
  id: number
  content: string
  author: Author
  created_at: string
  active: boolean
}

interface Post {
  id: number
  title: string
  slug: string
  content: string
  author: Author
  publish_date: string
  status: 'draft' | 'published'
  comments: Comment[]
}

interface BlogState {
  posts: Post[]
  currentPost: Post | null
  totalPosts: number
  currentPage: number
  pageSize: number
}

export const useBlogStore = defineStore('blog', {
  state: (): BlogState => ({
    posts: [],
    currentPost: null,
    totalPosts: 0,
    currentPage: 1,
    pageSize: 10,
  }),

  getters: {
    getPosts: (state) => state.posts,
    getCurrentPost: (state) => state.currentPost,
    getTotalPages: (state) => Math.ceil(state.totalPosts / state.pageSize),
  },

  actions: {
    async fetchPosts(page = 1, filters = {}) {
      try {
        const response = await axios.get('/api/blog/posts/', {
          params: {
            page,
            page_size: this.pageSize,
            ...filters,
          },
        })
        if (response.data.results) {
          // Handle paginated response
          this.posts = response.data.results
          this.totalPosts = response.data.count
        } else {
          // Handle non-paginated response
          this.posts = response.data
          this.totalPosts = response.data.length
        }
        this.currentPage = page
        return response
      } catch (error) {
        console.error('Error fetching posts:', error)
        throw error
      }
    },

    async createPost(postData: Partial<Post>) {
      try {
        const response = await axios.post('/api/blog/posts/', postData)
        await this.fetchPosts(this.currentPage)
        return response
      } catch (error) {
        console.error('Error creating post:', error)
        throw error
      }
    },

    async updatePost(postId: number, postData: Partial<Post>) {
      try {
        const response = await axios.patch(`/api/blog/posts/${postId}/`, postData)
        if (this.currentPost && this.currentPost.id === postId) {
          this.currentPost = response.data
        }
        await this.fetchPosts(this.currentPage)
        return response
      } catch (error) {
        console.error('Error updating post:', error)
        throw error
      }
    },

    async deletePost(postId: number) {
      try {
        await axios.delete(`/api/blog/posts/${postId}/`)
        if (this.currentPost && this.currentPost.id === postId) {
          this.currentPost = null
        }
        await this.fetchPosts(this.currentPage)
      } catch (error) {
        console.error('Error deleting post:', error)
        throw error
      }
    },

    async createComment(postId: number, content: string) {
      try {
        const response = await axios.post('/api/blog/comments/', {
          post: postId,
          content,
        })
        if (this.currentPost && this.currentPost.id === postId) {
          // Refetch post to get updated comments
          await this.fetchPost(postId)
        }
        return response
      } catch (error) {
        console.error('Error creating comment:', error)
        throw error
      }
    },

    async fetchPost(postId: number) {
      try {
        const response = await axios.get(`/api/blog/posts/${postId}/`)
        this.currentPost = response.data
        return response
      } catch (error) {
        console.error('Error fetching post:', error)
        throw error
      }
    },
  },
}) 