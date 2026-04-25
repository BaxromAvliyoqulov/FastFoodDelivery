<template>
  <div class="max-w-4xl mx-auto pb-20">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 class="text-2xl font-bold text-[var(--color-text-main)]">Buyurtmalar</h1>
      <div class="flex items-center gap-2">
        <button 
          @click="exportToExcel" 
          :disabled="filteredOrders.length === 0"
          class="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <span class="hidden sm:inline">Excel yuklash</span>
        </button>
        <button @click="fetchOrders" :disabled="isLoading" class="bg-[var(--color-surface-light)] hover:bg-[var(--color-text-muted)]/20 text-[var(--color-text-main)] px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm">
          <svg v-if="isLoading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="hidden sm:inline">Yangilash</span>
        </button>
      </div>
    </div>

    <!-- Status Filter Tabs -->
    <div class="flex overflow-x-auto gap-2 mb-5 pb-1 scrollbar-hide">
      <button 
        v-for="tab in filterTabs" 
        :key="tab.value"
        @click="activeFilter = tab.value"
        class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2"
        :class="activeFilter === tab.value 
          ? 'bg-[var(--color-primary-base)] text-white shadow-md' 
          : 'bg-[var(--color-surface-base)] text-[var(--color-text-muted)] border border-[var(--color-surface-light)] hover:bg-[var(--color-surface-light)]'"
      >
        {{ tab.label }}
        <span 
          v-if="tab.count > 0"
          class="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold"
          :class="activeFilter === tab.value 
            ? 'bg-white/20 text-white' 
            : 'bg-[var(--color-surface-light)] text-[var(--color-text-muted)]'"
        >{{ tab.count }}</span>
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="filteredOrders.length === 0 && !isLoading" class="bg-[var(--color-surface-base)] border border-[var(--color-surface-light)] rounded-3xl p-12 text-center text-[var(--color-text-muted)] shadow-sm">
      {{ activeFilter === 'all' ? "Hozircha hech qanday buyurtma kelib tushmagan." : `"${activeFilterLabel}" holatida buyurtmalar yo'q.` }}
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-4">
      <div v-for="(order, index) in reversedFilteredOrders" :key="order.id" class="bg-[var(--color-surface-base)] border border-[var(--color-surface-light)] rounded-3xl p-5 shadow-sm animate-fade-in">
        
        <!-- Order Header -->
        <div class="flex flex-col sm:flex-row justify-between sm:items-start mb-4 pb-4 border-b border-[var(--color-surface-light)]/50 gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="inline-flex items-center justify-center bg-[var(--color-primary-base)] text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                Buyurtma #{{ orders.length - orders.indexOf(filteredOrders[reversedFilteredOrders.length - 1 - index]) }}
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

        <!-- Customer Info -->
        <div v-if="order.name" class="mb-4 pb-4 border-b border-[var(--color-surface-light)]/50">
          <div class="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[var(--color-primary-base)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="text-sm font-semibold text-[var(--color-text-main)]">Mijoz ma'lumotlari</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            <div class="flex items-center gap-2 text-[var(--color-text-muted)]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span>{{ order.name }}</span>
            </div>
            <div class="flex items-center gap-2 text-[var(--color-text-muted)]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <span>{{ order.phone }}</span>
            </div>
            <div class="flex items-center gap-2 text-[var(--color-text-muted)]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>{{ order.address }}</span>
            </div>
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
import * as XLSX from 'xlsx'
import { API_URL } from '../../config'

const toast = useToast()
const orders = ref([])
const isLoading = ref(false)
const activeFilter = ref('all')
let refreshInterval = null

// Filter tabs config
const filterTabs = computed(() => [
  { value: 'all', label: 'Barchasi', count: orders.value.length },
  { value: 'Yangi', label: '🟡 Yangi', count: orders.value.filter(o => o.status === 'Yangi').length },
  { value: 'Qabul qilindi', label: '🔵 Qabul qilindi', count: orders.value.filter(o => o.status === 'Qabul qilindi').length },
  { value: 'Yetkazildi', label: '🟢 Yetkazildi', count: orders.value.filter(o => o.status === 'Yetkazildi').length },
  { value: 'Bekor qilindi', label: '🔴 Bekor qilindi', count: orders.value.filter(o => o.status === 'Bekor qilindi').length }
])

const activeFilterLabel = computed(() => {
  return filterTabs.value.find(t => t.value === activeFilter.value)?.label || ''
})

const filteredOrders = computed(() => {
  if (activeFilter.value === 'all') return orders.value
  return orders.value.filter(o => o.status === activeFilter.value)
})

const reversedFilteredOrders = computed(() => {
  return [...filteredOrders.value].reverse()
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
    const response = await fetch(`${API_URL}/orders`)
    const data = await response.json()
    if (data.success) {
      orders.value = data.orders
    }
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(() => { isLoading.value = false }, 300)
  }
}

const updateStatus = async (orderId, newStatus) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
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

const exportToExcel = () => {
  const exportOrders = filteredOrders.value
  if (exportOrders.length === 0) return

  // Format data for Excel
  const data = exportOrders.map(order => ({
    'ID': `#${order.id}`,
    'Sana': formatDate(order.date),
    'Mijoz': order.name || '',
    'Telefon': order.phone || '',
    'Manzil': order.address || '',
    'Taomlar': order.items.map(item => `${item.quantity}x ${item.name}${item.variant ? ` (${item.variant.name})` : ''}`).join('\n'),
    'Summa (UZS)': order.total,
    'Holati': order.status
  }))

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data)
  
  // Set column widths
  const wscols = [
    { wch: 15 }, // ID
    { wch: 20 }, // Sana
    { wch: 20 }, // Mijoz
    { wch: 20 }, // Telefon
    { wch: 30 }, // Manzil
    { wch: 40 }, // Taomlar
    { wch: 15 }, // Summa
    { wch: 15 }  // Holati
  ]
  ws['!cols'] = wscols

  // Create workbook
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Buyurtmalar")

  // Save file
  const filterName = activeFilter.value === 'all' ? 'barcha' : activeFilter.value.toLowerCase().replace(/ /g, '_')
  const dateStr = new Date().toISOString().split('T')[0]
  XLSX.writeFile(wb, `buyurtmalar_${filterName}_${dateStr}.xlsx`)
  
  toast.success("Excel fayl yaratildi!")
}

onMounted(() => {
  fetchOrders()
  refreshInterval = setInterval(() => fetchOrders(), 5000)
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
