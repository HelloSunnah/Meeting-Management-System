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
      class="bg-white rounded-3xl shadow-xl w-[90vw] max-w-2xl p-12 relative scale-95 transform transition-transform duration-300 ease-in-out hover:scale-100 z-50 animate-fadeIn"
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

      <!-- Centered Icon Section -->
      <div class="w-32 h-32 bg-blue-200 rounded-full flex items-center justify-center shadow-xl mx-auto mb-6">
        <i class="fas fa-headset text-blue-600 text-4xl"></i>
      </div>

      <!-- Modal Title -->
      <h2 class="text-2xl font-semibold mb-6 text-center text-gray-800" id="modal-title">Support Details</h2>

      <!-- Modal Description (for screen readers) -->
      <p id="modal-description" class="sr-only">
        Contact information for customer support, including email, phone number, and location.
      </p>

      <!-- Email Section -->
      <div class="mb-6 flex items-center">
        <i class="fas fa-envelope text-blue-500 mr-4 text-2xl transition-transform duration-300 transform hover:scale-110"></i>
        <p class="text-lg font-medium text-gray-900">Email:
          <span class="font-normal text-gray-900">{{$t( email )}}</span>
        </p>
      </div>

      <!-- Phone Number Section -->
      <div class="mb-6 flex items-center">
        <i class="fas fa-phone-alt text-green-500 mr-4 text-2xl transition-transform duration-300 transform hover:scale-110"></i>
        <p class="text-lg font-medium text-gray-900">Phone Number:
          <span class="font-normal text-gray-900">{{ $t(phone) }}</span>
        </p>
      </div>

      <!-- Location Section -->
      <div class="mb-6 flex items-center">
        <i class="fas fa-map-marker-alt text-red-500 mr-4 text-2xl transition-transform duration-300 transform hover:scale-110"></i>
        <p class="text-lg font-medium text-gray-900">Location:
          <span class="font-normal text-gray-900">{{ $t(location) }}</span>
        </p>
      </div>

      <!-- Logo Section -->
      <div class="flex items-center justify-center mt-6">
        <img
          src="@/assets/img/ati-logo.png"
          alt="ATI Limited Logo"
          class="h-8 w-auto"
        />
      </div>
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
      // Add dynamic data for email, phone, and location
      email: 'info@atilimited.net',
      phone: '+88 01716291 680',
      location: 'ATI centre, House-07, Gareeb-e-Nawaz Avenue, Sector-11, Uttara, Dhaka-1230'
    };
  },
  methods: {
    close() {
      this.$emit('close');
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

/* Tailwind Animation Class */
.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}

/* Hover effects for icons */
i:hover {
  transform: scale(1.3);
  transition: transform 0.3s ease;
}
</style>
