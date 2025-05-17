<template>
  <div class="home">
    <h1>Welcome to Vue 3 + TypeScript + Pinia Starter</h1>
    
    <div class="counter-demo">
      <h2>Counter Demo</h2>
      <p>Current count: {{ counter.count }}</p>
      <button @click="counter.increment">Increment</button>
    </div>

    <div class="features">
      <h2>Features</h2>
      <ul>
        <li v-for="feature in features" :key="feature.id">
          {{ feature.icon }} {{ feature.name }} - {{ feature.description }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCounterStore } from '@/stores/counter'

interface Feature {
  id: number
  icon: string
  name: string
  description: string
}

const counter = useCounterStore()

const features = ref<Feature[]>([
  {
    id: 1,
    icon: '🚀',
    name: 'Vue 3',
    description: 'Latest Vue.js with Composition API',
  },
  {
    id: 2,
    icon: '📝',
    name: 'TypeScript',
    description: 'Full type safety and better IDE support',
  },
  {
    id: 3,
    icon: '🏪',
    name: 'Pinia',
    description: 'Modern Vue.js state management',
  },
  {
    id: 4,
    icon: '⚡',
    name: 'Vite',
    description: 'Lightning fast development experience',
  },
])
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.counter-demo {
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #3aa876;
}

.features {
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}
</style> 