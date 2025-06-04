<template>
  <div :class="theme8" class="min-h-screen p-2 sm:p-4 transition-all duration-300 ease-in-out">
    <!-- Table Container -->
    <div :class="theme9" class="w-full rounded-lg shadow-xl p-3 sm:p-4">

      <!-- Navigation Bar -->
      <Breadcrumb :items="breadcrumbs" :align="buttonPositionClass" :themeText="themeText" />
      <Loader v-if="loading" />

      <!-- Table -->
      <div class="w-full overflow-x-auto  scrollbar-hidden">
        <table :class="theme6" class="min-w-full table-auto rounded-lg shadow text-sm">
          <thead :class="theme5" class="text-gray-700 bg-gray-100">
            <tr class="text-left text-xs sm:text-sm font-semibold uppercase">
              <th class="p-2 text-start w-10"></th>
              <th v-for="(placeholder, key) in searchFields" :key="key" class="p-2 text-start">
                <input v-model="searchQueries[key]" :placeholder="placeholder" class="input-field w-full sm:w-auto" />
              </th>
              <th></th>
              <th class="p-2 text-start">Action</th>
            </tr>
          </thead>

          <tbody :class="theme7">
            <template v-for="(meeting, index) in paginatedMeetings" :key="meeting.id">
              <tr :class="getRowClass(index)">
                <td class="p-2 text-start">
                  <span @click="toggleDetails(index)"
                    class="cursor-pointer w-6 h-6 flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow">
                    <span class="text-base font-bold">{{ expandedIndex === index ? "×" : "+" }}</span>
                  </span>
                </td>
                <td class="p-2">
                  <div class="flex items-start gap-2">
                    <span>{{ meeting.title }}</span>
                    <span v-if="isMeetingOngoing(meeting)" class="w-6 h-6">
                      <img src="@/assets/img/workflow.gif" alt="Ongoing"
                        class="w-full h-full object-cover rounded-full" />
                    </span>
                  </div>
                </td>
                <td class="p-2">{{ meeting.client_name }}</td>
                <td class="p-2">{{ meeting.project_name }}</td>
                <td class="p-2">{{ meeting.location_name }}</td>
                <td class="p-2">{{ new Date(meeting.date).toLocaleDateString() }}</td>
                <td class="p-2">{{ meeting.start_time }}–{{ meeting.end_time }}</td>
                <td class="p-2">
                  <div class="flex justify-center relative group">
                    <span v-if="!isMeetingOngoing(meeting)" class="w-8 h-8 relative">
                      <img src="@/assets/img/cal16.gif" alt="Upcoming" class="w-full h-full" />

                      <div class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                         bg-blue-600 text-white text-xs sm:text-sm font-medium 
                         px-2.5 py-1 rounded-md shadow-md 
                         opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 
                         transition-all duration-200 ease-out z-10 whitespace-nowrap">
                        📅 Meeting will be held in {{ daysUntil(meeting.date) }} days

                        <!-- Tooltip Arrow -->
                        <div class="absolute top-full left-1/2 transform -translate-x-1/2 
                           w-2.5 h-2.5 bg-blue-600 rotate-45"></div>
                      </div>
                    </span>
                  </div>
                </td>
                <td class="p-1">
                  <button class="w-full sm:w-auto px-3 py-1 text-white bg-gray-600 hover:bg-gray-800 rounded"
                    @click="toggleMinutes(index)">Minutes</button>
                </td>
              </tr>

              <tr v-show="expandedIndex === index" :class="theme9">
                <td colspan="12" class="p-3 sm:p-5 bg-gray-50 rounded-b-lg">
                  <MeetingDetails v-if="showMinutesIndex !== index" :meeting-id="meeting.id" :meeting="meeting"
                    :hosts="hosts" :clients="clients" :projects="projects" :locations="locations"     :otherParticipants="meeting.OtherParticipants"

                    @submitted="fetchMeetings" :PreviousParticipants="meeting.participants" />
                  <MeetingMinute v-if="showMinutesIndex === index" :meeting-id="meeting.id" :meeting="meeting" />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Floating Add Button -->
      <FloatingAddButton :route="'/meeting/schedule/form'" />

      <!-- Pagination -->
      <Pagination :currentPage="currentPage" :totalPages="totalPages || 1" @page-change="changePage" />
    </div>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Main/Breadcrumbs.vue";
import Loader from "@/components/Main/Loader.vue";
import axios from "axios";
import MeetingDetails from "@/components/Pages/Schedule/MeetingDetails.vue";
import MeetingMinute from "@/components/Pages/Schedule/MeetingMinute.vue";
import Pagination from "@/components/Pages/Schedule/Pagination.vue";
import FloatingAddButton from "@/components/Main/Floating/FloatingAddButton.vue";
import apiEndpoints from "@/config/apiConfig";

export default {
  components: {
    MeetingDetails,
    Pagination,
    Loader,
    Breadcrumb,
    MeetingMinute,
    FloatingAddButton,
  },
  data() {
    return {
      breadcrumbs: [
        { label: "Home", clickable: true, onClick: () => this.$router.push("/dashboard") },
        { label: "Schedule", clickable: false },
        { label: "Meeting", clickable: false },
      ],
      loading: false,
      showMinutesIndex: null,
      expandedIndex: null,
      searchQueries: {
        title: "",
        client: "",
        project: "",
        room: "",
        date: "",
        time: "",
      },
      locations: "",
      loggedInPerson: "",
      clients: [],
      themeText: "",
      projects: [],
      participants: [],
      hosts: [],
      meetings: [],
      currentPage: 1,
      itemsPerPage: 8,
    };
  },
  computed: {
    buttonPositionClass() {
      return this.$store.state.sidebarPosition;
    },
    theme5() { return "bg-gray-500 text-gray-100"; },
    theme6() { return this.$store.state.theme === "dark" ? "bg-gray-600 text-gray-50" : "bg-gray-400 text-gray-900"; },
    theme7() { return this.$store.state.theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-300 text-gray-700"; },
    theme8() { return this.$store.state.theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-700"; },
    theme9() { return this.$store.state.theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"; },
    searchFields() {
      return {
        title: "Search Title",
        client: "Search Client",
        project: "Search Project",
        room: "Search Room",
        date: "Search Date",
        time: "Search Time"
      };
    },
    filteredMeetings() {
      return this.meetings.filter(meeting => {
        const dateStr = new Date(meeting.date).toLocaleDateString('en-CA');

        return (
          (meeting.title && meeting.title.toLowerCase().includes(this.searchQueries.title ? this.searchQueries.title.toLowerCase() : "")) &&
          (meeting.project_name && meeting.project_name.toLowerCase().includes(this.searchQueries.project ? this.searchQueries.project.toLowerCase() : "")) &&
          (meeting.location_name && meeting.location_name.toLowerCase().includes(this.searchQueries.room ? this.searchQueries.room.toLowerCase() : "")) &&
          (meeting.client_name && meeting.client_name.toLowerCase().includes(this.searchQueries.client ? this.searchQueries.client.toLowerCase() : "")) &&
          (meeting.start_time && meeting.start_time.toLowerCase().includes(this.searchQueries.time ? this.searchQueries.time.toLowerCase() : "")) &&
          (dateStr && dateStr.includes(this.searchQueries.date ? this.searchQueries.date : ""))
        );
      });
    },
    paginatedMeetings() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredMeetings.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredMeetings.length / this.itemsPerPage);
    },
  },
  mounted() {
    this.fetchAllData();
    this.loggedInPerson = localStorage.getItem("user_id");
    this.fetchMeetings();
  },
  methods: {
    isMeetingOngoing(meeting) {
      const now = new Date();
      const [y, m, d] = meeting.date.split("-");
      const toTime = time => {
        const [h, min, s] = time.split(":").map(Number);
        return new Date(y, m - 1, d, h, min, s);
      };
      return now >= toTime(meeting.start_time) && now <= toTime(meeting.end_time);
    },
    getRowClass(index) {
      const meeting = this.paginatedMeetings[index];
      const isOngoing = this.isMeetingOngoing(meeting);
      return isOngoing
        ? "border-b border-gray-200 text-white bg-gradient-to-l from-blue-200 via-gray-600 to-blue-100 bg-[length:200%_100%] animate-sweep transition-all duration-300 shadow-[0_0_12px_2px_rgba(59,130,246,0.5)]"
        : "border-b border-gray-200 bg-white text-gray-800 transition-all duration-300 shadow-md hover:bg-gray-100 hover:shadow-blue-400/50 hover:text-blue-700";
    },
    toggleMinutes(index) {
      this.showMinutesIndex = this.showMinutesIndex === index ? null : index;
      this.expandedIndex = index;
    },
    toggleDetails(index) {
      this.expandedIndex = this.expandedIndex === index ? null : index;
      if (this.expandedIndex !== index) {
        this.showMinutesIndex = null;
      }
    },
    async fetchAllData() {
      try {
        this.loading = true;
        const token = localStorage.getItem("token");
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
      } finally {
        this.loading = false;
      }
    },
    daysUntil(date) {
      const today = new Date();
      const meetingDate = new Date(date);
      const diffTime = meetingDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },
fetchMeetings() {
  this.loading = true;

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("user_id");

  axios.get(apiEndpoints.meetings, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(response => {
    const allMeetings = response.data.data;

// In the fetchMeetings method:
this.meetings = allMeetings
  .filter(meeting => {
    const isAdmin = String(meeting.admin_id) === currentUserId;
    const participants = Array.isArray(meeting.participants) ? meeting.participants : [];  // Ensure participants is an array
    const isParticipant = participants.some(
      participant => String(participant.user_id) === currentUserId
    );
    return isAdmin || isParticipant;
  })
  .map(meeting => ({
    ...meeting,
    participants: (Array.isArray(meeting.participants) ? meeting.participants : [])
      .filter(p => p.user_id !== null)
      .map(p => ({
        user_id: p.user_id,
        attendance_status: p.attendance_status,
        remarks: p.remarks
      })),
    otherParticipants: (Array.isArray(meeting.participants) ? meeting.participants : [])
      .filter(p => p.user_id === null)
      .map(p => ({
        id: p.id,
        other_participant_name: p.other_participant_name
      }))
  }));

  })
  .catch(error => {
    console.error("Error fetching meetings:", error);
  })
  .finally(() => {
    this.loading = false;
  });
}
,
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) this.currentPage = page;
    },
  },
};
</script>
<style>
.input-field {
  @apply px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-400;
}

.scrollbar-hidden {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
</style>
