<template>
  <div :class="theme8" class="min-h-screen p-2 sm:p-4 transition-all duration-300 ease-in-out">
    <div :class="theme9" class="w-full rounded-lg shadow-xl p-3 sm:p-4 mt-6">
      <Breadcrumb :items="breadcrumbs" :align="buttonPositionClass" :themeText="themeText" />
      <Loader v-if="loading" />

      <div class="w-full overflow-x-auto">
        <table :class="theme6" class="min-w-full table-auto rounded-lg shadow text-sm">
          <thead :class="theme5" class="text-gray-700 bg-gray-100">
            <tr class="text-left text-xs sm:text-sm font-semibold uppercase">
              <th class="p-2 text-start w-10"></th>
              <th v-for="(placeholder, key) in searchFields" :key="key" class="p-2 text-start">
                <input v-model="searchQueries[key]" :placeholder="placeholder" class="input-field w-full sm:w-auto" />
              </th>
              <th class="p-2">Status</th>
              <th class="p-2">Actions</th>
            </tr>
          </thead>
          <tbody :class="theme7">
            <template v-for="(pollOption, index) in paginatedPollOptions" :key="pollOption.id">
              <tr :class="getRowClass(index)">
                <td class="p-2">
                  <!-- <span @click="toggleDetails(index)"
                    class="cursor-pointer w-6 h-6 flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow">
                    <span class="text-base font-bold">{{ expandedIndex === index ? "×" : "+" }}</span>
                  </span> -->
                </td>
                <td class="p-2">{{ pollOption.name }}</td>
                <td class="p-2">
                  <span :class="[
                    pollOption.status == '1'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700',
                    'text-xs font-semibold px-3 py-1 rounded-full inline-block'
                  ]">
                    {{ pollOption.status == '1' ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="p-2">
                  <button @click="deletePollOption(pollOption.id)"
                    class="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded">
                    Delete
                  </button>
                </td>
              </tr>

              <!-- Expanded Poll Option details for editing -->
              <tr v-show="expandedIndex === index" :class="theme9">
                <td colspan="4" :class="theme6" class="p-8 bg-gray-50 rounded-b-lg">
                  <PollOptionEdit v-if="expandedIndex === index" :poll-option-id="pollOption.id"
                    :poll-option="pollOption" @updated="fetchPollOptions" />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <FloatingAddButton :route="'/setup/pollOption/form'" />
      <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
    </div>
  </div>
  <DeleteConfirmationModal ref="deleteConfirmationModal" />

</template>

<script>
import PollOptionEdit from "@/components/Pages/Polling/PollOptionEdit.vue"; // Adjust path as needed
import Breadcrumb from "@/components/Main/Breadcrumbs.vue";
import Loader from "@/components/Main/Loader.vue";
import Pagination from "@/components/Pages/Schedule/Pagination.vue";
import FloatingAddButton from "@/components/Main/Floating/FloatingAddButton.vue";
import axios from "axios";
import apiEndpoints from "@/config/apiConfig";
import DeleteConfirmationModal from "@/components/Modals/ConfirmationModal.vue";
import useTheme from '@/components/js/ThemeSetting';
import { useToast } from "vue-toastification";
export default {
  components: {
    DeleteConfirmationModal,
    PollOptionEdit,
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
    return {
      themeText: "",
      breadcrumbs: [
        { label: "Home", clickable: true, onClick: () => this.$router.push("/dashboard") },
        { label: "Poll Options", clickable: false },
      ],
      searchQueries: {
        name: "",
      },
      pollOptions: [],
      loading: false,
      expandedIndex: null,
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    buttonPositionClass() {
      return this.$store.state.sidebarPosition;
    },
    searchFields() {
      return {
        name: "Search Name",
      };
    },
    filteredPollOptions() {
      return this.pollOptions.filter(option => {
        return !this.searchQueries.name || (option.name ?? "").toLowerCase().includes(this.searchQueries.name.toLowerCase());
      });
    },
    paginatedPollOptions() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredPollOptions.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredPollOptions.length / this.itemsPerPage);
    },
  },
  mounted() {
    this.fetchPollOptions();
  },
  methods: {
    toggleDetails(index) {
      this.expandedIndex = this.expandedIndex === index ? null : index;
    },
    fetchPollOptions() {
      this.loading = true;
      const token = sessionStorage.getItem("token");
      axios
        .get(apiEndpoints.pollOptions, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          this.pollOptions = response.data.data || [];
        })
        .catch(error => {
          console.error("Error fetching Poll Options:", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    confirmDeletePollOption(id) {
      const token = sessionStorage.getItem("token");
      axios
        .delete(apiEndpoints.deletePollOption(id), {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          this.fetchPollOptions(); // Refresh the poll options list after successful deletion
          this.toast.success('Poll option Deleted successfully!');
          s
        })
        .catch(error => {
          console.error("Error deleting Poll Option:", error);
        });

    },


    deletePollOption(id) {
      this.$refs.deleteConfirmationModal.show(
        "Delete Poll Option",
        "Are you sure you want to delete this Poll Option?",
        () => this.confirmDeletePollOption(id)
      );
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) this.currentPage = page;
    },
    getRowClass(index) {
      return index % 2 === 0 ? this.theme9 : this.theme8;
    },
  },
};
</script>
<style scoped>
.input-field {
  @apply px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-400;
}
</style>
