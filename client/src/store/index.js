import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    // Cart State
    cartItems: [],
    isCartOpen: false,
    
    // Global Menu State
    categories: [],
    products: [],
    deliveryFee: 0,
    isMenuLoading: false,
    
    // Auth State
    isAdmin: !!localStorage.getItem('adminToken')
  }),
  getters: {
    cartTotalItems: (state) => {
      return state.cartItems.reduce((total, item) => total + item.quantity, 0)
    },
    cartSubtotal: (state) => {
      return state.cartItems.reduce((total, item) => total + (item.totalPrice), 0)
    },
    cartTotal: (state) => {
      return state.cartItems.length > 0 ? state.cartSubtotal + state.deliveryFee : 0
    }
  },
  actions: {
    async fetchMenuData() {
      this.isMenuLoading = true
      try {
        const response = await fetch('http://localhost:5000/data')
        const data = await response.json()
        if (data.success) {
          this.categories = data.categories
          this.products = data.products
          this.deliveryFee = data.deliveryFee
        }
      } catch (err) {
        console.error("Menyuni yuklashda xatolik:", err)
      } finally {
        this.isMenuLoading = false
      }
    },
    async login(username, password) {
      try {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        })
        const data = await response.json()
        if (data.success) {
          this.isAdmin = true
          localStorage.setItem('adminToken', data.token)
          return true
        }
        return false
      } catch (err) {
        return false
      }
    },
    logout() {
      this.isAdmin = false
      localStorage.removeItem('adminToken')
    },
    toggleCart() {
      this.isCartOpen = !this.isCartOpen
    },
    addToCart(newItem) {
      // Check if exact same item (id + variant) is already in cart
      const existingItemIndex = this.cartItems.findIndex(
        item => item.productId === newItem.productId && item.variant?.id === newItem.variant?.id
      )

      if (existingItemIndex !== -1) {
        // Increase quantity and update total price
        this.cartItems[existingItemIndex].quantity += newItem.quantity
        // Recalculate total price for this item stack
        const basePrice = this.cartItems[existingItemIndex].variant ? this.cartItems[existingItemIndex].variant.price : (newItem.totalPrice / newItem.quantity)
        this.cartItems[existingItemIndex].totalPrice = basePrice * this.cartItems[existingItemIndex].quantity
      } else {
        // Add new item
        this.cartItems.push({ ...newItem })
      }
    },
    removeFromCart(index) {
      this.cartItems.splice(index, 1)
      if (this.cartItems.length === 0) {
        this.isCartOpen = false
      }
    },
    incrementQuantity(index) {
      this.cartItems[index].quantity++
      const item = this.cartItems[index]
      const basePrice = item.variant ? item.variant.price : (item.totalPrice / (item.quantity - 1))
      item.totalPrice = basePrice * item.quantity
    },
    decrementQuantity(index) {
      if (this.cartItems[index].quantity > 1) {
        this.cartItems[index].quantity--
        const item = this.cartItems[index]
        const basePrice = item.variant ? item.variant.price : (item.totalPrice / (item.quantity + 1))
        item.totalPrice = basePrice * item.quantity
      } else {
        this.removeFromCart(index)
      }
    },
    clearCart() {
      this.cartItems = []
      this.isCartOpen = false
    }
  }
})
