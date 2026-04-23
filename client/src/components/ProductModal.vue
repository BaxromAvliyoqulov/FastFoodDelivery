<template>
  <!-- Backdrop -->
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" @click.self="close">
    
    <!-- Modal Container -->
    <div class="bg-[var(--color-surface-base)] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      
      <!-- Image Section -->
      <div class="relative h-48 bg-[var(--color-surface-light)]">
        <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
          <span>No Image</span>
        </div>
        <button @click="close" class="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content Section (Scrollable) -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-[var(--color-text-main)]">{{ product.name }}</h2>
          <p class="text-[var(--color-text-muted)] mt-1 text-sm">{{ product.description }}</p>
        </div>

        <!-- Variants (Radio) -->
        <div v-if="product.variants && product.variants.length > 0">
          <h3 class="text-lg font-semibold text-[var(--color-text-main)] mb-3">Choose Size</h3>
          <div class="space-y-2">
            <label v-for="variant in product.variants" :key="variant.id" class="flex items-center justify-between p-3 border border-[var(--color-surface-light)] rounded-xl cursor-pointer hover:bg-[var(--color-surface-light)] transition" :class="{'border-[var(--color-primary-base)] bg-[var(--color-surface-light)]/50': selectedVariant?.id === variant.id}">
              <div class="flex items-center">
                <input type="radio" :value="variant" v-model="selectedVariant" class="w-4 h-4 text-[var(--color-primary-base)] bg-[var(--color-surface-base)] border-[var(--color-surface-light)] focus:ring-[var(--color-primary-base)] focus:ring-offset-[var(--color-surface-base)]">
                <span class="ml-3 text-[var(--color-text-main)]">{{ variant.name }}</span>
              </div>
              <span class="text-[var(--color-text-muted)]">{{ formatPrice(variant.price) }}</span>
            </label>
          </div>
        </div>




        
        <!-- Quantity Selector -->
        <div class="flex items-center justify-center space-x-6 py-2">
          <button @click="decrement" class="w-10 h-10 rounded-full bg-[var(--color-surface-light)] text-[var(--color-text-main)] flex items-center justify-center hover:bg-[var(--color-text-muted)]/20 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span class="text-2xl font-semibold text-[var(--color-text-main)] w-8 text-center">{{ quantity }}</span>
          <button @click="increment" class="w-10 h-10 rounded-full bg-[var(--color-surface-light)] text-[var(--color-text-main)] flex items-center justify-center hover:bg-[var(--color-text-muted)]/20 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-[var(--color-surface-light)] bg-[var(--color-surface-base)]">
        <button @click="addToOrder" class="w-full bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-dark)] text-white font-semibold py-4 rounded-xl shadow-lg transition-colors flex justify-between px-6">
          <span>Savatga qo'shish</span>
          <span>{{ formatPrice(totalPrice) }}</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  product: Object
})

const emit = defineEmits(['close', 'add'])

const quantity = ref(1)
const selectedVariant = ref(null)
const note = ref('')

const formatPrice = (price) => {
  return price.toLocaleString('uz-UZ') + ' UZS'
}

// Reset state when a new product is opened
watch(() => props.isOpen, (newVal) => {
  if (newVal && props.product) {
    quantity.value = 1
    // Set default variant if available
    if (props.product.variants && props.product.variants.length > 0) {
      selectedVariant.value = props.product.variants[0]
    } else {
      selectedVariant.value = null
    }
  }
})

const totalPrice = computed(() => {
  if (!props.product) return 0
  
  let basePrice = selectedVariant.value ? selectedVariant.value.price : (props.product.price || 0)
  
  return basePrice * quantity.value
})

const increment = () => { quantity.value++ }
const decrement = () => { if (quantity.value > 1) quantity.value-- }

const close = () => {
  emit('close')
}

const addToOrder = () => {
  const orderItem = {
    productId: props.product.id,
    name: props.product.name,
    variant: selectedVariant.value,
    quantity: quantity.value,
    totalPrice: totalPrice.value
  }
  
  console.log('Adding to order:', orderItem)
  emit('add', orderItem)
  close()
}
</script>
