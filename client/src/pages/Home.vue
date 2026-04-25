<template>
  <div class="max-w-xl mx-auto pb-20">
    <!-- Header -->
    <div class="px-4 pt-4 pb-2">
      <h1 class="text-3xl font-bold text-[var(--color-text-main)] tracking-tight text-center">Xush kelibsiz!</h1>
      <h2 class="text-xl font-extrabold text-[var(--color-primary-base)] text-center mt-1">75 BURGER</h2>
    </div>

    <!-- Sticky Category Bar -->
    <div class="sticky top-0 z-40 bg-[var(--color-background)]/95 backdrop-blur py-3 px-4 border-b border-[var(--color-surface-light)] flex overflow-x-auto gap-3 scrollbar-hide mb-4 shadow-sm">
      <button 
        v-for="category in store.categories" 
        :key="category.id"
        :disabled="!categoryHasProducts(category.id)"
        @click="scrollToCategory(category.id)"
        class="whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all text-sm flex-shrink-0"
        :class="{
          'bg-[var(--color-primary-base)] text-white shadow-md scale-105': activeCategory === category.id && categoryHasProducts(category.id),
          'bg-[var(--color-surface-base)] text-[var(--color-text-main)] border border-[var(--color-surface-light)] hover:bg-[var(--color-surface-light)]': activeCategory !== category.id && categoryHasProducts(category.id),
          'bg-[var(--color-surface-base)] text-[var(--color-text-muted)] border border-[var(--color-surface-light)] opacity-40 cursor-not-allowed': !categoryHasProducts(category.id)
        }"
      >
        {{ category.name }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="store.isMenuLoading" class="flex justify-center py-20">
      <svg class="animate-spin h-10 w-10 text-[var(--color-primary-base)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Grouped Product List (Tab View) -->
    <div v-else class="px-4">
      <div 
        v-for="category in store.categories" 
        :key="category.id" 
        v-show="activeCategory === category.id"
        class="animate-fade-in"
      >
        <div v-if="categoryHasProducts(category.id)">
          <div class="flex flex-col space-y-4">
            <div 
              v-for="product in getProductsByCategory(category.id)" 
              :key="product.id"
              @click="openModal(product)"
              class="bg-[var(--color-surface-base)] rounded-2xl overflow-hidden shadow border border-[var(--color-surface-light)] flex items-stretch cursor-pointer active:scale-[0.98] transition-transform"
            >
              <!-- Product Info (Left) -->
              <div class="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h3 class="text-lg font-bold text-[var(--color-text-main)] leading-tight">{{ product.name }}</h3>
                  <p class="text-[var(--color-text-muted)] text-xs mt-1 line-clamp-2 leading-snug">{{ product.description }}</p>
                  
                  <!-- Variants Indicator -->
                  <div v-if="product.variants && product.variants.length > 0" class="flex flex-wrap gap-1 mt-2">
                    <span v-for="v in product.variants" :key="v.id" class="text-[10px] bg-[var(--color-surface-light)] text-[var(--color-text-muted)] px-1.5 py-0.5 rounded-md border border-[var(--color-surface-light)]">
                      {{ v.name }}
                    </span>
                  </div>
                </div>
                <div class="mt-3 font-bold text-[var(--color-primary-base)]">
                  {{ product.variants && product.variants.length > 0 ? 'dan ' : '' }}{{ formatPrice(product.price) }}
                </div>
              </div>
              
              <!-- Product Image (Right) -->
              <div class="w-32 sm:w-40 relative flex-shrink-0 bg-[var(--color-surface-light)]">
                <img v-if="product.image" :src="product.image" :alt="product.name" class="absolute inset-0 w-full h-full object-cover" />
                <div v-else class="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)] text-xs">
                  No Image
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- The Modal -->
    <ProductModal 
      :is-open="isModalOpen" 
      :product="selectedProduct" 
      @close="closeModal"
      @add="handleAddToOrder"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import ProductModal from '../components/ProductModal.vue'
import { useToast } from 'vue-toastification'
import { useAppStore } from '../store'

const toast = useToast()
const store = useAppStore()

const formatPrice = (price) => {
  return price.toLocaleString('uz-UZ') + ' UZS'
}

const categoryHasProducts = (categoryId) => {
  return store.products.some(p => p.categoryId === categoryId)
}

const getProductsByCategory = (categoryId) => {
  return store.products.filter(p => p.categoryId === categoryId)
}

const activeCategory = ref(null)
watch(() => store.categories, (newCats) => {
  if (newCats.length > 0 && !activeCategory.value) {
    activeCategory.value = newCats[0].id
  }
}, { immediate: true })

const scrollToCategory = (categoryId) => {
  activeCategory.value = categoryId
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  store.fetchMenuData()
})

// Modal logic
const isModalOpen = ref(false)
const selectedProduct = ref(null)

const openModal = (product) => {
  selectedProduct.value = product
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
    selectedProduct.value = null
  }, 200)
}

const handleAddToOrder = (orderItem) => {
  store.addToCart(orderItem)
  const unitLabel = orderItem.unit === 'kg' ? 'kg' : 'ta'
  const qtyDisplay = orderItem.unit === 'kg' ? orderItem.quantity.toFixed(2) : orderItem.quantity
  toast.success(`${qtyDisplay} ${unitLabel} ${orderItem.name} savatga qo'shildi!`)
}
</script>

<style scoped>
/* Utility to hide scrollbar but keep functionality */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
