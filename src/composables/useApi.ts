import { useQuery } from '@tanstack/vue-query';
import { apiService } from '@/api/service';
import { computed, ref } from 'vue';
import { Post } from '@/api/types';
import { useDataStore } from '@/stores/data';

export function useAppData() {
    const dataStore = useDataStore();
    const { data, isLoading, isError } = useQuery({
        queryKey: ['app-data'],
        queryFn: async () => {
            
            const [usersData, postsData] = await Promise.all([
                apiService.fetchUsers(),
                //API не возвращает пользователей внутри постов, нужно отдельно добавлять
                apiService.fetchPosts() as Promise<Post[]>
            ]);
            
            for(const post of postsData) dataStore.cachePost(post);
            for(const user of usersData) dataStore.cacheUser(user);
            
            return {
                users: usersData,
                posts: postsData
            };
        },
        staleTime: 10 * 60 * 1000,
    });

    return {
        users: computed(() => data.value?.users || []),
        posts: computed(() => data.value?.posts || []),
        isLoading,
        isError
    };
}

export function usePostsSearch() {
    const dataStore = useDataStore();
    const searchQuery = ref('');
  
    const { data: posts, isLoading, isError, refetch } = useQuery({
        queryKey: ['posts-search', searchQuery],
        queryFn: async () => {
            let posts = await apiService.fetchPosts({ 
                title: searchQuery.value 
            }) as Post[];
      
      
            // Связываем посты с пользователями из кеша
            posts = posts.map(post => {
                const user = dataStore.getUserById(post.userId)!;
                return {
                    ...post,
                    user
                };
            });
            
            for (const post of posts) dataStore.cachePost(post);
      
            return posts;
        },
        enabled: false,
    });

    const search = (query: string) => {
        searchQuery.value = query;
        refetch();
    };

    return {
        posts,
        isLoading,
        isError,
        search
    };
}