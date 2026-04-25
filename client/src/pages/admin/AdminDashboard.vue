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
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      
      <!-- Today's Revenue -->
      <div class="bg-[var(--color-surface-base)] border border-[var(--color-surface-light)] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[var(--color-primary-base)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <span class="text-[var(--color-text-muted)] text-xs font-bold uppercase">Bugun</span>
        </div>
        <div class="text-xl sm:text-2xl font-extrabold text-[var(--color-primary-base)]">{{ formatPrice(todayRevenue) }}</div>
        <div class="text-[var(--color-text-muted)] text-xs mt-1">{{ todayOrdersCount }} ta buyurtma</div>
      </div>

      <!-- This Week -->
      <div class="bg-[var(--color-surface-base)] border border-[var(--color-surface-light)] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <span class="text-[var(--color-text-muted)] text-xs font-bold uppercase">Hafta</span>
        </div>
        <div class="text-xl sm:text-2xl font-bold text-[var(--color-text-main)]">{{ formatPrice(weekRevenue) }}</div>
        <div class="text-[var(--color-text-muted)] text-xs mt-1">{{ weekOrdersCount }} ta buyurtma</div>
      </div>

      <!-- This Month -->
      <div class="bg-[var(--color-surface-base)] border border-[var(--color-surface-light)] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <span class="text-[var(--color-text-muted)] text-xs font-bold uppercase">Oy</span>
        </div>
        <div class="text-xl sm:text-2xl font-bold text-[var(--color-text-main)]">{{ formatPrice(monthRevenue) }}</div>
        <div class="text-[var(--color-text-muted)] text-xs mt-1">{{ monthOrdersCount }} ta buyurtma</div>
      </div>

      <!-- Total Delivered -->
      <div class="bg-[var(--color-surface-base)] border border-[var(--color-surface-light)] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <span class="text-[var(--color-text-muted)] text-xs font-bold uppercase">Yetkazildi</span>
        </div>
        <div class="text-xl sm:text-2xl font-bold text-green-400">{{ totalDeliveredCount }}</div>
        <div class="text-[var(--color-text-muted)] text-xs mt-1">Barcha vaqt uchun</div>
      </div>
    </div>

    <!-- 🔥 Bestseller Section -->
    <div class="bg-[var(--color-surface-base)] border border-[var(--color-surface-light)] rounded-3xl p-5 sm:p-6 shadow-sm mb-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <div class="flex items-center gap-2">
          <span class="text-xl">🔥</span>
          <h2 class="text-lg font-bold text-[var(--color-text-main)]">Eng ko'p sotilganlar</h2>
        </div>
        <!-- Period Tabs -->
        <div class="flex bg-[var(--color-background)] rounded-xl p-1 gap-1">
          <button 
            v-for="period in periods" 
            :key="period.key"
            @click="activePeriod = period.key"
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            :class="activePeriod === period.key 
              ? 'bg-[var(--color-primary-base)] text-white shadow-sm' 
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'"
          >
            {{ period.label }}
          </button>
        </div>
      </div>

      <!-- Bestseller Grid by Category -->
      <div v-if="bestsellers.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div 
          v-for="item in bestsellers" 
          :key="item.categoryId"
          class="bg-[var(--color-background)] rounded-2xl p-4 border border-[var(--color-surface-light)]/50 hover:border-[var(--color-primary-base)]/30 transition-colors"
        >
          <!-- Category badge -->
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-[var(--color-text-muted)] bg-[var(--color-surface-light)] px-2.5 py-1 rounded-lg">
              {{ item.categoryName }}
            </span>
            <span class="text-xs text-[var(--color-text-muted)]">
              {{ periodLabel }}
            </span>
          </div>
          <!-- Product Info -->
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-[var(--color-surface-light)] overflow-hidden flex-shrink-0">
              <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-lg">🍽️</div>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-[var(--color-text-main)] text-sm truncate">{{ item.name }}</h3>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[var(--color-primary-base)] font-extrabold text-lg">{{ item.count }}</span>
                <span class="text-[var(--color-text-muted)] text-xs">ta sotildi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty Bestseller State -->
      <div v-else class="text-center py-8 text-[var(--color-text-muted)] text-sm">
        {{ periodLabel }} uchun hali buyurtmalar yo'q
      </div>
    </div>

    <!-- 📋 Recent Orders (Compact) -->
    <div class="bg-[var(--color-surface-base)] border border-[var(--color-surface-light)] rounded-3xl p-5 sm:p-6 shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold text-[var(--color-text-main)] flex items-center gap-2">
          <span>📋</span> Oxirgi buyurtmalar
        </h2>
        <span class="text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-light)] px-2.5 py-1 rounded-lg font-bold">
          So'nggi {{ recentOrders.length }} ta
        </span>
      </div>

      <div v-if="recentOrders.length === 0" class="text-center py-8 text-[var(--color-text-muted)] text-sm">
        Hali buyurtmalar yo'q
      </div>

      <div v-else class="space-y-2">
        <div 
          v-for="order in recentOrders" 
          :key="order.id"
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 bg-[var(--color-background)] rounded-xl px-4 py-3 border border-[var(--color-surface-light)]/50 hover:border-[var(--color-surface-light)] transition-colors"
        >
          <!-- Left: Customer & Items -->
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <!-- Avatar circle -->
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              :class="{
                'bg-yellow-500/15 text-yellow-500': order.status === 'Yangi',
                'bg-blue-500/15 text-blue-500': order.status === 'Qabul qilindi',
                'bg-green-500/15 text-green-500': order.status === 'Yetkazildi',
                'bg-red-500/15 text-red-500': order.status === 'Bekor qilindi'
              }"
            >
              {{ getInitials(order.name) }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="font-bold text-sm text-[var(--color-text-main)] truncate">{{ order.name || 'Noma\'lum' }}</span>
                <span v-if="order.phone" class="text-xs text-[var(--color-text-muted)] hidden sm:inline">{{ order.phone }}</span>
              </div>
              <div class="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
                {{ order.items.map(i => `${i.quantity}x ${i.name}`).join(', ') }}
              </div>
            </div>
          </div>

          <!-- Right: Price & Status -->
          <div class="flex items-center gap-3 sm:gap-4 pl-12 sm:pl-0">
            <span class="font-bold text-sm text-[var(--color-text-main)] whitespace-nowrap">{{ formatPrice(order.total) }}</span>
            <span 
              class="text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap"
              :class="{
                'bg-yellow-500/15 text-yellow-500': order.status === 'Yangi',
                'bg-blue-500/15 text-blue-500': order.status === 'Qabul qilindi',
                'bg-green-500/15 text-green-500': order.status === 'Yetkazildi',
                'bg-red-500/15 text-red-500': order.status === 'Bekor qilindi'
              }"
            >{{ order.status }}</span>
            <span class="text-xs text-[var(--color-text-muted)] whitespace-nowrap hidden sm:inline">{{ formatTime(order.date) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../../store'
import { API_URL } from '../../config'

const store = useAppStore()
const orders = ref([])
const isLoading = ref(false)

const formatPrice = (price) => {
  if (!price) return '0 UZS'
  return price.toLocaleString('uz-UZ') + ' UZS'
}

const formatTime = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleString('uz-UZ', { 
    day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const fetchOrders = async () => {
  isLoading.value = true
  try {
    const response = await fetch(`${API_URL}/orders`)
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
  // Also ensure store has menu data for category names
  if (store.categories.length === 0) {
    store.fetchMenuData()
  }
})

// --- Time Filters ---
const isToday = (date) => {
  const d = new Date(date)
  const today = new Date()
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
}

const isThisWeek = (date) => {
  const d = new Date(date)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dayOfWeek = today.getDay() || 7 // Monday = 1
  const monday = new Date(today)
  monday.setDate(today.getDate() - dayOfWeek + 1)
  monday.setHours(0,0,0,0)
  return d >= monday
}

const isThisMonth = (date) => {
  const d = new Date(date)
  const today = new Date()
  return d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
}

// --- Stats ---
const validOrders = computed(() => orders.value.filter(o => o.status !== 'Bekor qilindi'))

const todayOrders = computed(() => validOrders.value.filter(o => isToday(o.date)))
const todayRevenue = computed(() => todayOrders.value.reduce((sum, o) => sum + (o.total || 0), 0))
const todayOrdersCount = computed(() => todayOrders.value.length)

const weekOrders = computed(() => validOrders.value.filter(o => isThisWeek(o.date)))
const weekRevenue = computed(() => weekOrders.value.reduce((sum, o) => sum + (o.total || 0), 0))
const weekOrdersCount = computed(() => weekOrders.value.length)

const monthOrders = computed(() => validOrders.value.filter(o => isThisMonth(o.date)))
const monthRevenue = computed(() => monthOrders.value.reduce((sum, o) => sum + (o.total || 0), 0))
const monthOrdersCount = computed(() => monthOrders.value.length)

const totalDeliveredCount = computed(() => orders.value.filter(o => o.status === 'Yetkazildi').length)

// --- Bestseller Logic ---
const periods = [
  { key: 'today', label: 'Bugun' },
  { key: 'week', label: 'Hafta' },
  { key: 'month', label: 'Oy' }
]

const activePeriod = ref('today')

const periodLabel = computed(() => {
  return periods.find(p => p.key === activePeriod.value)?.label || ''
})

const periodOrders = computed(() => {
  switch (activePeriod.value) {
    case 'today': return todayOrders.value
    case 'week': return weekOrders.value
    case 'month': return monthOrders.value
    default: return todayOrders.value
  }
})

const bestsellers = computed(() => {
  const categories = store.categories
  if (!categories.length || !periodOrders.value.length) return []

  // Count items sold per product across all orders in the period
  const productCounts = {}
  
  periodOrders.value.forEach(order => {
    if (!order.items) return
    order.items.forEach(item => {
      const key = item.productId || item.name
      if (!productCounts[key]) {
        productCounts[key] = {
          name: item.name,
          productId: item.productId,
          count: 0,
          image: null
        }
      }
      productCounts[key].count += item.quantity || 1
    })
  })

  // Find the product info from store for images and categoryId
  const results = []
  
  categories.forEach(cat => {
    // Get all products in this category
    const categoryProducts = store.products.filter(p => p.categoryId === cat.id)
    
    // Find the best-selling product in this category
    let bestProduct = null
    let bestCount = 0

    categoryProducts.forEach(prod => {
      // Match by productId or name
      const countEntry = productCounts[prod.id] || productCounts[prod.name]
      if (countEntry && countEntry.count > bestCount) {
        bestCount = countEntry.count
        bestProduct = prod
      }
    })

    if (bestProduct && bestCount > 0) {
      results.push({
        categoryId: cat.id,
        categoryName: cat.name,
        name: bestProduct.name,
        image: bestProduct.image,
        count: bestCount
      })
    }
  })

  return results
})

// --- Recent Orders (last 5) ---
const recentOrders = computed(() => {
  return [...orders.value].reverse().slice(0, 5)
})
</script>
