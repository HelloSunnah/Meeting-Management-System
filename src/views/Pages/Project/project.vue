<template>
  <div :class="theme8" class="min-h-screen p-2 sm:p-4 transition-all duration-300 ease-in-out">
    <div :class="theme9" class="w-full rounded-lg shadow-xl p-3 sm:p-4">

      <!-- Breadcrumbs -->
      <Breadcrumb :items="breadcrumbs" :align="buttonPositionClass" :themeText="themeText" />
      <Loader v-if="loading" />

      <!-- Table -->
      <div class="w-full overflow-x-auto">
        <table :class="theme6" class="min-w-full table-auto rounded-lg shadow text-sm">
          <thead :class="theme5" class="text-gray-700 bg-gray-100">
            <tr class="text-left text-xs sm:text-sm font-semibold uppercase">
              <th class="p-2 text-start w-10"></th>
              <th v-for="(placeholder, key) in searchFields" :key="key" class="p-2 text-start">
                <input v-model="searchQueries[key]" :placeholder="placeholder" class="input-field w-full sm:w-auto" />
              </th>
              <th class="p-2">Actions</th>
            </tr>
          </thead>

          <tbody :class="theme7">
            <template v-for="(project, index) in paginatedProjects" :key="project.id">
              <tr :class="getRowClass(index)">
                <td class="p-2 text-start">
                  <span @click="toggleDetails(index)"
                    class="cursor-pointer w-6 h-6 flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow">
                    <span class="text-base font-bold">{{ expandedIndex === index ? "×" : "+" }}</span>
                  </span>
                </td>
                <td class="p-2">{{ project.name }}</td>
                <td class="p-2">{{ project.owner_name }}</td>
                <td class="p-2">{{ project.client_name }}</td>
                <td class="p-2">{{ project.start_time }}</td>
                <td class="p-2">{{ project.end_time }}</td>
                <td class="p-2">
                  <button @click="deleteProject(project.id)"
                    class="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded">
                    Delete
                  </button>
                </td>
              </tr>

              <tr v-show="expandedIndex === index" :class="theme9">
                <td colspan="7" class="p-8 bg-gray-50 rounded-b-lg">
                  <ProjectEdit v-if="expandedIndex === index" :project-id="project.id" :project="project"
                    @updated="fetchProjects" />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Floating Add Button -->
      <FloatingAddButton :route="'/setup/project/form'" />

      <!-- Pagination -->
      <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <DeleteConfirmationModal ref="deleteConfirmationModal" />
</template>

<script>
import axios from "axios";
import ProjectEdit from "@/components/Pages/Project/ProjectEdit.vue";
import apiEndpoints from "@/config/apiConfig";
import Breadcrumb from "@/components/Main/Breadcrumbs.vue";
import Loader from "@/components/Main/Loader.vue";
import FloatingAddButton from "@/components/Main/Floating/FloatingAddButton.vue";
import Pagination from "@/components/Pages/Schedule/Pagination.vue";
import DeleteConfirmationModal from "@/components/Modals/ConfirmationModal.vue";

export default {
  components: {
    Breadcrumb,
    Loader,
    Pagination,
    ProjectEdit,
    FloatingAddButton,
    DeleteConfirmationModal,  // Register the modal component
  },
  data() {
    return {
      themeText: "",
      breadcrumbs: [
        { label: "Home", clickable: true, onClick: () => this.$router.push("/dashboard") },
        { label: "Projects", clickable: false }
      ],
      searchQueries: {
        name: "",
        owner_name: "",
        client_name: "",
        start_time: "",
        end_time: "",
      },
      projects: [],
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
        owner_name: "Search Owner",
        client_name: "Search Client",
        start_time: "Start Date",
        end_time: "End Date",
      };
    },
    filteredProjects() {
      return this.projects.filter(project => {
        return (
          (!this.searchQueries.name || (project.name ?? "").toLowerCase().includes(this.searchQueries.name.toLowerCase())) &&
          (!this.searchQueries.owner_name || (project.owner_name ?? "").toLowerCase().includes(this.searchQueries.owner_name.toLowerCase())) &&
          (!this.searchQueries.client_name || (project.client_name ?? "").toLowerCase().includes(this.searchQueries.client_name.toLowerCase())) &&
          (!this.searchQueries.start_time || (project.start_time ?? "").includes(this.searchQueries.start_time)) &&
          (!this.searchQueries.end_time || (project.end_time ?? "").includes(this.searchQueries.end_time))
        );
      });
    },
    paginatedProjects() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredProjects.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredProjects.length / this.itemsPerPage);
    },
  },
  mounted() {
    this.fetchProjects();
  },
  methods: {
    toggleDetails(index) {
      this.expandedIndex = this.expandedIndex === index ? null : index;
    },
    fetchProjects() {
      this.loading = true;
      const token = localStorage.getItem("token");
      axios.get(apiEndpoints.projects, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          this.projects = response.data.data;
        })
        .catch(error => {
          console.error("Error fetching Projects:", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    deleteProject(projectId) {
      this.$refs.deleteConfirmationModal.show(
        "Delete Project",
        "Are you sure you want to delete this project?",
        () => this.confirmDelete(projectId)
      );
    },
    confirmDelete(projectId) {
      const token = localStorage.getItem("token");

      axios
        .delete(apiEndpoints.deleteProject(projectId), {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          this.fetchProjects();
        })
        .catch((error) => {
          console.error("Error deleting project:", error);
          this.toast.error("Failed to delete project.");
        });
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
