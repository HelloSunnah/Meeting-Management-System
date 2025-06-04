<template>
  <div :class="theme8" class="min-h-screen p-2 sm:p-4 transition-all duration-300 ease-in-out">
    <div :class="theme9" class="w-full rounded-lg shadow-xl p-3 sm:p-4">
      <Breadcrumb :items="breadcrumbs" :align="buttonPositionClass" :themeText="themeText" />
      <Loader v-if="loading" />

      <div class="w-full overflow-x-auto">
        <table :class="theme6" class="min-w-full table-auto rounded-lg shadow text-sm">
          <thead :class="theme5" class="text-gray-700 bg-gray-100">
            <tr class="text-left text-xs sm:text-sm font-semibold uppercase">
              <th class="p-2 w-10"></th>
              <th v-for="(placeholder, key) in searchFields" :key="key" class="p-2 text-start">
                <input v-model="searchQueries[key]" :placeholder="placeholder" class="input-field w-full sm:w-auto" />
              </th>
              <th class="p-2 w-20">Actions</th>
            </tr>
          </thead>
          <tbody :class="theme7">
            <template v-for="(client, index) in paginatedClients" :key="client.id">
              <tr :class="getRowClass(index)">
                <td class="p-2">
                  <span @click="toggleDetails(index)"
                    class="cursor-pointer w-6 h-6 flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow">
                    <span class="text-base font-bold">{{ expandedIndex === index ? "×" : "+" }}</span>
                  </span>
                </td>
                <td class="p-2">{{ client.name }}</td>
                <td class="p-2">{{ client.abbreviation }}</td>
                <td class="p-2">{{ client.mobile }}</td>
                <td class="p-2">{{ client.company_name }}</td>
                <td class="p-2">
                  <button @click="deleteClient(client.id)"
                    class="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded">
                    Delete
                  </button>
                </td>
              </tr>
              <!-- Expanded client details for editing -->
              <tr v-show="expandedIndex === index" :class="theme9">
                <td colspan="6" class="p-8 bg-gray-50 rounded-b-lg">
                  <ClientEdit v-if="expandedIndex === index" :client-id="client.id" :client="client"
                    @updated="fetchClients" />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <FloatingAddButton :route="'/setup/client/form'" />
      <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
    </div>
  </div>
    <DeleteConfirmationModal ref="deleteConfirmationModal" />

</template>
<script>
import ClientEdit from "@/components/Pages/Client/ClientEdit.vue";
import Breadcrumb from "@/components/Main/Breadcrumbs.vue";
import Loader from "@/components/Main/Loader.vue";
import Pagination from "@/components/Pages/Schedule/Pagination.vue";
import FloatingAddButton from "@/components/Main/Floating/FloatingAddButton.vue";
import axios from "axios";
import apiEndpoints from "@/config/apiConfig";
import DeleteConfirmationModal from "@/components/Modals/ConfirmationModal.vue";

export default {
  components: {
    ClientEdit,DeleteConfirmationModal,
    Pagination,
    Loader,
    Breadcrumb,
    FloatingAddButton,
  },
  data() {
    return {
      themeText: "",
      breadcrumbs: [
        { label: "Home", clickable: true, onClick: () => this.$router.push("/dashboard") },
        { label: "Client", clickable: false },
        { label: "List", clickable: false },
      ],
      searchQueries: {
        name: "",
        abbreviation: "",
        mobile: "",
        company_name: ""
      },
      clients: [],
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
    theme5() { return "bg-gray-500 text-gray-100"; },
    theme6() { return this.$store.state.theme === "dark" ? "bg-gray-600 text-gray-50" : "bg-gray-400 text-gray-900"; },
    theme7() { return this.$store.state.theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-300 text-gray-700"; },
    theme8() { return this.$store.state.theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-700"; },
    theme9() { return this.$store.state.theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"; },
    searchFields() {
      return {
        name: "Search Name",
        abbreviation: "Search Abbr",
        mobile: "Search Mobile",
        company_name: "Search Company",
      };
    },
    filteredClients() {
      return this.clients.filter(client => {
        return (
          (!this.searchQueries.name || (client.name ?? "").toLowerCase().includes(this.searchQueries.name.toLowerCase())) &&
          (!this.searchQueries.abbreviation || (client.abbreviation ?? "").toLowerCase().includes(this.searchQueries.abbreviation.toLowerCase())) &&
          (!this.searchQueries.mobile || (client.mobile ?? "").includes(this.searchQueries.mobile)) &&
          (!this.searchQueries.company_name || (client.company_name ?? "").toLowerCase().includes(this.searchQueries.company_name.toLowerCase()))
        );
      });
    },
    paginatedClients() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredClients.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredClients.length / this.itemsPerPage);
    },
  },
  mounted() {
    this.fetchClients();
  },
  methods: {
    toggleDetails(index) {
      this.expandedIndex = this.expandedIndex === index ? null : index;
    },
    fetchClients() {
      this.loading = true;
      const token = localStorage.getItem("token");

      axios.get(apiEndpoints.clients, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          this.clients = response.data.data;
        })
        .catch(error => {
          console.error("Error fetching Clients:", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
    confirmDeleteClient(clientId) {
        const token = localStorage.getItem("token");

        axios.delete(apiEndpoints.ClientChange(clientId), {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(() => {
            this.fetchClients();
          })
          .catch(error => {
            console.error("Error deleting client:", error);
          });
      
    },
    deleteClient(clientId) {
      this.$refs.deleteConfirmationModal.show(
        "Delete Project",
        "Are you sure you want to delete this project?",
        () => this.confirmDeleteClient(clientId)
      );
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) this.currentPage = page;
    },
    getRowClass(index) {
      return index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100';
    },
  },
};
</script>