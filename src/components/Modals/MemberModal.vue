<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out opacity-100"
    @click.self="close"
    role="dialog"
    aria-labelledby="modal-title"
    aria-hidden="false"
    aria-describedby="modal-description"
    @keydown.esc="close"
    tabindex="0"
  >
    <!-- Modal Container -->
    <div
      class="bg-white rounded-3xl shadow-xl w-[90vw] max-w-2xl p-12 relative transform transition-transform duration-500 ease-in-out slide-up z-50 animate-fadeIn"
      @click.stop
      tabindex="0"
    >
      <!-- Close Button -->
      <button
        @click="close"
        class="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl transition-transform duration-200 transform hover:scale-110 hover:text-gray-900"
        aria-label="Close modal"
      >
        ✖
      </button>

      <!-- Modal Title -->
      <h2 class="text-2xl font-semibold mb-6 text-center text-gray-800" id="modal-title">User Information Form</h2>

      <!-- Modal Description (for screen readers) -->
      <p id="modal-description" class="sr-only">
        Form to collect user information including name, age, and email.
      </p>

      <!-- Form Section -->
      <form @submit.prevent="submitForm" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Name Section -->
          <div class="flex flex-col">
            <label for="name" class="text-lg font-medium text-gray-900 mb-2">Name</label>
            <input
              type="text"
              id="name"
              v-model="form.name"
              required
              class="mt-2 p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Enter your name"
            />
          </div>

          <!-- Position Section -->
          <div class="flex flex-col">
            <label for="position" class="text-lg font-medium text-gray-900 mb-2">Position</label>
            <input
              type="text"
              id="position"
              v-model="form.position"
              required
              class="mt-2 p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Enter your position"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Office Section -->
          <div class="flex flex-col">
            <label for="office" class="text-lg font-medium text-gray-900 mb-2">Office</label>
            <input
              type="text"
              id="office"
              v-model="form.office"
              required
              class="mt-2 p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Enter your office location"
            />
          </div>

          <!-- Salary Section -->
          <div class="flex flex-col">
            <label for="salary" class="text-lg font-medium text-gray-900 mb-2">Salary</label>
            <input
              type="text"
              id="salary"
              v-model="form.salary"
              required
              class="mt-2 p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Enter your salary"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Extension Section -->
          <div class="flex flex-col">
            <label for="extension" class="text-lg font-medium text-gray-900 mb-2">Extension</label>
            <input
              type="text"
              id="extension"
              v-model="form.extension"
              required
              class="mt-2 p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Enter extension number"
            />
          </div>

          <!-- Extra Info Section -->
          <div class="flex flex-col">
            <label for="extraInfo" class="text-lg font-medium text-gray-900 mb-2">Extra Info</label>
            <input
              type="text"
              id="extraInfo"
              v-model="form.extraInfo"
              required
              class="mt-2 p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Enter additional information"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-center mt-6">
          <button
            type="submit"
            class="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      // Form data model
      form: {
        name: 'Airi Satou',
        position: 'Accountant',
        office: 'Tokyo',
        salary: '$162,700',
        extension: '5407',
        extraInfo: 'More info here...'
      }
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    submitForm() {
      // Handle form submission
      console.log('Form submitted:', this.form);
      // Optionally close the modal after form submission
      this.close();
    }
  }
};
</script>

<style scoped>
/* Custom Tailwind Animations */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideUp {
  0% {
    transform: translateY(100vh);
  }
  100% {
    transform: translateY(0);
  }
}

/* Tailwind Animation Classes */
.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}

.slide-up {
  animation: slideUp 0.5s ease-out forwards;
}

i:hover {
  transform: scale(1.3);
  transition: transform 0.3s ease;
}
</style>
