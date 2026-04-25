<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="bg-[var(--color-surface-base)] w-full max-w-md rounded-3xl p-8 shadow-2xl border border-[var(--color-surface-light)] text-center animate-fade-in">
      
      <!-- Success Icon -->
      <div class="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 class="text-3xl font-extrabold text-[var(--color-text-main)] mb-2">Rahmat!</h1>
      <p class="text-[var(--color-text-muted)] mb-8">Buyurtmangiz muvaffaqiyatli qabul qilindi. Tez orada operatorimiz siz bilan bog'lanadi.</p>

      <!-- Order ID Card -->
      <div v-if="orderId" class="bg-[var(--color-background)] rounded-2xl p-4 mb-8 border border-[var(--color-surface-light)]">
        <span class="block text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider mb-1">Buyurtma ID</span>
        <span class="text-[var(--color-primary-base)] font-mono text-xl font-bold">#{{ orderId }}</span>
      </div>

      <router-link 
        to="/" 
        class="block w-full bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-dark)] text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]"
      >
        Asosiy sahifaga qaytish
      </router-link>

      <p class="mt-6 text-xs text-[var(--color-text-muted)]">
        Agar savollaringiz bo'lsa, biz bilan bog'laning.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const orderId = computed(() => route.query.id)
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
