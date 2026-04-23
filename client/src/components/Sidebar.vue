<template>
  <div class="w-64 bg-gray-800 h-full text-white shadow-lg flex flex-col">
    <div class="p-4 border-b border-gray-700">
      <h2 class="text-lg font-bold">Admin Panel</h2>
    </div>
    <nav class="flex-1 p-4 space-y-2">
      <router-link to="/admin" class="block px-4 py-2 rounded hover:bg-gray-700 transition">Dashboard</router-link>
      <a href="#" class="block px-4 py-2 rounded hover:bg-gray-700 transition">Manage Menu</a>
      <a href="#" class="block px-4 py-2 rounded hover:bg-gray-700 transition">Manage Orders</a>
    </nav>
  </div>
</template>

<script setup>
// Sidebar logic here
</script>
