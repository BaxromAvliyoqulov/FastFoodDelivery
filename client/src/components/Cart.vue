<template>
  <div v-if="store.isCartOpen" class="fixed inset-0 z-50 flex flex-col justify-end">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="store.toggleCart()"></div>

    <!-- Bottom Sheet Panel -->
    <div class="relative bg-[var(--color-surface-base)] w-full max-w-xl mx-auto rounded-t-3xl shadow-2xl flex flex-col max-h-[90dvh] animate-slide-up">
      
      <!-- Drag Handle (Visual only) -->
      <div class="flex justify-center pt-3 pb-1" @click="store.toggleCart()">
        <div class="w-12 h-1.5 bg-[var(--color-surface-light)] rounded-full cursor-pointer"></div>
      </div>

      <!-- Header -->
      <div class="px-6 py-4 flex justify-between items-center border-b border-[var(--color-surface-light)]">
        <h2 class="text-xl font-bold text-[var(--color-text-main)]">Sizning savatingiz</h2>
        <button @click="store.toggleCart()" class="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition bg-[var(--color-surface-light)] rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="store.cartItems.length === 0" class="flex-1 flex flex-col items-center justify-center py-12 px-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-[var(--color-surface-light)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-[var(--color-text-muted)] text-lg text-center">Savatingiz hozircha bo'sh.</p>
        <button @click="store.toggleCart()" class="mt-6 text-[var(--color-primary-base)] font-semibold hover:underline">Menyuga qaytish</button>
      </div>

      <!-- Cart Items (Scrollable) -->
      <div v-else class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <div v-for="(item, index) in store.cartItems" :key="index" class="flex justify-between items-center py-2 border-b border-[var(--color-surface-light)]/50 last:border-0 pb-4">
          <div class="flex-1 pr-4">
            <h3 class="font-bold text-[var(--color-text-main)]">{{ item.name }}</h3>
            <p v-if="item.variant" class="text-sm text-[var(--color-text-muted)]">{{ item.variant.name }}</p>
            <div class="font-bold text-[var(--color-primary-base)] mt-1">{{ formatPrice(item.totalPrice) }}</div>
          </div>
          
          <div class="flex flex-col items-end gap-3">
            <button @click="store.removeFromCart(index)" class="text-red-500/80 hover:text-red-500 transition-colors p-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <div class="flex items-center bg-[var(--color-background)] rounded-lg px-2 py-1 shadow-inner border border-[var(--color-surface-light)]/50">
              <button @click="store.decrementQuantity(index)" class="w-7 h-7 flex items-center justify-center text-[var(--color-text-main)] hover:text-[var(--color-primary-base)] transition-colors text-lg font-bold">-</button>
              <div class="px-2 min-w-[3rem] text-center">
                <span class="text-sm font-extrabold text-[var(--color-text-main)]">{{ item.unit === 'kg' ? item.quantity.toFixed(2) : item.quantity }}</span>
                <span class="block text-[10px] text-[var(--color-text-muted)] font-bold uppercase -mt-1">{{ item.unit === 'kg' ? 'kg' : 'ta' }}</span>
              </div>
              <button @click="store.incrementQuantity(index)" class="w-7 h-7 flex items-center justify-center text-[var(--color-text-main)] hover:text-[var(--color-primary-base)] transition-colors text-lg font-bold">+</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Checkout Footer -->
      <div v-if="store.cartItems.length > 0" class="p-6 pt-4 bg-[var(--color-surface-base)] border-t border-[var(--color-surface-light)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] shrink-0">
        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-[var(--color-text-muted)]">
            <span>Mahsulotlar</span>
            <span>{{ formatPrice(store.cartSubtotal) }}</span>
          </div>
          <div class="flex justify-between text-[var(--color-text-muted)]">
            <span>Yetkazib berish</span>
            <span>{{ formatPrice(store.deliveryFee) }}</span>
          </div>
          <div class="flex justify-between text-xl font-bold text-[var(--color-text-main)] pt-2 border-t border-[var(--color-surface-light)]/50">
            <span>Jami</span>
            <span>{{ formatPrice(store.cartTotal) }}</span>
          </div>
        </div>
        
        <div class="flex gap-3">
          <button @click="store.clearCart()" class="w-1/3 bg-[var(--color-surface-light)] hover:bg-[var(--color-surface-light)]/80 text-[var(--color-text-main)] font-semibold py-3.5 rounded-xl transition-colors">
            Tozalash
          </button>
          <button @click="goToCheckout" class="w-2/3 bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-dark)] text-white font-semibold py-3.5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            Davom etish
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Checkout Modal -->
  <CheckoutModal />
</template>

<script setup>
import { useAppStore } from '../store'
import CheckoutModal from './CheckoutModal.vue'

const store = useAppStore()

const formatPrice = (price) => {
  return price.toLocaleString('uz-UZ') + ' UZS'
}

const goToCheckout = () => {
  store.toggleCart()
  store.openCheckout()
}
</script>

