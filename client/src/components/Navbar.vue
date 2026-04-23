<template>
  <nav class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex-shrink-0 flex items-center">
            <span class="font-bold text-xl text-orange-500">FastFood Delivery</span>
          </router-link>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link to="/" class="text-gray-900 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium">Menu</router-link>
            <router-link to="/orders" class="text-gray-900 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium">Orders</router-link>
          </div>
        </div>
        <div class="flex items-center">
          <router-link to="/admin" class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Admin Panel</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
// Navbar logic here
</script>
