<template>
    <div
        class="min-h-screen bg-background text-foreground transition-colors"
        :class="{ 'dark': themeStore.isDark }"
    >
        <div class="container mx-auto py-8 px-4">
            <!-- Шапка приложения -->
            <header class="mb-8">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-3xl font-bold">
                        Таблица публикаций
                    </h1>
                    <ThemeSelect />
                </div>

                <!-- Поисковая строка -->
                <SearchBox
                    v-model:search-query="searchQuery"
                    :is-loading="isLoading"
                    @search="handleSearch"
                    @reset="handleReset"
                />
            </header>

            <!-- Основной контент -->
            <main>
                <!-- Статистика -->
                <div class="mb-4 text-sm text-muted-foreground">
                    <span v-if="!isLoading">
                        Найдено публикаций: {{ currentPosts?.length || 0 }}
                    </span>
                    <span v-else>Загрузка...</span>
                </div>

                <!-- Таблица -->
                <DataTable
                    :posts="currentPosts"
                    @user-click="openUserModal"
                />

                <!-- Уведомление об ошибке -->
                <div
                    v-if="isError"
                    class="mt-4 p-4 bg-destructive/10 border border-destructive rounded-lg"
                >
                    <p class="text-destructive font-medium">
                        Сервис временно недоступен. Пожалуйста, попробуйте позже.
                    </p>
                </div>
            </main>
        </div>

        <!-- Модальное окно пользователя -->
        <Dialog v-model:open="isUserModalOpen">
            <DialogContent class="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Профиль пользователя</DialogTitle>
                    <DialogDescription>
                        Информация о авторе публикации
                    </DialogDescription>
                </DialogHeader>
                
                <UserCard 
                    v-if="selectedUserId" 
                    :user-id="selectedUserId"
                    @close="closeUserModal"
                />
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useThemeStore } from '@/stores/theme';
import { useAppData, usePostsSearch } from '@/composables/useApi';

// Components
import DataTable from '@/components/DataTable.vue';
import UserCard from '@/components/UserCard.vue';
import ThemeSelect from '@/components/ThemeSelect.vue';
import SearchBox from '@/components/SearchBox.vue';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const themeStore = useThemeStore();

const { posts: initialPosts, isLoading: appDataLoading } = useAppData();


// Поиск
const { posts: searchedPosts, isLoading: searchLoading, isError, search } = usePostsSearch();

// Состояние поиска
const searchQuery = ref('');
const isSearching = ref(false);

const handleSearch = (query: string) => {
    searchQuery.value = query;
    isSearching.value = true;
    search(query);
};

const handleReset = () => {
    searchQuery.value = '';
    isSearching.value = false;
};

// Определяем какие посты показывать
const currentPosts = computed(() => {
    return isSearching.value && searchedPosts.value 
        ? searchedPosts.value 
        : initialPosts.value;
});

const isLoading = appDataLoading || searchLoading;

// Модальное окно пользователя
const isUserModalOpen = ref(false);
const selectedUserId = ref<number>();

const openUserModal = (userId: number) => {
    selectedUserId.value = userId;
    isUserModalOpen.value = true;
};

const closeUserModal = () => {
    isUserModalOpen.value = false;
    selectedUserId.value = undefined;
};
</script>