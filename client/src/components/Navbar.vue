<template>
  <nav class="bg-[var(--color-surface-base)] shadow-md border-b border-[var(--color-surface-light)] sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <!-- Logo -->
          <router-link to="/" class="flex-shrink-0 flex items-center gap-2">
            <div class="w-9 h-9 bg-[var(--color-primary-base)] rounded-xl flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 14h18a1 1 0 010 2H3a1 1 0 010-2zm1-4h16c.55 0 1-.45 1-1 0-3.53-3.13-6-8-6H11C6.13 3 3 5.47 3 9c0 .55.45 1 1 1zm2-.5c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5s-.22.5-.5.5h-11a.5.5 0 01-.5-.5zM3 18h18c.55 0 1 .45 1 1s-.45 1-1 1H3c-.55 0-1-.45-1-1s.45-1 1-1z"/>
              </svg>
            </div>
            <div class="flex items-baseline gap-0">
              <span class="font-extrabold text-xl text-[var(--color-primary-base)] tracking-tight">75</span>
              <span class="font-bold text-lg text-[var(--color-text-main)] tracking-tight">Burger</span>
            </div>
          </router-link>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Secret Admin Icon (Always visible but highly transparent) -->
          <button @click="handleAdminClick" class="p-1.5 rounded-full border border-[var(--color-text-muted)] opacity-5 hover:opacity-100 transition-opacity focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          <!-- Cart Button -->
          <button @click="store.toggleCart()" class="relative p-2 text-[var(--color-text-main)] hover:text-[var(--color-primary-base)] transition-colors focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-if="store.cartTotalItems > 0" class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
              {{ store.cartTotalItems }}
            </span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Secret Login Modal -->
    <LoginModal :is-open="isLoginModalOpen" @close="isLoginModalOpen = false" />
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../store'
import LoginModal from './LoginModal.vue'

const store = useAppStore()
const router = useRouter()

const isLoginModalOpen = ref(false)

const handleAdminClick = () => {
  if (store.isAdmin) {
    router.push('/admin')
  } else {
    isLoginModalOpen.value = true
  }
}
</script>
