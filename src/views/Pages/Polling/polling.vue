<template>
  <div :class="theme8" class="min-h-screen p-2 sm:p-4 transition-all duration-300 ease-in-out">
    <div :class="theme9" class="w-full rounded-lg shadow-xl p-3 sm:p-4 mt-6">
      <Breadcrumb :items="breadcrumbs" :align="buttonPositionClass" :themeText="themeText" />

      <Loader v-if="loading" />

      <div class="w-full overflow-x-auto">
        <table :class="theme6" class="min-w-full table-auto rounded-lg shadow text-sm">
          <thead :class="theme5" class="text-gray-700 bg-gray-100">
            <!-- Header Row -->

            <!-- Filter Row -->
            <tr class="text-left text-xs sm:text-sm">
              <th class="p-2"></th>
              <th class="p-2">
                <input v-model="searchFilters.title" placeholder="Search"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none" />
              </th>
              <th class="p-2">
                <input v-model="searchFilters.start_time" placeholder="Search"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none" />
              </th>
              <th class="p-2">
                <input v-model="searchFilters.end_time" placeholder="Search"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none" />
              </th>
              <th class="p-2">
                <input v-model="searchFilters.status" placeholder="Active / Inactive"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none" />
              </th>
              <th class="p-2 w-20">Actions</th>
            </tr>
          </thead>

          <tbody :class="theme7">
            <template v-for="(poll, index) in paginatedPolls" :key="poll.id">
              <tr :class="getRowClass(index)">
                <td class="p-2">
                  <button @click="toggleDetails(index)"
                    class="cursor-pointer w-6 h-6 flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow">
                    <span class="text-base font-bold">{{ expandedIndex === index ? "×" : "+" }}</span>
                  </button>
                </td>
                <td class="p-2 align-top">{{ poll.title || "-" }}</td>
                <td class="p-2 align-top">{{ formatDateTime(poll.start_time) }}</td>
                <td class="p-2 align-top">{{ formatDateTime(poll.end_time) }}</td>
                <td class="p-2">
                  <span :class="[
                    poll.status === 1
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700',
                    'text-xs font-semibold px-3 py-1 rounded-full inline-block'
                  ]">
                    {{ poll.status === 1 ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="p-2">
                  <button @click="deletePoll(poll.id)"
                    class="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded">
                    Delete
                  </button>
                </td>
              </tr>

              <!-- Expanded Edit Section -->
              <tr v-show="expandedIndex === index" :class="theme9">
                <td colspan="6" class="p-8 rounded-b-lg">
                  <PollEdit :poll-id="poll.id" @submitted="fetchPolls" />
                </td>
              </tr>
            </template>

            <tr v-if="paginatedPolls.length === 0">
              <td colspan="6" class="p-4 text-center text-gray-500">No polls found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
    </div>

    <FloatingAddButton v-if="canCreatePolling" :route="'/polling/form'" />
    <DeleteConfirmationModal ref="deleteConfirmationModal" />
  </div>
</template>

<script>
import axios from "axios";
import apiEndpoints from "@/config/apiConfig";
import PollEdit from "@/components/Pages/Polling/PollEdit.vue";
import Breadcrumb from "@/components/Main/Breadcrumbs.vue";
import Loader from "@/components/Main/Loader.vue";
import Pagination from "@/components/Pages/Schedule/Pagination.vue";
import FloatingAddButton from "@/components/Main/Floating/FloatingAddButton.vue";
import DeleteConfirmationModal from "@/components/Modals/ConfirmationModal.vue";
import useTheme from "@/components/js/ThemeSetting";
import { useToast } from "vue-toastification";

export default {
  components: {
    PollEdit,
    DeleteConfirmationModal,
    Pagination,
    Loader,
    Breadcrumb,
    FloatingAddButton,
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
      theme7,
      theme8,
      theme9,
      themeText,
      toast,
    };
  },

  data() {
    return {canCreatePolling: false, // permission flag
      searchFilters: {
        title: "",
        start_time: "",
        end_time: "",
        status: "", 

      },
      breadcrumbs: [
        { label: "Home", clickable: true, onClick: () => this.$router.push("/dashboard") },
        { label: "Polling", clickable: false },
      ],
      polls: [],
      loading: false,
      expandedIndex: null,
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  watch: {
    searchFilters: {
      handler() {
        this.currentPage = 1;
      },
      deep: true,
    },
  },

  computed: {
    filteredPolls() {
      const { title, start_time, end_time, status } = this.searchFilters;

      return this.polls.filter((poll) => {
        const titleMatch = (poll.title || "").toLowerCase().includes(title.toLowerCase());
        const startTimeMatch = this.formatDateTime(poll.start_time).toLowerCase().includes(start_time.toLowerCase());
        const endTimeMatch = this.formatDateTime(poll.end_time).toLowerCase().includes(end_time.toLowerCase());
        const statusText = poll.status === 1 ? "active" : "inactive";
        const statusMatch = statusText.includes(status.toLowerCase());

        return titleMatch && startTimeMatch && endTimeMatch && statusMatch;
      });
    },

    buttonPositionClass() {
      return this.$store.state.sidebarPosition;
    },

    paginatedPolls() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredPolls.slice(start, start + this.itemsPerPage);
    },

    totalPages() {
      return Math.ceil(this.filteredPolls.length / this.itemsPerPage);
    }
  },

  mounted() {
    this.fetchPolls(); 
    const permission = sessionStorage.getItem("polling_create_per");
    this.canCreatePolling = permission === "1"; // true if user has permission
  },

  methods: {
    toggleDetails(index) {
      this.expandedIndex = this.expandedIndex === index ? null : index;
    },

    fetchPolls() {
      this.loading = true;
      const token = sessionStorage.getItem("token");

      axios
        .get(apiEndpoints.pollings, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.polls = response.data.data || [];
        })
        .catch((error) => {
          console.error("Error fetching polls:", error);
          this.toast.error("Failed to fetch polls");
        })
        .finally(() => {
          this.loading = false;
        });
    },

    deletePoll(pollId) {
      this.$refs.deleteConfirmationModal.show(
        "Delete Poll",
        "Are you sure you want to delete this poll?",
        () => this.confirmDeletePoll(pollId)
      );
    },

    confirmDeletePoll(pollId) {
      const token = sessionStorage.getItem("token");

      axios
        .delete(`${apiEndpoints.pollings}/${pollId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          this.toast.success("Poll deleted successfully");
          this.fetchPolls();
        })
        .catch((error) => {
          console.error("Error deleting poll:", error);
          this.toast.error("Failed to delete poll");
        });
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    getRowClass(index) {
      return index % 2 === 0 ? this.theme9 : this.theme8;
    },

    formatDateTime(datetime) {
      if (!datetime) return "-";
      const date = new Date(datetime);
      return date.toLocaleString(); // Adjust formatting as needed
    },
  },
};
</script>

<style scoped>
.input-field {
  @apply px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-400;
}
</style>
