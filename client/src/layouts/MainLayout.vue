<template>
  <div class="min-h-[100dvh] flex flex-col bg-[var(--color-background)]">
    <!-- Main top navigation -->
    <Navbar v-if="!isAdminRoute" />

    <div class="flex flex-1 w-full">
      <!-- Admin Sidebar only visible on admin routes -->
      <Sidebar v-if="isAdminRoute" />
      
      <!-- Main content area -->
      <main class="flex-1 w-full pb-20"> <!-- Added generous padding bottom for mobile scrolling -->
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
import Sidebar from '../components/Sidebar.vue'
import Cart from '../components/Cart.vue'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>
