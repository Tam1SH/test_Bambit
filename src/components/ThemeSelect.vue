<template>
    <div class="flex items-center gap-4">
        <Select 
            v-model="currentTheme"
            @update:model-value="handleThemeChange"
        >
            <SelectTrigger class="w-[180px] cursor-pointer">
                <SelectValue placeholder="Выберите тему" />
            </SelectTrigger>
            <SelectContent class="**:cursor-pointer">
                <SelectItem value="light">
                    <div class="flex items-center gap-2">
                        <Icon
                            icon="mdi:weather-sunny"
                            class="w-4 h-4"
                        />
                        <span>Светлая</span>
                    </div>
                </SelectItem>
                <SelectItem value="dark">
                    <div class="flex items-center gap-2">
                        <Icon
                            icon="mdi:weather-night"
                            class="w-4 h-4"
                        />
                        <span>Тёмная</span>
                    </div>
                </SelectItem>
                <SelectItem value="system">
                    <div class="flex items-center gap-2">
                        <Icon
                            icon="mdi:laptop"
                            class="w-4 h-4"
                        />
                        <span>Системная</span>
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
        
        <Button 
            class="cursor-pointer"
            variant="outline" 
            size="sm"
            @click="themeStore.toggleTheme()"
        >
            <Icon 
                :icon="themeStore.isDark ? 'mdi:weather-night' : 'mdi:weather-sunny'" 
                class="h-4 w-4 mr-2" 
            />
            {{ themeStore.isDark ? 'Тёмная' : 'Светлая' }}
        </Button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '@/stores/theme';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icon } from '@iconify/vue';
import { AcceptableValue } from 'reka-ui';
import Button from '@/components/ui/button/Button.vue';

const themeStore = useThemeStore();

const currentTheme = computed({
    get: () => themeStore.theme,
    set: (value) => themeStore.setTheme(value)
});

const handleThemeChange = (value: AcceptableValue) => {
    if (typeof value === 'string' && (value === 'light' || value === 'dark' || value === 'system')) {
        themeStore.setTheme(value);
    } else {
        themeStore.setTheme('system');
    }
};
</script>