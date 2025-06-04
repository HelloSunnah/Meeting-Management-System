<template>
  <div :class="themeClass" class="min-h-screen p-6 transition-all duration-300 ease-in-out">
    <div :class="formClass" class="relative w-full mx-auto p-6 sm:p-12 rounded-3xl shadow-xl bg-white">
      <h2 :class="themeClass === 'bg-gray-900 text-white' ? 'text-white' : 'text-gray-800'"
        class="text-3xl font-extrabold text-center mb-6">
        Create New Polling Event
      </h2>
      <form @submit.prevent="submitForm" class="space-y-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div class="bg-gray-50 p-6 rounded-2xl shadow-lg">
            <h3 class="text-xl font-semibold mb-4 text-gray-800">Details</h3>
            <div class="space-y-2">
              <label for="title" :class="labelClass" class="text-sm font-medium">Poll Title
                <span class="text-red-500">*</span>
              </label>
              <input type="text" required id="title" v-model="formData.title" :class="inputClass"
                placeholder="Enter the title" />
              <span v-if="formErrors.title" class="text-red-600 text-sm">{{ formErrors.title }}</span>
            </div>
            <div>
              <label for="type" :class="labelClass">Poll Type
                <span class="text-red-500">*</span>
              </label>
              <select required id="type" v-model="formData.type" :class="inputClass">
                <option disabled value="">Select type</option>
                <option value="1">General</option>
                <option value="2">Meeting</option>
              </select>
            </div>
            <div>
              <label for="meeting_id" :class="labelClass">Meeting Title
                <span class="text-red-500">*</span>
              </label>
              <select required id="meeting_id" v-model="formData.meeting_id"
                :class="[inputClass, formData.type !== '2' ? 'bg-gray-200 cursor-not-allowed' : '']"
                :disabled="formData.type !== '2'">
                <option disabled value="">Select meeting</option>
                <option v-for="meeting in meetings" :key="meeting.id" :value="meeting.id">{{ meeting.title }}</option>
              </select>
            </div>
            <div>
              <label for="options" :class="labelClass" class="text-sm font-medium text-gray-600">Poll Options</label>
              <multiselect v-model="formData.options" :options="options" :multiple="true" :close-on-select="false"
                :clear-on-select="false" :preserve-search="true" placeholder="Select poll options" label="name"
                track-by="id" />
            </div>
          </div>
          <!-- Right Column -->
          <div class="bg-gray-50 p-6 rounded-2xl shadow-lg">
            <h3 class="text-xl font-semibold mb-4 text-gray-800">Schedule & Participants</h3>
            <div>
              <label for="start_time" :class="labelClass">Start Time <span class="text-red-500">*</span></label>
              <input required type="datetime-local" id="start_time" v-model="formData.start_time" :class="inputClass" />
            </div>
            <div>
              <label for="end_time" :class="labelClass">End Time <span class="text-red-500">*</span></label>
              <input required type="datetime-local" id="end_time" v-model="formData.end_time" :class="inputClass" />
            </div>
            <div>
              <label for="department_id" :class="labelClass">Department</label>
              <select id="department_id" v-model="selectedDepartmentId" :class="inputClass"
                @change="filterParticipantsByDepartment">
                <option disabled value="">Select department</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id.toString()">{{ dept.name }}</option>
              </select>
            </div>
            <div>
              <label for="participant" :class="labelClass"
                class="text-sm font-medium text-gray-600">Participants</label>
              <multiselect required v-model="formData.participants" :options="participants" :multiple="true"
                :close-on-select="false" :clear-on-select="false" :preserve-search="true"
                placeholder="Select participants" label="name" track-by="id" />
            </div>
          </div>
          <!-- Description -->
          <div class="bg-gray-100 p-6 rounded-2xl shadow-lg col-span-2">
            <h3 class="text-xl font-semibold mb-4 text-gray-800">Description</h3>
            <label for="description" :class="labelClass">Description</label>
            <textarea id="description" v-model="formData.description" :class="inputClass" rows="4"
              placeholder="Enter a detailed description"></textarea>
          </div>
          <div
            class="bg-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out col-span-2">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Attachment</h3>
            <div class="relative bg-gray-100 p-6 rounded-2xl border border-gray-400 mb-8">
              <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                <div class="flex flex-col sm:flex-row sm:items-start gap-6">
                  <!-- File Input -->
                  <div class="w-full sm:w-6/12">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Upload File</label>
                    <input type="file" @change="handleFileUpload($event)" accept="image/*" :class="inputClass" />
                  </div>
                  <!-- Image Preview -->
                  <div v-if="formData.imagePreview" class="w-full sm:w-6/12 flex justify-center items-center">
                    <div class="relative w-full max-w-sm h-48 border border-gray-300 rounded-xl overflow-hidden shadow">
                      <img :src="formData.imagePreview" alt="Preview" class="object-contain w-full h-full" />
                      <button type="button" @click="removeAttachment"
                        class="absolute top-2 right-2 bg-white text-red-600 rounded-full p-1 hover:bg-red-100">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Actions -->
        <div class="flex justify-center mt-6 space-x-4">
          <router-link to="/polling/schedule"
            class="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 transition duration-300">
            Close
          </router-link>
          <button type="submit" :disabled="isSubmitting"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
            <span v-if="isSubmitting">Submitting...</span>
            <span v-else>Submit</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import apiEndpoints from '@/config/apiConfig';
import { useToast } from "vue-toastification";

export default {
    setup() {
    const toast = useToast();
    return { toast };
  },
  components: { Multiselect },
  data() {
    return {
      formData: {
        title: '',
        meeting_id: '',
        type: '',
        description: '',
        participants: [],
        options: [],
        start_time: '',
        end_time: '',
        attachment: null,
        imagePreview: null
      },
      formErrors: {},
      isSubmitting: false,
      themeClass: 'bg-white text-gray-800',
      formClass: 'bg-white',
      labelClass: 'text-gray-700',
      inputClass:
        'w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300',
      meetings: [],
      participants: [],
      options: [],
      departments: [],
      selectedDepartmentId: ''
    };
  },
  async mounted() {
    await this.fetchAllData();
  }, 

  methods: {
    async fetchAllData() {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const [userRes, optionRes, meetingRes, deptRes] = await Promise.all([
          fetch(apiEndpoints.users, { headers }),
          fetch(apiEndpoints.pollOptions, { headers }),
          fetch(apiEndpoints.meetings, { headers }),
          fetch(apiEndpoints.departments, { headers })
        ]);
        const [userData, optionData, meetingData, departmentData] = await Promise.all([
          userRes.json(),
          optionRes.json(),
          meetingRes.json(),
          deptRes.json()
        ]);
        this.participants = userData?.users || [];
        this.options = optionData?.data || [];
        this.meetings = meetingData?.data || [];

        this.departments = [
          { id: 'all', name: 'All Departments' },
          ...(departmentData?.data || [])
        ];
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    filterParticipantsByDepartment() {
      if (!this.selectedDepartmentId) return;
      if (this.selectedDepartmentId === 'all') {
        this.formData.participants = [...this.participants];
      } else {
        const selected = this.participants.filter(
          p => p.department_id === parseInt(this.selectedDepartmentId)
        );
        this.formData.participants = selected;
      }
    },
    formatDateTime(datetimeStr) {
      const date = new Date(datetimeStr);
      const pad = n => n < 10 ? '0' + n : n;
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    },
    async submitForm() {
      this.isSubmitting = true;
      this.formErrors = {};
      try {
        const token = localStorage.getItem("token");
        const form = new FormData();
        form.append('title', this.formData.title);
        form.append('type', this.formData.type);
        form.append('meeting_id', this.formData.meeting_id || '');
        form.append('description', this.formData.description);
        form.append('start_time', this.formatDateTime(this.formData.start_time));
        form.append('end_time', this.formatDateTime(this.formData.end_time));
        console.log("Form Data:", this.formData);
        this.formData.participants.forEach((participant, index) => {
          form.append(`participants[${index}]`, participant.id);
        });
        this.formData.options.forEach((option, index) => {
          form.append(`options[${index}]`, option.id);
        });
        if (this.formData.attachment) {
          form.append('attachment', this.formData.attachment);
        }
        for (let pair of form.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }
        const response = await fetch(apiEndpoints.pollings, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: form
        });
        if (response.ok) {
          this.$router.push('/pollings');
                  this.toast.success("Poll Created Succesfully");

        } 
        else {
          const responseData = await response.json();
          this.toast.error("Submission failed:", responseData);
          this.formErrors = responseData.errors || {};
        }
      } 
      catch (error) {
        this.toast.error("Submission Error:", error);
        this.formErrors.general = 'An error occurred while submitting the form.';
      } 
      finally {
        this.isSubmitting = false;
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.formData.attachment = file;
        this.formData.imagePreview = URL.createObjectURL(file);
      }
    },
    removeAttachment() {
      this.formData.attachment = null;
      this.formData.imagePreview = null;
    }
  }
};
</script>
<style scoped>
@import 'vue-multiselect/dist/vue-multiselect.min.css';

.multiselect-custom :v-deep .multiselect__tags {
  @apply border-2 rounded-lg p-2 w-full focus:ring-4 focus:ring-blue-500;
}
</style>
