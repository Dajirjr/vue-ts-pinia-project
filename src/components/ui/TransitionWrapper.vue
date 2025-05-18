<template>
  <transition
    :name="name"
    :mode="mode"
    :appear="appear"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <slot></slot>
  </transition>
</template>

<script setup lang="ts">
interface Props {
  name?: 'fade-slide-up' | 'fade-slide-down'
  mode?: 'in-out' | 'out-in'
  appear?: boolean
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  name: 'fade-slide-up',
  mode: undefined,
  appear: false,
  duration: 400,
})

const beforeEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.opacity = '0'
  element.style.transform = props.name === 'fade-slide-up' 
    ? 'translateY(10px)' 
    : 'translateY(-10px)'
}

const enter = (el: Element, done: () => void) => {
  const element = el as HTMLElement
  element.style.transition = `all ${props.duration}ms ease-out`
  element.style.opacity = '1'
  element.style.transform = 'translateY(0)'
  setTimeout(done, props.duration)
}

const afterEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.transition = ''
  element.style.transform = ''
}

const beforeLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.opacity = '1'
  element.style.transform = 'translateY(0)'
}

const leave = (el: Element, done: () => void) => {
  const element = el as HTMLElement
  element.style.transition = `all ${props.duration}ms ease-out`
  element.style.opacity = '0'
  element.style.transform = props.name === 'fade-slide-up' 
    ? 'translateY(-10px)' 
    : 'translateY(10px)'
  setTimeout(done, props.duration)
}

const afterLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.transition = ''
  element.style.transform = ''
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style> 