<template>
  <div class="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-[var(--color-background)]">
    
    <!-- Sidebar / Top Tabs -->
    <div class="w-full md:w-64 bg-[var(--color-surface-base)] border-b md:border-b-0 md:border-r border-[var(--color-surface-light)] flex-shrink-0 md:h-[calc(100vh-64px)] md:sticky md:top-[64px] overflow-y-auto">
      <div class="flex md:flex-col overflow-x-auto no-scrollbar md:overflow-visible p-3 sm:p-4 gap-2 h-full items-center md:items-stretch">
        
        <button 
          @click="activeTab = 'dashboard'" 
          :class="['px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold text-left whitespace-nowrap transition-colors flex items-center gap-2 sm:gap-3 shrink-0 md:shrink', activeTab === 'dashboard' ? 'bg-[var(--color-primary-base)] text-white shadow-lg shadow-orange-500/20' : 'text-[var(--color-text-main)] hover:bg-[var(--color-surface-light)]']"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
          <span class="md:block">Dashboard</span>
        </button>

        <button 
          @click="activeTab = 'orders'" 
          :class="['px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold text-left whitespace-nowrap transition-colors flex items-center gap-2 sm:gap-3 shrink-0 md:shrink', activeTab === 'orders' ? 'bg-[var(--color-primary-base)] text-white shadow-lg shadow-orange-500/20' : 'text-[var(--color-text-main)] hover:bg-[var(--color-surface-light)]']"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          <span>Buyurtmalar</span>
        </button>
        
        <button 
          @click="activeTab = 'products'" 
          :class="['px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold text-left whitespace-nowrap transition-colors flex items-center gap-2 sm:gap-3 shrink-0 md:shrink', activeTab === 'products' ? 'bg-[var(--color-primary-base)] text-white shadow-lg shadow-orange-500/20' : 'text-[var(--color-text-main)] hover:bg-[var(--color-surface-light)]']"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          <span>Menyu</span>
        </button>
        
        <button 
          @click="activeTab = 'categories'" 
          :class="['px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold text-left whitespace-nowrap transition-colors flex items-center gap-2 sm:gap-3 shrink-0 md:shrink', activeTab === 'categories' ? 'bg-[var(--color-primary-base)] text-white shadow-lg shadow-orange-500/20' : 'text-[var(--color-text-main)] hover:bg-[var(--color-surface-light)]']"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
          <span>Kategoriyalar</span>
        </button>

        <button 
          @click="activeTab = 'settings'" 
          :class="['px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold text-left whitespace-nowrap transition-colors flex items-center gap-2 sm:gap-3 shrink-0 md:shrink', activeTab === 'settings' ? 'bg-[var(--color-primary-base)] text-white shadow-lg shadow-orange-500/20' : 'text-[var(--color-text-main)] hover:bg-[var(--color-surface-light)]']"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span>Sozlamalar</span>
        </button>
        
        <div class="hidden md:block flex-1"></div>

        <button 
          @click="handleLogout" 
          class="px-4 py-3 rounded-xl text-sm font-bold text-left whitespace-nowrap transition-colors flex items-center gap-3 text-red-500 hover:bg-red-500/10 md:mt-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Chiqish
        </button>

      </div>
    </div>

    <!-- Content Area -->
    <div class="flex-1 p-4 md:p-8 overflow-y-auto">
      <AdminDashboard v-if="activeTab === 'dashboard'" />
      <AdminOrders v-if="activeTab === 'orders'" />
      <AdminProducts v-if="activeTab === 'products'" />
      <AdminCategories v-if="activeTab === 'categories'" />
      <AdminSettings v-if="activeTab === 'settings'" />
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../store'
import AdminDashboard from './admin/AdminDashboard.vue'
import AdminOrders from './admin/AdminOrders.vue'
import AdminProducts from './admin/AdminProducts.vue'
import AdminCategories from './admin/AdminCategories.vue'
import AdminSettings from './admin/AdminSettings.vue'

const store = useAppStore()
const router = useRouter()
const activeTab = ref('dashboard')

onMounted(() => {
  store.fetchMenuData()
})

const handleLogout = () => {
  store.logout()
  router.push('/')
}
</script>
