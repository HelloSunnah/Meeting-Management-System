<template>
  <div :class="theme9" class="min-h-screen p-6 transition-all duration-300 ease-in-out">
    <div :class="theme7" class="relative w-full p-2 sm:p-12 bg-gray-200 mt-4 rounded-2xl lg:rounded-3xl shadow-xl">

      <!-- Title -->
      <h2 :class="themeText" class="text-2xl font-semibold text-center mb-6">

        {{ $t("Create New Agenda") }}
      </h2>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-8">

        <!-- Title -->
        <div>
          <label for="title" class="text-sm font-medium"> {{ $t("Title") }}</label>
          <input type="text" id="title" v-model="formData.title"
            class="w-full p-2 border-2 rounded-lg focus:ring-4 focus:ring-blue-500 focus:outline-none transition-all duration-300 ease-in-out"
            :class="inputClass" placeholder="Enter the title" required />
          <p v-if="formErrors.title" class="text-red-600 text-sm mt-1">{{ formErrors.title }}</p>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="text-sm font-medium"> {{ $t("Description") }}</label>
          <textarea id="description" v-model="formData.description"
            class="w-full p-2 border-2 rounded-lg focus:ring-4 focus:ring-blue-500 focus:outline-none transition-all duration-300 ease-in-out"
            :class="inputClass" placeholder="Enter a detailed description" rows="4" required></textarea>
          <p v-if="formErrors.description" class="text-red-600 text-sm mt-1">{{ formErrors.description }}</p>
        </div>

        <!-- Remarks & Attachment -->
        <div class="flex flex-col sm:flex-row sm:space-x-6">
          <div class="w-full sm:w-1/2">
            <label for="remarks" class="text-sm font-medium"> {{ $t("Remarks") }}</label>
            <input type="text" id="remarks" v-model="formData.remarks"
              class="w-full p-3 border-2 rounded-lg focus:ring-4 focus:ring-blue-500 focus:outline-none transition-all duration-300 ease-in-out"
              :class="inputClass" placeholder="Enter any remarks" />
            <p v-if="formErrors.remarks" class="text-red-600 text-sm mt-1">{{ formErrors.remarks }}</p>
          </div>

          <div class="w-full sm:w-1/2 mt-4 sm:mt-0">
            <label for="attachment" class="text-sm font-medium"> {{ $t("Attachment") }}</label>
            <input type="file" id="attachment" @change="handleFileUpload"
              class="w-full p-2 border-2 rounded-lg focus:ring-4 focus:ring-blue-500 focus:outline-none transition-all duration-300 ease-in-out"
              :class="inputClass" />
            <p v-if="formErrors.attachment" class="text-red-600 text-sm mt-1">{{ formErrors.attachment }}</p>
            <p v-if="formData.attachment" class="text-sm mt-2 text-gray-700">
              Selected File: {{ formData.attachment.name }}
            </p>
          </div>
        </div>

        <!-- Active Status & Agenda Type -->
        <div class="flex flex-col sm:flex-row sm:space-x-6 items-center">
          <div class="flex items-center space-x-2 w-full sm:w-1/2">
            <label class="text-sm font-medium"> {{ $t("Active Status") }}</label>
            <div class="flex space-x-4">
              <div class="flex items-center space-x-2">
                <input type="radio" id="active" value="1" v-model="formData.isActive"
                  class="w-6 h-6 rounded focus:outline-none transition-all duration-300" />
                <label for="active" class="text-sm font-medium"> {{ $t("Active") }}</label>
              </div>

              <div class="flex items-center space-x-2">
                <input type="radio" id="inactive" value="0" v-model="formData.isActive"
                  class="w-6 h-6 rounded focus:outline-none transition-all duration-300" />
                <label for="inactive" class="text-sm font-medium"> {{ $t("Inactive") }}</label>
              </div>
            </div>
          </div>

          <div class="w-full sm:w-1/2 mt-4 sm:mt-0">
            <label for="agenda-type" class="block text-sm font-medium"> {{ $t("Agenda Type") }}</label>
            <select id="agenda-type" v-model="formData.agendaType"
              class="w-full p-2 border-2 rounded-lg focus:ring-4 focus:ring-blue-500 focus:outline-none transition-all duration-300 ease-in-out"
              :class="inputClass" required>
              <option value="Meeting"> {{ $t("Meeting") }}</option>
              <option value="Presentation"> {{ $t("Presentation") }}</option>
              <option value="Workshop"> {{ $t("Workshop") }}</option>
              <option value="Conference">  {{ $t("Conference") }}</option>
            </select>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row justify-center sm:space-x-4">
          <router-link to="/meeting/agenda"
            class="px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white text-center rounded-lg shadow-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-300">
              {{ $t("Close") }}
          </router-link>

          <button type="submit" :disabled="isSubmitting"
            class="px-8 py-4 bg-gradient-to-r to-blue-500 from-teal-500 text-white text-center rounded-lg shadow-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-300">
            <span>
              {{ $t("Submit") }}

            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import { useToast } from "vue-toastification";
import themeSetting from "@/components/js/ThemeSetting.js";


export default {
    setup() {
    const toast = useToast();
    return { toast };
  },  name: "CreateAgenda",
  ...themeSetting,
  data() {
    return {
      formData: {
        title: '',
        description: '',
        remarks: '',
        attachment: null,
        isActive: 1, // Default to 0 (inactive)
        agendaType: 'meeting',
      },
      formErrors: {},
      isSubmitting: false,
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    // Handle file upload
    handleFileUpload(event) {
      this.formData.attachment = event.target.files[0];
      console.log("File uploaded: ", this.formData.attachment.name); // Debugging file upload
    },

    // Ensure that the isActive field is set to 1 or 0
    updateIsActive() {
      // Convert the boolean to 1 or 0
      this.formData.isActive = this.formData.isActive ? 1 : 0;
    },

    // Submit form data
    async submitForm() {
      this.isSubmitting = true;
      this.formErrors = {}; // Reset previous errors

      const formData = new FormData();
      formData.append('title', this.formData.title);
      formData.append('description', this.formData.description);
      formData.append('remarks', this.formData.remarks);
      formData.append('isActive', this.formData.isActive); // Send 1 or 0 based on checkbox value
      formData.append('agendaType', this.formData.agendaType);

      // If attachment is present, append it to formData
      if (this.formData.attachment) {
        formData.append('attachment', this.formData.attachment);
      }

      try {
           const response = await axios.post(apiEndpoints.createAgenda, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Required for file uploads
            Authorization: `Bearer ${token}`,    // Bearer token for authentication
            Accept: 'application/json',           // Specify that we expect JSON response
          },
        });
        this.toast.success("Meeting Agenda Created Successfully");
        this.$router.push('/meeting/agenda'); // Redirect after successful submission
      } catch (error) {
        console.error("Error occurred during submission:", error);
        if (error.response && error.response.data) {
          this.formErrors = error.response.data.errors;
        } else {
          alert('An error occurred while creating the agenda');
        }
      } finally {
        this.isSubmitting = false;
      }
    }
  },
};
</script>
