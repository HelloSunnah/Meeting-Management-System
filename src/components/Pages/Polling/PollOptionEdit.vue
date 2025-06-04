<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <form @submit.prevent="updatePollOption">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Left Column -->
        <div class="bg-gray-100 p-4 rounded">
          <!-- Title -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Option Name</label>
            <input v-model="formData.name" type="text" class="input-field" required />
          </div>

           <!-- Status -->
           <div class="mb-4">
            <label class="block font-semibold mb-1">Status</label>
            <select v-model="formData.status" class="input-field">
              <option :value="1">Active</option>
              <option :value="0">Inactive</option>
            </select>
          </div>

        </div>

        <!-- Right Column -->
        <div class="bg-gray-100 p-4 rounded">
         
          <!-- Description -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Description</label>
            <textarea v-model="formData.description" class="input-field" rows="3"></textarea>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="mt-6 flex justify-center">
        <button type="submit" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow">
          Save Changes
        </button>
      </div>
    </form>
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
      const token = localStorage.getItem('token'); 
      const formData = new FormData();

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
        alert('Poll option updated successfully!');
      })
      .catch(error => {
        console.error('Error updating poll option:', error);
        alert('Failed to update poll option.');
        this.toast.error()
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
