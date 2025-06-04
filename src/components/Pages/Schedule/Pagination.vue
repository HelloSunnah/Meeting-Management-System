<template>
  <div class="flex justify-center items-center space-x-4 mt-6">
    <button
      @click="$emit('page-change', currentPage - 1)"
      :disabled="currentPage === 1"
      class="pagination-button"
    >
      ← Prev
    </button>
    <span class="text-sm font-semibold">{{ currentPage }} / {{ totalPages }}</span>
    <button
      @click="$emit('page-change', currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="pagination-button"
    >
      Next →
    </button>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";

export default {
    setup() {
    const toast = useToast();
    return { toast };
  },
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  }
};
</script>

<style scoped>
.pagination-button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination-button:hover {
  background-color: #0056b3;
}
</style>
