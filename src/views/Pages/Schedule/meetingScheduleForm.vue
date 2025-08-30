<template>
  <div :class="theme8" class="min-h-screen py-10 px-4 sm:px-6 lg:px-12 transition-all duration-300 ease-in-out">
    <div :class="theme7" class="mx-auto p-6 sm:p-10 rounded-3xl shadow-xl space-y-10">

      <!-- Heading -->
      <h2 :class="themeText" class="text-4xl font-bold text-center mb-6">
        Create New Meeting Schedule
      </h2>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-12">

        <!-- === Meeting Information Section === -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Left Column -->
          <div :class="theme8" class="p-6 space-y-6 rounded-2xl shadow">
            <h3 class="text-xl font-semibold">Meeting Details</h3>

            <div>
              <label for="title" class="block text-sm font-medium">Title <span class="text-red-500">*</span></label>
              <input v-model="formData.title" id="title" required type="text" :class="[inputClass, themeInputText]"
                placeholder="Enter the meeting title" />
              <span v-if="formErrors.title" class="text-red-600 text-sm">{{ formErrors.title }}</span>
            </div>
            <div>
              <label class="block text-sm font-medium">Client <span class="text-red-500">*</span></label>
              <multiselect v-model="formData.client_id" :options="clients" required label="name" track-by="id"
                placeholder="Select Client" :searchable="true" :close-on-select="true" />
            </div>

            <div>
              <label class="block text-sm font-medium">Project <span class="text-red-500">*</span></label>
              <multiselect v-model="formData.project_id" :options="projects" label="name" required track-by="id"
                placeholder="Select Project" :searchable="true" :close-on-select="true"
                :disabled="!formData.client_id" />

            </div>

            <div>
              <label class="block text-sm font-medium">Meeting Host <span class="text-red-500">*</span></label>
              <multiselect v-model="formData.host" :options="hosts" label="name" track-by="id" required
                placeholder="Select Host" :searchable="true" :close-on-select="true" />
            </div>


            <div>
              <label class="block text-sm font-medium">Location <span class="text-red-500">*</span></label>
              <multiselect v-model="formData.location_id" :options="locations" required label="name" track-by="id"
                placeholder="Select Room" :searchable="true" :close-on-select="true" />
            </div>
          </div>

          <!-- Right Column -->
          <div :class="theme8" class="p-6 space-y-6 rounded-2xl shadow">
            <h3 class="text-xl font-semibold">Schedule Details</h3>

            <div>
              <label class="block text-sm font-medium">Meeting Type <span class="text-red-500">*</span></label>
              <select v-model="formData.meeting_type" :class="[inputClass, themeInputText]">
                <option disabled value="">Select Type</option>
                <option value="1">Internal</option>
                <option value="2">External</option>
                <option value="3">Other</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium">Meeting Date <span class="text-red-500">*</span></label>
              <input type="date" v-auto-date required v-model="formData.date" :min="today"
                :class="[inputClass, themeInputText]" />
              <span v-if="formErrors.date" required class="text-red-600 text-sm">{{ formErrors.date }}</span>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium">Start Time <span class="text-red-500">*</span></label>
                <input type="time" required v-model="formData.start_time" :class="[inputClass, themeInputText]" />
              </div>
              <div>
                <label class="block text-sm font-medium">End Time <span class="text-red-500">*</span></label>
                <input type="time" required v-model="formData.end_time" :class="[inputClass, themeInputText]" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium">Department</label>
              <select v-model="selectedDepartmentId" @change="filterParticipantsByDepartment"
                :class="[inputClass, themeInputText]">
                <option disabled value="">Select department</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id.toString()">{{ dept.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium">Select Internal Participants <span
                  class="text-red-500">*</span></label>
              <multiselect v-model="formData.participants" :options="participants" :multiple="true"
                :close-on-select="false" label="name" track-by="id" placeholder="Select participants" />
            </div>

            <!-- External Participants -->
            <div v-if="formData.meeting_type === '3'" class="space-y-4">
              <div v-for="(outParticipant, index) in formData.outParticipants" :key="index"
                class="flex items-end gap-4 p-4 rounded-lg border border-blue-400">
                <input type="text" v-model="outParticipant.name" placeholder="Participant name"
                  :class="[inputClass, themeInputText]" />
                <button v-if="formData.outParticipants.length > 1" type="button" @click="removeParticipants(index)"
                  class="text-red-600 hover:text-red-800">
                  <i class="fas fa-minus-circle text-xl"></i>
                </button>
              </div>
              <button type="button" @click="addParticipants"
                class="flex items-center gap-2 text-green-600 hover:text-green-800">
                <i class="fas fa-plus-circle text-lg"></i> Add Participant
              </button>
            </div>
          </div>
        </section>

        <!-- === Description Section === -->
        <section :class="theme8" class="p-6 rounded-2xl shadow">
          <label class="block text-sm font-medium mb-2">Description</label>
          <TextEditor v-model="formData.description"  :class="themeInputText" id="description" style="min-height: 300px" />
        </section>

        <!-- === Attachments Section === -->
        <section :class="theme8" class="p-6 rounded-2xl shadow space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-semibold">Attachments</h3>
            <button type="button" @click="addAttachment" class="text-green-600 hover:text-green-800 text-2xl">
              <i class="fa-solid fa-square-plus"></i>
            </button>
          </div>

          <div v-for="(attachment, index) in formData.attachments" :key="index"
            class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-blue-400">
            <input type="text" v-model="attachment.title" placeholder="Attachment Title"
              :class="[inputClass, themeInputText]" />
            <input type="file" @change="handleFileUpload($event, index)" :class="[inputClass, themeInputText]" />
            <div class="col-span-full flex justify-end">
              <button v-if="formData.attachments.length > 1" type="button" @click="removeAttachment(index)"
                class="text-red-500 hover:text-red-700 text-xl">
                <i class="fa-solid fa-circle-minus"></i>
              </button>
            </div>
          </div>
        </section>

        <!-- === Submit Buttons === -->
        <div class="flex justify-center items-center gap-6 mt-10">
          <!-- Close Button -->
          <router-link to="/meeting/schedule"
            class="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gray-500 text-gray-800 font-medium shadow hover:bg-gray-400 transition duration-200">
            Close
          </router-link>

          <!-- Submit Button -->
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
            <span>{{ isSubmitting ? 'Submitting...' : 'Submit' }}</span>
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import { useToast } from "vue-toastification";
import apiEndpoints from "@/config/apiConfig";
import TextEditor from "@/components/Pages/Schedule/TextEditor.vue";
import useTheme from "@/components/js/ThemeSetting";
export default {
  components: {
    Multiselect,
    TextEditor,
  },

  setup() {
    const {
      theme1,
      theme2,
      theme3,
      theme4,
      theme5,
      theme6,
      theme7,
      theme8, themeInputText,
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
      theme6, themeInputText,
      theme7,
      theme8,
      theme9,
      themeText,
      toast,
    };
  },
  data() {
    return {
      formErrors: {},
      today: new Date().toISOString().split("T")[0],
      formData: {
        title: "",
        outParticipants: [{ name: "" }],

        client_id: "",
        host: "",
        project_id: "",
        location_id: "",
        meeting_type: "",
        description: "",
        participants: [],
        date: "",
        start_time: "",
        end_time: "",
        attachments: [{ title: "", file: null }],
      },
      formErrors: {},
      isSubmitting: false,
      labelClass: "text-gray-700",
      inputClass:
        "w-full p-3 border-2 rounded-lg focus:ring-4 focus:ring-blue-500 focus:outline-none transition-all duration-300 ease-in-out",
      clients: [],
      participants: [],
      locations: [], projects: [],
      allProjects: [],
      hosts: [],
      roomConflict: false,
      departments: [],
      selectedDepartmentId: "",
    };
  },
  async mounted() {
    await this.fetchAllData();
  },
  watch: {
    "formData.client_id"(newClient) {
      this.filterProjectsByClient(newClient);

      // Reset project if current selected project not in filtered projects
      if (
        this.formData.project_id &&
        !this.projects.find(
          p =>
            String(p.id) ===
            String(this.formData.project_id.id || this.formData.project_id)
        )
      ) {
        this.formData.project_id = "";
      }
    },
    // your existing watchers...
    "formData.date": "checkRoomAvailability",
    "formData.start_time": "checkRoomAvailability",
    "formData.end_time": "checkRoomAvailability",
    "formData.location_id": "checkRoomAvailability",
  },

  methods: {
    validateForm() {
      this.formErrors = {};

      const selectedDate = new Date(this.formData.date);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Strip time part

      if (!this.formData.date) {
        this.formErrors.date = "Meeting Date is required.";
      } else if (selectedDate < currentDate) {
        this.formErrors.date = "Meeting Date cannot be earlier than today.";
      }

      return Object.keys(this.formErrors).length === 0;
    },
    async fetchAllData() {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) throw new Error("Missing token");
        const headers = { Authorization: `Bearer ${token}` };

        const [userRes, clientRes, projectRes, locationRes, deptRes] =
          await Promise.all([
            fetch(apiEndpoints.chatUsers, { headers }),
            fetch(apiEndpoints.clients, { headers }),
            fetch(apiEndpoints.projects, { headers }),
            fetch(apiEndpoints.meetingLocations, { headers }),
            fetch(apiEndpoints.departments, { headers }),
          ]);

        const [
          userData,
          clientsData,
          projectsData,
          locationsData,
          departmentData,
        ] = await Promise.all([
          userRes.json(),
          clientRes.json(),
          projectRes.json(),
          locationRes.json(),
          deptRes.json(),
        ]);

        this.clients = (clientsData?.data || []).filter(c => c.status === 1);
        this.allProjects = (projectsData?.data || []).filter(p => p.status === 1);
        this.projects = this.allProjects; // initially show all projects

        this.locations = (locationsData?.data || []).filter(l => l.status === 1);
        this.hosts = this.participants = userData?.users || [];
        this.departments = [
          { id: "all", name: "All Departments" },
          ...(departmentData?.data || []),
        ];
      } catch (error) {
        console.error("Data fetch error:", error);
      }
    }
    , filterProjectsByClient(clientId) {
      if (!clientId) {
        this.projects = this.allProjects;
      } else {
        this.projects = this.allProjects.filter(
          p => String(p.client_id) === String(clientId.id || clientId)
        );
      }
    },

    async checkRoomAvailability() {
      this.formErrors.date = "";
      this.roomConflict = false;
      const { date, start_time, end_time, location_id } = this.formData;
      if (!date || !start_time || !end_time || !location_id) return;
      try {
        const formattedDate = date;
        const formattedStart = start_time;
        const formattedEnd = end_time;
        // const token = sessionStorage.getItem("token");
        const token = sessionStorage.getItem("token");

        const response = await fetch(
          apiEndpoints.FormateMeetings(formattedDate),
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Authorization header
              "Content-Type": "application/json", // You can specify content type if needed
            },
          }
        );
        const data = await response.json();
        const meetings = data?.data || [];
        const hasConflict = meetings.some((meeting) => {
          return (
            meeting.location_id == location_id &&
            meeting.date === formattedDate &&
            ((formattedStart >= meeting.start_time &&
              formattedStart < meeting.end_time) ||
              (formattedEnd > meeting.start_time &&
                formattedEnd <= meeting.end_time) ||
              (formattedStart <= meeting.start_time &&
                formattedEnd >= meeting.end_time))
          );
        });
        if (hasConflict) {
          this.formErrors.date =
            "Room is already booked during this time. Please choose another time or room.";
          this.roomConflict = true;
        } else {
          this.formErrors.date = "";
          this.roomConflict = false;
        }
      } catch (error) {
        console.error("Room availability check failed:", error);
        this.formErrors.date = "Error checking room availability.";
        this.roomConflict = true;
      }
    },
    addAttachment() {
      this.formData.attachments.push({ title: "", file: null });
    },
    removeAttachment(index) {
      this.formData.attachments.splice(index, 1);
    },
    addParticipants() {
      this.formData.outParticipants.push({ name: "" });
    },
    removeParticipants(index) {
      this.formData.outParticipants.splice(index, 1);
    },
    handleFileUpload(event, index) {
      const file = event.target.files[0];
      this.formData.attachments[index].file = file;
    },
    filterParticipantsByDepartment() {
      if (!this.selectedDepartmentId) return;
      if (this.selectedDepartmentId === "all") {
        this.formData.participants = [...this.participants];
      } else {
        const selected = this.participants.filter(
          (p) => p.department_id === parseInt(this.selectedDepartmentId)
        );
        this.formData.participants = selected;
      }
    },
    async submitForm() {
      if (this.roomConflict) {
        this.toast.error("Room is already booked during this time.");
        return;
      }

      this.isSubmitting = true;

      try {
        const formData = new FormData();
        formData.append("title", this.formData.title);
        formData.append("client_id", this.formData.client_id?.id || "");
        formData.append("host", this.formData.host?.id || "");
        formData.append("project_id", this.formData.project_id?.id || "");
        formData.append("location_id", this.formData.location_id?.id || "");

        formData.append("meeting_type", this.formData.meeting_type);
        formData.append("company_id", "1");
        formData.append("status", "1");
        formData.append("meeting_status", "1");
        formData.append("description", this.formData.description);
        formData.append("date", this.formData.date);
        formData.append(
          "start_time",
          this.formData.start_time.length === 5
            ? this.formData.start_time + ":00"
            : this.formData.start_time
        );
        formData.append(
          "end_time",
          this.formData.end_time.length === 5
            ? this.formData.end_time + ":00"
            : this.formData.end_time
        );

        console.log(
          "Other Participants (outParticipants):",
          this.formData.outParticipants
        );
        this.formData.outParticipants
          .filter((p) => p.name.trim() !== "")
          .forEach((p, index) => {
            formData.append(
              `other_participant_name[${index}][other_participant_name]`,
              p.name
            );
          });
        this.formData.participants.forEach((p, index) => {
          formData.append(`participants[${index}]`, p.id);
        });
        this.formData.attachments.forEach((att, index) => {
          formData.append(`attachments[${index}]`, att.file);
          formData.append(`attachment_title[${index}]`, att.title);
        });
        console.log("🔍 Final FormData Contents:");
        for (let pair of formData.entries()) {
          console.log(`${pair[0]}:`, pair[1]);
        }

        const token = sessionStorage.getItem("token");

        const response = await fetch(apiEndpoints.meetings, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const responseData = await response.json();

        if (response.ok) {
          this.$router.push("/meeting/schedule");
          this.toast.success("Meeting created successfully");
        } else {
          // Handle the error response with array of error objects
          if (responseData.errors && Array.isArray(responseData.errors)) {
            const errorDetails = responseData.errors
              .map((error) => error.detail)
              .join("\n");
            this.toast.error(`${errorDetails}`);
          } else {
            this.toast.error("An unknown error occurred. Please try again.");
          }

          console.error("Server validation errors:", responseData);
        }
      } catch (error) {
        console.error("Submit error:", error);
        this.toast.error("An error occurred while submitting the form.");
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
<style scoped>
@import "vue-multiselect/dist/vue-multiselect.min.css";

.multiselect-custom :v-deep .multiselect__tags {
  @apply border-2 rounded-lg p-2 w-full focus:ring-4 focus:ring-blue-500;
}

/* Scroll for dropdown content */
::v-deep(.multiselect__content) {
  max-height: 200px;
  overflow-y: auto;
}

/* Scroll for selected items/tags */
::v-deep(.multiselect__tags) {
  max-height: 100px;
  overflow-y: auto;
}
</style>
