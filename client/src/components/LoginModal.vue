<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="$emit('close')"></div>
    
    <!-- Modal Content -->
    <div class="relative bg-[var(--color-surface-base)] w-full max-w-sm mx-4 rounded-3xl shadow-2xl p-6 animate-slide-up border border-[var(--color-surface-light)]">
      
      <!-- Close Button -->
      <button @click="$emit('close')" class="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition bg-[var(--color-surface-light)] rounded-full p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-[var(--color-surface-light)] rounded-2xl mx-auto flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[var(--color-primary-base)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-[var(--color-text-main)]">Maxfiy Kirish</h2>
        <p class="text-[var(--color-text-muted)] text-sm mt-1">Admin parolini kiriting</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <input 
            type="text" 
            v-model="username" 
            ref="usernameInput"
            placeholder="Login..." 
            class="w-full bg-[var(--color-surface-light)] border border-transparent focus:border-[var(--color-primary-base)] rounded-xl p-4 text-center text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:ring-0 text-lg outline-none transition-colors mb-4"
          >
          <input 
            type="password" 
            v-model="password" 
            placeholder="Parol..." 
            class="w-full bg-[var(--color-surface-light)] border border-transparent focus:border-[var(--color-primary-base)] rounded-xl p-4 text-center text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:ring-0 text-xl tracking-widest outline-none transition-colors"
          >
        </div>
        
        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-dark)] text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex justify-center disabled:opacity-70"
        >
          <svg v-if="isLoading" class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-else>Kirish</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../store'
import { useToast } from 'vue-toastification'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const store = useAppStore()
const router = useRouter()
const toast = useToast()

const username = ref('')
const password = ref('')
const usernameInput = ref(null)
const isLoading = ref(false)

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    username.value = ''
    password.value = ''
    nextTick(() => {
      if (usernameInput.value) usernameInput.value.focus()
    })
  }
})

const handleLogin = async () => {
  if (!username.value || !password.value) return
  
  isLoading.value = true
  
  const success = await store.login(username.value, password.value)
  
  isLoading.value = false
  
  if (success) {
    toast.success("Xush kelibsiz, Admin!")
    emit('close')
    router.push('/admin')
  } else {
    toast.error("Login yoki parol noto'g'ri!")
    password.value = ''
  }
}
</script>
