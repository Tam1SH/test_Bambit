import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { User, Post } from '@/api/types';

export const useDataStore = defineStore('data', () => {
    const users = ref<Record<number, User>>({});
    const posts = ref<Record<number, Post>>({});
    const viewedUsers = ref<Set<number>>(new Set());
  
    function cacheUser(userData: User) {
        users.value[userData.id] = userData;
    }
  
    function getCachedUserEmail(userId: number) {
        return users.value[userId]?.email;
    }
    
    function cachePost(postData: Post) {
        posts.value[postData.id] = postData;
    }
  
    function markUserAsViewed(userId: number) {
        viewedUsers.value.add(userId);
    }
    
    const isUserViewed = computed(() => (userId: number) => viewedUsers.value.has(userId));
  
    const getUserById = computed(() => (userId: number) => users.value[userId]);
  
    return {
        users,
        posts,
        viewedUsers,
        cacheUser,
        cachePost,
        markUserAsViewed,
        getCachedUserEmail,
        isUserViewed,
        getUserById
    };
}, {
    persist: {
        serializer: {
            deserialize: (json: string) => {
                const data = JSON.parse(json);
                if (data.viewedUsers && !Array.isArray(data.viewedUsers)) {
                    data.viewedUsers = [];
                }
                return {
                    users: data.users,
                    posts: data.posts,
                    viewedUsers: new Set(data.viewedUsers || [])
                };
            },
            serialize: (state: any) => {
                return JSON.stringify({
                    users: state.users,
                    posts: state.posts,
                    viewedUsers: [...state.viewedUsers]
                });
            }
        }
    }
});