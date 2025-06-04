<template>
  <div class="mx-auto px-4 md:px-10 pt-10 pb-10 h-screen overflow-y-auto scrollbar-hidden flex flex-col bg-gray-50">
    <div v-if="loading" class="text-center text-xl font-semibold text-gray-500 animate-pulse">
      Loading meetings...
    </div>
    <template v-else>
      <Marquee :loading="loading" :runningMeeting="runningMeeting" :upcomingMeetings="upcomingMeetings"
        :formatTime="formatTime" />
      <FloatingLogin />
      <div
        :class="['grid gap-8', processedRooms.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-2']">
        <div v-for="room in processedRooms.slice(0, 100)" :key="room.location_id"
          class="bg-white rounded-2xl border border-green-200 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col min-h-[520px] max-h-[520px] overflow-hidden">
          <template v-if="room.meeting">
            <header
              class="bg-green-700 text-white px-6 py-5 rounded-t-2xl shadow-sm flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              <div class="flex-1 space-y-2">
                <div class="tooltip-container">
                  <h3 class="text-2xl font-extrabold tracking-tight leading-snug">
                    {{ room.meeting.title.slice(0, 78) }}
                  </h3>
                </div>
                <div class="flex flex-wrap items-center gap-x-6 text-base font-medium leading-relaxed">
                  <p class="flex items-center text-xl"><i class="fas fa-clock mr-2"></i>{{
                    formatTime(room.meeting.start_time)
                  }} – {{ formatTime(room.meeting.end_time) }}</p>
                  <p class="flex items-center text-xl"><i class="fas fa-microphone-alt mr-2"></i>Host: {{
                    room.meeting.host_name || "N/A" }}</p>
                </div>
              </div>
              <div class="flex-shrink-0 self-start md:self-center">
                <span class="location-badge">{{ room.location_name }}</span>
              </div>
            </header>
            <!-- Conditional Rendering: Show time left if it's less than 15 minutes -->
            <template v-if="getMinutesLeft(room.meeting.end_time, room.meeting.date) < 15">
              <div class="time-left-container p-4 mt-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-md">
                <div class="flex items-center gap-2">
                  <i class="fas fa-clock text-yellow-600 text-xl"></i>
                  <p class="text-lg font-semibold text-yellow-800">
                    🕒 This meeting will finish in
                    <span class="text-green-600 font-bold text-xl">
                      {{ getMinutesLeft(room.meeting.end_time, room.meeting.date) }}
                    </span>
                    minute<span v-if="getMinutesLeft(room.meeting.end_time, room.meeting.date) > 1">s</span>.
                  </p>
                </div>
              </div>
            </template>
            <ul class="bg-gray-50 space-y-3 p-4 flex-1 overflow-auto scrollbar-hidden">
              <li v-for="p in room.meeting.participants || []" :key="p.id"
                class="flex items-center gap-4 bg-white rounded-xl shadow-sm p-3 hover:bg-gray-100 transition">
                <img :src="getParticipantImage(p)" class="w-10 h-10 rounded-full object-cover"
                  :alt="p.user_name || 'Participant avatar'"
                  @error="event => event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.user_name || 'User')}&size=128&background=random`" />
                <div class="leading-tight">
                  <p class="text-base font-semibold text-gray-800">{{ p.user_name }}</p>
                  <p class="text-sm text-gray-500">{{ p.department_name || 'N/A' }}</p>
                </div>
              </li>
            </ul>
          </template>
          <template v-else>
            <div class="flex flex-col flex-1 justify-between items-center text-center p-6">
              <div
                class="w-full bg-green-700 text-white py-4 px-4 rounded-t-2xl flex justify-between items-start w-full">
                <!-- <p v-if="room.upcomingMeeting" class="text-sm font-medium">
                  📅 Upcoming meeting scheduled today
                </p> -->
                <span class="location-badge">{{ room.location_name }}</span>
              </div>
              <div class="flex flex-col items-center justify-center flex-1">
                <img src="@/assets/img/meeting.png" alt="Room Available" class="h-32 my-4" />
                <h1 class="text-xl font-bold text-blue-600 animate-bounce">
                  Available
                </h1>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import Marquee from "@/components/Overview/Marque.vue";
import axios from "axios";
import apiEndpoints from "@/config/apiConfig";
import FloatingLogin from "@/components/Main/Floating/FloatingLogin.vue";
export default {
  components: {
    FloatingLogin,
    Marquee,
  },
  data() {
    return {
      loading: true,
      rooms: [],
      userAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
    };
  },
  computed: {
    processedRooms() {
      const now = new Date();
      return this.rooms.map((room) => {
        const meetingsWithTimes = room.meetings.map((m) => {
          const start = new Date(`${m.date}T${m.start_time}`);
          const end = new Date(`${m.date}T${m.end_time}`);
          return { ...m, start, end };
        });
        const current = meetingsWithTimes.find((m) => now >= m.start && now <= m.end);
        const upcoming = meetingsWithTimes.filter((m) => m.start > now).sort((a, b) => a.start - b.start);
        return {
          location_id: room.location_id,
          location_name: room.location_name,
          meeting: current || null,
          upcomingMeeting: upcoming[0] || null,
          allUpcoming: upcoming,
        };
      }).sort((a, b) => {
        if (a.meeting && !b.meeting) return -1;
        if (!a.meeting && b.meeting) return 1;
        return a.location_name.localeCompare(b.location_name);
      });
    },
    runningMeeting() {
      const now = new Date();
      return this.rooms
        .flatMap((room) =>
          room.meetings.map((meeting) => {
            const start = new Date(`${meeting.date}T${meeting.start_time}`);
            const end = new Date(`${meeting.date}T${meeting.end_time}`);
            return { ...meeting, location_name: room.location_name, start, end };
          })
        )
        .find((meeting) => now >= meeting.start && now <= meeting.end);
    },
    upcomingMeetings() {
      const now = new Date();
      return this.rooms
        .flatMap((room) =>
          room.meetings.map((meeting) => {
            const start = new Date(`${meeting.date}T${meeting.start_time}`);
            return { ...meeting, location_name: room.location_name, start };
          })
        )
        .filter((meeting) => meeting.start > now)
        .sort((a, b) => a.start - b.start);
    },
    hasMeetings() {
      return this.runningMeeting || this.upcomingMeetings.length > 0;
    },
  },
  methods: {
    async fetchMeetings() {
      try {
        const { data } = await axios.get(apiEndpoints.location);
        this.rooms = data;
        localStorage.setItem('cachedMeetings', JSON.stringify(data));
      } catch (err) {
        console.error("Error loading meetings:", err);
        const cached = localStorage.getItem('cachedMeetings');
        if (cached) {
          this.rooms = JSON.parse(cached);
          console.warn("Loaded meetings from cache.");
        } else {
          console.warn("No cached meeting data available.");
        }
      } finally {
        this.loading = false;
      }
    },
    formatTime(timeStr) {
      const [h, m] = timeStr.split(":");
      return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
    },
    isImage(url) {
      return /\.(jpg|jpeg|png|gif|bmp)$/i.test(url);
    },
    getParticipantImage(p) {
      if (this.isImage(p.user_image)) {
        return `${apiEndpoints.storage}/${p.user_image}`;
      }
      return p.avatar || this.userAvatar;
    },
    getMinutesLeft(endTimeStr, dateStr) {
      if (!endTimeStr || !dateStr) return 0;
      try {
        const now = new Date();
        const end = new Date(`${dateStr}T${endTimeStr}`);
        if (isNaN(end)) return 0;
        const diffMs = end - now;
        const minutesLeft = Math.ceil(diffMs / 60000);
        return minutesLeft > 0 ? minutesLeft : 0;
      } catch (e) {
        console.error("Error calculating time left:", e);
        return 0;
      }
    },
  },
mounted() {
  this.fetchMeetings();

  this.timer = setInterval(() => {
    this.$forceUpdate(); 
  }, 30000); 

  this.reloadTimer = setInterval(() => {
    this.fetchMeetings(); 
  }, 5000); 
},

beforeDestroy() {
  clearInterval(this.timer);
  clearInterval(this.reloadTimer);
},

};
</script>
<style>
.location-badge {
  background-color: #f0f9ff;
  color: #0a4926;
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  border-radius: 9999px;
  border: 3px solid #4fce82;
  box-shadow: 0 4px 10px rgba(59, 128, 99, 0.15);

  transition: transform 0.3s ease-in-out;
}
.location-badge:hover {
  transform: scale(1.07);
}
</style>