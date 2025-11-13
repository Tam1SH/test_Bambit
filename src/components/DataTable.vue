<template>
    <div class="w-[600px] h-[600px] mx-auto border rounded-lg overflow-hidden bg-background">
        <!-- Шапка таблицы -->
        <div class="bg-muted sticky top-0 z-10">
            <div class="grid grid-cols-[50px_1fr_150px_200px] gap-4 p-4 border-b font-semibold">
                <div 
                    class="cursor-pointer hover:text-primary flex items-center gap-1"
                    @click="sortBy('id')"
                >
                    ID
                    <Icon 
                        v-if="sortConfig.key === 'id'" 
                        :icon="sortConfig.direction === 'asc' ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
                        class="w-4 h-4" 
                    />
                    <Icon 
                        v-else 
                        icon="mdi:unfold-more-horizontal" 
                        class="w-4 h-4 opacity-30" 
                    />
                </div>
                <div 
                    class="cursor-pointer hover:text-primary flex items-center gap-1"
                    @click="sortBy('title')"
                >
                    Заголовок
                    <Icon 
                        v-if="sortConfig.key === 'title'" 
                        :icon="sortConfig.direction === 'asc' ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
                        class="w-4 h-4" 
                    />
                    <Icon 
                        v-else 
                        icon="mdi:unfold-more-horizontal" 
                        class="w-4 h-4 opacity-30" 
                    />
                </div>
                <div 
                    class="cursor-pointer hover:text-primary flex items-center gap-1"
                    @click="sortBy('email')"
                >
                    Автор
                    <Icon 
                        v-if="sortConfig.key === 'email'" 
                        :icon="sortConfig.direction === 'asc' ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
                        class="w-4 h-4" 
                    />
                    <Icon 
                        v-else 
                        icon="mdi:unfold-more-horizontal" 
                        class="w-4 h-4 opacity-30" 
                    />
                </div>
                <div 
                    class="cursor-pointer hover:text-primary flex items-center gap-1"
                    @click="sortBy('body')"
                >
                    Контент
                    <Icon 
                        v-if="sortConfig.key === 'body'" 
                        :icon="sortConfig.direction === 'asc' ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
                        class="w-4 h-4" 
                    />
                    <Icon 
                        v-else 
                        icon="mdi:unfold-more-horizontal" 
                        class="w-4 h-4 opacity-30" 
                    />
                </div>
            </div>
        </div>

        <!-- Тело таблицы -->
        <div 
            ref="scrollContainer"
            class="h-[552px] overflow-y-auto"
            @scroll="handleScroll"
        >
            <div
                v-if="isLoading"
                class="p-4"
            >
                <TableSkeleton />
            </div>
            
            <div
                v-else-if="isError"
                class="p-4 text-center text-destructive"
            >
                Ошибка загрузки данных
            </div>
            
            <div
                v-else-if="sortedPosts.length === 0"
                class="p-4 text-center text-muted-foreground"
            >
                Нет данных для отображения
            </div>

            <div v-else>
                <div
                    v-for="post in visiblePosts"
                    :key="post.id"
                    class="grid grid-cols-[50px_1fr_150px_200px] gap-4 p-4 border-b hover:bg-muted/50 transition-colors"
                >
                    <!-- ID -->
                    <div class="text-sm text-muted-foreground">
                        {{ post.id }}
                    </div>
                    
                    <!-- Заголовок -->
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <div class="text-sm truncate">
                                    {{ post.title }}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p class="max-w-xs">
                                    {{ post.title }}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    
                    <!-- Автор (Email) -->
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <div 
                                    class="text-sm truncate cursor-pointer hover:text-primary transition-colors"
                                    :class="{
                                        'font-medium text-blue-900': isUserViewed(post.userId)
                                    }"
                                    @click="openUserModal(post.userId)"
                                >
                                    {{ getUserEmail(post.userId) }}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Кликните для просмотра профиля</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    
                    <!-- Контент -->
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <div class="text-sm truncate">
                                    {{ post.body }}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p class="max-w-xs">
                                    {{ post.body }}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                
                <!-- Индикатор загрузки -->
                <div
                    v-if="isLoadingMore"
                    class="p-4 text-center"
                >
                    <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useAppData } from '@/composables/useApi';
import { useDataStore } from '@/stores/data';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import TableSkeleton from '@/components/TableSkeleton.vue';
import type { Post, User } from '@/api/types';

interface Props {
    posts?: Post[]
    searchQuery?: string // Передаем чтобы знать идет поиск или нет
}

const props = defineProps<Props>();

// Просто используем переданные посты
const posts = computed(() => props.posts || []);


const { users, isLoading, isError } = useAppData();

const dataStore = useDataStore();

// Сортировка
interface SortConfig {
    key: Exclude<keyof Post, 'user'> | 'email'
    direction: 'asc' | 'desc'
}

const sortConfig = ref<SortConfig>({ key: 'id', direction: 'asc' });

function sortBy(key: SortConfig['key']) {
    if (sortConfig.value.key === key) {
        sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc';
    } else {
        sortConfig.value.key = key;
        sortConfig.value.direction = 'asc';
    }
}

// Отсортированные посты
const sortedPosts = computed(() => {
    if (!posts.value) return [];
    return posts.value.toSorted((a, b) => {
        let aValue: string | number | User | undefined;
        let bValue: string | number | User | undefined;
        
        // Специальная логика для email
        if (sortConfig.value.key === 'email') {
            aValue = dataStore.getCachedUserEmail(a.userId) || '';
            bValue = dataStore.getCachedUserEmail(b.userId) || '';
        }
        else {
            bValue = b[sortConfig.value.key];
            aValue = a[sortConfig.value.key];
        }
        
        if (aValue < bValue) return sortConfig.value.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.value.direction === 'asc' ? 1 : -1;
        return 0;
    });
});

// Пагинация
const visibleCount = ref(30);
const isLoadingMore = ref(false);

const visiblePosts = computed(() => {
    return sortedPosts.value.slice(0, visibleCount.value);
});

// Бесконечный скролл
const scrollContainer = ref<HTMLDivElement>();

function handleScroll(event: Event) {
    const target = event.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    
    if (scrollTop + clientHeight >= scrollHeight - 50 && !isLoadingMore.value) {
        loadMore();
    }
}

async function loadMore() {
    if (visibleCount.value >= sortedPosts.value.length) return;
    
    isLoadingMore.value = true;
    await new Promise(resolve => setTimeout(resolve, 300));
    visibleCount.value += 30;
    isLoadingMore.value = false;
}

// Вспомогательные функции
const getUserEmail = (userId: number) => {
    // Не используем кеш для email, всегда запрашиваем из общего состояния
    const user = users.value?.find(u => u.id === userId);
    return user?.email;
};

const isUserViewed = (userId: number) => {
    return dataStore.isUserViewed(userId);
};

// Модальное окно пользователя
const emit = defineEmits<{
    userClick: [userId: number]
}>();

function openUserModal(userId: number) {
    dataStore.markUserAsViewed(userId);
    emit('userClick', userId);
}
</script>