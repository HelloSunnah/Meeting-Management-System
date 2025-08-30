<template>
  <div :class="theme81" class="w-full p-10 shadow-2xl rounded-3xl transition-all duration-300">
    <header class="flex flex-wrap md:flex-nowrap items-center justify-between border-gray-200 pb-6">
      <div class="flex flex-col w-full md:w-5/6">
        <h3 :class="themeText" class="text-xs font-semibold uppercase tracking-widest">
          Meeting Minutes
        </h3>
        <h2 :class="themeText" class="text-4xl font-extrabold mt-2 break-words">
          Title: {{ meeting.title || "No title available" }}
        </h2>
        <div :class="themeText" class="prose max-w-none mt-1 text-base" v-html="descriptionHtml"></div>
      </div>
      <div class="flex items-center justify-end mt-4 md:mt-0 md:w-1/6">
        <p :class="themeText" class="text-xl font-bold text-gray-500">
          📅 {{ formattedDate }}
        </p>
      </div>
    </header>

    <!-- Meeting Notes Editor -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-2xl shadow-md">
      <div class="md:col-span-2">
        <label :class="themeText" for="minutes" class="block text-sm font-semibold mb-2">
          📝 Meeting Notes
        </label>
        <TextEditor v-model="minutes" :disabled="isAlreadySaved" class="text-gray-800" />
      </div>

      <!-- Participants Section -->
      <div class="overflow-y-auto no-scrollbar max-h-80">
        <div class="grid grid-cols-2 gap-2 mt-6">
          <div v-for="(p, index) in participants" :key="p.id"
            class="p-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.03] transition-transform duration-200">
            
            <div class="flex items-start justify-between gap-3">
              <!-- Avatar and Name -->
              <div class="flex items-center gap-3 w-full">
                <img :src="getImageUrl(p)" alt="Participant image"
                  class="w-12 h-12 sm:w-8 sm:h-8 rounded-full border-2 border-blue-500 shadow-sm hover:shadow-md" />
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-blue-900">
                    {{ p.user_name }}
                  </span>
                </div>
              </div>

              <!-- Status + Toggle -->
              <div class="flex flex-col items-end gap-1">
                <span :class="getAttendanceClass(p.attendance_status)"
                      class="w-3.5 h-3.5 flex items-center justify-center" 
                      :title="getAttendanceText(p.attendance_status)">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor">
                    <path v-if="p.attendance_status === 1" stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="3" d="M1 5.917L5.724 10.5L15 1.5" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                </span>
                <!-- Remarks Toggle -->
                <svg v-if="p.remarks?.length > 0" @click="toggleAccordion(index)"
                     :class="{ 'rotate-180': isAccordionOpen(index) }"
                     class="w-3.5 h-3.5 text-gray-600 cursor-pointer transition-transform duration-200"
                     fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Toggle remarks">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <!-- Remarks -->
            <transition name="fade">
              <div v-if="isAccordionOpen(index)" class="mt-2 text-xs text-gray-700 bg-gray-50 px-3 py-2 rounded-lg shadow-inner">
                {{ p.remarks || "No remarks provided." }}
              </div>
            </transition>
          </div>
        </div>
      </div>
    </section>

    <!-- Save Button -->
    <button @click="saveMinutes"
            :disabled="saving || isAlreadySaved"
            class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 mt-6">
      <span v-if="!saving">Save</span>
      <span v-else>Saving...</span>
    </button>
  </div>
</template>


<script>
import ParticipantsList from "@/components/Pages/Schedule/Participants.vue";
import apiEndpoints from "@/config/apiConfig";
import useTheme from "@/components/js/ThemeSetting";
import { useToast } from "vue-toastification";
import TextEditor from "@/components/Pages/Schedule/TextEditor.vue";

export default {
  components: { ParticipantsList, TextEditor },
  props: {
    meeting: { type: Object, required: true },
  },
  data() {
    return {
      minutes: "",
      originalMinutes: "", // ← Add this
      saved: false,
      saving: false,
      participants: [],
      loggedInPerson: sessionStorage.getItem("user_id"),
      openAccordions: new Set(),
    };
  },
  setup() {
    const {
      theme1,
      theme2,
      theme3,
      theme4,
      theme5,
      theme6,
      theme81,
      theme7,
      theme8,
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
      theme6,
      theme81,
      theme7,
      theme8,
      theme9,
      themeText,
      toast,
    };
  },
computed: {
  formattedDate() {
    return this.meeting.date
      ? new Date(this.meeting.date).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Date not set";
  },
  descriptionHtml() {
    return this.meeting.description || "<p class='text-gray-400'>No description provided.</p>";
  },
  isAlreadySaved() {
    return !!this.originalMinutes?.trim();
  },
},

methods: {
  toggleAccordion(index) {
    this.openAccordions.has(index)
      ? this.openAccordions.delete(index)
      : this.openAccordions.add(index);
  },
  isAccordionOpen(index) {
    return this.openAccordions.has(index);
  },
  getAttendanceText(status) {
    switch (status) {
      case 1: return "Present";
      case 0: return "Absent";
      default: return "Unknown";
    }
  },
  getImageUrl(p) {
    if (p.user_image && /\.(jpg|jpeg|png|gif|bmp)$/i.test(p.user_image)) {
      return `${apiEndpoints.storageUrl2}/${p.user_image}`;
    }
    const name = p.user_name || "User";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8b5cf6&color=fff&rounded=true&size=128`;
  },
  getAttendanceClass(status) {
    return status === 1 ? "text-green-500" : status === 0 ? "text-red-500" : "text-gray-400";
  },
  async fetchMinutes() {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(apiEndpoints.meetingMinutes(this.meeting.id), {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      this.minutes = data.meeting_minutes?.[0]?.description || "";
      this.originalMinutes = this.minutes;
      this.participants = data.participants || [];
    } catch (err) {
      console.error("Fetch error:", err);
      this.toast.error("❌ Failed to fetch meeting minutes.");
    }
  },
  async saveMinutes() {
    this.saving = true;
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(apiEndpoints.meetingMinutes(this.meeting.id), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: this.minutes }),
      });
      if (!response.ok) throw new Error("Failed response");
      this.originalMinutes = this.minutes;
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
    this.loggedInPerson = sessionStorage.getItem("user_id");
    this.fetchMinutes();
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
