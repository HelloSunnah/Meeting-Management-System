<template>
  <div :class="theme81" class="min-h-screen p-6 transition-all bg-gray-50">
    <div class="mx-auto rounded-lg bg-white p-8 shadow-md">
      <h2 :class="themeText" class="text-3xl font-extrabold text-center mb-8">Edit Polling Event</h2>

      <form @submit.prevent="submitForm" class="space-y-8">
        <!-- Poll Details -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label :class="themeText" for="title" class="block font-semibold mb-2">Poll Title <span
                class="text-red-500">*</span></label>
            <input id="title" type="text" v-model.trim="formData.title" :class="[
              themeInputText,
              'w-full border rounded-md px-4 py-3 transition focus:ring-2 focus:ring-blue-400',
              formErrors.title ? 'border-red-500' : 'border-gray-300'
            ]" placeholder="Enter poll title" />
            <p v-if="formErrors.title" class="text-red-600 mt-1 text-sm">{{ formErrors.title }}</p>
          </div>

          <div>
            <label :class="themeText" for="type" class="block font-semibold mb-2">Poll Type <span
                class="text-red-500">*</span></label>
            <select id="type" v-model="formData.type" :class="[
              themeInputText,
              'w-full border rounded-md px-4 py-3 transition focus:ring-2 focus:ring-blue-400',
              formErrors.type ? 'border-red-500' : 'border-gray-300'
            ]">
              <option disabled value="">Select type</option>
              <option value="1">General</option>
              <option value="2">Meeting</option>
            </select>
            <p v-if="formErrors.type" class="text-red-600 mt-1 text-sm">{{ formErrors.type }}</p>
          </div>

          <div>
            <label :class="themeText" for="meeting_id" class="block font-semibold mb-2">Meeting Title</label>
            <select id="meeting_id" v-model="formData.meeting_id" :disabled="formData.type !== '2'" :class="[
              themeInputText,
              'w-full border rounded-md px-4 py-3 transition focus:ring-2 focus:ring-blue-400',
              formData.type !== '2' ? 'bg-gray-100 cursor-not-allowed' : '',
              formErrors.meeting_id ? 'border-red-500' : 'border-gray-300'
            ]">
              <option disabled value="">Select meeting</option>
              <option v-for="meeting in meetings" :key="meeting.id" :value="meeting.id.toString()">
                {{ meeting.title }}
              </option>
            </select>
            <p v-if="formErrors.meeting_id" class="text-red-600 mt-1 text-sm">{{ formErrors.meeting_id }}</p>
          </div>

          <div>
            <label :class="themeText" for="options" class="block font-semibold mb-2">Poll Options</label>
            <multiselect v-if="options.length" v-model="formData.options" :options="options" :multiple="true"
              placeholder="Select options" label="name" track-by="id" :class="[themeInputText]" />
            <p v-else class="text-gray-400 italic text-sm mt-1">No poll options available.</p>
            <p v-if="formErrors.options" class="text-red-600 mt-1 text-sm">{{ formErrors.options }}</p>
          </div>
        </div>

        <!-- Schedule & Participants -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label :class="themeText" for="start_time" class="block font-semibold mb-2">Start Time <span
                class="text-red-500">*</span></label>
            <input id="start_time" type="datetime-local"  v-auto-date v-model="formData.start_time" :class="[
              themeInputText,
              'w-full border rounded-md px-4 py-3 transition focus:ring-2 focus:ring-blue-400',
              formErrors.start_time ? 'border-red-500' : 'border-gray-300'
            ]" />
            <p v-if="formErrors.start_time" class="text-red-600 mt-1 text-sm">{{ formErrors.start_time }}</p>
          </div>

          <div>
            <label :class="themeText" for="end_time" class="block font-semibold mb-2">End Time <span
                class="text-red-500">*</span></label>
            <input id="end_time" type="datetime-local" v-auto-date v-model="formData.end_time" :class="[
              themeInputText,
              'w-full border rounded-md px-4 py-3 transition focus:ring-2 focus:ring-blue-400',
              formErrors.end_time ? 'border-red-500' : 'border-gray-300'
            ]" />
            <p v-if="formErrors.end_time" class="text-red-600 mt-1 text-sm">{{ formErrors.end_time }}</p>
          </div>

          <div>
            <label :class="themeText" for="department_id" class="block font-semibold mb-2">Department</label>
            <select id="department_id" v-model="selectedDepartmentId" :class="[
              themeInputText,
              'w-full border rounded-md px-4 py-3 transition focus:ring-2 focus:ring-blue-400',
              formErrors.department_id ? 'border-red-500' : 'border-gray-300'
            ]">
              <option value="all">All Departments</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id.toString()">
                {{ dept.name }}
              </option>
            </select>
          </div>

          <div>
            <label :class="themeText" for="participants" class="block font-semibold mb-2">Participants</label>
            <multiselect v-if="filteredParticipants.length" v-model="formData.participants"
              :options="filteredParticipants" :multiple="true" placeholder="Select participants" label="name"
              track-by="id" :class="[themeInputText]" />
            <p v-else class="text-gray-400 italic text-sm mt-1">No participants found.</p>
            <p v-if="formErrors.participants" class="text-red-600 mt-1 text-sm">{{ formErrors.participants }}</p>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label :class="themeText" for="description" class="block font-semibold mb-2">Description</label>
          <TextEditor id="description" v-model="formData.description" style="min-height: 280px"
            :class="[themeInputText, 'border rounded-md px-4 py-2']" />
          <p v-if="formErrors.description" class="text-red-600 mt-1 text-sm">{{ formErrors.description }}</p>
        </div>

        <!-- Attachment -->
        <div>
          <label :class="themeText" class="block font-semibold mb-2">Attachment</label>
          <input type="file" @change="handleFileUpload" accept="image/*"
            :class="[themeInputText, 'border rounded-md px-4 py-2 cursor-pointer']" />
          <div v-if="formData.imagePreview" class="mt-4 max-w-xs relative border rounded-md p-3 bg-gray-50 shadow-sm">
            <img v-if="isImage(formData.imagePreview)" :src="generateApiUrl(formData.imagePreview)"
              class="w-full h-auto rounded-md" alt="Attachment preview" />
            <a v-else :href="formData.imagePreview" target="_blank" class="text-blue-600 underline">
              Download attachment
            </a>
            <button type="button" @click="removeAttachment"
              class="absolute top-2 right-2 text-red-600 hover:text-red-800 focus:outline-none"
              aria-label="Remove attachment">
              <i class="fa-solid fa-xmark fa-lg"></i>
            </button>
          </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-center">
          <button type="submit" :disabled="isSubmitting"
            class="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition">
            <span v-if="isSubmitting" class="flex items-center justify-center space-x-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Updating...</span>
            </span>
            <span v-else>Update</span>
          </button>
        </div>

        <p v-if="formErrors.general" class="text-red-600 text-center mt-4 font-semibold">{{ formErrors.general }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Multiselect from "vue-multiselect";
import apiEndpoints from "@/config/apiConfig";
import useTheme from "@/components/js/ThemeSetting";
import { useToast } from "vue-toastification";
import TextEditor from "@/components/Pages/Schedule/TextEditor.vue";

export default {
  props: {
    pollId: {
      type: [Number, String],
      required: true,
    },
  },
  components: { Multiselect, TextEditor },
  data() {
    return {
      formData: {
        title: "",
        type: "",
        meeting_id: "",
        start_time: "",
        end_time: "",
        description: "",
        participants: [],
        options: [],
        attachment: null,
        imagePreview: null,
      },
      options: [],
      formErrors: {},
      isSubmitting: false,
      meetings: [],
      departments: [],
      participants: [],
      selectedDepartmentId: "all",
    };
  },
  setup() {
    const {
      theme6,
      theme8,
      theme61,
      theme9,
      theme81,
      themeText,
      themeInputText,
    } = useTheme();
    const toast = useToast();
    return {
      theme61,
      theme6,
      theme8,
      theme9,
      theme81,
      themeText,
      toast,
      themeInputText,
    };
  },
  mounted() {
    this.loadData();
  },
  watch: {
    selectedDepartmentId() {
      // Participants are filtered via computed, so no need for separate filter method
    },
  },
  computed: {
    filteredParticipants() {
      if (this.selectedDepartmentId === "all") return this.participants;
      return this.participants.filter(
        (p) => p.department_id?.toString() === this.selectedDepartmentId.toString()
      );
    },
  },
  methods: {
    async loadData() {
      try {
        await Promise.all([this.fetchAllData(), this.fetchPollingData()]);
      } catch (error) {
        console.error("Error loading data:", error);
        this.formErrors.general = "Failed to load data. Please reload the page.";
      }
    },

    async fetchAllData() {
      const token = sessionStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [userRes, meetingRes, deptRes, optionsRes] = await Promise.all([
          axios.get(apiEndpoints.chatUsers, { headers }),
          axios.get(apiEndpoints.meetings, { headers }),
          axios.get(apiEndpoints.departments, { headers }),
          axios.get(apiEndpoints.pollOptions, { headers }),
        ]);

        this.participants = Array.isArray(userRes.data?.users) ? userRes.data.users : [];
        this.meetings = Array.isArray(meetingRes.data?.data) ? meetingRes.data.data : [];
        this.departments = [{ id: "all", name: "All Departments" }].concat(
          Array.isArray(deptRes.data?.data) ? deptRes.data.data : []
        );
        this.options = Array.isArray(optionsRes.data?.data) ? optionsRes.data.data : [];
      } catch (error) {
        console.error("Error fetching data:", error);
        this.formErrors.general = "Failed to fetch necessary data.";
      }
    },

    async fetchPollingData() {
      const token = sessionStorage.getItem("token");
      try {
        const res = await axios.get(apiEndpoints.polling(this.pollId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;
        if (!data) throw new Error("Polling data not found");

        this.formData.title = data.title || "";
        this.formData.type = data.type?.toString() || "";
        this.formData.meeting_id = data.meeting_id?.toString() || "";
        this.formData.start_time = this.formatDateTimeForInput(data.start_time);
        this.formData.end_time = this.formatDateTimeForInput(data.end_time);
        this.formData.description = data.description || "";
        // Participants and options expected to be arrays of objects with id + name
        this.formData.participants = Array.isArray(data.participants) ? data.participants : [];
        this.formData.options = Array.isArray(data.options) ? data.options : [];
        this.formData.imagePreview = data.attachment || null;
      } catch (error) {
        console.error("Error fetching polling data:", error);
        this.formErrors.general = "Failed to load polling data.";
      }
    },

    formatDateTimeForInput(datetimeStr) {
      if (!datetimeStr) return "";
      const date = new Date(datetimeStr);
      if (isNaN(date)) return "";
      const pad = (n) => n.toString().padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
        date.getHours()
      )}:${pad(date.getMinutes())}`;
    },

    formatDateTimeForBackend(datetimeStr) {
      if (!datetimeStr) return null;
      const [date, time] = datetimeStr.split("T");
      return date && time ? `${date} ${time}:00` : null;
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.formData.attachment = file;
      this.formData.imagePreview = URL.createObjectURL(file);
    },

    removeAttachment() {
      this.formData.attachment = null;
      this.formData.imagePreview = null;
    },

    isImage(url) {
      return /\.(jpg|jpeg|png|gif|bmp)$/i.test(url);
    },

    generateApiUrl(attachment) {
      if (!attachment) return "";
      // If already full URL, return directly
      if (attachment.startsWith("http")) return attachment;
      return `${apiEndpoints.storageUrl2}/${attachment}`;
    },

    async submitForm() {
      this.isSubmitting = true;
      this.formErrors = {};

      // Basic validation
      if (!this.formData.title) this.formErrors.title = "Poll title is required.";
      if (!this.formData.type) this.formErrors.type = "Poll type is required.";
      if (!this.formData.start_time) this.formErrors.start_time = "Start time is required.";
      if (!this.formData.end_time) this.formErrors.end_time = "End time is required.";
      if (this.formData.type === "2" && !this.formData.meeting_id)
        this.formErrors.meeting_id = "Meeting must be selected for meeting polls.";

      if (Object.keys(this.formErrors).length > 0) {
        this.isSubmitting = false;
        return;
      }

      try {
        const token = sessionStorage.getItem("token");
        const formDataPayload = new FormData();

        formDataPayload.append("title", this.formData.title);
        formDataPayload.append("type", this.formData.type);
        formDataPayload.append("description", this.formData.description || "");
        formDataPayload.append("start_time", this.formatDateTimeForBackend(this.formData.start_time));
        formDataPayload.append("end_time", this.formatDateTimeForBackend(this.formData.end_time));
        formDataPayload.append(
          "participants",
          JSON.stringify(this.formData.participants.map((p) => p.id))
        );
        formDataPayload.append(
          "options",
          JSON.stringify(this.formData.options.map((o) => o.id))
        );

        if (this.formData.type === "2" && this.formData.meeting_id) {
          formDataPayload.append("meeting_id", this.formData.meeting_id);
        }

        if (this.formData.attachment) {
          formDataPayload.append("attachment", this.formData.attachment);
        }

        const res = await axios.put(apiEndpoints.polling(this.pollId), formDataPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        this.toast.success("Polling updated successfully.");
        if (res.status === 200) {
          this.$router.push("/pollings");
        }
      } catch (error) {
        if (error.response?.data?.errors) {
          this.formErrors = error.response.data.errors;
        } else {
          this.formErrors.general = "Failed to update polling. Please try again.";
        }
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
/* You can optionally style the multiselect here if needed */
/* For example: */
.multiselect {
  font-size: 0.95rem;
}
</style>
