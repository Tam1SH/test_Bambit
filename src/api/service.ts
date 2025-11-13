import type { User, Post } from '@/api/types';
import { UsersArraySchema, PostsArraySchema, PostSchema, UserSchema } from '@/api/validation';
import { z } from 'zod';
const BASE_URL = 'https://jsonplaceholder.typicode.com';

class ApiError extends Error {
    constructor(message: string, public status?: number) {
        super(message);
        this.name = 'ApiError';
    }
}

export class ApiService {
    private async fetchWithValidation<T>(
        url: string, 
        schema: z.ZodSchema<T>
    ): Promise<T> {
        const response = await fetch(url);
    
        if (!response.ok) {
            throw new ApiError(`HTTP Error: ${response.status}`, response.status);
        }
    
        const data = await response.json();
    
        try {
            return schema.parse(data);
        } catch {
            throw new ApiError('API Response validation failed');
        }
    }

    async fetchUsers(): Promise<User[]> {
        return this.fetchWithValidation(`${BASE_URL}/users`, UsersArraySchema);
    }
  
    async fetchPosts(params: { title?: string } = {}): Promise<Omit<Post, 'user'>[]> {
        const url = new URL(`${BASE_URL}/posts`);
    
        if (params.title) {
            url.searchParams.append('title_like', params.title);
        }
    
        return this.fetchWithValidation(url.toString(), PostsArraySchema);
    }
  
    async fetchPostById(id: number): Promise<Omit<Post, 'user'>> {
        return this.fetchWithValidation(`${BASE_URL}/posts/${id}`, PostSchema);
    }
  
    async fetchUserById(id: number): Promise<User> {
        return this.fetchWithValidation(`${BASE_URL}/users/${id}`, UserSchema);
    }
}

export const apiService = new ApiService();