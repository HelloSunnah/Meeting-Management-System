<template>
  <!-- Full Width Form Section -->
  <div :class="themeClass" class="min-h-screen p-6 transition-all duration-300 ease-in-out">
    <div :class="formClass" class="relative w-full p-2 sm:p-12 rounded-2xl lg:rounded-3xl shadow-xl">

      <!-- Logo -->


      <!-- Form Title -->
      <h2 :class="themeClass === 'bg-gray-900 text-white' ? 'text-white' : 'text-gray-800'"
        class="text-2xl font-semibold text-center">
        Create New Subscription
      </h2>

      <!-- Form Content -->
      <form @submit.prevent="submitForm" class="space-y-8">
        <div class="flex space-x-6">
          <div class="w-1/2">
              <label for="company" :class="themeText" class="block text-sm font-medium">Company</label>
              <select id="company" v-model="formData.companyId"
                class="w-full p-2 border-2 rounded-lg focus:ring-4 focus:ring-blue-500 focus:outline-none transition-all duration-300 ease-in-out"
                :class="themeClass === 'bg-gray-900 text-white' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'"
                required>
                <option value="meeting">Unit-1</option>
                <option value="presentation">Unit-2</option>
              </select>
          </div>
          <div class="w-1/2">
              <label for="subscription-type" :class="themeText" class="block text-sm font-medium">Subscription Type</label>
              <select id="agenda-type" v-model="formData.subscriptionType"
                class="w-full p-2 border-2 rounded-lg focus:ring-4 focus:ring-blue-500 focus:outline-none transition-all duration-300 ease-in-out"
                :class="themeClass === 'bg-gray-900 text-white' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'"
                required>
                <option value="meeting">Yearly</option>
                <option value="presentation">Monthly</option>
              </select>
          </div>
         
        </div>
        <div class="flex space-x-6">
          <div class="w-1/2">
            <label for="start-date" :class="themeText" class="block text-sm font-medium">Start Date</label>
            <input
              type="date"v-auto-date
              id="start-date"
              v-model="formData.startDate"
              class="w-full p-2 border-2 rounded-lg focus:ring-4 focus:ring-blue-500 focus:outline-none transition-all duration-300 ease-in-out"
              :class="themeClass === 'bg-gray-900 text-white' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'"
              required
            />
          </div>
          <div class="w-1/2">
            <label for="start-date" :class="themeText" class="block text-sm font-medium">End Date</label>
            <input
              type="date"v-auto-date
              id="end-date"
              v-model="formData.startDate"
              class="w-full p-2 border-2 rounded-lg focus:ring-4 focus:ring-blue-500 focus:outline-none transition-all duration-300 ease-in-out"
              :class="themeClass === 'bg-gray-900 text-white' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'"
              required
            />
          </div>
         
        </div>
    

        <!-- Active Status and Agenda Type in Same Row -->
        <div class="flex justify-between items-center space-x-6">
          <div class="flex items-center space-x-4 w-1/2">
            <label for="active-status" :class="themeText" class="text-sm font-medium">Active Status</label>
            <input type="checkbox" id="active-status" v-model="formData.isActive"
              class="w-6 h-6 bg-blue-500 rounded-full focus:outline-none transition-all duration-300 ease-in-out"
              aria-label="Active Status" />
          </div>

          <div class="flex items-center space-x-4 w-1/2">
            <label for="subscription-status" :class="themeText" class="text-sm font-medium">Subscription Status</label>
            <input type="checkbox" id="subscription-status" v-model="formData.isSubscription"
              class="w-6 h-6 bg-blue-500 rounded-full focus:outline-none transition-all duration-300 ease-in-out"
              aria-label="Active Status" />
          </div>
        </div>
         <!-- Remarks -->
         <div class="flex flex-col sm:flex-row sm:space-x-6">
          <div class="w-full sm:w-1/2">
            <label for="remarks" class="text-sm font-medium">Remarks</label>
            <input
              type="text"
              id="remarks"
              v-model="formData.remarks"
              class="w-full p-3 border-2 rounded-lg focus:ring-4 focus:ring-blue-500 focus:outline-none transition-all duration-300 ease-in-out"
              :class="inputClass"
              placeholder="Enter any remarks"
            />
            <p v-if="formErrors.remarks" class="text-red-600 text-sm mt-1">{{ formErrors.remarks }}</p>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-center">

      
          <router-link to="/meeting/schedule" class="px-8 py-4 mr-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-all duration-300 ease-in-out">
    <button>
      <span>Close</span>
    </button>
  </router-link>
          <h2></h2>
          <button type="submit" :disabled="isSubmitting"
            class="px-8 py-4 bg-blue-700 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-all duration-300 ease-in-out"
            aria-live="polite">
            <span v-if="isSubmitting">Saving...</span>
            <span v-else>Save</span>
          </button>

        </div>
      </form>
    </div>
  </div>
</template>
<script>import apiEndpoints from '@/config/apiConfig';

import useTheme from '@/components/js/ThemeSetting';
import { useToast } from "vue-toastification";

export default {

    setup() {
    const {
      theme1,
      theme2,
      theme3,
      theme4,
      theme5,
      theme6,
      theme7,
      theme8,
      theme9,
      themeText,
    } = useTheme();

    const toast = useToast();

    return {
      theme1,
      theme2,
      theme3,
      theme4,
      theme5,
      theme6,
      theme7,
      theme8,
      theme9,
      themeText,
      toast,
    };
  },  data() {
    return {
      formData: {
        title: '',
        description: '',
        remarks: '',
        attachment: null,
        isActive: false,
        isSubscription: false,
        agendaType: 'meeting',
      },
      isSubmitting: false,
      formErrors: {
        title: '',
        description: '',
        remarks: '',
        attachment: '',
      },
    };
  },
  computed: {
    themeClass() {
      return this.$store.state.theme === 'dark' ? 'bg-gray-900 text-white custom-scrollbar' : 'bg-gray-100 text-gray-800 custom-scrollbar';
    },
    formClass() {
      return this.$store.state.theme === 'dark' ? 'bg-gray-600 text-white custom-scrollbar' : 'bg-gray-100 text-gray-800 custom-scrollbar';
    },
    labelClass() {
      return this.themeClass === 'bg-gray-900 text-white' ? 'text-white' : 'text-gray-700';
    }
  },
  methods: {

    handleFileUpload(event) {
      this.formData.attachment = event.target.files[0];
    },
    AgendaPage() {
    },
    validateForm() {
      this.formErrors = {
        title: this.formData.title ? '' : 'Title is required.',
        description: this.formData.description ? '' : 'Description is required.',
        remarks: '',
        attachment: this.formData.attachment ? '' : 'Attachment is required.',
      };
      return Object.values(this.formErrors).every((error) => !error);
    },
    async submitForm() {
      if (!this.validateForm()) {
        // alert('Please fix the form errors before submitting.');
        return;
      }
      this.isSubmitting = true;

      try {
        const formDataToSubmit = new FormData();
        formDataToSubmit.append('title', this.formData.title);
        formDataToSubmit.append('description', this.formData.description);
        formDataToSubmit.append('remarks', this.formData.remarks);
        formDataToSubmit.append('attachment', this.formData.attachment);
        formDataToSubmit.append('isActive', this.formData.isActive);
        formDataToSubmit.append('agendaType', this.formData.agendaType);

        const response = await fetch('YOUR_API_ENDPOINT', {
          method: 'POST',
          body: formDataToSubmit,
        });

        if (!response.ok) {
          throw new Error('Error submitting form');
        }

        // alert('Form submitted successfully!');
        this.resetForm();
      } catch (error) {
        // alert('There was an error: ' + error.message);
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.formData = {
        title: '',
        description: '',
        remarks: '',
        attachment: null,
        isActive: false,
        isSubscription: false,
        agendaType: 'meeting',
      };
    },
  },
};
</script>
