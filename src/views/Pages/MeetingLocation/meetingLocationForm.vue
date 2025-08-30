<template>
  <div :class="theme81" class="min-h-screen transition-all duration-300 ease-in-out py-10 px-4">
    <div :class="theme61" class="max-w-full mx-auto  rounded-2xl shadow-lg p-8 space-y-6">
      <h2 :class="themeText"
        class="text-3xl font-extrabold text-center transition-colors duration-300 ease-in-out">
        Add New Meeting Room
      </h2>
      <form @submit.prevent="submitLocation" enctype="multipart/form-data" class="space-y-6">

        <!-- Card Grid Layout -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div :class="theme7" class="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
            <!-- Location Name -->
            <div>
              <label :class="themeText"  class="form-label">Meeting Room Name <span class="text-red-500">*</span></label>
              <input :class="themeInputText"  v-model="location.name" type="text" placeholder="Enter Location Name" class="input" required />
            </div>

            <!-- Total Seat -->
            <div>
              <label :class="themeText"  class="form-label">Total Seat <span class="text-red-500">*</span></label>
              <input :class="themeInputText"  v-model="location.total_seat"  v-non-negative type="number" placeholder="Total Seat" class="input" required />
            </div>

            <!-- Serial -->
            <div>
              <label :class="themeText"  class="form-label">Serial <span class="text-red-500">*</span></label>
              <input :class="themeInputText"  v-model="location.serial" v-non-negative type="number" placeholder="Serial" class="input" required />
            </div>

            <!-- Select Company -->
            <div>
              <label :class="themeText"  class="form-label">Select Company <span class="text-red-500">*</span></label>
              <select  :class="themeInputText"  v-model="location.company_id" class="input" required>
                <option v-for="company in companies" :key="company.id" :value="company.id">
                  {{ company.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Right Column -->
          <div :class="theme7" class=" p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
            <div>
              <label :class="themeText"  class="form-label">Status</label>
              <select  :class="themeInputText"  v-model="location.status" class="input">
                <option :value="1">Active</option>
                <option :value="0">Inactive</option>
              </select>
            </div>
            <div>
              <label :class="themeText"  class="form-label">Description</label>
              <textarea  :class="themeInputText"  v-model="location.description" placeholder="Short description" class="input"></textarea>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-center mt-8">
          <button type="submit" :disabled="isSubmitting"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300">
            {{ isSubmitting ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import apiEndpoints from '@/config/apiConfig';

import useTheme from '@/components/js/ThemeSetting';
import { useToast } from "vue-toastification";

export default {

    setup() {
    const {
      theme6,
      theme8, theme61,
      theme9,theme81,
      themeText,
      themeInputText,theme7
    } = useTheme();

    const toast = useToast();

    return {
      theme61,
      theme6,
      theme8,
      theme9,theme81,
      themeText,
      toast,themeInputText,theme7
    };
  },
  
  data() {
    return {
      location: {
        name: '',
        description: '',
        total_seat: null,
        serial: null,
        company_id: null,
        status: 1,
      },
      isSubmitting: false,
      companies: [],
    };
  },
  mounted() {
    this.fetchCompanies();
  },
  methods: {
    async fetchCompanies() {
      try {
        const token = sessionStorage.getItem('token');
        const res = await fetch(apiEndpoints.companies, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        this.companies = data.data;
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    },
async submitLocation() {
  this.isSubmitting = true;

  try {
    const token = sessionStorage.getItem('token');
    const response = await fetch(apiEndpoints.meetingLocations, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.location),
    });

    const data = await response.json();

    if (response.ok) {
      // Success: redirect or show toast
      this.$router.push('/setup/meetingLocation');
      // or this.toast.success('Meeting Location created successfully!');
    } else {
      // Handle server validation or other errors
      this.errors = data;

      // If your backend sends errors as an object or with 'errors' array, adjust here
      if (Array.isArray(data.errors)) {
        data.errors.forEach(err => {
          if (err.detail) {
            this.toast.error(err.detail);
          } else {
            this.toast.error(JSON.stringify(err));
          }
        });
      } else {
        // Generic fallback: show all error messages
        Object.values(data).forEach(messages => {
          if (Array.isArray(messages)) {
            messages.forEach(msg => this.toast.error(msg));
          } else {
            this.toast.error(messages);
          }
        });
      }

      console.error('Error creating location:', data);
    }
  } catch (error) {
    // Network or unexpected errors
    this.toast.error('An unexpected error occurred. Please try again.');
    console.error(error);
  } finally {
    this.isSubmitting = false;
  }
}

  },
};
</script>

<style scoped>
.input {
  @apply w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300;
}

.form-label {
  @apply block text-sm font-medium mb-1;
}
</style>
