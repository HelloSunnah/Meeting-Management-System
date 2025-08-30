<template>
  <div :class="theme7" class="min-h-screen py-10 px-4 sm:px-6 lg:px-12 transition-all duration-300 ease-in-out">

      <h2 :class="themeText" class="text-4xl font-bold text-center mb-6">
        Edit Meeting Schedule
      </h2>

      <form @submit.prevent="submitForm" class="space-y-12">
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <!-- Left Column: Meeting Details -->
          <div :class="theme8" class="p-6 space-y-6 rounded-2xl shadow">
            <h3 class="text-xl font-semibold">Meeting Details</h3>

            <div>
              <label for="title" class="block text-sm font-medium">Title <span class="text-red-500">*</span></label>
              <input v-model="form.title" required id="title" type="text" :class="[inputClass, themeInputText]"
                placeholder="Enter the meeting title" />
              <span v-if="errors.title" class="text-red-600 text-sm">{{ errors.title }}</span>
            </div>
            <div>
              <label class="block text-sm font-medium">Host</label>
              <input v-model="form.host_name" disabled :class="[inputClass, themeInputText]"
                placeholder="Enter the meeting title" />

            </div>
            <div>
              <label class="block text-sm font-medium">Client <span class="text-red-500">*</span></label>
              <Multiselect v-model="form.client_id" required :options="clients" label="name" track-by="id"
                placeholder="Select Client" :searchable="true" :close-on-select="true" />
              <span v-if="errors.client_name" class="text-red-600 text-sm">{{ errors.client_name }}</span>
            </div>
            <div>
              <label class="block text-sm font-medium">Project <span class="text-red-500">*</span></label>
              <Multiselect v-model="form.project_id" :options="filteredProjects" label="name" track-by="id"
                placeholder="Select Project" />
              <span v-if="errors.project_name" class="text-red-600 text-sm">{{ errors.project_name }}</span>
            </div>



            <div>
              <label class="block text-sm font-medium">Location <span class="text-red-500">*</span></label>
              <Multiselect v-model="form.location_id" required :options="locations" label="name" track-by="id"
                placeholder="Select Room" :searchable="true" :close-on-select="true" />
              <span v-if="errors.location_name" class="text-red-600 text-sm">{{ errors.location_name }}</span>
            </div>
          </div>

          <div :class="theme8" class="p-6 space-y-6 rounded-2xl shadow">
            <h3 class="text-xl font-semibold">Schedule Details</h3>

            <div>
              <label class="block text-sm font-medium">Meeting Date <span class="text-red-500">*</span></label>
              <input type="date" v-auto-date v-model="form.date" required :min="today" :class="[inputClass, themeInputText]" />
              <p v-if="form.start_time && form.end_time && new Date(`1970-01-01T${form.start_time}:00`) >= new Date(`1970-01-01T${form.end_time}:00`)"
                class="text-red-500 text-sm mt-1">
                ⚠️ Start time must be earlier than end time.
              </p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium">Start Time <span class="text-red-500">*</span></label>
                <input type="time" required v-model="form.start_time" :class="[inputClass, themeInputText]" />
                <span v-if="errors.start_time" class="text-red-600 text-sm">{{ errors.start_time }}</span>
              </div>
              <div>
                <label class="block text-sm font-medium">End Time <span class="text-red-500">*</span></label>
                <input type="time" required v-model="form.end_time" :class="[inputClass, themeInputText]" />
                <span v-if="errors.end_time" class="text-red-600 text-sm">{{ errors.end_time }}</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium">Participants <span class="text-red-500">*</span></label>
              <Multiselect v-model="form.participants" required :options="participants" :multiple="true"
                :close-on-select="false" label="name" track-by="id" placeholder="Select participants" />
              <span v-if="errors.participants" class="text-red-600 text-sm">{{ errors.participants }}</span>
            </div>
          </div>
        </section>
        <div>
          <label for="description" class="block text-sm font-medium">Description</label>
          <TextEditor v-model="form.description" id="description" :class="[inputClass, themeInputText]"
            style="min-height: 300px" />
        </div>
        <!-- Attachments -->
        <section :class="theme8" class="p-6 rounded-2xl shadow space-y-6">
          <h3 class="text-xl font-semibold">Attachments</h3>

          <div v-for="(attachment, index) in newAttachments" :key="'new-' + index"
            class="flex items-center gap-4 mb-4 flex-wrap md:flex-nowrap">
            <!-- Attachment Title -->
            <input type="text" v-model="attachment.title" :class="[inputClass, themeInputText, 'flex-1']"
              placeholder="Attachment Title" />

            <!-- File Upload -->
            <input type="file" @change="handleNewFileUpload($event, index)"
              :class="[inputClass, themeInputText, 'flex-1']" />

            <!-- Remove Button -->
            <button v-if="newAttachments.length >= 1" type="button" @click="removeNewAttachment(index)"
              class="text-red-500 hover:text-red-700 text-xl">
              <i class="fa-solid fa-circle-minus"></i>
            </button>
          </div>

          <button type="button" @click="addAttachmentField" class="text-green-600 hover:text-green-800 text-2xl">
            <i class="fa-solid fa-square-plus"></i> Add Attachment
          </button>

          <div class="mt-6 space-y-4">
            <h3 class="text-lg font-semibold">Existing Attachments</h3>


            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div v-for="(attachment, index) in form.attachments" :key="attachment.id"
                class="border p-4 rounded-lg bg-white shadow">
                <div class="h-32 flex items-center justify-center bg-gray-100 rounded">
                  <template v-if="isImage(attachment.attachment_path)">
                    <a :href="generateApiUrl(attachment.attachment_path)" target="_blank">
                      <img :src="generateApiUrl(attachment.attachment_path)" class="object-contain max-h-32" />
                    </a>
                  </template>
                  <template v-else-if="isPDF(attachment.attachment_path)">
                    <a :href="generateApiUrl(attachment.attachment_path)" target="_blank">
                      <i class="fa fa-file-pdf text-4xl text-red-600"></i>
                    </a>
                  </template>
                  <template v-else>
                    <i class="fa fa-file text-4xl text-gray-500"></i>
                  </template>
                </div>


                <input type="text" v-model="attachment.attachment_title" class="w-full border rounded-md px-2 py-1 mt-2"
                  placeholder="Attachment Title" />
                <button @click="removeExistingAttachment(index)" class="text-red-600 hover:text-red-800 text-sm mt-3">
                  <i class="fa-solid fa-trash mr-1"></i> Remove
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Action Buttons -->
        <div class="flex justify-center items-center gap-6 mt-10">
          <router-link to="/meeting/schedule"
            class="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gray-500 text-gray-800 font-medium shadow hover:bg-gray-400 transition duration-200">
            Close
          </router-link>

          <button type="submit" :disabled="isSubmitting || roomConflict" :class="[
            'inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold shadow transition duration-300',
            isSubmitting || roomConflict
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          ]" :title="roomConflict ? 'Room is not available at selected time' : 'Click to submit'">
            <svg v-if="isSubmitting" class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span>{{ isSubmitting ? 'Submitting...' : 'Save' }}</span>
          </button>
        </div>
      </form>
  </div>
</template>
<script>
import apiEndpoints from "@/config/apiConfig";
import axios from "axios";
import Multiselect from "vue-multiselect";
import useTheme from '@/components/js/ThemeSetting';
import { useToast } from "vue-toastification";
import TextEditor from "@/components/Pages/Schedule/TextEditor.vue";

export default {
  setup() {
    const {
      theme6,
      theme8, theme61,
      theme9, theme81,
      themeText,
      themeInputText, theme7
    } = useTheme();

    const toast = useToast();

    return {
      theme61,
      theme6,
      theme8,
      theme9, theme81,
      themeText,
      toast,
      themeInputText
      , theme7
    };
  },
  components: { Multiselect, TextEditor },
  props: {
    meetingId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      form: {
        title: "",
        description: "",
        project_id: null,
        client_id: null,
        location_id: null,
        date: "",
        start_time: "",
        end_time: "",
        participants: [],
        other_participants: [],
        host_id: null,
        host_name: "",
        timezone: "",
        meeting_type: 1,
        attachments: [],
      },
      newAttachments: [],
      removedAttachments: [],
      participants: [],
      clients: [],
      projects: [],
      locations: [],
      errors: {},
      isSubmitting: false,
      roomConflict: false,
      today: new Date().toISOString().split("T")[0],
      toast: null,
      inputClass: "w-full px-4 py-3 border bg-gray-50 text-gray-800 border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500",
      themeInputText: "",
    };
  },

  async mounted() {
    await this.fetchData();
    await this.loadMeeting();
  },
  computed: {
  filteredProjects() {
    if (!this.form.client_id) {
      return this.form.project_id ? [this.form.project_id] : [];
    }

    const filtered = this.projects.filter(
      project => project.client_id === (this.form.client_id.id || this.form.client_id)
    );

    const selectedProjectId = this.form.project_id?.id || this.form.project_id;
    if (selectedProjectId && !filtered.some(p => p.id === selectedProjectId)) {
      const selectedProject = this.projects.find(p => p.id === selectedProjectId);
      if (selectedProject) filtered.push(selectedProject);
    }

    return filtered;
  }
},
watch: {
  'form.client_id'(newClient) {
    const projectClientId = this.form.project_id?.client_id || null;
    const newClientId = newClient?.id || newClient;

    // Only reset project if its client_id does not match the selected client
    if (this.form.project_id && projectClientId !== newClientId) {
      this.form.project_id = null;
    }
  }
}
,
  methods: {
    async fetchData() {
      try {
        const token = sessionStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const start = performance.now();

        const [clientsRes, projectsRes, locationsRes, usersRes] = await Promise.all([
          axios.get(apiEndpoints.clients, { headers }),
          axios.get(apiEndpoints.projects, { headers }),
          axios.get(apiEndpoints.meetingLocations, { headers }),
          axios.get(apiEndpoints.chatUsers, { headers }),
        ]);

        // console.log("API fetch time:", performance.now() - start, "ms");

        this.clients = clientsRes.data?.data?.filter(c => c.status === 1) || [];
        this.projects = projectsRes.data?.data?.filter(p => p.status === 1) || [];
        this.locations = locationsRes.data?.data?.filter(l => l.status === 1) || [];
        this.participants = Array.isArray(usersRes.data?.users) ? usersRes.data.users : (Array.isArray(usersRes.data) ? usersRes.data : []);

      } catch (error) {
        this.toast.error("Failed to load required data.");
        console.error("fetchData error", error);
      }
    }
    ,

    async loadMeeting() {
      this.isSubmitting = true;
      try {
        const token = sessionStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const { data } = await axios.get(`${apiEndpoints.meetings}/${this.meetingId}`, { headers });
        const meeting = data.data || data;

        // Create a map for fast participant lookup
        const participantMap = new Map(this.participants.map(u => [u.id, u]));

        this.form.title = meeting.title || "";
        this.form.description = meeting.description || "";
        this.form.project_id = this.projects.find(p => p.id === meeting.project_id) || null;
        this.form.client_id = this.clients.find(c => c.id === meeting.client_id) || null;
        this.form.location_id = this.locations.find(l => l.id === meeting.location_id) || null;
        this.form.date = meeting.date || "";
        this.form.start_time = meeting.start_time || "";
        this.form.end_time = meeting.end_time || "";
        this.form.host_id = meeting.host_id || null;
        this.form.host_name = meeting.host_name || "";
        this.form.meeting_type = meeting.meeting_type || 1;
        this.form.timezone = meeting.timezone || "";

        this.form.participants = (meeting.participants || []).map(p =>
          participantMap.get(p.user_id) || { id: p.user_id, name: p.user_name }
        );
        this.form.other_participants = meeting.other_participants || [];
        this.form.attachments = meeting.attachments || [];

      } catch (error) {
        this.toast.error("Failed to load meeting data.");
        console.error("loadMeeting error", error);
      } finally {
        this.isSubmitting = false;
      }
    }
    ,

    addAttachmentField() {
      this.newAttachments.push({ file: null, title: "" });
    },

    removeNewAttachment(index) {
      this.newAttachments.splice(index, 1);
    },

    removeExistingAttachment(index) {
      const removed = this.form.attachments.splice(index, 1)[0];
      if (removed?.id) {
        this.removedAttachments.push(removed.id);
      }
    },

    handleNewFileUpload(event, index) {
      const file = event.target.files[0];
      if (file && this.validateFile(file)) {
        this.newAttachments[index].file = file;
      }
    },

    validateFile(file) {
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      const maxSize = 5 * 1024 * 1024;
      if (!allowedTypes.includes(file.type)) {
        this.toast.error("Only JPG, PNG, or PDF files are allowed.");
        return false;
      }
      if (file.size > maxSize) {
        this.toast.error("File size must be under 5MB.");
        return false;
      }
      return true;
    },

    isImage(path) {
      return /\.(jpe?g|png|gif|bmp|webp)$/i.test(path);
    },

    isPDF(path) {
      return /\.pdf$/i.test(path);
    },

    generateApiUrl(path) {
      return `${apiEndpoints.storageUrl2}/${path}`;
    },

    validate() {
      this.errors = {};

      if (!this.form.title) this.errors.title = "Title is required.";
      if (!this.form.client_id) this.errors.client_name = "Client is required.";
      if (!this.form.project_id) this.errors.project_name = "Project is required.";
      if (!this.form.location_id) this.errors.location_name = "Location is required.";
      if (!this.form.date) this.errors.date = "Date is required.";
      if (!this.form.start_time) this.errors.start_time = "Start time is required.";
      if (!this.form.end_time) this.errors.end_time = "End time is required.";
      if (!this.form.participants.length) this.errors.participants = "Select at least one participant.";

      if (this.form.start_time && this.form.end_time) {
        const start = new Date(`1970-01-01T${this.form.start_time}:00`);
        const end = new Date(`1970-01-01T${this.form.end_time}:00`);
        if (start >= end) {
          this.errors.start_time = "Start time must be earlier than end time.";
          this.errors.end_time = "End time must be later than start time.";
        }
      }

      if (Object.keys(this.errors).length > 0) {
        this.showErrorsToast();
        return false;
      }
      return true;
    },

    showErrorsToast() {
      for (const key in this.errors) {
        if (this.errors.hasOwnProperty(key)) {
          this.toast.error(this.errors[key]);
        }
      }
    },

    async submitForm() {
      // 1. Run form-level validations
      if (!this.validate()) return;

      // 2. Validate that start_time < end_time
      const normalizeTime = (time) => time.length === 5 ? time + ":00" : time;
      const start = new Date(`1970-01-01T${normalizeTime(this.form.start_time)}`);
      const end = new Date(`1970-01-01T${normalizeTime(this.form.end_time)}`);

      if (start >= end) {
        this.toast.error("⚠️ Start time must be earlier than end time.");
        return;
      }

      this.isSubmitting = true;

      try {
        const token = sessionStorage.getItem("token");
        const formData = new FormData();

        formData.append("_method", "PUT");
        formData.append("title", this.form.title);
        formData.append("description", this.form.description || "");
        formData.append("date", this.form.date);
        formData.append("start_time", normalizeTime(this.form.start_time));
        formData.append("end_time", normalizeTime(this.form.end_time));
        formData.append("project_id", this.form.project_id?.id || this.form.project_id);
        formData.append("client_id", this.form.client_id?.id || this.form.client_id);
        formData.append("location_id", this.form.location_id?.id || this.form.location_id);
        formData.append("meeting_type", this.form.meeting_type || 1);
        formData.append("timezone", this.form.timezone || "");
        formData.append("host", this.form.host_id || "");

        // Participants (internal)
        this.form.participants.forEach(p => {
          formData.append("participants[]", p.id);
        });

        // Other Participants (external)
        this.form.other_participants.forEach((op, index) => {
          formData.append(`other_participant_name[${index}][id]`, op.id || '');
          formData.append(`other_participant_name[${index}][name]`, op.name || op.other_participant_name || '');
        });

        // Existing Attachments
        this.form.attachments.forEach((att, index) => {
          formData.append("existing_attachments[]", att.id);
          formData.append("existing_attachment_titles[]", att.attachment_title || "");
        });

        // Removed Attachments
        this.removedAttachments.forEach(id => {
          formData.append("removed_attachments[]", id);
        });

        // New Attachments
        this.newAttachments.forEach((att, index) => {
          if (att.file) {
            formData.append(`attachments[${index}]`, att.file);
            formData.append(`attachment_title[${index}]`, att.title);
          }
        });

        // 3. Submit the request
        await axios.post(apiEndpoints.updateMeeting(this.meetingId), formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        this.$emit("submitted");
        this.toast.success("Meeting updated successfully.");
        this.$router.push("/meeting/schedule");

      } catch (error) {
        if (error.response?.data) {
          let errors = error.response.data;

          // If error data is a stringified JSON, parse it
          if (typeof errors === "string") {
            try {
              errors = JSON.parse(errors);
            } catch {
              this.toast.error(errors);
              this.errors.general = errors;
              return;
            }
          }

          this.errors = errors;

          // Handle backend error format: array of errors with "detail" field
          if (Array.isArray(errors.errors)) {
            errors.errors.forEach((err) => {
              if (err.detail) {
                this.toast.error(err.detail);
              } else {
                this.toast.error(JSON.stringify(err));
              }
            });
          } else {
            // Fallback: show all error messages
            Object.values(errors).forEach((messages) => {
              if (Array.isArray(messages)) {
                messages.forEach((msg) => this.toast.error(msg));
              } else {
                this.toast.error(messages);
              }
            });
          }
        } else {
          this.toast.error("An unexpected error occurred. Please try again.");
          console.error(error);
        }
      }




      finally {
        this.isSubmitting = false;
      }
    }

  },
};

</script>
