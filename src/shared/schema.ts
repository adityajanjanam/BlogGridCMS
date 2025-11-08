export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  published: boolean;
  authorId: number;
  coverImage?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  views?: number;
  likes?: number;
}

export interface Comment {
  id: number;
  content: string;
  authorName: string;
  authorAvatar?: string;
  postId: number;
  createdAt?: string | Date;
  likes?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}