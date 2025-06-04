<template>
  <div class="p-6 bg-white shadow rounded-lg">
    <h2 class="text-xl font-bold mb-4">Overview</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-gray-100 p-4 rounded-lg shadow-lg">
        <h3 class="text-lg font-medium text-gray-700">Total Users</h3>
        <p class="text-2xl font-semibold text-blue-600">1,250</p>
      </div>
      <div class="bg-gray-100 p-4 rounded-lg shadow-lg">
        <h3 class="text-lg font-medium text-gray-700">Revenue</h3>
        <p class="text-2xl font-semibold text-green-600">$30,500</p>
      </div>
      <div class="bg-gray-100 p-4 rounded-lg shadow-lg">
        <h3 class="text-lg font-medium text-gray-700">Active Sessions</h3>
        <p class="text-2xl font-semibold text-orange-600">325</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Overview",
};
</script>

<style scoped>
/* Scoped styles for theme customization */
</style>
