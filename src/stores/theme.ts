import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
export type Theme = 'light' | 'dark' | 'system';

export const useThemeStore = defineStore('theme', () => {
    const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'system');
  
    const isDark = computed(() => {
        if (theme.value === 'system') {
            return globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return theme.value === 'dark';
    });
  
    const currentTheme = computed(() => theme.value);
  
    function setTheme(newTheme: Theme) {
        theme.value = newTheme;
    }
  
    function toggleTheme() {
        theme.value = theme.value === 'light' ? 'dark' : 'light';
    }
  
    // Автоматически применяем тему при изменении
    watch(isDark, (dark) => {
        document.documentElement.classList.toggle('dark', dark);
    }, { immediate: true });
  
    return {
        theme,
        isDark,
        currentTheme,
        setTheme,
        toggleTheme
    };
}, {
    persist: true
});