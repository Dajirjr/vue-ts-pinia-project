<template>
  <div class="bg-gradient-to-b from-gray-950 to-black text-white">
    <!-- Hero Section -->
    <AnimatedSection class="min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <div class="max-w-4xl text-center space-y-8">
        <h1 class="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 animate-gradient">
          VisionBoard AI
        </h1>
        <p class="text-xl sm:text-2xl text-gray-400 max-w-2xl mx-auto">
          Your AI-powered productivity dashboard with smart planning, calendar sync, and beautiful insights.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <a 
            href="https://visionboard.doc.dahir.dev" 
            class="group px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95"
            target="_blank"
            rel="noopener noreferrer"
          >
            🚀 Try Demo
            <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </a>
          <a 
            href="https://github.com/yourusername/visionboard-ai" 
            class="px-8 py-4 border border-gray-700 rounded-lg text-white hover:bg-gray-800 transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 hover:border-indigo-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            💻 View on GitHub
          </a>
        </div>
      </div>
    </AnimatedSection>

    <!-- Features Section -->
    <AnimatedSection class="py-24 bg-gray-900/50">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(feature, index) in features" 
            :key="feature.title" 
            class="group p-6 bg-gray-800/50 backdrop-blur rounded-lg border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/10"
            :style="{ transitionDelay: `${index * 100}ms` }"
          >
            <component :is="feature.icon" class="w-12 h-12 text-indigo-400 mb-4 transform group-hover:scale-110 transition-transform" />
            <h3 class="text-xl font-semibold mb-2 text-white">
              {{ feature.title }}
            </h3>
            <p class="text-gray-400">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>

    <!-- Screenshots Section -->
    <AnimatedSection class="py-24">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 animate-gradient">
          See VisionBoard in Action
        </h2>
        <div class="relative max-w-6xl mx-auto">
          <div class="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory scrollbar-hide">
            <div v-for="screenshot in screenshots" :key="screenshot.title"
              class="snap-center shrink-0 first:pl-4 last:pr-4">
              <div class="w-[300px] md:w-[500px] group">
                <div class="relative overflow-hidden rounded-lg border border-gray-800/50 transition-all duration-500">
                  <img 
                    :src="screenshot.src"
                    :alt="screenshot.title"
                    class="rounded-lg shadow-2xl group-hover:shadow-indigo-500/20 transition-all duration-500 transform group-hover:scale-105"
                  >
                  <div class="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="absolute bottom-0 left-0 right-0 p-6">
                      <h3 class="text-xl font-semibold text-white mb-2">
                        {{ screenshot.title }}
                      </h3>
                      <p class="text-gray-300">
                        {{ screenshot.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Navigation Dots -->
          <div class="flex justify-center mt-8 gap-3">
            <button 
              v-for="(_, index) in screenshots" 
              :key="index"
              class="w-3 h-3 rounded-full bg-gray-700 hover:bg-indigo-500 transition-colors duration-300 hover:scale-110"
              :class="{ 'bg-indigo-500': index === currentScreenshot }"
              @click="scrollToScreenshot(index)"
            />
          </div>
        </div>
      </div>
    </AnimatedSection>

    <!-- Tech Stack Section -->
    <AnimatedSection class="py-24 bg-gray-900/50">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 animate-gradient">
          Built with Modern Tech Stack
        </h2>
        <div class="flex flex-wrap justify-center items-center gap-12 md:gap-16">
          <img v-for="(tech, index) in techStack" 
            :key="tech.name"
            :src="tech.logo"
            :alt="tech.name"
            :style="{ transitionDelay: `${index * 100}ms` }"
            class="h-12 opacity-50 hover:opacity-100 transition-all duration-300 transform hover:scale-110"
            :class="{ 'invert': tech.invert }"
          >
        </div>
      </div>
    </AnimatedSection>

    <!-- Call to Action Section -->
    <AnimatedSection class="py-24 bg-gradient-to-b from-gray-900/50 to-indigo-900/20">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 animate-gradient">
          Ready to Transform Your Productivity?
        </h2>
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a 
            href="https://visionboard.doc.dahir.dev" 
            class="group px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition-all duration-300 flex items-center hover:scale-105 active:scale-95"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try the Demo
            <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </a>
          <a 
            href="https://github.com/yourusername/visionboard-ai" 
            class="px-8 py-4 border border-gray-700 hover:border-indigo-500 rounded-lg text-white hover:bg-gray-800 transition-all duration-300 hover:scale-105 active:scale-95"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
          <a 
            href="https://linkedin.com/in/johannesdahir" 
            class="px-8 py-4 border border-gray-700 hover:border-indigo-500 rounded-lg text-white hover:bg-gray-800 transition-all duration-300 hover:scale-105 active:scale-95"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact Dahir
          </a>
        </div>
      </div>
    </AnimatedSection>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Brain, Calendar, FileText, Clock } from 'lucide-vue-next'
import AnimatedSection from '@/components/AnimatedSection.vue'

const currentScreenshot = ref(0)

const features = [
  {
    icon: Brain,
    title: 'AI Reports',
    description: 'Weekly summaries and insights powered by GPT-4'
  },
  {
    icon: Calendar,
    title: 'Calendar Sync',
    description: 'Seamless Google Calendar integration with smart duplicate handling'
  },
  {
    icon: FileText,
    title: 'PDF Export',
    description: 'Export beautiful reports and analytics in PDF format'
  },
  {
    icon: Clock,
    title: 'Recurring Tasks',
    description: 'Smart task generation with customizable recurrence patterns'
  }
]

const screenshots = [
  {
    src: '/screenshots/dashboard.png',
    title: 'AI-Powered Dashboard',
    description: 'Get insights and recommendations for better productivity'
  },
  {
    src: '/screenshots/reports.png',
    title: 'Weekly Reports & Analytics',
    description: 'Track your progress with beautiful visualizations'
  },
  {
    src: '/screenshots/charts.png',
    title: 'Interactive Charts',
    description: 'Analyze your productivity patterns in detail'
  }
]

const techStack = [
  { name: 'Vue.js', logo: '/logos/vue.svg', invert: false },
  { name: 'Supabase', logo: '/logos/supabase.svg', invert: false },
  { name: 'OpenAI', logo: '/logos/openai.svg', invert: true },
  { name: 'Google', logo: '/logos/google.svg', invert: false },
  { name: 'Tailwind CSS', logo: '/logos/tailwind.svg', invert: false }
]

const scrollToScreenshot = (index: number) => {
  const container = document.querySelector('.snap-x')
  const items = container?.querySelectorAll('.snap-center')
  if (container && items && items[index]) {
    container.scrollTo({
      left: items[index].offsetLeft - container.offsetLeft,
      behavior: 'smooth'
    })
    currentScreenshot.value = index
  }
}

onMounted(() => {
  const container = document.querySelector('.snap-x')
  if (container) {
    container.addEventListener('scroll', () => {
      const items = container.querySelectorAll('.snap-center')
      const containerLeft = container.scrollLeft
      const containerWidth = container.offsetWidth

      items.forEach((item, index) => {
        const itemLeft = item.offsetLeft - container.offsetLeft
        if (Math.abs(containerLeft - itemLeft) < containerWidth / 2) {
          currentScreenshot.value = index
        }
      })
    })
  }
})
</script>

<style scoped>
.snap-x {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.snap-x::-webkit-scrollbar {
  display: none;
}

.snap-center {
  scroll-snap-align: center;
}

.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  background-size: 200% auto;
  animation: gradient 8s ease infinite;
}
</style> 