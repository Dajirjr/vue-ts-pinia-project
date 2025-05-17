<template>
  <div class="layout">
    <header class="header">
      <nav>
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/about" class="nav-link">About</router-link>
      </nav>
    </header>

    <main class="main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="footer">
      <p>&copy; {{ currentYear }} Vue 3 + TypeScript + Pinia Starter. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 1rem;
  background-color: #2c3e50;
  color: white;
}

.nav-link {
  color: white;
  text-decoration: none;
  margin-right: 1rem;
}

.nav-link:hover {
  color: #42b883;
}

.main {
  flex: 1;
  padding: 2rem;
}

.footer {
  padding: 1rem;
  background-color: #2c3e50;
  color: white;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 