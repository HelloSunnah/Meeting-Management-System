<template>
  <!-- Schedule Form Layout Improvements -->
  <div :class="themeClass" class="min-h-screen py-10 px-4 sm:px-6 lg:px-12 transition-all duration-300 ease-in-out">
    <div :class="formClass" class=" mx-auto p-6 sm:p-10 rounded-3xl shadow-xl bg-white space-y-10">
      <h2 :class="themeClass === 'bg-gray-900 text-white' ? 'text-white' : 'text-gray-800'"
        class="text-4xl font-bold text-center mb-4 transition-colors duration-300 ease-in-out">
        Create New Schedule
      </h2>

      <form @submit.prevent="submitForm" class="space-y-12">

        <!-- General Info Section -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="space-y-6 bg-gray-50 p-6 rounded-2xl shadow">
            <h3 class="text-xl font-semibold text-gray-700">Meeting Details</h3>

            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
              <input v-model="formData.title" id="title" type="text" :class="inputClass"
                placeholder="Enter the meeting title" />
              <span v-if="formErrors.title" class="text-red-600 text-sm">{{ formErrors.title }}</span>
            </div>

            <!-- Project -->
            <div>
              <label for="project_id" class="block text-sm font-medium text-gray-700">Project</label>
              <select v-model="formData.project_id" id="project_id" :class="inputClass">
                <option disabled value="">Select a project</option>
                <option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option>
              </select>
            </div>

            <!-- Host -->
            <div>
              <label for="host" class="block text-sm font-medium text-gray-700">Meeting Host</label>
              <select v-model="formData.host" id="host" :class="inputClass">
                <option disabled value="">Select Host</option>
                <option v-for="h in hosts" :key="h.id" :value="h.id">{{ h.name }}</option>
              </select>
            </div>

            <!-- Client -->
            <div>
              <label for="client_id" class="block text-sm font-medium text-gray-700">Client</label>
              <select v-model="formData.client_id" id="client_id" :class="inputClass">
                <option disabled value="">Select Client</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }}</option>
              </select>
            </div>

            <!-- Location -->
            <div>
              <label for="location_id" class="block text-sm font-medium text-gray-700">Location</label>
              <select v-model="formData.location_id" id="location_id" :class="inputClass">
                <option disabled value="">Select Room</option>
                <option v-for="room in locations" :key="room.id" :value="room.id">{{ room.name }}</option>
              </select>
            </div>
          </div>

          <!-- Time & Type -->
          <div class="space-y-6 bg-gray-50 p-6 rounded-2xl shadow">
            <h3 class="text-xl font-semibold text-gray-700">Schedule Details</h3>

            <!-- Meeting Type -->
            <div>
              <label for="meeting_type" class="block text-sm font-medium text-gray-700">Meeting Type</label>
              <select v-model="formData.meeting_type" id="meeting_type" :class="inputClass">
                <option disabled value="">Select Type</option>
                <option value="1">Internal</option>
                <option value="2">External</option>
                <option value="3">Other</option>
              </select>
            </div>

            <!-- Date -->
            <div>
              <label for="date" class="block text-sm font-medium text-gray-700">Meeting Date</label>
              <input v-model="formData.date" id="date" type="date" :class="inputClass" />
              <span v-if="formErrors.date" class="text-red-600 text-sm">{{ formErrors.date }}</span>
            </div>

            <!-- Time -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="start_time" class="block text-sm font-medium text-gray-700">Start Time</label>
                <input v-model="formData.start_time" id="start_time" type="time" :class="inputClass" />
              </div>
              <div>
                <label for="end_time" class="block text-sm font-medium text-gray-700">End Time</label>
                <input v-model="formData.end_time" id="end_time" type="time" :class="inputClass" />
              </div>

            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Select Internal Participants</label>
              <multiselect v-model="formData.participants" :options="participants" :multiple="true"
                :close-on-select="false" label="name" track-by="id" placeholder="Choose participants" />
            </div>
            <!-- External Participants for 'Other' -->
            <div v-if="formData.meeting_type === '3'" class="space-y-4">
              <div v-for="(outParticipant, index) in formData.outParticipants" :key="index"
                class="flex items-end gap-4 bg-white p-4 rounded-lg border border-gray-200">
                <input type="text" v-model="outParticipant.name" placeholder="Participant name" :class="inputClass" />
                <button type="button" @click="removeParticipants(index)" v-if="formData.outParticipants.length > 1"
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


        <!-- Description -->
        <section class="bg-gray-50 p-6 rounded-2xl shadow">
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea v-model="formData.description" id="description" rows="4" placeholder="Add description"
            :class="inputClass"></textarea>
          <span v-if="formErrors.description" class="text-red-600 text-sm">{{ formErrors.description }}</span>
        </section>

        <!-- Attachments -->
        <section class="bg-gray-50 p-6 rounded-2xl shadow space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-semibold text-gray-700">Attachments</h3>
            <button type="button" @click="addAttachment" class="text-green-600 hover:text-green-800 text-2xl">
              <i class="fa-solid fa-square-plus"></i>
            </button>
          </div>

          <div v-for="(attachment, index) in formData.attachments" :key="index"
            class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-200">
            <input type="text" v-model="attachment.title" placeholder="Attachment Title" :class="inputClass" />
            <input type="file" @change="handleFileUpload($event, index)" :class="inputClass" />
            <div class="col-span-1 md:col-span-2 flex justify-end">
              <button v-if="formData.attachments.length > 1" type="button" @click="removeAttachment(index)"
                class="text-red-500 hover:text-red-700 text-xl">
                <i class="fa-solid fa-circle-minus"></i>
              </button>
            </div>
          </div>
        </section>

        <!-- Submit -->
        <div class="flex justify-center gap-4">
          <router-link to="/meeting/schedule" class="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 transition">
            Close
          </router-link>
          <button type="submit" :disabled="isSubmitting || roomConflict" :class="[
            'px-6 py-3 rounded-lg font-semibold transition duration-300',
            isSubmitting || roomConflict
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          ]" :title="roomConflict ? 'Room is not available at selected time' : ''">
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
import { useToast } from "vue-toastification";
import apiEndpoints from '@/config/apiConfig';

export default {
  components: {
    Multiselect
  },
  data() {
    return {
      formData: {
        title: '',
        outParticipants: [{ name: '' }],

        client_id: '',
        host: '',
        project_id: '',
        location_id: '',
        meeting_type: '',
        description: '',
        participants: [],
        date: '',
        start_time: '',
        end_time: '',
        attachments: [{ title: '', file: null }]
      },
      formErrors: {},
      isSubmitting: false,
      themeClass: 'bg-white text-gray-800',
      formClass: 'bg-white',
      labelClass: 'text-gray-700',
      inputClass: 'w-full p-3 border-2 rounded-lg focus:ring-4 focus:ring-blue-500 focus:outline-none transition-all duration-300 ease-in-out',
      clients: [],
      participants: [],
      locations: [],
      hosts: [],
      projects: [],
      roomConflict: false
    };
  },
  async mounted() {
    await this.fetchAllData();
  },
  watch: {
    'formData.date': 'checkRoomAvailability',
    'formData.start_time': 'checkRoomAvailability',
    'formData.end_time': 'checkRoomAvailability',
    'formData.location_id': 'checkRoomAvailability'
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    async fetchAllData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Missing token");
        const headers = { Authorization: `Bearer ${token}` };
        const [userRes, clientRes, projectRes, locationRes] = await Promise.all([
          fetch(apiEndpoints.allUsers, { headers }),
          fetch(apiEndpoints.clients, { headers }),
          fetch(apiEndpoints.projects, { headers }),
          fetch(apiEndpoints.meetingLocations, { headers }),
        ]);
        const [userData, clientsData, projectsData, locationsData] = await Promise.all([
          userRes.json(), clientRes.json(), projectRes.json(), locationRes.json()
        ]);

        this.clients = clientsData?.data || [];
        this.projects = projectsData?.data || [];
        this.locations = locationsData?.data || [];
        this.hosts = this.participants = userData?.users || [];
      } catch (error) {
        console.error("Data fetch error:", error);
      }
    },

    async checkRoomAvailability() {
      this.formErrors.date = '';
      this.roomConflict = false;
      const { date, start_time, end_time, location_id } = this.formData;
      if (!date || !start_time || !end_time || !location_id) return;
      try {
        const formattedDate = date;
        const formattedStart = start_time;
        const formattedEnd = end_time;
        const token = localStorage.getItem("token");
        const response = await fetch(apiEndpoints.FormateMeetings(formattedDate), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header
            'Content-Type': 'application/json', // You can specify content type if needed
          },
        });
        const data = await response.json();
        const meetings = data?.data || [];
        const hasConflict = meetings.some(meeting => {
          return (
            meeting.location_id == location_id &&
            meeting.date === formattedDate &&
            (
              (formattedStart >= meeting.start_time && formattedStart < meeting.end_time) ||
              (formattedEnd > meeting.start_time && formattedEnd <= meeting.end_time) ||
              (formattedStart <= meeting.start_time && formattedEnd >= meeting.end_time)
            )
          );
        });
        if (hasConflict) {
          this.formErrors.date = 'Room is already booked during this time. Please choose another time or room.';
          this.roomConflict = true;
        } else {
          this.formErrors.date = '';
          this.roomConflict = false;
        }
      }
      catch (error) {
        console.error("Room availability check failed:", error);
        this.formErrors.date = 'Error checking room availability.';
        this.roomConflict = true;
      }
    },
    addAttachment() {
      this.formData.attachments.push({ title: '', file: null });
    },
    removeAttachment(index) {
      this.formData.attachments.splice(index, 1);
    },
    addParticipants() {
      this.formData.outParticipants.push({ name: '', });
    },
    removeParticipants(index) {
      this.formData.outParticipants.splice(index, 1);
    },
    handleFileUpload(event, index) {
      const file = event.target.files[0];
      this.formData.attachments[index].file = file;
    },
    async submitForm() {
      if (this.roomConflict) {
        this.toast.error("Room is already booked during this time.");
        return;
      }

      this.isSubmitting = true;

      try {
        const formData = new FormData();
        formData.append('title', this.formData.title);
        formData.append('client_id', this.formData.client_id);
        formData.append('host', this.formData.host);
        formData.append('project_id', this.formData.project_id);
        formData.append('location_id', this.formData.location_id);
        formData.append('meeting_type', this.formData.meeting_type);
        formData.append('company_id', '1');
        formData.append('status', '1');
        formData.append('meeting_status', '1');
        formData.append('description', this.formData.description);
        formData.append('date', this.formData.date);
        formData.append('start_time', this.formData.start_time.length === 5 ? this.formData.start_time + ':00' : this.formData.start_time);
        formData.append('end_time', this.formData.end_time.length === 5 ? this.formData.end_time + ':00' : this.formData.end_time);

        console.log("Other Participants (outParticipants):", this.formData.outParticipants);
        this.formData.outParticipants
          .filter(p => p.name.trim() !== '')
          .forEach((p, index) => {
            formData.append(`other_participant_name[${index}][other_participant_name]`, p.name);

          });
        this.formData.participants.forEach((p, index) => {
          formData.append(`participants[${index}]`, p.id);
        });




        this.formData.attachments.forEach((att, index) => {
          formData.append(`attachments[${index}]`, att.file);
          formData.append(`attachment_title[${index}]`, att.title);
        });

        const token = localStorage.getItem("token");

        const response = await fetch(apiEndpoints.meetings, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        const responseData = await response.json();

        if (response.ok) {
          this.$router.push('/meeting/schedule');
          this.toast.success("Meeting created successfully");
        } else {
          // Handle the error response with array of error objects
          if (responseData.errors && Array.isArray(responseData.errors)) {
            const errorDetails = responseData.errors.map(error => error.detail).join('\n');
            this.toast.error(`Failed to create meeting:\n${errorDetails}`);
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
    }


  }
};
</script>


<style scoped>
.multiselect-custom :v-deep .multiselect__tags {
  @apply border-2 rounded-lg p-2 w-full focus:ring-4 focus:ring-blue-500;
}
</style>
