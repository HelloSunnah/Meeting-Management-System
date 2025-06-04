<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
  >
    <div
      class="bg-white p-6 rounded-lg shadow-xl w-96 relative transform transition-all duration-300 scale-100"
    >
      <!-- Close Button -->
      <button
        @click="cancelAction"
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl focus:outline-none"
      >
        &times;
      </button>

      <!-- Modal Title -->
      <h3 class="text-2xl font-bold text-gray-800 mb-3">
        {{ modalTitle }}
      </h3>

      <!-- Modal Message -->
      <p class="text-gray-600 text-base mb-5">
        {{ modalMessage }}
      </p>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3">
        <button
          @click="cancelAction"
          class="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md transition duration-150"
        >
          No
        </button>
        <button
          @click="confirmAction"
          class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition duration-150"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isVisible: false,
      modalTitle: '',
      modalMessage: '',
      modalAction: null,
    };
  },
  methods: {
    show(title, message, action) {
      this.modalTitle = title;
      this.modalMessage = message;
      this.modalAction = action;
      this.isVisible = true;
    },
    hide() {
      this.isVisible = false;
    },
    confirmAction() {
      if (this.modalAction) {
        this.modalAction();
      }
      this.hide();
    },
    cancelAction() {
      this.hide();
    },
  },
};
</script>
