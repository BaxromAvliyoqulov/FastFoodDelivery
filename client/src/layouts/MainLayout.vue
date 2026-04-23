<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Main top navigation -->
    <Navbar v-if="!isAdminRoute" />

    <div class="flex flex-1 overflow-hidden">
      <!-- Admin Sidebar only visible on admin routes -->
      <Sidebar v-if="isAdminRoute" />
      
      <!-- Main content area -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>
