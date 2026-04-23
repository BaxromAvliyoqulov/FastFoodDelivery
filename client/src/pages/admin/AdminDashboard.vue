<template>
  <div class="max-w-6xl mx-auto pb-20">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-[var(--color-text-main)]">Hisobot (Dashboard)</h1>
      <button @click="fetchOrders" :disabled="isLoading" class="bg-[var(--color-surface-light)] hover:bg-[var(--color-text-muted)]/20 text-[var(--color-text-main)] px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
        <svg v-if="isLoading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="hidden sm:inline">Yangilash</span>
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      <!-- Today's Revenue -->
      <div class="bg-[var(--color-surface-base)] border border-[var(--color-surface-light)] rounded-3xl p-6 shadow-sm flex flex-col justify-center items-start">
        <div class="text-[var(--color-text-muted)] text-sm font-bold mb-1">Bugungi daromad</div>
        <div class="text-2xl lg:text-3xl font-extrabold text-[var(--color-primary-base)]">{{ formatPrice(todayRevenue) }}</div>
        <div class="text-[var(--color-text-muted)] text-xs mt-2">{{ todayOrdersCount }} ta buyurtma</div>
      </div>

      <!-- This Week's Revenue -->
      <div class="bg-[var(--color-surface-base)] border border-[var(--color-surface-light)] rounded-3xl p-6 shadow-sm flex flex-col justify-center items-start">
        <div class="text-[var(--color-text-muted)] text-sm font-bold mb-1">Shu hafta</div>
        <div class="text-2xl font-bold text-[var(--color-text-main)]">{{ formatPrice(weekRevenue) }}</div>
        <div class="text-[var(--color-text-muted)] text-xs mt-2">{{ weekOrdersCount }} ta buyurtma</div>
      </div>

      <!-- This Month's Revenue -->
      <div class="bg-[var(--color-surface-base)] border border-[var(--color-surface-light)] rounded-3xl p-6 shadow-sm flex flex-col justify-center items-start">
        <div class="text-[var(--color-text-muted)] text-sm font-bold mb-1">Shu oy</div>
        <div class="text-2xl font-bold text-[var(--color-text-main)]">{{ formatPrice(monthRevenue) }}</div>
        <div class="text-[var(--color-text-muted)] text-xs mt-2">{{ monthOrdersCount }} ta buyurtma</div>
      </div>

      <!-- Total Delivered -->
      <div class="bg-[var(--color-surface-base)] border border-[var(--color-surface-light)] rounded-3xl p-6 shadow-sm flex flex-col justify-center items-start">
        <div class="text-[var(--color-text-muted)] text-sm font-bold mb-1">Umumiy muvaffaqiyatli</div>
        <div class="text-2xl font-bold text-green-500">{{ totalDeliveredCount }} ta buyurtma</div>
        <div class="text-[var(--color-text-muted)] text-xs mt-2">Barcha vaqt uchun</div>
      </div>

    </div>

    <!-- Recent Activity -->
    <div class="bg-[var(--color-surface-base)] border border-[var(--color-surface-light)] rounded-3xl p-6 shadow-sm">
      <h2 class="text-lg font-bold text-[var(--color-text-main)] mb-4">So'nggi harakatlar</h2>
      <div v-if="recentOrders.length === 0" class="text-[var(--color-text-muted)] text-sm">Hozircha ma'lumot yo'q.</div>
      <ul v-else class="space-y-4">
        <li v-for="order in recentOrders" :key="order.id" class="flex justify-between items-center border-b border-[var(--color-surface-light)] pb-4 last:border-0 last:pb-0">
          <div>
            <div class="font-bold text-[var(--color-text-main)]">Buyurtma #{{ order.id }}</div>
            <div class="text-xs text-[var(--color-text-muted)]">{{ formatDate(order.date) }}</div>
          </div>
          <div class="text-right">
            <div class="font-bold text-[var(--color-primary-base)]">{{ formatPrice(order.total) }}</div>
            <div class="text-xs font-bold" :class="{
                  'text-yellow-500': order.status === 'Yangi',
                  'text-blue-500': order.status === 'Qabul qilindi',
                  'text-green-500': order.status === 'Yetkazildi',
                  'text-red-500': order.status === 'Bekor qilindi'
                }">{{ order.status }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const orders = ref([])
const isLoading = ref(false)

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
      orders.value = data.orders
    }
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})

// Calculations
const isToday = (date) => {
  const d = new Date(date)
  const today = new Date()
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
}

const isThisWeek = (date) => {
  const d = new Date(date)
  const today = new Date()
  const firstDay = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1))) // Monday
  firstDay.setHours(0,0,0,0)
  return d >= firstDay
}

const isThisMonth = (date) => {
  const d = new Date(date)
  const today = new Date()
  return d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
}

// Stats computed
const validOrders = computed(() => orders.value.filter(o => o.status !== 'Bekor qilindi'))

const todayOrders = computed(() => validOrders.value.filter(o => isToday(o.date)))
const todayRevenue = computed(() => todayOrders.value.reduce((sum, o) => sum + o.total, 0))
const todayOrdersCount = computed(() => todayOrders.value.length)

const weekOrders = computed(() => validOrders.value.filter(o => isThisWeek(o.date)))
const weekRevenue = computed(() => weekOrders.value.reduce((sum, o) => sum + o.total, 0))
const weekOrdersCount = computed(() => weekOrders.value.length)

const monthOrders = computed(() => validOrders.value.filter(o => isThisMonth(o.date)))
const monthRevenue = computed(() => monthOrders.value.reduce((sum, o) => sum + o.total, 0))
const monthOrdersCount = computed(() => monthOrders.value.length)

const totalDeliveredCount = computed(() => orders.value.filter(o => o.status === 'Yetkazildi').length)

const recentOrders = computed(() => {
  return [...orders.value].reverse().slice(0, 5) // Last 5 orders
})

</script>
