<script setup lang="ts">
import { Search, X } from 'lucide-vue-next';

interface Props {
  darkMode: boolean;
  menuOpen: boolean;
}

defineProps<Props>();
defineEmits<{
  (e: 'close'): void;
}>();

const menuItems = ['Dashboard', 'Tasks', 'Calendar', 'Analytics', 'Settings'];
</script>

<template>
  <Transition>
    <div 
      v-if="menuOpen"
      :class="`fixed inset-y-0 left-0 z-20 w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} ${darkMode ? 'text-white' : 'text-gray-900'} shadow-lg md:hidden`"
    >
      <div class="p-4 space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mr-2">
              <span class="font-bold text-white">V</span>
            </div>
            <span class="font-semibold">VisionBoard AI</span>
          </div>
          <button @click="$emit('close')">
            <X :size="20" class="text-gray-400" />
          </button>
        </div>
        
        <div :class="`flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full px-4 h-10 mt-4`">
          <Search :size="16" :class="`${darkMode ? 'text-gray-400' : 'text-gray-500'}`" />
          <input
            type="text"
            placeholder="Search..."
            :class="`bg-transparent border-none w-full ml-2 focus:outline-none ${darkMode ? 'placeholder:text-gray-500' : 'placeholder:text-gray-400'}`"
          />
        </div>
        
        <nav class="mt-6 space-y-1">
          <a 
            v-for="item in menuItems"
            :key="item"
            href="#"
            :class="`block py-2 px-4 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`"
          >
            {{ item }}
          </a>
        </nav>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: transform 0.3s ease;
}

.v-enter-from {
  transform: translateX(-100%);
}

.v-leave-to {
  transform: translateX(-100%);
}
</style> 