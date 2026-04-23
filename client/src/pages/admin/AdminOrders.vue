<template>
  <div class="max-w-4xl mx-auto pb-20">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-[var(--color-text-main)]">Buyurtmalar</h1>
      <button @click="fetchOrders" :disabled="isLoading" class="bg-[var(--color-surface-light)] hover:bg-[var(--color-text-muted)]/20 text-[var(--color-text-main)] px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
        <svg v-if="isLoading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="hidden sm:inline">Yangilash</span>
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="orders.length === 0 && !isLoading" class="bg-[var(--color-surface-base)] border border-[var(--color-surface-light)] rounded-3xl p-12 text-center text-[var(--color-text-muted)] shadow-sm">
      Hozircha hech qanday buyurtma kelib tushmagan.
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-4">
      <div v-for="(order, index) in reversedOrders" :key="order.id" class="bg-[var(--color-surface-base)] border border-[var(--color-surface-light)] rounded-3xl p-5 shadow-sm animate-fade-in">
        
        <!-- Order Header -->
        <div class="flex flex-col sm:flex-row justify-between sm:items-start mb-4 pb-4 border-b border-[var(--color-surface-light)]/50 gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="inline-flex items-center justify-center bg-[var(--color-primary-base)] text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                Buyurtma #{{ orders.length - index }}
              </span>
              <!-- Status Select -->
              <select 
                v-model="order.status" 
                @change="updateStatus(order.id, order.status)"
                class="bg-[var(--color-surface-light)] border border-transparent focus:border-[var(--color-primary-base)] text-[var(--color-text-main)] text-xs font-bold rounded-lg px-2 py-1.5 outline-none cursor-pointer"
                :class="{
                  'text-yellow-500': order.status === 'Yangi',
                  'text-blue-500': order.status === 'Qabul qilindi',
                  'text-green-500': order.status === 'Yetkazildi',
                  'text-red-500': order.status === 'Bekor qilindi'
                }"
              >
                <option value="Yangi" class="text-[var(--color-text-main)]">Yangi</option>
                <option value="Qabul qilindi" class="text-[var(--color-text-main)]">Qabul qilindi</option>
                <option value="Yetkazildi" class="text-[var(--color-text-main)]">Yetkazildi</option>
                <option value="Bekor qilindi" class="text-[var(--color-text-main)]">Bekor qilindi</option>
              </select>
            </div>
            
            <div class="text-[var(--color-text-muted)] text-xs flex items-center gap-1">
              {{ formatDate(order.date) }}
            </div>
          </div>
          <div class="text-left sm:text-right">
            <div class="text-xl font-extrabold text-[var(--color-text-main)]">{{ formatPrice(order.total) }}</div>
            <div v-if="order.deliveryFee" class="text-xs text-[var(--color-text-muted)] mt-0.5">Yetkazib berish: {{ formatPrice(order.deliveryFee) }}</div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="space-y-3">
          <div v-for="(item, i) in order.items" :key="i" class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="bg-[var(--color-surface-light)] text-[var(--color-text-main)] text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                {{ item.quantity }}
              </div>
              <div>
                <div class="text-[var(--color-text-main)] font-semibold">{{ item.name }}</div>
                <div v-if="item.variant" class="text-[var(--color-text-muted)] text-xs">{{ item.variant.name }}</div>
              </div>
            </div>
            <div class="text-[var(--color-text-main)] font-medium text-sm">
              {{ formatPrice(item.totalPrice) }}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const orders = ref([])
const isLoading = ref(false)
let refreshInterval = null

const reversedOrders = computed(() => {
  return [...orders.value].reverse()
})

const formatPrice = (price) => {
  if (!price) return '0 UZS'
  return price.toLocaleString('uz-UZ') + ' UZS'
}

const formatDate = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleString('uz-UZ', { 
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const fetchOrders = async () => {
  isLoading.value = true
  try {
    const response = await fetch('http://localhost:5000/orders')
    const data = await response.json()
    if (data.success) {
      // Merge silently if not empty to prevent UI jump during edit
      if (orders.value.length === 0) {
        orders.value = data.orders
      } else {
        // Just update data
        orders.value = data.orders
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(() => { isLoading.value = false }, 300)
  }
}

const updateStatus = async (orderId, newStatus) => {
  try {
    const response = await fetch(`http://localhost:5000/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    const data = await response.json()
    if (data.success) {
      toast.success("Holat yangilandi!")
    } else {
      toast.error("Xatolik yuz berdi")
    }
  } catch (error) {
    toast.error("Tarmoq xatosi")
  }
}

onMounted(() => {
  fetchOrders()
  refreshInterval = setInterval(() => fetchOrders(), 5000)
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>
