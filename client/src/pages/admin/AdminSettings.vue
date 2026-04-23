<template>
  <div class="max-w-xl mx-auto pb-20">
    <h1 class="text-2xl font-bold text-[var(--color-text-main)] mb-6">Sozlamalar</h1>
    
    <div class="bg-[var(--color-surface-base)] border border-[var(--color-surface-light)] rounded-3xl p-6 shadow-sm">
      <form @submit.prevent="saveConfig">
        <div class="mb-4">
          <label class="block text-[var(--color-text-muted)] text-sm font-bold mb-2">
            Yetkazib berish narxi (UZS)
          </label>
          <input 
            type="number" 
            v-model.number="deliveryFee" 
            class="w-full bg-[var(--color-surface-light)] border border-transparent focus:border-[var(--color-primary-base)] rounded-xl p-3 text-[var(--color-text-main)] outline-none transition-colors font-semibold"
          >
        </div>
        
        <button 
          type="submit" 
          :disabled="isSaving"
          class="w-full bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-dark)] text-white font-bold py-3 rounded-xl shadow transition-colors flex justify-center items-center"
        >
          <svg v-if="isSaving" class="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Saqlash
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '../../store'
import { useToast } from 'vue-toastification'

const store = useAppStore()
const toast = useToast()

const deliveryFee = ref(0)
const isSaving = ref(false)

onMounted(() => {
  deliveryFee.value = store.deliveryFee
})

const saveConfig = async () => {
  isSaving.value = true
  try {
    const response = await fetch('http://localhost:5000/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deliveryFee: deliveryFee.value })
    })
    const data = await response.json()
    if (data.success) {
      toast.success("Sozlamalar saqlandi!")
      store.deliveryFee = deliveryFee.value // update locally
    }
  } catch (error) {
    toast.error("Xatolik yuz berdi")
  } finally {
    isSaving.value = false
  }
}
</script>
