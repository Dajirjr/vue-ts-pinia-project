<template>
  <div class="calendar-page">
    <CalendarView />
  </div>
</template>

<script setup lang="ts">
import CalendarView from '@/components/CalendarView.vue'
</script>

<style scoped>
.calendar-page {
  @apply min-h-screen bg-gray-50;
}
</style> 