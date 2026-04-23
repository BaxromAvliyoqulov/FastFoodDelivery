<template>
  <nav class="bg-[var(--color-surface-base)] shadow-md border-b border-[var(--color-surface-light)] sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <!-- Logo with Secret Tap -->
          <div @click="handleSecretTap" class="flex-shrink-0 flex items-center cursor-pointer select-none" title="FastFood Delivery">
            <span class="font-bold text-xl text-[var(--color-primary-base)]">FastFood Delivery</span>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Admin link only visible if already logged in -->
          <router-link v-if="store.isAdmin" to="/admin" class="hidden sm:block text-[var(--color-primary-base)] hover:text-[var(--color-primary-dark)] px-3 py-2 rounded-md text-sm font-bold transition-colors">Admin Panel</router-link>
          
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

const tapCount = ref(0)
let tapTimeout = null
const isLoginModalOpen = ref(false)

const handleSecretTap = () => {
  // If already logged in, just route to admin immediately
  if (store.isAdmin) {
    router.push('/admin')
    return
  }

  // Secret 5-tap logic
  tapCount.value++
  if (tapCount.value >= 5) {
    isLoginModalOpen.value = true
    tapCount.value = 0
    if (tapTimeout) clearTimeout(tapTimeout)
  } else {
    if (tapTimeout) clearTimeout(tapTimeout)
    tapTimeout = setTimeout(() => {
      tapCount.value = 0 // Reset tap count if too slow
    }, 1000) // 1 second window to tap 5 times
  }
}
</script>
