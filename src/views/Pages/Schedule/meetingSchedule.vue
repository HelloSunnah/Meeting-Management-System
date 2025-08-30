<template>
  <div :class="theme8" class="min-h-screen p-2 sm:p-4 transition-all duration-300 ease-in-out">
    <div :class="theme7" class="w-full rounded-xl shadow-2xl p-4 sm:p-6 mt-4">
      <!-- Breadcrumb & Total Count -->
      <!-- Header with Total Meetings and Breadcrumb -->

      <Breadcrumb :items="breadcrumbs" :align="buttonPositionClass" :class="themeText" />
      <div class="flex items-center gap-6 mb-4">
        <div :class="themeText" class="text-gray-700 text-sm font-semibold">
          Total Meetings: <span class="font-bold">{{ totalMeetings }}</span>
        </div>
      </div>
      <!-- Meeting List -->
      <div class="space-y-4">
        <div class="filter-wrap" :class="theme4">
          <button v-for="option in meetingFilterOptions" :key="option.value" @click="changeFilter(option.value)"
            :class="['filter-tab', meetingFilter === option.value ? 'is-selected' : '']">
            <span class="px-6">{{ option.label }}</span>
          </button>
        </div>
        <!-- Table Container -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
            <table :class="theme7" class="min-w-full text-sm border-collapse">

              <!-- Table Header -->
              <thead :class="theme6" class=" border-b sticky top-0 z-10">
                <tr class="text-gray-700 uppercase font-semibold text-xs sm:text-sm">
                  <th class="p-3 w-10"></th>
                  <th v-for="(placeholder, key) in searchFields" :key="key" class="p-2 min-w-[140px]">
                    <input v-model="searchQueries[key]" :placeholder="placeholder"
                      class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </th>
                  <th class="p-3"></th>
                  <th class="p-3 text-center">Action</th>
                </tr>
              </thead>

              <!-- Table Body -->
              <tbody v-if="allMeetings.length > 0 || loading">

                <!-- Loading -->
                <tr v-if="loading">
                  <td :colspan="Object.keys(searchFields).length + 3" class="py-10 text-center text-gray-500">
                    <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Loading meetings...
                  </td>
                </tr>
                <template v-else v-for="(meeting, index) in allMeetings" :key="meeting.id">
                  <tr :class="getRowClass(index)">
                    <td class="p-2">
                      <span @click="toggleDetails(index)"
                        class="cursor-pointer w-6 h-6 flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow transition-all duration-150">
                        <span class="text-base font-bold">{{
                          expandedIndex === index ? "×" : "+"
                          }}</span>
                      </span>
                    </td>

                    <td class="p-2">
                      <div class="flex items-center gap-2">
                        <span>{{ meeting.title }}</span>
                        <img v-if="isMeetingOngoing(meeting)" src="@/assets/img/workflow.gif" alt="Ongoing"
                          class="w-5 h-5 object-cover rounded-full" />
                      </div>
                    </td>

                    <td class="p-2">{{ meeting.client_name }}</td>
                    <td class="p-2">{{ meeting.project_name }}</td>
                    <td class="p-2">{{ meeting.location_name }}</td>
                    <td class="p-2">{{ formatDate(meeting.date) }}</td>
                    <td class="p-2">
                      {{ meeting.start_time }} – {{ meeting.end_time }}
                    </td>

                    <td class="p-2">
                      <div class="relative group flex justify-center items-center">
                        <span v-if="!isMeetingOngoing(meeting)" class="w-8 h-8">
                          <img src="@/assets/img/cal16.gif" alt="Upcoming" class="w-full h-full" />
                          <div
                            class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-md shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-20 whitespace-nowrap">
                            🗓️ Meeting in {{ daysUntil(meeting.date) }} day(s)
                            <div
                              class="absolute top-full left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-blue-600 rotate-45">
                            </div>
                          </div>
                        </span>
                      </div>
                    </td>

                    <td class="p-2 text-center">
                      <button
                        class="bg-gray-700 hover:bg-gray-900 text-white px-4 py-1 rounded shadow-sm text-sm transition-all"
                        @click="toggleMinutes(index)">
                        Minutes
                      </button>
                    </td>
                  </tr>
                  <tr v-show="expandedIndex === index" :class="theme8">
                    <td colspan="12" class="p-4 bg-gray-50 rounded-b-lg">
                      <!-- Meeting Edit Mode -->
                      <MeetingEdit v-if="expandedIndex === index && showMinutesIndex !== index" :key="meeting.id"
                        :meetingId="meeting.id" @submitted="handleMeetingSubmitted" />

                      <!-- Meeting Minute Mode -->
                      <!-- <MeetingMinute v-else :class="theme8" :meeting-id="meeting.id" :meeting="meeting"
                      :PreviousParticipants="meeting.participants" /> -->

                      <MeetingMinute v-if="expandedIndex === index && showMinutesIndex === index" :key="meeting.id"
                        :class="theme8" :meeting-id="meeting.id" :meeting="meeting"
                        :PreviousParticipants="meeting.participants" />
                    </td>
                  </tr>
                </template>
              </tbody>

              <!-- Empty State -->
              <tbody v-else>
                <tr>
                  <td :colspan="Object.keys(searchFields).length + 3" class="py-12 text-center text-gray-500">
                    <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor"
                      stroke-width="1.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 6v6h4m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    No meetings found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <Pagination v-if="filteredTotalPages > 1" :currentPage="currentPage" :totalPages="filteredTotalPages"
            @page-change="changePage" class="border-t p-3 bg-white" />
        </div>
      </div>




      <!-- Floating Add Button -->
  <FloatingAddButton
      v-if="meetingPermission"
    :route="'/meeting/schedule/form'"
  />
    </div>
  </div>
</template>
<style scoped>
.filter-wrap {
  padding: 8px;
  border-radius: 10px;
  display: flex;

  background-color: #ffffff;
}

.filter-tab {
  position: relative;
  padding: 1rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  color: #475569;
  font-weight: 600;
  transition: 0.3s;
  border: none;
  cursor: pointer;
}

.filter-tab:hover {
  color: #2563eb;
}

.filter-tab.is-selected {
  color: #fff;
  background: linear-gradient(90deg, #3b82f6, #9333ea);
  background-clip: padding-box;
}

/* left chevron */
.filter-tab.is-selected::before {
  content: "";
  position: absolute;
  left: -1px;
  /* Changed from -0px to -1px */
  top: 0;
  width: 15px;
  height: 100%;
  background: linear-gradient(90deg, #fff, #fff);
  clip-path: polygon(0 0, 100% 50%, 0 100%);
  /* box-shadow removed */
  will-change: transform;
}

/* right chevron */
.filter-tab.is-selected::after {
  content: "";
  position: absolute;
  right: -15px;
  top: 0;
  width: 15px;
  height: 100%;
  background: linear-gradient(90deg, #9333ea, #9333ea);
  clip-path: polygon(0 0, 100% 50%, 0 100%);
  z-index: 2;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  will-change: transform;
}
</style>



<script>

import _ from "lodash";
import axios from "axios";
import Breadcrumb from "@/components/Main/Breadcrumbs.vue";
import Loader from "@/components/Main/Loader.vue";
import MeetingEdit from "@/components/Pages/Schedule/MeetingEdit.vue";
import MeetingMinute from "@/components/Pages/Schedule/MeetingMinute.vue";
import Pagination from "@/components/Pages/Schedule/Pagination.vue";
import FloatingAddButton from "@/components/Main/Floating/FloatingAddButton.vue";
import apiEndpoints from "@/config/apiConfig";
import { useToast } from "vue-toastification";
import useTheme from "@/components/js/ThemeSetting";
const meetingPermission = sessionStorage.getItem("meeting_create_per");

export default {
  components: {
    Breadcrumb,
    Loader,
    MeetingEdit,
    MeetingMinute,
    Pagination,
    FloatingAddButton,
  },

  setup() {
    const toast = useToast();
    return { ...useTheme(), toast };
  },

  data() {
    return { canCreatemeeting: false, // permission flag
      loading: false,
      expandedIndex: null,
      showMinutesIndex: null,

      meetingFilter: "today",
      meetingFilterOptions: [
        { value: "today", label: "Today" },
        { value: "upcoming", label: "Upcoming" },
        { value: "past", label: "Previous" },
        { value: "all", label: "All" },
      ],

      searchQueries: {
        title: "",
        client: "",
        project: "",
        location: "",
        date: "",
        time: "",
      },

      currentPage: 1,
      itemsPerPage: 10,
      filteredTotalPages: 1,
      totalMeetings: 0,

      allMeetings: [],

      meeting_create_per: sessionStorage.getItem("meeting_create_per"),
      loggedInPerson: sessionStorage.getItem("user_id") || "",
      currentUserRole: Number(sessionStorage.getItem("role_id") || 0),

      breadcrumbs: [
        {
          label: "Home",
          clickable: true,
          onClick: () => this.$router.push("/dashboard"),
        },
        { label: "Schedule", clickable: false },
        { label: "Meeting", clickable: false },
      ],
    };
  },

  computed: {
    buttonPositionClass() {
      return this.$store.state.sidebarPosition;
    },
    searchFields() {
      return {
        title: "Search Title",
        client: "Search Client",
        project: "Search Project",
        location: "Search Location",
        date: "Search Date",
        time: "Search Time",
      };
    },
    queryParams() {
      const params = new URLSearchParams({
        page: this.currentPage,
        limit: this.itemsPerPage,
      });
      for (const [key, value] of Object.entries(this.searchQueries)) {
        const trimmed = value.trim();
        if (trimmed) params.append(key, trimmed);
      }
      return params.toString();
    },
    meetingApiEndpoint() {
      const map = {
        today: apiEndpoints.meetingsPresent,
        upcoming: apiEndpoints.meetingsUpcoming,
        past: apiEndpoints.meetingsPast,
        all: apiEndpoints.meetings,
      };
      return map[this.meetingFilter] || apiEndpoints.meetings;
    },
  },

  watch: {
    searchQueries: {
      handler: _.debounce(function () {
        this.currentPage = 1;
        this.fetchMeetingsByFilter();
      }, 500),
      deep: true,
    },
    meetingFilter() {
      this.currentPage = 1;
      this.fetchMeetingsByFilter();
    },
  },

  async mounted() {   const permission = sessionStorage.getItem("meeting_create_per");
    this.canCreatemeeting = permission === "1"; // true if user has permission
    this.loading = true;

    const token = sessionStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      // Try fetching today's meetings first
      const todayUrl = `${apiEndpoints.meetingsPresent}?page=1&limit=10`;
      const todayRes = await axios.get(todayUrl, { headers });
      const todayMeetings = todayRes.data?.data || [];

      const isAdmin = this.currentUserRole === 1;

      const filteredTodayMeetings = isAdmin
        ? todayMeetings
        : todayMeetings.filter((m) =>
          m.participants?.some((p) => String(p.user_id) === this.loggedInPerson)
        );

      if (filteredTodayMeetings.length > 0) {
        this.meetingFilter = "today";
      } else {
        this.meetingFilter = "all";
      }

      await this.fetchMeetingsByFilter();
    } catch (err) {
      this.toast.error("Failed to load meetings.");
      this.meetingFilter = "all";
      await this.fetchMeetingsByFilter();
    } finally {
      this.loading = false;
    }
  },

  methods: {
    async fetchMeetingsByFilter() {
      this.loading = true;
      try {
        const token = sessionStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const url = `${this.meetingApiEndpoint}?${this.queryParams}`;

        const { data } = await axios.get(url, { headers });
        const meetings = data?.data ?? [];

        if (this.currentUserRole === 1) {
          this.allMeetings = meetings;
          this.totalMeetings = data.meta?.total ?? meetings.length;
        } else {
          const userMeetings = meetings.filter((m) =>
            m.participants?.some((p) => String(p.user_id) === this.loggedInPerson)
          );
          this.allMeetings = userMeetings;
          this.totalMeetings = userMeetings.length;
        }

        this.filteredTotalPages = data.meta?.last_page ?? 1;
      } catch (error) {
        this.toast.error("Failed to load meetings.");
      } finally {
        this.loading = false;
      }
    },

    changePage(page) {
      if (page >= 1 && page <= this.filteredTotalPages && page !== this.currentPage) {
        this.currentPage = page;
        this.fetchMeetingsByFilter();
      }
    },

    toggleDetails(index) {
      this.expandedIndex = this.expandedIndex === index ? null : index;
      this.showMinutesIndex = null;
    },

    toggleMinutes(index) {
      if (this.expandedIndex === index && this.showMinutesIndex === index) {
        // Already open in minutes view, close everything
        this.expandedIndex = null;
        this.showMinutesIndex = null;
      } else {
        this.showMinutesIndex = index;
        this.expandedIndex = index;
      }
    }
    ,

    handleMeetingSubmitted() {
      this.expandedIndex = null;
    },

    getRowClass(index) {
      const meeting = this.allMeetings[index];
      const baseTheme = index % 2 === 0 ? this.theme9 : this.theme8;
      return this.isMeetingOngoing(meeting)
        ? "bg-green-100 text-blue-800"
        : baseTheme;
    },

    isMeetingOngoing(meeting) {
      const now = new Date();
      const [year, month, day] = meeting.date.split("-").map(Number);
      const toTime = (timeStr) => {
        const [h = 0, m = 0, s = 0] = (timeStr || "").split(":").map(Number);
        return new Date(year, month - 1, day, h, m, s);
      };
      return now >= toTime(meeting.start_time) && now <= toTime(meeting.end_time);
    },

    changeFilter(newFilter) {
      if (this.meetingFilter !== newFilter) {
        this.meetingFilter = newFilter;
      }
    },

    daysUntil(dateStr) {
      const today = new Date();
      const date = new Date(dateStr);
      return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    },

    formatDate(dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
};
</script>
