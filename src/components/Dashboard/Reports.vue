<template>
  <div class="p-6 bg-white shadow rounded-lg">
    <h2 class="text-xl font-bold mb-4">Reports</h2>
    <table class="min-w-full bg-white rounded-lg shadow-lg">
      <thead>
        <tr class="bg-gray-200">
          <th class="py-3 px-4 text-left text-gray-700">Report Name</th>
          <th class="py-3 px-4 text-left text-gray-700">Status</th>
          <th class="py-3 px-4 text-left text-gray-700">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="py-3 px-4">Sales Report</td>
          <td class="py-3 px-4 text-green-600">Completed</td>
          <td class="py-3 px-4">Mar 5, 2025</td>
        </tr>
        <tr>
          <td class="py-3 px-4">User Activity Report</td>
          <td class="py-3 px-4 text-yellow-600">Pending</td>
          <td class="py-3 px-4">Mar 6, 2025</td>
        </tr>
        <tr>
          <td class="py-3 px-4">Revenue Report</td>
          <td class="py-3 px-4 text-green-600">Completed</td>
          <td class="py-3 px-4">Mar 4, 2025</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "Reports",
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border-bottom: 1px solid #e5e7eb;
}
</style>
