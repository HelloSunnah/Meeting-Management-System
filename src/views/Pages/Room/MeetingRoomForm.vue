<template>
  <div :class="theme9" class="min-h-screen p-6 transition-all duration-300 ease-in-out">
    <div :class="theme7" class="relative w-full p-2 sm:p-12 bg-gray-200 mt-4 rounded-2xl lg:rounded-3xl shadow-xl">

      <!-- Title -->
      <h2 :class="themeText" class="text-2xl font-semibold text-center mb-6">
        {{ $t("Create New Room") }}
      </h2>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-8">

        <!-- Room Name -->
        <div>
          <label for="roomName" class="text-sm font-medium">Room Name</label>
          <input type="text" id="roomName" v-model="formData.roomName"
            class="w-full p-2 border-2 rounded-lg focus:ring-4 focus:ring-blue-500"
            :class="inputClass" placeholder="Enter the room name" required />
          <p v-if="formErrors.roomName" class="text-red-600 text-sm mt-1">{{ formErrors.roomName }}</p>
        </div>

        <!-- Room Description -->
        <div>
          <label for="roomDesc" class="text-sm font-medium">Room Description</label>
          <textarea id="roomDesc" v-model="formData.roomDesc"
            class="w-full p-2 border-2 rounded-lg focus:ring-4 focus:ring-blue-500"
            :class="inputClass" placeholder="Enter a room description" rows="4" required></textarea>
          <p v-if="formErrors.roomDesc" class="text-red-600 text-sm mt-1">{{ formErrors.roomDesc }}</p>
        </div>

        <!-- Total Seat -->
        <div>
          <label for="totalSeat" class="text-sm font-medium">Total Seats</label>
          <input type="number" id="totalSeat" v-model="formData.totalSeat"
            class="w-full p-2 border-2 rounded-lg focus:ring-4 focus:ring-blue-500"
            :class="inputClass" placeholder="Enter total number of seats" required />
          <p v-if="formErrors.totalSeat" class="text-red-600 text-sm mt-1">{{ formErrors.totalSeat }}</p>
        </div>

        <!-- Room Serial -->
        <div>
          <label for="roomSerial" class="text-sm font-medium">Room Serial</label>
          <input type="text" id="roomSerial" v-model="formData.roomSerial"
            class="w-full p-2 border-2 rounded-lg focus:ring-4 focus:ring-blue-500"
            :class="inputClass" placeholder="Enter room serial number" required />
          <p v-if="formErrors.roomSerial" class="text-red-600 text-sm mt-1">{{ formErrors.roomSerial }}</p>
        </div>

        <!-- Status (Active / Inactive) -->
        <div class="flex items-center space-x-4 mt-4">
          <label class="text-sm font-medium">Status:</label>
          <label class="flex items-center space-x-2">
            <input type="radio" value="1" v-model="formData.status" />
            <span>Active</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="radio" value="0" v-model="formData.status" />
            <span>Inactive</span>
          </label>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row justify-center sm:space-x-4 mt-6">
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
import apiEndpoints from '@/config/apiConfig';

export default {
  name: "CreateAgenda",
  ...themeSetting,
  data() {
    return {
    formData: {
      company_id: '',     // Populate this with user’s company_id if necessary
      roomName: '',
      roomDesc: '',
      totalSeat: '',
      roomSerial: '',
      status: 1,          // Default to active
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
    async submitForm() {
  this.isSubmitting = true;
  this.formErrors = {}; // Reset errors

  const payload = {
    company_id:'1',
    roomName: this.formData.roomName,
    roomDesc: this.formData.roomDesc,
    totalSeat: this.formData.totalSeat,
    roomSerial: this.formData.roomSerial,
    status: this.formData.status,
  };

  try {
         const response = await axios.post(apiEndpoints.createRoom, payload, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Bearer token for authentication
            Accept: 'application/json', // Specify that the response should be JSON
          },
        });

    this.toast.success("Room Created Successfully");
    this.$router.push('/meeting/room');
  } catch (error) {
    console.error("Submission error:", error);
    if (error.response && error.response.data) {
      this.formErrors = error.response.data.errors;
    } else {
      alert('An error occurred while creating the room');
    }
  } finally {
    this.isSubmitting = false;
  }
}

  },
};
</script>
