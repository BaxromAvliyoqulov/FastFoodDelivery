<template>
  <div v-if="store.isCheckoutOpen" class="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="store.closeCheckout()"></div>

    <!-- Modal Panel -->
    <div class="relative bg-[var(--color-surface-base)] w-full max-w-md mx-auto rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up max-h-[90dvh] overflow-y-auto">
      
      <!-- Header -->
      <div class="px-6 pt-6 pb-4 border-b border-[var(--color-surface-light)]">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-[var(--color-text-main)]">Buyurtma ma'lumotlari</h2>
          <button @click="store.closeCheckout()" class="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition bg-[var(--color-surface-light)] rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="text-sm text-[var(--color-text-muted)] mt-1">Yetkazib berish uchun ma'lumotlaringizni kiriting</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="px-6 py-5 space-y-4">
        
        <!-- Name Field -->
        <div>
          <label for="checkout-name" class="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">Ismingiz</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input 
              id="checkout-name"
              v-model="form.name" 
              type="text" 
              placeholder="Ism Familiya"
              class="w-full bg-[var(--color-background)] border border-[var(--color-surface-light)] rounded-xl py-3 pl-11 pr-4 text-[var(--color-text-main)] placeholder-[var(--color-text-muted)]/50 outline-none focus:border-[var(--color-primary-base)] transition-colors"
              :class="{ 'border-red-500': errors.name }"
            />
          </div>
          <p v-if="errors.name" class="text-red-400 text-xs mt-1">{{ errors.name }}</p>
        </div>

        <!-- Phone Field -->
        <div>
          <label for="checkout-phone" class="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">Telefon raqam</label>
          <div class="relative flex">
            <span class="inline-flex items-center gap-1.5 px-3 bg-[var(--color-surface-light)] border border-r-0 border-[var(--color-surface-light)] rounded-l-xl text-[var(--color-text-main)] text-sm font-semibold select-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +998
            </span>
            <input 
              id="checkout-phone"
              :value="form.phone" 
              @input="onPhoneInput"
              type="tel" 
              placeholder="90 123 45 67"
              maxlength="12"
              class="w-full bg-[var(--color-background)] border border-[var(--color-surface-light)] rounded-r-xl py-3 px-4 text-[var(--color-text-main)] placeholder-[var(--color-text-muted)]/50 outline-none focus:border-[var(--color-primary-base)] transition-colors tracking-wide"
              :class="{ 'border-red-500': errors.phone }"
            />
          </div>
          <p v-if="errors.phone" class="text-red-400 text-xs mt-1">{{ errors.phone }}</p>
        </div>

        <!-- Address Field -->
        <div>
          <label for="checkout-address" class="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">Manzil</label>
          <div class="relative">
            <span class="absolute left-3 top-3 text-[var(--color-text-muted)]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            <textarea 
              id="checkout-address"
              v-model="form.address" 
              rows="2"
              placeholder="Ko'cha, uy, xonadon raqami"
              class="w-full bg-[var(--color-background)] border border-[var(--color-surface-light)] rounded-xl py-3 pl-11 pr-4 text-[var(--color-text-main)] placeholder-[var(--color-text-muted)]/50 outline-none focus:border-[var(--color-primary-base)] transition-colors resize-none"
              :class="{ 'border-red-500': errors.address }"
            ></textarea>
          </div>
          <p v-if="errors.address" class="text-red-400 text-xs mt-1">{{ errors.address }}</p>
        </div>

        <!-- Order Summary Mini -->
        <div class="bg-[var(--color-background)] rounded-xl p-4 space-y-2 border border-[var(--color-surface-light)]/50">
          <div class="flex justify-between text-sm text-[var(--color-text-muted)]">
            <span>Mahsulotlar ({{ store.cartTotalItems }})</span>
            <span>{{ formatPrice(store.cartSubtotal) }}</span>
          </div>
          <div class="flex justify-between text-sm text-[var(--color-text-muted)]">
            <span>Yetkazib berish</span>
            <span>{{ formatPrice(store.deliveryFee) }}</span>
          </div>
          <div class="flex justify-between font-bold text-[var(--color-text-main)] pt-2 border-t border-[var(--color-surface-light)]/50">
            <span>Jami</span>
            <span class="text-[var(--color-primary-base)]">{{ formatPrice(store.cartTotal) }}</span>
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="w-full bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-dark)] text-white font-semibold py-3.5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          <span v-if="!isSubmitting">Buyurtma berish</span>
          <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../store'
import { useToast } from 'vue-toastification'
import { API_URL } from '../config'

const store = useAppStore()
const router = useRouter()
const toast = useToast()

const form = reactive({
  name: store.userInfo.name || '',
  phone: stripCountryCode(store.userInfo.phone || ''),
  address: store.userInfo.address || ''
})

// Strip +998 prefix for display, keep only local digits
function stripCountryCode(phone) {
  return phone.replace(/^\+?998\s?/, '').trim()
}

// Format phone input: only digits, max 9, auto-space as XX XXX XX XX
const onPhoneInput = (e) => {
  let raw = e.target.value.replace(/\D/g, '').slice(0, 9)
  // Format: XX XXX XX XX
  let formatted = ''
  if (raw.length > 0) formatted += raw.slice(0, 2)
  if (raw.length > 2) formatted += ' ' + raw.slice(2, 5)
  if (raw.length > 5) formatted += ' ' + raw.slice(5, 7)
  if (raw.length > 7) formatted += ' ' + raw.slice(7, 9)
  form.phone = formatted
}

const errors = reactive({
  name: '',
  phone: '',
  address: ''
})

const isSubmitting = ref(false)

// Pre-fill form when modal opens if user info was previously saved
watch(() => store.isCheckoutOpen, (isOpen) => {
  if (isOpen) {
    form.name = store.userInfo.name || ''
    form.phone = stripCountryCode(store.userInfo.phone || '')
    form.address = store.userInfo.address || ''
    errors.name = ''
    errors.phone = ''
    errors.address = ''
  }
})

const formatPrice = (price) => {
  return price.toLocaleString('uz-UZ') + ' UZS'
}

const validate = () => {
  let isValid = true
  errors.name = ''
  errors.phone = ''
  errors.address = ''

  if (!form.name.trim()) {
    errors.name = 'Ismingizni kiriting'
    isValid = false
  }

  const phoneDigits = form.phone.replace(/\D/g, '')
  if (!phoneDigits) {
    errors.phone = 'Telefon raqamni kiriting'
    isValid = false
  } else if (phoneDigits.length < 9) {
    errors.phone = "Telefon raqam noto'g'ri (9 ta raqam kerak)"
    isValid = false
  }

  if (!form.address.trim()) {
    errors.address = 'Manzilingizni kiriting'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return
  if (store.cartItems.length === 0) return

  isSubmitting.value = true

  // Save user info to store + localStorage (with +998 prefix)
  const fullPhone = '+998 ' + form.phone.trim()
  store.setUserInfo({
    name: form.name.trim(),
    phone: fullPhone,
    address: form.address.trim()
  })

  try {
    const orderData = {
      customer: {
        name: store.userInfo.name,
        phone: store.userInfo.phone,
        address: store.userInfo.address
      },
      items: store.cartItems,
      subtotal: store.cartSubtotal,
      deliveryFee: store.deliveryFee,
      total: store.cartTotal
    }

    const response = await fetch(`${API_URL}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })

    if (!response.ok) {
      throw new Error('Server xatosi')
    }

    const result = await response.json()
    console.log('Server javobi:', result)

    store.closeCheckout()
    store.clearCart()
    
    // Redirect to success page with Order ID
    if (result.success && result.order?.id) {
      router.push({ name: 'OrderSuccess', query: { id: result.order.id } })
    } else {
      toast.success("Buyurtmangiz muvaffaqiyatli qabul qilindi!")
    }
  } catch (error) {
    console.error("Xatolik yuz berdi:", error)
    toast.error("Buyurtma yuborishda xatolik yuz berdi. Iltimos qayta urinib ko'ring.")
  } finally {
    isSubmitting.value = false
  }
}
</script>
