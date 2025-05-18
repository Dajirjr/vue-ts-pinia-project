<script setup lang="ts">
import { ref } from 'vue';
import { Moon, Sun, Menu, Bell, Search, User } from 'lucide-vue-next';
import Sidebar from '../components/Sidebar.vue';
import KanbanBoard from '../components/KanbanBoard.vue';
import PlannerAI from '../components/PlannerAI.vue';

const darkMode = ref(true);
const menuOpen = ref(false);

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
};

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const tasks = ref([
  { id: 1, title: 'Complete VisionBoard AI layout', priority: 'High', completed: false },
  { id: 2, title: 'Research Supabase integration', priority: 'Medium', completed: false },
  { id: 3, title: 'Design color scheme for dark mode', priority: 'High', completed: true },
  { id: 4, title: 'Implement Google login', priority: 'Medium', completed: false }
]);

const handleToggleComplete = (taskId: number) => {
  const task = tasks.value.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
  }
};

const handleOpenSettings = (taskId: number) => {
  console.log('Open settings for task:', taskId);
};

const handleAddTask = () => {
  console.log('Add new task');
};

const handleSuggestions = () => {
  console.log('Show AI suggestions');
};

const handleReschedule = () => {
  console.log('Reschedule tasks');
};
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
            <component :is="menuOpen ? 'X' : Menu" :size="20" />
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

    <!-- Sidebar -->
    <Sidebar 
      :dark-mode="darkMode"
      :menu-open="menuOpen"
      @close="toggleMenu"
    />

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
            <KanbanBoard
              :tasks="tasks"
              :dark-mode="darkMode"
              @toggle-complete="handleToggleComplete"
              @open-settings="handleOpenSettings"
              @add-task="handleAddTask"
            />
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
            <PlannerAI
              :dark-mode="darkMode"
              @suggestions="handleSuggestions"
              @reschedule="handleReschedule"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template> 