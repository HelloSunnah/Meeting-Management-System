<template>
    <div v-if="showCancelModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-lg font-semibold mb-4">Reason for Cancellation</h2>
        <input type="text" 
               :value="cancelReason" 
               @input="updateCancelReason" 
               placeholder="Enter reason"
               class="input-field w-full mb-4" />
        <div class="flex justify-end gap-4">
          <button @click="submitCancellationReason"
                  class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Submit
          </button>
          <button @click="closeModal"
                  class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>import apiEndpoints from '@/config/apiConfig';

import { useToast } from "vue-toastification";

export default {
    setup() {
    const toast = useToast();
    return { toast };
  },    props: {
      showCancelModal: Boolean,
      cancelReason: String,  // Binding reason prop to the modal
    },
    methods: {
      updateCancelReason(event) {
        // Emit the updated reason back to the parent component
        this.$emit('update:cancelReason', event.target.value);
      },
      submitCancellationReason() {
        if (!this.cancelReason.trim()) {
                this.toast.error("An error occurred. Please try again.Please enter a reason.")

          return;
        }
        // You can handle the submission logic here
        this.$emit('submit-cancellation', this.cancelReason); // Emit the submission event
        this.closeModal();
      },
      closeModal() {
        // Emit the modal close event
        this.$emit('update:showCancelModal', false);
      }
    }
  };
  </script>
  