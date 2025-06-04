<template>
    <td class="p-3 text-center" style="display: flex; justify-content: center; gap: 1rem; align-items: center;">
      <!-- Use :value for binding and @update:attendanceStatus to emit updates -->
      <select :value="attendanceStatus" @change="handleStatusChange" 
              class="w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 transition">
        <option value="attend">Attend</option>
        <option value="cancel">Cancel</option>
      </select>
    </td>
  </template>
  
  <script>
  export default {
    props: {
      attendanceStatus: String,
    },
    methods: {
      handleStatusChange(event) {
        // Emit an event to the parent to update the attendanceStatus
        this.$emit('update:attendanceStatus', event.target.value);
        this.$emit("status-change");
      },
    },
  };
  </script>
  