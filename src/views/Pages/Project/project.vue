<template>
  <div :class="theme8" class="min-h-screen p-2 sm:p-4 transition-all duration-300 ease-in-out">
    <div :class="theme7" class="w-full rounded-xl shadow-2xl p-4 sm:p-6 mt-6">
      <Breadcrumb :items="breadcrumbs" :align="buttonPositionClass" :class="themeText" />
      <Loader v-if="loading" />

      <!-- Add this above the table or near pagination -->
      <div :class="themeText" class="mb-2 text-sm font-medium">
        Total Projects: {{ filteredProjects.length }}
      </div>

      <!-- Meeting Table -->
      <div>
        <div class="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
          <table class="min-w-full border rounded-xl overflow-hidden text-sm">
            <thead :class="theme4" class="uppercase font-semibold text-xs sm:text-sm tracking-wider text-left">
              <tr class="text-left text-xs sm:text-sm font-semibold uppercase">
                <th class="p-2 w-10"></th>
                <th v-for="(placeholder, key) in searchFields" :key="key" class="p-2">
                  <input v-model="searchQueries[key]" :placeholder="placeholder"
                    class="input-field w-full sm:w-auto border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400" />
                </th>
                <th class="p-2">Status</th>
                <th class="p-2">Actions</th>
              </tr>
            </thead>
            <tbody v-if="paginatedProjects.length > 0 || loading" >
              <template v-for="(project, index) in paginatedProjects" :key="project.id">
                <tr :class="getRowClass(index)">
                  <td class="p-2">
                    <span @click="toggleDetails(index)"
                      class="cursor-pointer w-6 h-6 flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow">
                      <span class="text-base font-bold">
                        {{ expandedIndex === index ? '×' : '+' }}
                      </span>
                    </span>
                  </td>

                  <td class="p-2">{{ project.name }}</td>
                  <td class="p-2">{{ project.owner_name }}</td>
                  <td class="p-2">{{ project.client_name }}</td>
                  <td class="p-2">{{ project.start_time }}</td>
                  <td class="p-2">{{ project.end_time }}</td>

                  <td class="p-2">
                    <span :class="[
                      project.status == '1'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700',
                      'text-xs font-semibold px-3 py-1 rounded-full inline-block'
                    ]">
                      {{ project.status == '1' ? 'Active' : 'Inactive' }}
                    </span>
                  </td>

                  <td class="p-2 space-x-2">
                    <button @click="deleteProject(project.id)"
                      class="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded">
                      Delete
                    </button>
                  </td>
                </tr>
                <tr v-show="expandedIndex === index" :class="theme9">
                  <td colspan="8" :class="theme6" class="p-6 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                    <ProjectEdit v-if="expandedIndex === index" :project-id="project.id" :project="project"
                      @updated="fetchProjects" />
                  </td>
                </tr>
              </template>
            </tbody>
                     <tbody v-else>
                <tr>
                  <td :colspan="Object.keys(searchFields).length + 3" class="py-12 text-center text-gray-500">
                    <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor"
                      stroke-width="1.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 6v6h4m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    No Project found.
                  </td>
                </tr>
              </tbody>

          </table>
        </div>
        <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
      </div>

      <DeleteConfirmationModal ref="deleteConfirmationModal" />
    </div>
    <FloatingAddButton :route="'/setup/project/form'" class="z-50 fixed bottom-6 right-6" />

  </div>
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

import useTheme from '@/components/js/ThemeSetting';
import { useToast } from "vue-toastification";


export default {

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
      const token = sessionStorage.getItem("token");
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
      const token = sessionStorage.getItem("token");

      axios
        .delete(apiEndpoints.deleteProject(projectId), {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          this.fetchProjects();
          this.toast.success("Project Deleted Successfully")
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
      return index % 2 === 0 ? this.theme9 : this.theme8;
    },
  },
};
</script>
