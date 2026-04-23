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

    <!-- Today's Orders DataTable -->
    <div class="bg-[var(--color-surface-base)] border border-[var(--color-surface-light)] rounded-3xl p-6 shadow-sm">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 class="text-lg font-bold text-[var(--color-text-main)]">Bugungi buyurtmalar ro'yxati</h2>
        <button 
          @click="exportToExcel" 
          :disabled="todayOrders.length === 0"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Excel (CSV) ga yuklash
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-[var(--color-text-main)]">
          <thead class="text-xs text-[var(--color-text-muted)] uppercase bg-[var(--color-surface-light)]">
            <tr>
              <th scope="col" class="px-6 py-4 rounded-tl-xl">ID</th>
              <th scope="col" class="px-6 py-4">Sana</th>
              <th scope="col" class="px-6 py-4">Taomlar</th>
              <th scope="col" class="px-6 py-4">Summa</th>
              <th scope="col" class="px-6 py-4 rounded-tr-xl">Holati</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="todayOrders.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-[var(--color-text-muted)]">Bugun hali buyurtmalar tushmadi. Yangi kun uchun jadval bo'm-bo'sh!</td>
            </tr>
            <tr v-else v-for="order in todayOrders" :key="order.id" class="border-b border-[var(--color-surface-light)] last:border-0 hover:bg-[var(--color-surface-light)]/40 transition-colors">
              <td class="px-6 py-4 font-bold">#{{ order.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(order.date) }}</td>
              <td class="px-6 py-4 min-w-[200px]">
                <div v-for="(item, i) in order.items" :key="i" class="text-xs mb-1 last:mb-0">
                  <span class="font-bold text-[var(--color-primary-base)]">{{ item.quantity }}x</span> {{ item.name }} <span v-if="item.variant" class="text-[var(--color-text-muted)]">({{ item.variant.name }})</span>
                </div>
              </td>
              <td class="px-6 py-4 font-bold whitespace-nowrap">{{ formatPrice(order.total) }}</td>
              <td class="px-6 py-4 font-bold">
                <span :class="{
                  'text-yellow-500': order.status === 'Yangi',
                  'text-blue-500': order.status === 'Qabul qilindi',
                  'text-green-500': order.status === 'Yetkazildi',
                  'text-red-500': order.status === 'Bekor qilindi'
                }">{{ order.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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

const exportToExcel = () => {
  if (todayOrders.value.length === 0) return;

  // Add UTF-8 BOM to fix Excel encoding issues
  const BOM = '\uFEFF';
  const headers = ['Buyurtma ID', 'Sana', 'Taomlar', 'Summa (UZS)', 'Holati'];
  
  const rows = todayOrders.value.map(order => {
    const itemsStr = order.items.map(item => `${item.quantity}x ${item.name}${item.variant ? ` (${item.variant.name})` : ''}`).join('; ');
    return [
      `#${order.id}`,
      formatDate(order.date),
      `"${itemsStr}"`, // wrap in quotes to handle commas/semicolons inside
      order.total,
      order.status
    ];
  });

  const csvContent = BOM + [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `kunlik_buyurtmalar_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

</script>
