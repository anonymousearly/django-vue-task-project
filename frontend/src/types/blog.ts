export interface Author {
  id: number;
  username: string;
  email?: string;
}

export interface Comment {
  id: number;
  content: string;
  author: Author;
  created_at: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: Author;
  publish_date: string;
  comments?: Comment[];
}

export interface BlogState {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  postsPerPage: number;
} 