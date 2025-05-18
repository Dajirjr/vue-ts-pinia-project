<template>
  <nav class="app-navigation">
    <div class="flex items-center space-x-4">
      <router-link 
        to="/" 
        class="nav-link"
        :class="{ active: $route.path === '/' }"
      >
        <HomeIcon class="w-5 h-5" />
        <span>Home</span>
      </router-link>

      <router-link 
        to="/calendar" 
        class="nav-link"
        :class="{ active: $route.path === '/calendar' }"
      >
        <CalendarIcon class="w-5 h-5" />
        <span>Calendar</span>
      </router-link>

      <router-link 
        to="/analytics" 
        class="nav-link"
        :class="{ active: $route.path === '/analytics' }"
      >
        <ChartBarIcon class="w-5 h-5" />
        <span>Analytics</span>
      </router-link>
    </div>

    <div class="flex items-center space-x-4">
      <ThemeSwitcher />
      <button 
        @click="handleLogout"
        class="nav-link text-red-500 hover:text-red-600"
      >
        <LogOutIcon class="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { HomeIcon, CalendarIcon, ChartBarIcon, LogOutIcon } from 'lucide-vue-next'
import ThemeSwitcher from './ThemeSwitcher.vue'

const router = useRouter()

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>

<style scoped>
.app-navigation {
  @apply flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200;
}

.nav-link {
  @apply flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors;
}

.nav-link.active {
  @apply text-blue-500 bg-blue-50 hover:text-blue-600 hover:bg-blue-100;
}
</style> 