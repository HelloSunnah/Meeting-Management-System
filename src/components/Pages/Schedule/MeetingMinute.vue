<template>
  <div
    class="w-full px-6 py-10 md:px-12 lg:px-24 bg-gradient-to-r from-gray-50 to-white shadow-2xl rounded-3xl transition-all duration-300 space-y-10"
  >
    <!-- Header Section -->
    <header class="flex items-center justify-between border-b border-gray-200 pb-6">
      <div class="flex flex-col w-5/6">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Meeting Minutes</h3>
        <h2 class="text-4xl font-extrabold text-blue-900 mt-2 break-words w-full">
          Tittle : {{ meeting.title }}
        </h2>
        <p class="text-xl font-medium text-blue-800 mt-1">{{ meeting.description }}</p>
      </div>
      <div class="flex items-center w-1/6 justify-end">
        <p class="text-xl font-bold text-gray-500 mt-1 ml-4" aria-label="Meeting Date">📅 {{ formattedDate }}</p>
      </div>
    </header>

    <!-- Notes & Participants Section -->
    <section class="grid grid-cols-2 md:grid-cols-3 gap-2 bg-gradient-to-br from-gray-50 to-white p-6 border border-gray-100 rounded-2xl shadow-md">
      <!-- Notes Section -->
      <div class="md:col-span-2">
        <label for="minutes" class="block text-gray-700 text-sm font-semibold mb-2">📝 Meeting Notes</label>
        <textarea
          id="minutes"
          v-model="minutes"
          rows="15"
          :disabled="!isHostUser"          placeholder="Type your meeting notes here..."
          class="w-full p-4 border border-gray-300 rounded-xl shadow-inner focus:ring-2 focus:ring-blue-400 resize-none transition-all"
          aria-label="Meeting minutes"
        ></textarea>
      </div>

      <!-- Participants Section -->
      <ParticipantsList :participants="participants" />
    </section>

    <!-- Save Button -->
    <div class="text-center">
      <button
        @click="saveMinutes"
        :disabled="saving || !isHostUser"
        class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
      >
        <span v-if="!saving">💾 Save</span>
        <span v-else>⏳ Saving...</span>
      </button>
    </div>

    <!-- Save Feedback -->
    <transition name="fade">
      <p v-if="saved" class="text-green-600 font-medium text-sm text-right mt-3">✅ Minutes saved successfully!</p>
    </transition>
  </div>
</template>

<script>
import ParticipantsList from "@/components/Pages/Schedule/Participants.vue";
import apiEndpoints from '@/config/apiConfig';

import { useToast } from "vue-toastification";

export default {
    setup() {
    const toast = useToast();
    return { toast };
  },
  components: {
    ParticipantsList,
  },
  props: {
    meeting: { type: Object, required: true },
  },
  data() {
    return {
      minutes: "",
      saved: false,
      saving: false,
      loggedInPerson: null,
      loggedInPerson: localStorage.getItem("user_id"),

      participants: [],
    };
  },


  watch: {
    isHostUser(newValue) {
    }
  },
  computed: {
    formattedDate() {
      return new Date(this.meeting.date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    isHostUser() {
      const isHostUser = String(this.meeting?.host_id) === String(this.loggedInPerson);
      return isHostUser;

    },
  },
  methods: {
    async fetchMinutes() {
      try {
        const token = localStorage.getItem("token");
      const response = await fetch(apiEndpoints.meetingMinutes(this.meeting.id), {
          method: 'GET', // The method for fetching meeting minutes
          headers: {
            Authorization: `Bearer ${token}`, // Bearer token for authentication
          },
        });

        if (!res.ok) throw new Error("Failed to fetch meeting minutes.");

        const data = await res.json();
        this.minutes = data.meeting_minutes[0]?.description || "";
        this.participants = data.participants;
      } catch (err) {
        console.error("Fetch error:", err);
        this.toast.error("❌ Failed to fetch minutes.");

      }
    },

   async saveMinutes() {
      this.saving = true;
      this.saved = false;

      try {
        const token = localStorage.getItem("token");

        // Check if there is a valid token
        if (!token) {
          throw new Error("Token not found.");
        }

        const res = await fetch(apiEndpoints.meetingMinutes(this.meeting.id), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ description: this.minutes }), // Send the meeting minutes
        });

        // Check if the response is successful
        if (!res.ok) {
          throw new Error("Failed to save minutes.");
        }

        // Update state after successful save
        this.saved = true;
        this.toast.success("✔️ Minutes saved successfully!");
      } catch (err) {
        console.error("Save error:", err);
        this.toast.error("❌ Failed to save minutes.");
      } finally {
        this.saving = false;
      }
    },
  },
  mounted() {
    this.loggedInPerson = localStorage.getItem("user_id");
    this.fetchMinutes();
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
</style>
