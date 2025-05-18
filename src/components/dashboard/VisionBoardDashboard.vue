<script setup lang="ts">
import { ref } from 'vue';
import { Moon, Sun, Menu, X, Bell, Search, User, Settings } from 'lucide-vue-next';

const darkMode = ref(true);
const menuOpen = ref(false);

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
};

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const tasks = [
  { id: 1, title: 'Complete VisionBoard AI layout', priority: 'High', completed: false },
  { id: 2, title: 'Research Supabase integration', priority: 'Medium', completed: false },
  { id: 3, title: 'Design color scheme for dark mode', priority: 'High', completed: true },
  { id: 4, title: 'Implement Google login', priority: 'Medium', completed: false }
];
</script>

<template>
  <div :class="`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`">
    <!-- Header -->
    <header :class="`fixed top-0 left-0 right-0 z-10 ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <!-- Logo & Brand -->
        <div class="flex items-center space-x-4">
          <button 
            class="md:hidden p-2 rounded-full bg-gray-800 text-gray-200" 
            @click="toggleMenu"
          >
            <component :is="menuOpen ? X : Menu" :size="20" />
          </button>
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mr-2">
              <span class="font-bold text-white">V</span>
            </div>
            <span class="font-semibold text-lg">VisionBoard</span>
            <span class="text-purple-500 ml-1 font-semibold">AI</span>
          </div>
        </div>

        <!-- Search -->
        <div :class="`hidden md:flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full px-4 w-96 h-10`">
          <Search :size="18" :class="`${darkMode ? 'text-gray-400' : 'text-gray-500'}`" />
          <input
            type="text"
            placeholder="Search tasks, notes, etc..."
            :class="`bg-transparent border-none w-full ml-2 focus:outline-none ${darkMode ? 'placeholder:text-gray-500' : 'placeholder:text-gray-400'}`"
          />
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <button class="p-2 rounded-full hover:bg-gray-700/50 transition-colors">
            <Bell :size="20" class="text-gray-400" />
          </button>
          <button 
            class="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
            @click="toggleDarkMode"
          >
            <component :is="darkMode ? Sun : Moon" :size="20" :class="darkMode ? 'text-yellow-400' : 'text-gray-400'" />
          </button>
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <User :size="16" class="text-white" />
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Menu -->
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
            <button @click="toggleMenu">
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
              v-for="item in ['Dashboard', 'Tasks', 'Calendar', 'Analytics', 'Settings']"
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

    <!-- Main Content -->
    <main class="pt-20 px-4 pb-8">
      <div class="container mx-auto">
        <!-- Welcome Message -->
        <div :class="`p-6 rounded-2xl mb-8 ${darkMode ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`">
          <h1 class="text-2xl font-bold mb-2">Good afternoon, Dahir</h1>
          <p :class="`${darkMode ? 'text-gray-400' : 'text-gray-600'}`">You have 3 tasks due today and 2 meetings scheduled.</p>
        </div>
        
        <!-- Dashboard Layout -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Tasks Column -->
          <div class="md:col-span-2">
            <div :class="`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Today's Tasks</h2>
                <button class="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium">
                  + New Task
                </button>
              </div>
              
              <!-- Task List -->
              <div class="space-y-3">
                <div 
                  v-for="task in tasks"
                  :key="task.id"
                  :class="`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} flex items-center justify-between transition-all hover:shadow-md`"
                >
                  <div class="flex items-center">
                    <input 
                      type="checkbox" 
                      :checked="task.completed"
                      class="w-5 h-5 rounded-md border-gray-300 text-purple-500 focus:ring-purple-500"
                    />
                    <span :class="`ml-3 ${task.completed ? 'line-through text-gray-500' : ''}`">{{ task.title }}</span>
                    <span :class="`ml-3 text-xs px-2 py-1 rounded-full ${task.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`">
                      {{ task.priority }}
                    </span>
                  </div>
                  <button class="text-gray-400 hover:text-gray-600">
                    <Settings :size="16" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Stats & Calendar Column -->
          <div class="space-y-6">
            <!-- Stats Card -->
            <div :class="`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`">
              <h2 class="text-xl font-semibold mb-4">Weekly Progress</h2>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between mb-1">
                    <span :class="`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`">Tasks Completed</span>
                    <span class="text-sm font-medium">24/36</span>
                  </div>
                  <div :class="`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`">
                    <div class="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 w-2/3"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-1">
                    <span :class="`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`">Focus Time</span>
                    <span class="text-sm font-medium">18h/25h</span>
                  </div>
                  <div :class="`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`">
                    <div class="h-2 rounded-full bg-gradient-to-r from-green-500 to-teal-500 w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- AI Assistant -->
            <div class="p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur border border-purple-500/20">
              <div class="flex items-center mb-4">
                <div class="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center mr-2">
                  <span class="font-bold text-white">AI</span>
                </div>
                <h2 class="text-xl font-semibold">Vision Assistant</h2>
              </div>
              <p :class="`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`">
                Based on your schedule, I recommend focusing on the high-priority tasks first.
              </p>
              <div class="flex space-x-2">
                <button :class="`px-3 py-1 text-sm rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`">
                  Suggestions
                </button>
                <button :class="`px-3 py-1 text-sm rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`">
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
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