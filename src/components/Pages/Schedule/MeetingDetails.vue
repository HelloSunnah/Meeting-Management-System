<template>
  <div class="mx-auto bg-white shadow-xl rounded-xl p-8 sm:p-12 border border-gray-200 space-y-12">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">

      <!-- Meeting Details Section -->
      <div class="flex flex-col bg-gray-100 space-y-6 p-6 shadow-md rounded-xl border border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">Meeting Details</h2>
        <div class="space-y-4">
          <label for="meeting-title" class="text-sm font-semibold text-gray-700">Title</label>
          <input v-model="meeting.title" id="meeting-title"
            class="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Meeting title" required :disabled="!isHostUser" />

          <label for="project-id" class="text-sm font-semibold text-gray-700">Project</label>
          <select v-model="meeting.project_id" id="project-id" :disabled="!isHostUser"
            class="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
            <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>

          <label for="meeting-type" class="text-sm font-semibold text-gray-700">Meeting Type</label>
          <select v-model="meeting.meeting_type" id="meeting-type" :disabled="!isHostUser"
            @change="onMeetingTypeChange"
            class="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
            <option value="1">Internal</option>
            <option value="2">External</option>
            <option value="3">Other</option>
          </select>
          

          <label for="client" class="text-sm font-semibold text-gray-700">Client</label>
          <select v-model="meeting.client_id" id="client" :disabled="!isHostUser"
            class="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
            <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
      </div>

      <!-- Meta Details -->
      <div class="flex flex-col bg-gray-100 space-y-6 p-6 shadow-md rounded-xl border border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">Meta Details</h2>
        <p v-if="roomConflict" class="text-sm text-red-600 font-medium">
          ⚠️ Conflict: This room is already booked during the selected time.
          Please choose another time or location.
        </p>
        <div class="space-y-4">
          <label for="location" class="text-sm font-semibold text-gray-700">Location</label>
          <select v-model="meeting.location_id" id="location" :disabled="!isHostUser"
            class="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
            <option v-for="l in locations" :key="l.id" :value="l.id">{{ l.name }}</option>
          </select>

          <label for="start-time" class="text-sm font-semibold text-gray-700">Start Time</label>
          <input v-model="meeting.start_time" type="time" id="start-time" :disabled="!isHostUser"
            class="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required />

          <label for="end-time" class="text-sm font-semibold text-gray-700">End Time</label>
          <input v-model="meeting.end_time" type="time" id="end-time" :disabled="!isHostUser"
            class="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required />

          <label for="meeting-date" class="text-sm font-semibold text-gray-700">Date</label>
          <input v-model="meeting.date" type="date" id="meeting-date" :disabled="!isHostUser"
            class="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required />
        </div>
      </div>

      <!-- Description -->
      <div class="bg-gray-100 shadow-md rounded-xl border border-gray-200 p-6 space-y-6">
        <label for="description" class="text-sm font-semibold text-gray-700">Description</label>
        <textarea v-model="meeting.description" id="description" rows="6" :disabled="!isHostUser"
          class="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Add a brief description..." required></textarea>
      </div>

      <!-- Participants -->
      <ParticipantsSection v-model="selectedParticipants" :participants="MyParticipants"
        :availableParticipants="Participants" :isHostUser="isHostUser" @removeParticipant="removeExistingParticipant" />

      <!-- Other Participants -->

<!-- Other Participants Section -->
<div v-if="OtherParticipants.length > 0 || meeting.meeting_type === '3'">
  <h1 class="text-lg font-semibold mb-2">Other Participants</h1>

  <div v-for="(other, index) in OtherParticipants" :key="other.id" class="flex gap-4 items-center mb-2">
    <input
      v-model="other.other_participant_name"
      :disabled="meeting.meeting_type !== '3'"
      class="flex-grow px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      placeholder="Participant name"
    />
    <button
      @click="removeParticipant(index)"
      class="text-red-600"
    >
            <i class="fa-solid fa-trash mr-1"></i> Remove
    </button>
  </div>
  <button
    @click="addParticipant"
    class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Add Participant
  </button>
</div>
    </div>
    <!-- Attachments -->
    <AttachmentSection :attachments="meeting.attachments" :newAttachments="newAttachments"
      :removedAttachments="removedAttachments" />
    <!-- Submit Section -->
 <div class="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8 border-t border-gray-200">
  <!-- Host/Admin sees Submit button -->
  <button v-if="isHostUser" @click="submitMeeting" :disabled="roomConflict"
    class="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-shadow-md">
    Submit
  </button>

  <!-- Participant (but not Host/Admin) sees Attend/Cancel -->
  <div v-else-if="isParticipantOnly" class="flex items-center gap-4">
    <select v-model="attendanceStatus" class="w-40 px-4 py-2 border rounded-md bg-white text-gray-700">
      <option value="attend">Attend</option>
      <option value="cancel">Cancel</option>
    </select>
    <div v-if="attendanceStatus === 'cancel'" class="flex items-center gap-4">
      <input v-model="cancelReason" type="text" class="w-64 px-4 py-2 border rounded-md bg-white text-gray-700"
        placeholder="Cancellation reason" />
      <button @click="submitCancelReason"
        class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-shadow-sm">
        Send
      </button>
    </div>
  </div>
</div>

  </div>
</template>

<script>
import apiEndpoints from "@/config/apiConfig";
import AttachmentSection from "@/components/Pages/Schedule/AttachmentFile.vue";
import ParticipantsSection from "@/components/Pages/Schedule/MeetingParticipants.vue";
import axios from "axios";
import Multiselect from "vue-multiselect";
import { useToast } from "vue-toastification";

export default {
      setup() {
    const toast = useToast();
    return { toast };
  },
  components: { Multiselect, AttachmentSection, ParticipantsSection },
  props: {
    meeting: Object,
    hosts: Array,
    clients: Array,
    participants: Array,
    projects: Array,
    locations: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      selectedParticipants: [],
      cancelReason: "",
      attendanceStatus: "attend",
      Participants: [],
      roomConflict: false,
      removedAttachments: [],
      newAttachments: [],
      OtherParticipants: [],
      MyParticipants: [],
      removedParticipantIds: [],
      openAccordions: new Set(),
      existingParticipantIds: [],
      loggedInPerson: localStorage.getItem("user_id"),
      loggedInPersonName: localStorage.getItem("login_user_name"),
    };
  },
  mounted() {
    this.fetchParticipants();
    this.fetchMeetingParticipants();
  },
  watch: {
    "meeting.date": "checkRoomAvailability",
    "meeting.start_time": "checkRoomAvailability",
    "meeting.end_time": "checkRoomAvailability",
    "meeting.location_id": "checkRoomAvailability",
  },
computed: {
  isHostUser() {
    return String(this.meeting?.host_id) === String(this.loggedInPerson) ||
           this.loggedInPersonName === 'Admin';
  },
  isParticipantOnly() {
    const isParticipant = this.MyParticipants.some(p => String(p.user_id) === String(this.loggedInPerson));
    return isParticipant && !this.isHostUser;
  }
},

  methods: {
    addParticipant() {
      const newId = Date.now();
      this.OtherParticipants.push({ id: newId, other_participant_name: '' });
    },
    removeParticipant(index) {
      this.OtherParticipants.splice(index, 1);
    },
    async checkRoomAvailability() {
      this.roomConflict = false;
      const { date, start_time, end_time, location_id } = this.meeting;
      if (!date || !start_time || !end_time || !location_id) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(apiEndpoints.meetingsByDate(date), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        const meetings = data?.data || [];
        const formattedStart = start_time.length === 5 ? start_time + ":00" : start_time;
        const formattedEnd = end_time.length === 5 ? end_time + ":00" : end_time;

        this.roomConflict = meetings.some((m) => {
          if (m.id == this.meeting.id) return false;
          return (
            m.location_id == location_id &&
            m.date === date &&
            ((formattedStart >= m.start_time && formattedStart < m.end_time) ||
              (formattedEnd > m.start_time && formattedEnd <= m.end_time) ||
              (formattedStart <= m.start_time && formattedEnd >= m.end_time))
          );
        });
      } catch (error) {
        console.error("Room availability check failed:", error);
        this.roomConflict = true;
      }
    },
    async fetchParticipants() {
      try {
        const token = localStorage.getItem("token");
        const LoginUserName = localStorage.getItem("login_user_name");
        console.log(LoginUserName)
        const { data } = await axios.get(apiEndpoints.allUsers, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.Participants = data.users || [];
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    },
    async fetchMeetingParticipants() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(apiEndpoints.updateMeeting(this.meeting.id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        this.MyParticipants = Object.values(data.data.participants || {}).map((p) => ({
          ...p,
          user_name: p.user_name || "Unnamed",
        }));
        this.existingParticipantIds = this.MyParticipants.map((p) => p.user_id);
        this.OtherParticipants = (data.data.other_participants || []).map((op) => ({
          id: op.id,
          other_participant_name: op.other_participant_name || "Unnamed",
        }));
      } catch (err) {
        console.error("Fetch error:", err);
      }
    },
    removeExistingParticipant(user_id) {
      this.MyParticipants = this.MyParticipants.filter(p => p.user_id !== user_id);
      if (this.existingParticipantIds.includes(user_id)) {
        this.removedParticipantIds.push(user_id);
      }
    },
    async submitCancelReason() {
      if (!this.cancelReason.trim()) {
        this.toast.error("Please provide a reason for cancellation.");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const payload = {
          meeting_id: this.meeting.id,
          attendance_status: 0,
          user_id: this.loggedInPerson,
          remarks: this.cancelReason,
        };
        await axios.post(apiEndpoints.submitCancelReason, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.toast.success("Cancellation reason submitted successfully!");
      } catch {
        this.toast.error("Failed to submit cancellation reason.");
      }
    },
  onMeetingTypeChange() {
    if (this.meeting.meeting_type === '3' && this.OtherParticipants.length === 0) {
      this.OtherParticipants.push({
        id: Date.now(),
        other_participant_name: ''
      });
    }
  },
    async submitMeeting() {
      if (this.roomConflict) {
        this.toast.error("⚠️ Cannot submit: Room is already booked during this time.");
        return;
      }

      const requiredFields = ["title", "project_id", "start_time", "end_time", "date", "location_id"];
      for (const field of requiredFields) {
        if (!this.meeting[field]) {
          alert(`Please fill in the ${field.replace("_", " ")} before submitting.`);
          return;
        }
      }

      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("_method", "PUT");

        const fields = {
          ...this.meeting,
          start_time: this.meeting.start_time.length === 5 ? this.meeting.start_time + ":00" : this.meeting.start_time,
          end_time: this.meeting.end_time.length === 5 ? this.meeting.end_time + ":00" : this.meeting.end_time,
          company_id: "1",
          status: "1",
          meeting_status: this.meeting.meeting_status || "1",
        };

        Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
        this.meeting.attachments.forEach((att, index) => {
          if (!this.removedAttachments.includes(att.id)) {
            formData.append("existing_attachments[]", att.id);
            formData.append(
              "existing_attachment_titles[]",
              att.attachment_title || ""
            );
            if (att.new_file) {
              formData.append(
                `existing_attachment_files[${index}]`,
                att.new_file
              );
            }
          }
        });
        if (this.removedAttachments.length > 0) {
          this.removedAttachments.forEach((id) => {
            formData.append("removed_attachments[]", id);
          });
        }
        let hasNewAttachments = false;
        this.newAttachments.forEach((attachment, index) => {
          if (attachment.file) {
            hasNewAttachments = true;
            formData.append(`attachments[${index}]`, attachment.file);
            formData.append(`attachment_title[${index}]`, attachment.title);
          }
        });
        if (!hasNewAttachments) {
          formData.append("attachments[]", "");
        }
        const existing = this.existingParticipantIds.filter(id => !this.removedParticipantIds.includes(id));
        const newParticipants = this.selectedParticipants.map(p => p.id);
        [...existing, ...newParticipants].forEach(id => {
          formData.append("participants[]", id);
        });


        this.OtherParticipants.forEach((op, index) => {
          formData.append(`other_participant_name[${index}][id]`, op.id ? parseInt(op.id) : ''); // Laravel treats '' as null
          formData.append(`other_participant_name[${index}][name]`, op.other_participant_name ?? '');
        });

        for (let pair of formData.entries()) {
          console.log(pair[0] + ": ", pair[1]);
        }

        await axios.post(apiEndpoints.updateMeeting(this.meeting.id), formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        this.toast.success("Meeting updated successfully.");
        this.$router.push("/meeting/schedule");
      } catch (err) {
        console.error("Submit failed:", err);
        this.toast.error("Failed to update the meeting.");
      }
    },
  }
  ,
};
</script>
