<template>
  <div :class="theme8" class="min-h-screen p-6 transition-all duration-300 ease-in-out">
    <div :class="theme61" class="max-w-7xl mx-auto rounded-lg shadow-lg p-8">
      <Breadcrumb :items="breadcrumbs" :align="buttonPositionClass" :themeText="themeText" />

      <!-- Loading Spinner -->
      <div class="text-center mt-10" v-if="loading">
        <svg class="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p class="mt-2 text-blue-600 font-medium">Loading meetings...</p>
      </div>

      <h2 :class="themeText" class="text-3xl font-extrabold mb-8 text-gray-900 border-b border-gray-300 pb-3">Meeting Report</h2>

      <!-- Filters -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10 items-end">
        <div>
          <label  :class="themeText"for="" class="block text-gray-700 font-semibold mb-1">From Date</label>
          <input v-model="filters.from_date" type="date" :class="['input-field', themeInputText]" v-auto-date
            placeholder="From Date" />
        </div>
        <div>
          <label  :class="themeText"  for="" class="block text-gray-700 font-semibold mb-1">To Date</label>
          <input v-model="filters.to_date" type="date" :class="['input-field', themeInputText]" v-auto-date
            placeholder="To Date" />
        </div>
        <div>
          <label  :class="themeText"class="block text-gray-700 font-semibold mb-1">Client</label>
          <multiselect v-model="filters.client_id" :options="clients" :track-by="'id'" :label="'name'"
            placeholder="Select Client" :searchable="true" :allow-empty="true" class="multiselect-custom" />
        </div>
        <div>
          <label  :class="themeText"class="block text-gray-700 font-semibold mb-1">Project</label>
          <multiselect v-model="filters.project_id" :options="projects" :track-by="'id'" :label="'name'"
            placeholder="Select Project" :searchable="true" :allow-empty="true" class="multiselect-custom" />
        </div>
        <div>
          <label  :class="themeText"class="block text-gray-700 font-semibold mb-1">Location</label>
          <multiselect v-model="filters.location_id" :options="locations" :track-by="'id'" :label="'name'"
            placeholder="Select Location" :searchable="true" :allow-empty="true" class="multiselect-custom" />
        </div>
        <div>
          <label  :class="themeText"class="block text-gray-700 font-semibold mb-1">Participant</label>
          <multiselect v-model="filters.participant_id" :options="participants" :track-by="'id'" :label="'name'"
            placeholder="Select Participant" :searchable="true" :allow-empty="true" class="multiselect-custom" />
        </div>
        <div>
          <label  :class="themeText"class="block text-gray-700 font-semibold mb-1">Department</label>
          <multiselect v-model="filters.department_id" :options="departments" :track-by="'id'" :label="'name'"
            placeholder="Select Department" :searchable="true" :allow-empty="true" class="multiselect-custom" />
        </div>
        <div>
          <button @click="fetchMeetings" :disabled="!canSearch || loading"
            class="btn-primary w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
            <span v-if="loading">Loading...</span>
            <span v-else>🔍 Search</span>
          </button>
        </div>
        <div class="col-span-full flex justify-center mt-2">
          <button v-if="meetings.length > 0" @click="printResults" :disabled="loading"
            class="btn-primary bg-green-600 hover:bg-green-700 px-6">
            🖨️ Print Results
          </button>
        </div>
      </div>
    </div>

    <!-- Meeting Table -->
   <div :class="theme61" class="max-w-7xl mx-auto overflow-x-auto mt-10 shadow-lg rounded-xl" v-if="!selectedMeeting">
  <table class="min-w-full text-sm text-left border-collapse">
    <!-- Table Header -->
    <thead class="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
      <tr>
        <th class="table-header px-4 py-3 border-b">Title</th>
        <th class="table-header px-4 py-3 border-b">Client</th>
        <th class="table-header px-4 py-3 border-b">Project</th>
        <th class="table-header px-4 py-3 border-b">Location</th>
        <th class="table-header px-4 py-3 border-b">Date</th>
        <th class="table-header px-4 py-3 border-b">Participants</th>
        <th class="table-header px-4 py-3 border-b print-hidden">Actions</th>
      </tr>
    </thead>

    <!-- Table Body (With Data) -->
    <tbody v-if="meetings.length > 0" :class="theme7">
      <tr v-for="(meeting, index) in meetings" :key="meeting.id" :class="getRowClass(index)">
        <td :class="themeText" class="table-cell px-4 py-3 border-t">{{ meeting.title }}</td>
        <td class="table-cell px-4 py-3 border-t">{{ meeting.client_name || '-' }}</td>
        <td class="table-cell px-4 py-3 border-t">{{ meeting.project_name || '-' }}</td>
        <td class="table-cell px-4 py-3 border-t">{{ meeting.location_name || '-' }}</td>
        <td class="table-cell px-4 py-3 border-t">{{ meeting.date }}</td>
        <td class="table-cell px-4 py-3 border-t max-w-xs">
          <ul class="list-disc pl-5 max-h-24 overflow-auto">
            <li v-for="p in meeting.participants" :key="p.id">{{ p.user_name }}</li>
          </ul>
        </td>
        <td class="table-cell px-4 py-3 border-t print-hidden">
          <router-link :to="`/meeting-report/${meeting.id}`" class="text-blue-600 underline hover:text-blue-800">
            View Report
          </router-link>
        </td>
      </tr>
    </tbody>

    <!-- Table Body (No Data) -->
    <tbody v-else>
      <tr>
        <td colspan="7" class="py-12 text-center text-gray-500">
          <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" stroke-width="1.5"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 6v6h4m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          No meetings found.
        </td>
      </tr>
    </tbody>
  </table>
</div>

  </div>
</template>

<script>
import Breadcrumb from "@/components/Main/Breadcrumbs.vue";
import apiEndpoints from "@/config/apiConfig";
import useTheme from "@/components/js/ThemeSetting";
import { useToast } from "vue-toastification";
import Multiselect from "vue-multiselect";

export default {
  components: { Breadcrumb, Multiselect },

  setup() {
    const {
      theme6, theme7, theme8, theme61,
      themeText, themeInputText
    } = useTheme();
    const toast = useToast();

    return {
      theme6, theme7, theme8, theme61,
      themeText, themeInputText,
      toast
    };
  },

  data() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    return {
      meetings: [],
      clients: [],
      projects: [],
      locations: [],
      participants: [],
      departments: [],
      filters: {
        from_date: firstDay.toISOString().substr(0, 10),
        to_date: today.toISOString().substr(0, 10),
        client_id: "",
        project_id: "",
        location_id: "",
        participant_id: "",
        department_id: "",
      },
      loading: false,
      breadcrumbs: [],
      buttonPositionClass: "left",
      selectedMeeting: null,
    };
  },

  computed: {
    canSearch() {
      // Return true if any filter has a non-empty value
      return Object.values(this.filters).some(val => val !== "");
    }
  },

  methods: {
    getRowClass(index) {
      return index % 2 === 0 ? this.theme6 : this.theme7;
    },

    async fetchAllData() {
      try {
        const token = sessionStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [userRes, clientRes, projectRes, locationRes, deptRes] = await Promise.all([
          fetch(apiEndpoints.chatUsers, { headers }),
          fetch(apiEndpoints.clients, { headers }),
          fetch(apiEndpoints.projects, { headers }),
          fetch(apiEndpoints.meetingLocations, { headers }),
          fetch(apiEndpoints.departments, { headers }),
        ]);

        const [userData, clientData, projectData, locationData, deptData] = await Promise.all([
          userRes.json(),
          clientRes.json(),
          projectRes.json(),
          locationRes.json(),
          deptRes.json()
        ]);

        this.participants = Array.isArray(userData?.users) ? userData.users : [];
        this.clients = Array.isArray(clientData?.data) ? clientData.data : [];
        this.projects = Array.isArray(projectData?.data) ? projectData.data : [];
        this.locations = Array.isArray(locationData?.data) ? locationData.data : [];
        this.departments = Array.isArray(deptData?.data) ? deptData.data : [];
      } catch (error) {
        console.error("Error loading filter data:", error);
        this.toast.error("Failed to load filter data.");
        // Reset to empty arrays on error
        this.participants = [];
        this.clients = [];
        this.projects = [];
        this.locations = [];
        this.departments = [];
      }
    },
    async fetchMeetings() {
      if (!this.canSearch) {
        this.toast.warning("Please select at least one filter before searching.");
        return;
      }

      this.loading = true;
      try {
        const token = sessionStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        // Build request body:
        const body = {};

        // For dates, just add if not empty
        if (this.filters.from_date) body.from_date = this.filters.from_date;
        if (this.filters.to_date) body.to_date = this.filters.to_date;

        // For each ID filter, add only if selected and pass the integer ID
        if (this.filters.client_id && typeof this.filters.client_id === 'object' && this.filters.client_id.id) {
          body.client_id = this.filters.client_id.id;
        }

        if (this.filters.project_id && typeof this.filters.project_id === 'object' && this.filters.project_id.id) {
          body.project_id = this.filters.project_id.id;
        }

        if (this.filters.location_id && typeof this.filters.location_id === 'object' && this.filters.location_id.id) {
          body.location_id = this.filters.location_id.id;
        }

        if (this.filters.participant_id && typeof this.filters.participant_id === 'object' && this.filters.participant_id.id) {
          body.participant_id = this.filters.participant_id.id;
        }

        if (this.filters.department_id && typeof this.filters.department_id === 'object' && this.filters.department_id.id) {
          body.department_id = this.filters.department_id.id;
        }

        const res = await fetch(apiEndpoints.meetingReport, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("Network response was not ok");

        const data = await res.json();
        this.meetings = Array.isArray(data?.data) ? data.data : [];
      } catch (error) {
        console.error("Fetch meetings error:", error);
        this.toast.error("Unable to fetch meetings.");
        this.meetings = [];
      } finally {
        this.loading = false;
      }
    }
    ,

    printResults() {
      const table = document.querySelector("table");
      if (!table) return;

      const win = window.open("", "", "width=1000,height=700");
      win.document.write(`
        <html><head><title>Meeting Report</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px;
            color: #333;
          }
          h2 {
            text-align: center;
            margin-bottom: 20px;
            font-size: 24px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 8px 12px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          ul {
            margin: 0;
            padding-left: 20px;
          }
          .print-hidden {
            display: none !important;
          }
        </style>
        </head><body>
      `);
      win.document.write("<h2>Meeting Report</h2>");
      win.document.write(table.outerHTML);
      win.document.write("</body></html>");
      win.document.close();
      win.focus();
      win.print();
    }
  },

  mounted() {
    this.fetchAllData();
  }
};
</script>

<style scoped>
.multiselect-custom {
  width: 100%;
  font-size: 14px;
}

.input-field {
  @apply w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm;
}

.btn-primary {
  @apply inline-flex items-center justify-center px-6 py-2 font-semibold text-sm tracking-wide text-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200;
}

.table-header {
  @apply px-6 py-3 text-sm font-semibold text-gray-700 uppercase bg-gray-50 border-b border-gray-200;
}

.table-cell {
  @apply px-6 py-4 border-b border-gray-100 text-sm text-gray-800;
}
</style>
