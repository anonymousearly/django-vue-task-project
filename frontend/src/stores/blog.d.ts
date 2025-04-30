import { Post, BlogState } from '@/types/blog';

declare module '@/stores/blog' {
  import { StoreDefinition } from 'pinia';

  interface Author {
    id: number;
    username: string;
    email: string;
  }

  interface Comment {
    id: number;
    content: string;
    author: Author;
    created_at: string;
    active: boolean;
  }

  export interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    author: Author;
    publish_date: string;
    status: 'draft' | 'published';
    comments: Comment[];
  }

  export interface BlogStore {
    posts: Post[];
    currentPost: Post | null;
    totalPosts: number;
    currentPage: number;
    pageSize: number;
    getPosts: () => Post[];
    getCurrentPost: () => Post | null;
    getTotalPages: () => number;
    fetchPosts: (page?: number, filters?: Record<string, any>) => Promise<any>;
    createPost: (postData: Partial<Post>) => Promise<any>;
    updatePost: (postId: number, postData: Partial<Post>) => Promise<any>;
    deletePost: (postId: number) => Promise<void>;
    createComment: (postId: number, content: string) => Promise<any>;
    fetchPost: (postId: number) => Promise<any>;
  }

  export const useBlogStore: StoreDefinition<string, BlogStore>;
}

export function useBlogStore(): {
  posts: Post[];
  currentPage: number;

  getTotalPages: number;

  fetchPosts: (page?: number) => Promise<void>;
  fetchPost: (id: number) => Promise<Post>;
  createPost: (postData: Partial<Post>) => Promise<Post>;
  updatePost: (id: number, postData: Partial<Post>) => Promise<Post>;
  deletePost: (id: number) => Promise<void>;
}; 