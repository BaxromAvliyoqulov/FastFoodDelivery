<template>
  <div class="min-h-[100dvh] flex flex-col bg-[var(--color-background)]">
    <Navbar />

    <div class="flex flex-1 w-full relative">
      <!-- Main content area -->
      <main class="flex-1 w-full">
        <slot></slot>
      </main>

      <Cart v-if="!isAdminRoute" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Cart from '../components/Cart.vue'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>
