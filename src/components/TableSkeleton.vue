<template>
    <div class="space-y-3">
        <div
            v-for="i in 10"
            :key="i"
            class="grid grid-cols-[80px_1fr_150px_200px] gap-4 p-4"
        >
            <div class="h-4 bg-muted rounded animate-pulse" />
            <div class="h-4 bg-muted rounded animate-pulse" />
            <div class="h-4 bg-muted rounded animate-pulse" />
            <div class="h-4 bg-muted rounded animate-pulse" />
        </div>
    </div>
</template>

<script setup lang="ts">
</script>