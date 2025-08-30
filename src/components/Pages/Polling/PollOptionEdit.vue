<template>
  <div :class="theme81" class="p-6 rounded-lg shadow-md">
    <form @submit.prevent="updatePollOption">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Left Column -->
        <div class=" p-4 rounded">
          <!-- Title -->
          <div class="mb-4">
            <label :class="themeText" class="block font-semibold mb-1">Poll Option Name
              <span class="text-red-500">*</span>
            </label>
            <input :class="themeInputText" v-model="formData.name" type="text" class="input-field" required />
          </div>

           <!-- Status -->
           <div class="mb-4">
            <label :class="themeText" class="block font-semibold mb-1">Status</label>
            <select :class="themeInputText" v-model="formData.status" class="input-field">
              <option :value="1">Active</option>
              <option :value="0">Inactive</option>
            </select>
          </div>

        </div>

        <!-- Right Column -->
        <div class="p-4 rounded">
         
          <!-- Description -->
          <div class="mb-4">
            <label :class="themeText" class="block font-semibold mb-1">Description</label>
            <textarea :class="themeInputText" v-model="formData.description" class="input-field" rows="3"></textarea>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="mt-6 flex justify-center">
        <button type="submit" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow">
          Update
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
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
      themeInputText,
    } = useTheme();

    const toast = useToast();

    return {
      theme61,
      theme6,
      theme8,
      theme9,theme81,
      themeText,
      toast,themeInputText
    };
  },
  props: {
    pollOptionId: {
      type: Number,
      required: true
    },
    pollOption: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formData: {
        name: this.pollOption.name || '',
        description: this.pollOption.description || '',
        status: this.pollOption.status ?? 1
      },
    };
  },
  mounted() {
  },
  methods: {
updatePollOption() {
  const token = sessionStorage.getItem('token'); 
  const formData = new FormData();

  // Append all formData fields
  for (const key in this.formData) {
    if (this.formData[key] !== null && this.formData[key] !== undefined) {
      formData.append(key, this.formData[key]);
    }
  }
  formData.append('_method', 'PUT');

  axios.post(apiEndpoints.updatePollOption(this.pollOptionId), formData, {
    headers: {
      Authorization: `Bearer ${token}`, 
      'Content-Type': 'multipart/form-data',
    }
  })
  .then(() => {
    this.$emit('updated');
    this.toast.success('Poll option updated successfully!');
  })
  .catch(error => {
    console.error('Error updating poll option:', error);

    // Check if API returned an error response
    if (error.response && error.response.data && error.response.data.errors) {
      const apiErrors = error.response.data.errors;
      if (Array.isArray(apiErrors) && apiErrors.length) {
        apiErrors.forEach(err => {
          this.toast.error(err.detail || 'Unknown error occurred');
        });
      } else {
        this.toast.error(error.response.data.message || 'Failed to update poll option.');
      }
    } else {
      // Network or unexpected error
      this.toast.error('Something went wrong. Please try again.');
    }
  });
}

  }
};
</script>

<style scoped>
.input-field {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  width: 100%;
  transition: all 0.3s ease-in-out;
}
.input-field:focus {
  border-color: #007bff;
  outline: none;
}
</style>
