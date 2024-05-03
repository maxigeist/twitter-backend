import { CreatePostInputDTO, PostDTO } from '../dto';

export interface PostService {
  createPost: (userId: string, body: CreatePostInputDTO) => Promise<PostDTO>;
  deletePost: (userId: string, postId: string) => Promise<void>;
  getPost: (userId: string, postId: string) => Promise<PostDTO>;
  getLatestPosts: (userId: string, options: { limit?: number; before?: string; after?: string }) => Promise<PostDTO[]>;
  getPostsByAuthor: (userId: any, authorId: string) => Promise<PostDTO[]>;
  getById: (postId: string) => Promise<PostDTO | null>;
  getPostAuthorId: (postId: string) => Promise<string>;
}
