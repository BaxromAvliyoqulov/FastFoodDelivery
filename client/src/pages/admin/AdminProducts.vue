<template>
  <div class="max-w-5xl mx-auto pb-20">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-[var(--color-text-main)]">Taomlar menyusi</h1>
      <button @click="openModal()" class="bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-md flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        <span class="hidden sm:inline">Taom qo'shish</span>
      </button>
    </div>

    <!-- Products Grid -->
    <div v-if="store.products.length === 0" class="bg-[var(--color-surface-base)] border border-[var(--color-surface-light)] rounded-3xl p-12 text-center text-[var(--color-text-muted)]">
      Menyuda hech narsa yo'q.
    </div>
    
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="product in store.products" :key="product.id" class="bg-[var(--color-surface-base)] border border-[var(--color-surface-light)] rounded-2xl p-4 shadow-sm flex flex-col">
        <div class="relative h-40 bg-[var(--color-surface-light)] rounded-xl overflow-hidden mb-3">
          <img v-if="product.image" :src="product.image" class="w-full h-full object-cover" />
          <div v-else class="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)]">Rasm yo'q</div>
          
          <div class="absolute top-2 right-2 flex gap-1">
            <button @click="openModal(product)" class="bg-blue-500 text-white p-1.5 rounded-lg shadow hover:bg-blue-600 transition"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
            <button @click="deleteProduct(product.id)" class="bg-red-500 text-white p-1.5 rounded-lg shadow hover:bg-red-600 transition"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
          </div>
        </div>
        
        <h3 class="font-bold text-[var(--color-text-main)] text-lg line-clamp-1">{{ product.name }}</h3>
        <p class="text-[var(--color-text-muted)] text-xs mb-2 line-clamp-2 min-h-[32px]">{{ product.description }}</p>
        
        <div class="mt-auto pt-2 flex justify-between items-center border-t border-[var(--color-surface-light)]/50">
          <span class="text-[var(--color-primary-base)] font-bold">{{ product.price.toLocaleString() }} UZS</span>
          <span class="text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-light)] px-2 py-1 rounded">{{ getCategoryName(product.categoryId) }}</span>
        </div>
      </div>
    </div>

    <!-- Product Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative bg-[var(--color-surface-base)] w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-[var(--color-surface-light)] max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold text-[var(--color-text-main)] mb-6">{{ isEditing ? 'Taomni tahrirlash' : 'Yangi taom qo\'shish' }}</h2>
        
        <form @submit.prevent="saveProduct" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[var(--color-text-muted)] text-xs font-bold mb-1">Nomi</label>
              <input v-model="form.name" required class="w-full bg-[var(--color-surface-light)] rounded-xl p-2.5 text-[var(--color-text-main)] outline-none focus:ring-1 focus:ring-[var(--color-primary-base)]">
            </div>
            <div>
              <label class="block text-[var(--color-text-muted)] text-xs font-bold mb-1">Kategoriya</label>
              <select v-model="form.categoryId" required class="w-full bg-[var(--color-surface-light)] rounded-xl p-2.5 text-[var(--color-text-main)] outline-none focus:ring-1 focus:ring-[var(--color-primary-base)]">
                <option v-for="cat in store.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[var(--color-text-muted)] text-xs font-bold mb-1">Narxi (Asosiy, UZS)</label>
              <input type="number" v-model.number="form.price" required class="w-full bg-[var(--color-surface-light)] rounded-xl p-2.5 text-[var(--color-text-main)] outline-none focus:ring-1 focus:ring-[var(--color-primary-base)]">
            </div>
            <div>
              <label class="block text-[var(--color-text-muted)] text-xs font-bold mb-1">Rasm URL (Internetdan silka)</label>
              <input v-model="form.image" type="url" placeholder="https://..." class="w-full bg-[var(--color-surface-light)] rounded-xl p-2.5 text-[var(--color-text-main)] outline-none focus:ring-1 focus:ring-[var(--color-primary-base)]">
            </div>
            <div>
              <label class="block text-[var(--color-text-muted)] text-xs font-bold mb-1">O'lchov birligi</label>
              <select v-model="form.unit" class="w-full bg-[var(--color-surface-light)] rounded-xl p-2.5 text-[var(--color-text-main)] outline-none focus:ring-1 focus:ring-[var(--color-primary-base)]">
                <option value="dona">Dona (ta)</option>
                <option value="kg">Kilogramm (kg)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-[var(--color-text-muted)] text-xs font-bold mb-1">Tarifi (Tarkibi)</label>
            <textarea v-model="form.description" rows="2" class="w-full bg-[var(--color-surface-light)] rounded-xl p-2.5 text-[var(--color-text-main)] outline-none focus:ring-1 focus:ring-[var(--color-primary-base)]"></textarea>
          </div>

          <!-- Variants -->
          <div class="border border-[var(--color-surface-light)] rounded-2xl p-4">
            <div class="flex justify-between items-center mb-3">
              <label class="block text-[var(--color-text-main)] text-sm font-bold">Variantlar (O'lchamlar)</label>
              <button type="button" @click="addVariant" class="text-xs bg-[var(--color-surface-light)] hover:bg-[var(--color-primary-base)] hover:text-white text-[var(--color-text-main)] px-2 py-1 rounded transition">Yangi qo'shish</button>
            </div>
            
            <div v-if="form.variants.length === 0" class="text-xs text-[var(--color-text-muted)] italic">Variantlar yo'q. Faqat asosiy narx ishlatiladi.</div>
            
            <div class="space-y-2">
              <div v-for="(v, idx) in form.variants" :key="idx" class="flex gap-2 items-center">
                <input v-model="v.name" placeholder="Nomi (masalan: 1.5 L)" required class="flex-1 bg-[var(--color-surface-light)] rounded-lg p-2 text-sm text-[var(--color-text-main)] outline-none">
                <input type="number" v-model.number="v.price" placeholder="Narxi" required class="w-32 bg-[var(--color-surface-light)] rounded-lg p-2 text-sm text-[var(--color-text-main)] outline-none">
                <button type="button" @click="form.variants.splice(idx, 1)" class="text-red-500 hover:bg-red-500/10 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          </div>
          
          <div class="flex gap-3 justify-end pt-4 border-t border-[var(--color-surface-light)]">
            <button type="button" @click="closeModal" class="px-5 py-2.5 rounded-xl font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-light)] transition-colors">Bekor qilish</button>
            <button type="submit" :disabled="isSaving" class="px-5 py-2.5 rounded-xl font-bold bg-[var(--color-primary-base)] text-white hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-70">
              {{ isSaving ? 'Saqlanmoqda...' : 'Saqlash' }}
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

const getEmptyForm = () => ({
  id: null,
  categoryId: store.categories.length > 0 ? store.categories[0].id : '',
  name: '',
  description: '',
  price: 0,
  unit: 'dona',
  image: '',
  variants: []
})

const form = ref(getEmptyForm())

const getCategoryName = (id) => {
  const cat = store.categories.find(c => c.id === id)
  return cat ? cat.name : 'Unknown'
}

const openModal = (product = null) => {
  if (product) {
    isEditing.value = true
    form.value = JSON.parse(JSON.stringify(product)) // deep clone to avoid modifying state directly
    if (!form.value.variants) form.value.variants = []
  } else {
    isEditing.value = false
    form.value = getEmptyForm()
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const addVariant = () => {
  form.value.variants.push({ id: 'v' + Date.now(), name: '', price: 0 })
}

const saveProduct = async () => {
  isSaving.value = true
  
  try {
    const method = isEditing.value ? 'PUT' : 'POST'
    const url = isEditing.value ? `http://localhost:5000/products/${form.value.id}` : 'http://localhost:5000/products'
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    
    const data = await response.json()
    if (data.success) {
      toast.success("Muvaffaqiyatli saqlandi")
      closeModal()
      store.fetchMenuData()
    }
  } catch (error) {
    toast.error("Xatolik yuz berdi")
  } finally {
    isSaving.value = false
  }
}

const deleteProduct = async (id) => {
  if (!confirm("Rostdan ham o'chirmoqchimisiz?")) return
  
  try {
    const response = await fetch(`http://localhost:5000/products/${id}`, { method: 'DELETE' })
    if (response.ok) {
      toast.success("O'chirildi")
      store.fetchMenuData()
    }
  } catch (err) {
    toast.error("Xatolik")
  }
}
</script>
