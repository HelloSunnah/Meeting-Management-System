<template>
  <div v-if="user" class="max-w-8xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">
    <h2 class="text-2xl font-semibold text-gray-800 border-b pb-2">Edit User: {{ user.name }}</h2>

    <form @submit.prevent="submitForm" enctype="multipart/form-data" class="space-y-6">

      <!-- Input Fields -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input v-model="form.name" class="input-field w-full" placeholder="Enter full name" />
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="form.email" type="email" class="input-field w-full" placeholder="example@email.com" />
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Username</label>
          <input v-model="form.userName" class="input-field w-full" placeholder="username123" />
        </div>

        <div class="space-y-1">
          <label for="department" class="block text-sm font-medium text-gray-700">Department</label>
          <select id="department" v-model="form.department_id"
            class="input-field w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="" disabled>Select a department</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- File Uploads -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Profile Image</label>
          <div v-if="form.image_url" class="mb-2">
            <img v-if="isImage(form.image_url)" :src="form.image_url" alt="Profile"
              class="w-32 h-32 object-cover rounded-md shadow border border-gray-300" />
            <p v-else class="text-red-500 text-xs">Invalid image URL</p>
          </div>
          <input @change="handleFileUpload($event, 'image')" type="file" accept="image/*"
            class="text-sm file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-100 file:text-sm file:font-semibold hover:file:bg-gray-200" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Signature</label>
          <div v-if="form.signature_url" class="mb-2">
            <img v-if="isImage(form.signature_url)" :src="form.signature_url" alt="Signature"
              class="w-32 h-32 object-cover rounded-md shadow border border-gray-300" />
          </div>
          <input @change="handleFileUpload($event, 'signature')" type="file" accept="image/*"
            class="text-sm file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-100 file:text-sm file:font-semibold hover:file:bg-gray-200" />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center pt-4">
        <button type="submit"
          class="px-8 py-3 bg-indigo-600 text-white font-medium rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
          Save Changes
        </button>
      </div>
    </form>
  </div>

  <Loader v-else />
</template>


<script>
import axios from 'axios';
import apiEndpoints from '@/config/apiConfig';

import Loader from '@/components/Main/Loader.vue';

import { useToast } from "vue-toastification";

export default {
    setup() {
    const toast = useToast();
    return { toast };
  },
  components: { Loader },
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      user: null,
      form: {
        name: '',
        email: '',
        userName: '',
        password: '',
        password_confirmation: '',
        company_id: '',
        department_id: '',
        designation_id: '',
        image: null,
        signature: null,
      },
    };
  },
  mounted() {
    this.fetchDepartments();

    this.fetchUser();
  },
  methods: {

    async fetchDepartments() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(apiEndpoints.departments, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.departments = response.data.data || [];
      } catch (err) {
        console.error("Error fetching departments:", err);
        this.errorMessage = "Failed to fetch departments.";
      }
    },
    isImage(url) {
      return /\.(jpg|jpeg|png|gif|bmp)$/i.test(url);
    },
      fetchUser() {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage

      // Make an API request to fetch the user data
      axios.get(apiEndpoints.fetchUser(this.userId), {
        headers: {
          Authorization: `Bearer ${token}`, // Include the Bearer token in the request header
        },
      })
        .then((res) => {
          this.user = res.data; // Store the fetched user data
          // Initialize the form data with the fetched user data, and reset password fields
          this.form = {
            ...res.data,
            password: '',
            password_confirmation: '',
            image: null,
            signature: null,
          };
        })
        .catch((err) => {
          console.error("Failed to fetch user data:", err); // Handle errors
        });
    },
    handleFileUpload(event, field) {
      this.form[field] = event.target.files[0];
    },
    submitForm() {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      const formData = new FormData();

      // Loop through the form and append non-null and non-empty values to formData
      for (const key in this.form) {
        if (this.form[key] !== null && this.form[key] !== '') {
          formData.append(key, this.form[key]);
        }
      }

      // Make the POST request to update the user (simulating PUT request with _method)
      axios.post(`${apiEndpoints.updateUser(this.userId)}?_method=PUT`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Bearer token for authorization
          'Content-Type': 'multipart/form-data', // Header for file uploads
        }
      })
        .then(() => {
          this.$emit("updated"); // Emit an event after successful update
          this.toast.success("User updated successfully.");
        })
        .catch(err => {
          console.error("Update failed:", err); // Log the error if the update fails
          this.toast.error("Error updating user.");
        });
    }
  }
};
</script>

<style scoped>
.input-field {
  @apply px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400;
}
</style>
