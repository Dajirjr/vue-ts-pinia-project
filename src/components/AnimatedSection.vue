<template>
  <section
    ref="target"
    :class="[
      'transition-all duration-1000',
      isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    ]"
  >
    <slot />
  </section>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

const { isIntersecting, target } = useIntersectionObserver()
</script> 