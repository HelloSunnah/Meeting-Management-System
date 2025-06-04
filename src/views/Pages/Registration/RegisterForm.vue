<template>
  <div :class="themeClass" class="min-h-screen transition-all duration-300 ease-in-out py-10 px-4">
    <div :class="formClass" class="max-w-full mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <h2 :class="themeClass === 'bg-gray-900 text-white' ? 'text-white' : 'text-gray-800'"
        class="text-3xl font-extrabold text-center transition-colors duration-300 ease-in-out">
        Create New User
      </h2>
      <form @submit.prevent="submitForm" enctype="multipart/form-data" class="">

        <!-- Card Grid Layout -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <div class="bg-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
            <div class="relative mb-4">
              <label class="block text-sm font-semibold text-gray-700">Name <span class="text-red-500">*</span></label>
              <input required v-model="form.name" type="text"
                class="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Full name" />
              <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>
            </div>
            <div class="relative mb-4">
              <label class="block text-sm font-semibold text-gray-700">Password <span
                  class="text-red-500">*</span></label>
              <input v-model="form.password" type="password"
                class="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••" />
              <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</span>
            </div>
            <div class="relative mb-4">
              <label class="block text-sm font-semibold text-gray-700">Confirm Password <span
                  class="text-red-500">*</span></label>
              <input required v-model="form.password_confirmation" type="password"
                class="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••" />
              <span v-if="errors.password_confirmation" class="text-red-500 text-sm">{{ errors.password_confirmation }}</span>
            </div>
          </div>

          <div class="bg-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
            <div class="space-y-4">
              <!-- Department Dropdown -->
              <div class="relative mb-4">
                <label class="block text-sm font-semibold text-gray-700">Email <span
                    class="text-red-500">*</span></label>
                <input required v-model="form.email" type="email"
                  class="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="example@domain.com" />
                <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>
              </div>

              <div class="relative mb-4">
                <label class="block text-sm font-semibold text-gray-700">Department</label>
                <select v-model="form.department_id"
                  class="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">Select a Department</option>
                  <option  v-for="department in departments" :key="department.id" :value="department.id">
                    {{ department.name }}
                  </option>
                </select>
                <span v-if="errors.department_id" class="text-red-500 text-sm">{{ errors.department_id }}</span>
              </div>

              <!-- Image Upload -->
              <div class="relative mb-4">
                <label class="block text-sm font-semibold text-gray-700">Profile Image</label>
                <input type="file"
                  class="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  @change="handleFileUpload($event, 'image')" />
              </div>

              <!-- Signature Upload -->
              <div class="relative mb-4">
                <label class="block text-sm font-semibold text-gray-700">Signature</label>
                <input type="file"
                  class="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  @change="handleFileUpload($event, 'signature')" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="errors.general" class="text-red-500 text-center text-sm mb-4">{{ errors.general }}</div>

        <div class="w-full flex justify-center mt-6">
          <button :disabled="loading" type="submit"
            class="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out flex items-center justify-center">
            <span v-if="loading" class="spinner-border spinner-border-sm mr-2"></span>
            {{ loading ? 'Registering...' : 'Register' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import apiEndpoints from '@/config/apiConfig';

import { useToast } from "vue-toastification";

export default {
    setup() {
    const toast = useToast();
    return { toast };
  },  data() {
    return {
      themeClass: "",
      formClass: "",
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        company_id: '',
        department_id: '', // To store selected department
        designation_id: '',
        image: null,
        signature: null,
      },
      departments: [], // Will hold fetched department data
      errors: {}, // For handling validation and API errors
      loading: false,
    };
  },
  mounted() {
    this.fetchDepartments(); // Fetch departments on component mount
  },
  methods: {
    async fetchDepartments() {
      try {
        console.log("Fetching departments...");
        const response = await axios.get(apiEndpoints.departments, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.departments = response.data.data;
        console.log("Departments fetched:", this.departments);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },

    handleFileUpload(event, field) {
      console.log(`Uploading file for ${field}:`, event.target.files[0]);
      this.form[field] = event.target.files[0];
    },

    async submitForm() {
      this.errors = {}; // Clear previous errors
      console.log("Submitting form with data:", this.form);
      this.form.company_id = 1;

      // Basic validation
      if (
        !this.form.name ||
        !this.form.email ||
        !this.form.password ||
        !this.form.password_confirmation ||
        !this.form.department_id ||
        !this.form.company_id
      ) {
        this.errors.general = 'Please fill in all required fields.';
        console.warn("Validation failed: Required fields missing");
        return;
      }

      if (this.form.password !== this.form.password_confirmation) {
        this.errors.password = 'Passwords do not match.';
        console.warn("Validation failed: Passwords do not match");
        return;
      }

      if (this.loading) {
        console.log("Submission already in progress...");
        return;
      }

      this.loading = true;

      const formData = new FormData();
      for (const key in this.form) {
        if (this.form[key] !== null && this.form[key] !== '') {
          formData.append(key, this.form[key]);
          console.log(`Appending to formData: ${key}`, this.form[key]);
        }
      }

      try {
        const res = await axios.post(apiEndpoints.register, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log("Registration successful:", res.data);
        alert('Registration successful!');

      
        this.$router.push({ name: 'Register' }); // <-- Replace 'UserList' with your actual route name

      } catch (error) {
        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors;
          console.error("API returned validation errors:", this.errors);
        } else {
          this.errors.general = 'Something went wrong. Please try again.';
          console.error("API request failed:", error);
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
