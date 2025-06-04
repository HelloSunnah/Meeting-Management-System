<template>
  <div :class="theme8" class="min-h-screen p-6 transition-all duration-300 ease-in-out">
    <div :class="theme8" class="relative w-full mx-auto p-6 sm:p-12 rounded-3xl shadow-xl bg-white">
      <h2 :class="theme8 === 'bg-gray-900 text-white' ? 'text-white' : 'text-gray-800'"
        class="text-3xl font-extrabold text-center mb-6">
        Edit Polling Event
      </h2>

      <form @submit.prevent="submitForm" class="space-y-8">
        <div :class="theme8" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="bg-gray-50 p-6 rounded-2xl shadow-lg">
            <h3 class="text-xl font-semibold mb-4 text-gray-800">Details</h3>

            <div class="space-y-4">
              <div>
                <label for="title" :class="labelClass">Poll Title</label>
                <input type="text" id="title" v-model="formData.title" :class="inputClass" />
                <span v-if="formErrors.title" class="text-red-600 text-sm">{{ formErrors.title }}</span>
              </div>

              <div>
                <label for="type" :class="labelClass">Poll Type</label>
                <select id="type" v-model="formData.type" :class="inputClass">
                  <option disabled value="">Select type</option>
                  <option value="1">General</option>
                  <option value="2">Meeting</option>
                </select>
              </div>

              <div>
                <label for="meeting_id" :class="labelClass">Meeting Title</label>
                <select id="meeting_id" v-model.number="formData.meeting_id"
                  :class="[inputClass, formData.type !== '2' ? 'bg-gray-200 cursor-not-allowed' : '']"
                  :disabled="formData.type !== '2'">
                  <option disabled value="">Select meeting</option>
                  <option v-for="meeting in meetings" :key="meeting.id" :value="meeting.id">{{ meeting.title }}</option>
                </select>
              </div>

              <div>
                <label for="options" :class="labelClass">Poll Options</label>
                <multiselect v-model="formData.options" :options="options" :multiple="true" :close-on-select="false"
                  :clear-on-select="false" :preserve-search="true" placeholder="Select poll options" label="name"
                  track-by="id" />
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-6 rounded-2xl shadow-lg">
            <h3 class="text-xl font-semibold mb-4 text-gray-800">Schedule & Participants</h3>

            <div class="space-y-4">
              <div>
                <label for="start_time" :class="labelClass">Start Time</label>
                <input type="datetime-local" id="start_time" v-model="formData.start_time" :class="inputClass" />
              </div>

              <div>
                <label for="end_time" :class="labelClass">End Time</label>
                <input type="datetime-local" id="end_time" v-model="formData.end_time" :class="inputClass" />
              </div>

              <div>
                <label for="department_id" :class="labelClass">Department</label>
                <select id="department_id" v-model="selectedDepartmentId" :class="inputClass"
                  @change="filterParticipantsByDepartment">
                  <option disabled value="">Select department</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id.toString()">{{ dept.name }}
                  </option>
                </select>
              </div>

              <div>
                <label for="participants" :class="labelClass">Participants</label>
                <multiselect v-model="formData.participants" :options="participants" :multiple="true"
                  :close-on-select="false" :clear-on-select="false" :preserve-search="true"
                  placeholder="Select participants" label="name" track-by="id" />
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-100 p-6 rounded-2xl shadow-lg col-span-2">
          <h3 class="text-xl font-semibold mb-4 text-gray-800">Description</h3>
          <label for="description" :class="labelClass">Description</label>
          <textarea id="description" v-model="formData.description" :class="inputClass" rows="4"></textarea>
        </div>

        <!-- <div class="bg-gray-50 p-6 rounded-2xl shadow-lg col-span-2">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Attachment</h3>
          <div class="relative bg-gray-100 p-6 rounded-2xl border border-gray-400 mb-8">
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
              <div class="flex flex-col sm:flex-row sm:items-start gap-6">
                <div class="w-full sm:w-6/12">
                  <label class="block text-sm font-medium text-gray-600 mb-1">Upload File</label>
                  <input type="file" @change="handleFileUpload($event)" accept="image/*" :class="inputClass" />
                </div>
                <div class="relative w-full sm:w-6/12 flex justify-center items-center">
                  <div class="relative w-full max-w-sm h-48 border border-gray-300 rounded-xl overflow-hidden shadow">
                    <img   :src="generateApiUrl(formData.imagePreview)" v-if="isImage(formData.imagePreview)" alt="Preview"
                      class="object-contain w-full h-full" />
                    <a v-else :href="formData.imagePreview" target="_blank" class="text-blue-600 underline">Download
                      attachment</a>
                    <button type="button" @click="removeAttachment"
                      class="absolute top-2 right-2 bg-white text-red-600 rounded-full p-1 hover:bg-red-100">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div> -->

        <div class="flex justify-center mt-6 space-x-4">
          <!-- <router-link to="/pollings" class="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</router-link> -->
          <button type="submit" :disabled="isSubmitting"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <span v-if="isSubmitting">Updating...</span>
            <span v-else>Update</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Multiselect from 'vue-multiselect';
import apiEndpoints from '@/config/apiConfig';

export default {
  props: {
    pollId: {
      type: [Number, String],
      required: true
    },
    poll: {
      type: Object,
      required: true
    }
  },
  components: { Multiselect },
  data() {
    return {
      formData: {
        title: '',
        type: '',
        meeting_id: '',
        start_time: '',
        end_time: '',
        description: '',
        participants: [],
        options: [],
        attachment: null,
        imagePreview: null
      },
      options: [],
      formErrors: {},
      isSubmitting: false,
      formClass: 'bg-white',
      labelClass: 'text-gray-700',
      inputClass: 'w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500',
      meetings: [],
      departments: [],
      participants: [],
      selectedDepartmentId: ''
    };
  },
  async mounted() {
    await this.fetchAllData();
    await this.fetchPollingData();
  },
  computed: {
    theme8() {
      return this.$store.state.theme === 'dark' ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-700";
    },
  },
  methods: {
    async fetchAllData() {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [userRes, meetingRes, deptRes, optionsRes] = await Promise.all([
          axios.get(apiEndpoints.users, { headers }),
          axios.get(apiEndpoints.meetings, { headers }),
          axios.get(apiEndpoints.departments, { headers }),
          axios.get(apiEndpoints.pollOptions, { headers })
        ]);

        this.participants = userRes.data?.users || [];
        this.meetings = meetingRes.data?.data || [];
        this.departments = [{ id: 'all', name: 'All Departments' }, ...(deptRes.data?.data || [])];
        this.options = optionsRes.data?.data || [];
      } catch (error) {
        console.error('Error fetching all data:', error);
      }
    },

    formatInputDateTime(datetimeStr) {
      const date = new Date(datetimeStr);
      const pad = (n) => n.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    },

    async fetchPollingData() {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const res = await axios.get(apiEndpoints.polling(this.pollId), { headers });
        const { data } = res.data;

        this.formData = {
          ...this.formData,
          title: data.title,
          type: data.type.toString(),
          meeting_id: data.meeting_id,
          start_time: this.formatInputDateTime(data.start_time),
          end_time: this.formatInputDateTime(data.end_time),
          description: data.description,
          participants: data.participants || [],
          options: data.options || [],
          imagePreview: data.attachment
        };
      } catch (error) {
        console.error('Error fetching polling data:', error);
      }
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.formData.attachment = file;
        this.formData.imagePreview = URL.createObjectURL(file);
      }
    },
    generateApiUrl(attachment) {
      return `${apiEndpoints.storageUrl}/storage/${attachment}`;
    },
    isImage(url) {
      return url && /\.(jpg|jpeg|png|gif|bmp)$/i.test(url);
    },
    formatToBackendDate(datetimeStr) {
      if (!datetimeStr) return null;

      // Expected input: '2025-05-22T14:30'
      const [date, time] = datetimeStr.split('T');
      if (!date || !time) return null;

      return `${date} ${time}:00`; // Add seconds
    }
    ,
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // Set the attachment and create a preview URL for the image
        this.formData.attachment = file;
        this.formData.imagePreview = URL.createObjectURL(file);
      }
    },
    removeAttachment() {
      this.formData.attachment = null;  // Reset the attachment file
      this.formData.imagePreview = null; // Remove the image preview
    },
    async submitForm() {
      this.isSubmitting = true;
      this.formErrors = {};

      // Validate the required fields
      if (!this.formData.title || !this.formData.type || !this.formData.start_time || !this.formData.end_time) {
        this.formErrors.general = "Please fill in all required fields.";
        this.isSubmitting = false;
        return;
      }

      console.log('Form Data:', this.formData);

      // Debugging logs to check the structure of participants and options before sending
      console.log('Participants:', this.formData.participants);
      console.log('Options:', this.formData.options);

      try {
        const token = localStorage.getItem("token");

        // Prepare the payload
        const payload = {
          title: this.formData.title,
          type: this.formData.type,
          description: this.formData.description,
          start_time: this.formatToBackendDate(this.formData.start_time),
          end_time: this.formatToBackendDate(this.formData.end_time), 
          participants: this.formData.participants.map(participant => {
            return participant.id; 
          }),
          options: this.formData.options.map(option => {
            return option.id 
          }),
          attachment: this.formData.attachment ? this.formData.imagePreview : null // Send the image preview URL
        };

        if (this.formData.type === '2' && this.formData.meeting_id) {
          payload.meeting_id = parseInt(this.formData.meeting_id);
        }

        // Log the payload before sending
        console.log('Payload:', payload);

        // Send the API request
        const res = await axios.put(apiEndpoints.polling(this.pollId), payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log(res);

        // Check if the request was successful
        if (res.status === 200) {
          this.$router.push('/pollings'); // Redirect after successful update
        } else {
          this.formErrors.general = "Unexpected error. Please try again.";
        }
      } catch (error) {
        console.error('API Error:', error);

        // Handle validation errors (e.g., 422)
        if (error.response && error.response.status === 422) {
          this.formErrors = error.response.data.errors || {};
        } else {
          this.formErrors.general = "Something went wrong. Please try again later.";
        }
      } finally {
        this.isSubmitting = false;
      }
    }





  }
};
</script>
