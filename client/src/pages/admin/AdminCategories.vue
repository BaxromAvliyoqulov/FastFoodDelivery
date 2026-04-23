<template>
  <div class="max-w-4xl mx-auto pb-20">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-[var(--color-text-main)]">Kategoriyalar</h1>
      <button @click="openModal()" class="bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-md flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        Qo'shish
      </button>
    </div>

    <!-- Categories List -->
    <div class="bg-[var(--color-surface-base)] border border-[var(--color-surface-light)] rounded-3xl overflow-hidden shadow-sm">
      <div v-if="store.categories.length === 0" class="p-8 text-center text-[var(--color-text-muted)]">
        Kategoriyalar yo'q. Yangi qo'shing.
      </div>
      <ul v-else class="divide-y divide-[var(--color-surface-light)]">
        <li v-for="cat in store.categories" :key="cat.id" class="p-4 flex justify-between items-center hover:bg-[var(--color-surface-light)]/30 transition-colors">
          <span class="font-bold text-[var(--color-text-main)]">{{ cat.name }}</span>
          <div class="flex gap-2">
            <button @click="openModal(cat)" class="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
            <button @click="deleteCategory(cat.id)" class="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative bg-[var(--color-surface-base)] w-full max-w-md rounded-3xl p-6 shadow-2xl animate-fade-in border border-[var(--color-surface-light)]">
        <h2 class="text-xl font-bold text-[var(--color-text-main)] mb-4">{{ isEditing ? 'Tahrirlash' : 'Yangi kategoriya' }}</h2>
        
        <form @submit.prevent="saveCategory">
          <div class="mb-6">
            <label class="block text-[var(--color-text-muted)] text-sm font-bold mb-2">Nomi</label>
            <input v-model="form.name" required placeholder="Masalan: 🍔 Taomlar" class="w-full bg-[var(--color-surface-light)] border border-transparent focus:border-[var(--color-primary-base)] rounded-xl p-3 text-[var(--color-text-main)] outline-none font-semibold">
          </div>
          
          <div class="flex gap-3 justify-end">
            <button type="button" @click="closeModal" class="px-5 py-2.5 rounded-xl font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-light)] transition-colors">Bekor qilish</button>
            <button type="submit" :disabled="isSaving" class="px-5 py-2.5 rounded-xl font-bold bg-[var(--color-primary-base)] text-white hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-70">
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '../../store'
import { useToast } from 'vue-toastification'

const store = useAppStore()
const toast = useToast()

const isModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const form = ref({ id: null, name: '' })

const openModal = (cat = null) => {
  if (cat) {
    isEditing.value = true
    form.value = { ...cat }
  } else {
    isEditing.value = false
    form.value = { id: null, name: '' }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveCategory = async () => {
  if (!form.value.name) return
  isSaving.value = true
  
  try {
    const method = isEditing.value ? 'PUT' : 'POST'
    const url = isEditing.value ? `http://localhost:5000/categories/${form.value.id}` : 'http://localhost:5000/categories'
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.value.name })
    })
    
    const data = await response.json()
    if (data.success) {
      toast.success("Muvaffaqiyatli saqlandi")
      closeModal()
      store.fetchMenuData() // refresh all data
    }
  } catch (error) {
    toast.error("Xatolik yuz berdi")
  } finally {
    isSaving.value = false
  }
}

const deleteCategory = async (id) => {
  if (!confirm("Rostdan ham o'chirmoqchimisiz?")) return
  
  try {
    const response = await fetch(`http://localhost:5000/categories/${id}`, { method: 'DELETE' })
    if (response.ok) {
      toast.success("O'chirildi")
      store.fetchMenuData()
    }
  } catch (err) {
    toast.error("Xatolik")
  }
}
</script>
