<template>
    <div class="flex gap-3 max-w-2xl">
        <div class="flex-1">
            <Input
                v-model="localSearchQuery"
                placeholder="Поиск по заголовку публикации..."
                class="w-full"
                @keyup.enter="handleSearch"
            />
        </div>
        <Button 
            :disabled="isLoading" 
            class="cursor-pointer"
            @click="handleSearch"
        >
            <Icon 
                icon="mdi:search" 
                class="h-4 w-4 mr-2" 
            />
            {{ isLoading ? 'Поиск...' : 'Поиск' }}
        </Button>
        <Button 
            variant="outline" 
            class="cursor-pointer"
            @click="handleReset"
        >
            <Icon 
                icon="mdi:refresh" 
                class="h-4 w-4 mr-2" 
            />
            Сброс
        </Button>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/vue';

interface Props {
    searchQuery?: string
    isLoading?: boolean
}

interface Emits {
    (e: 'update:searchQuery', value: string): void
    (e: 'search', value: string): void
    (e: 'reset'): void
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const localSearchQuery = ref(props.searchQuery || '');

// Синхронизация с внешним значением
watch(() => props.searchQuery, (newValue) => {
    if (newValue !== localSearchQuery.value) {
        localSearchQuery.value = newValue || '';
    }
});

const handleSearch = () => {
    emit('update:searchQuery', localSearchQuery.value);
    emit('search', localSearchQuery.value);
};

const handleReset = () => {
    localSearchQuery.value = '';
    emit('update:searchQuery', '');
    emit('reset');
};

// Автоматически эмитим изменения для v-model
watch(localSearchQuery, (value) => {
    emit('update:searchQuery', value);
});
</script>