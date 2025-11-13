<template>
    <div
        v-if="userQuery.data.value"
        class="space-y-4"
    >
        <!-- Основная информация -->
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="text-sm font-medium text-muted-foreground">Имя</label>
                <p class="text-base">
                    {{ userQuery.data.value.name }}
                </p>
            </div>
            <div>
                <label class="text-sm font-medium text-muted-foreground">Логин</label>
                <p class="text-base">
                    {{ userQuery.data.value.username }}
                </p>
            </div>
        </div>

        <div>
            <label class="text-sm font-medium text-muted-foreground">Email</label>
            <p class="text-base">
                {{ userQuery.data.value.email }}
            </p>
        </div>

        <div>
            <label class="text-sm font-medium text-muted-foreground">Телефон</label>
            <p class="text-base">
                {{ userQuery.data.value.phone }}
            </p>
        </div>

        <div class="flex flex-col">
            <label class="text-sm font-medium text-muted-foreground">Веб-сайт</label>
            <a 
                target="_blank"
                rel="noopener noreferrer"
                :href="'https://' + userQuery.data.value.website"
                class="text-primary hover:underline"
            >
                {{ userQuery.data.value.website }}
            </a>
        </div>

        <div>
            <label class="text-sm font-medium text-muted-foreground">Компания</label>
            <p class="text-base">
                {{ userQuery.data.value.company.name }}
            </p>
        </div>

        <div>
            <label class="text-sm font-medium text-muted-foreground">Адрес</label>
            <p class="text-base">
                {{ userQuery.data.value.address.street }}, 
                {{ userQuery.data.value.address.suite }}, 
                {{ userQuery.data.value.address.city }}
            </p>
        </div>

        <!-- Кнопка закрытия -->
        <div class="flex justify-end pt-4">
            <Button
                class="cursor-pointer"
                @click="handleClose"
            >
                Закрыть
            </Button>
        </div>
    </div>

    <!-- Состояние загрузки -->
    <div
        v-else-if="userQuery.isLoading"
        class="space-y-4"
    >
        <div class="grid grid-cols-2 gap-4">
            <div>
                <div class="h-4 bg-muted rounded animate-pulse mb-2" />
                <div class="h-6 bg-muted rounded animate-pulse" />
            </div>
            <div>
                <div class="h-4 bg-muted rounded animate-pulse mb-2" />
                <div class="h-6 bg-muted rounded animate-pulse" />
            </div>
        </div>
        <div
            v-for="i in 4"
            :key="i"
            class="space-y-2"
        >
            <div class="h-4 bg-muted rounded animate-pulse" />
            <div class="h-6 bg-muted rounded animate-pulse" />
        </div>
    </div>

    <!-- Состояние ошибки -->
    <div
        v-else-if="userQuery.isError"
        class="text-center py-8"
    >
        <Icon
            icon="mdi:alert-circle-outline"
            class="w-12 h-12 text-destructive mx-auto mb-4"
        />
        <p class="text-destructive font-medium">
            Ошибка загрузки данных пользователя
        </p>
        <Button
            class="mt-4 cursor-pointer"
            @click="userQuery.refetch()"
        >
            <Icon
                icon="mdi:refresh"
                class="w-4 h-4 mr-2"
            />
            Попробовать снова
        </Button>
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/vue-query';
import { useDataStore } from '@/stores/data';
import { apiService } from '@/api/service';
interface Props {
    userId: number
}

interface Emits {
    (e: 'close'): void
}

const dataStore = useDataStore();
const props = defineProps<Props>();
const emit = defineEmits<Emits>();


const userQuery = useQuery({
    queryKey: ['user', props.userId],
    queryFn: async () => {
        
        const cachedUser = dataStore.getUserById(props.userId);
        if (cachedUser) {
            return cachedUser;
        }
    
        
        const user = await apiService.fetchUserById(props.userId);
        dataStore.cacheUser(user);
        return user;
    },
    staleTime: 10 * 60 * 1000,
});

const handleClose = () => {
    emit('close');
};
</script>