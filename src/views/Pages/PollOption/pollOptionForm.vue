<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
    <div class="bg-white w-full max-w-3xl rounded-2xl shadow-lg border border-gray-200 p-10">
      <h2 class="text-3xl font-bold text-center text-gray-600 mb-8">Create Poll Option</h2>

      <form @submit.prevent="submitPollOption" class="space-y-6">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Poll Option Name</label>
          <input
            v-model="pollOption.name"
            type="text"
            placeholder="Enter poll option name"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            :class="{'border-red-500': errors.name}"
          />
          <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            v-model="pollOption.description"
            placeholder="Write a short description"
            rows="4"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            :class="{'border-red-500': errors.description}"
          ></textarea>
          <p v-if="errors.description" class="text-sm text-red-500">{{ errors.description }}</p>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="pollOption.status"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option :value="1">Active</option>
            <option :value="0">Inactive</option>
          </select>
        </div>

        <!-- Submit -->
        <div class="pt-4 flex justify-center">
          <button
            type="submit"
            :disabled="isSubmitting || !isValid"
            class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-8 rounded-xl transition disabled:opacity-50"
          >
            {{ isSubmitting ? 'Saving...' : 'Create Poll Option' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import apiEndpoints from '@/config/apiConfig';

export default {
  data() {
    return {
      pollOption: {
        name: '',
        description: '',
        status: 1,
      },
      isSubmitting: false,
      errors: {},
    };
  },
  computed: {
    isValid() {
      return this.pollOption.name && this.pollOption.description && Object.keys(this.errors).length === 0;
    },
  },
  methods: {
    async submitPollOption() {
      this.errors = {}; // Clear previous errors
      if (!this.pollOption.name) {
        this.errors.name = 'Poll option name is required.';
      }
      if (!this.pollOption.description) {
        this.errors.description = 'Description is required.';
      }

      if (Object.keys(this.errors).length > 0) return; // Prevent submission if there are errors

      this.isSubmitting = true;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(apiEndpoints.pollOptions, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.pollOption),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Poll Option created successfully!');
          this.$router.push('/setup/pollOption');
        } else {
          console.error('Error creating Poll Option:', data);
          alert('Failed to create Poll Option.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the Poll Option.');
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
/* Optional: custom error styling */
input:focus, textarea:focus {
  border-color: #4CAF50; /* green on focus */
}
</style>
