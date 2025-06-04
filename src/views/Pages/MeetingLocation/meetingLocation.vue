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
            <template v-for="(location, index) in paginatedLocations" :key="location.id">
              <tr :class="getRowClass(index)">
                <td class="p-2">
                  <span @click="toggleDetails(index)"
                    class="cursor-pointer w-6 h-6 flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow">
                    <span class="text-base font-bold">{{
                      expandedIndex === index ? "×" : "+"
                    }}</span>
                  </span>
                </td>
                <td class="p-2">{{ location.name }}</td>
                <td class="p-2">{{ location.total_seat }}</td>
                <td class="p-2">
                  <button @click="deleteLocation(location.id)"
                    class="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded">
                    Delete
                  </button>
                </td>
              </tr>
              <!-- Expanded location details for editing -->
              <tr v-show="expandedIndex === index" :class="theme9">
                <td colspan="6" class="p-8 bg-gray-50 rounded-b-lg">
                  <LocationEdit v-if="expandedIndex === index" :location-id="location.id" :location="location"
                    @updated="fetchLocations" />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <FloatingAddButton :route="'/setup/meetingLocation/form'" />
      <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
    </div>
  </div>   
   <DeleteConfirmationModal ref="deleteConfirmationModal" />

</template>
<script>
import LocationEdit from "@/components/Pages/Location/MeetingLocationEdit.vue";
import Breadcrumb from "@/components/Main/Breadcrumbs.vue";
import Loader from "@/components/Main/Loader.vue";
import Pagination from "@/components/Pages/Schedule/Pagination.vue";
import FloatingAddButton from "@/components/Main/Floating/FloatingAddButton.vue";
import axios from "axios";
import apiEndpoints from "@/config/apiConfig";
import DeleteConfirmationModal from "@/components/Modals/ConfirmationModal.vue";

export default {
  components: {
    LocationEdit,
    Pagination,DeleteConfirmationModal,
    Loader,
    Breadcrumb,
    FloatingAddButton,
  },
  data() {
    return {
      themeText: "",
      breadcrumbs: [
        {
          label: "Home",
          clickable: true,
          onClick: () => this.$router.push("/dashboard"),
        },
        { label: "Locations", clickable: false },
        { label: "List", clickable: false },
      ],
      searchQueries: {
        name: "",
        total_seat: "",
      },
      locations: [],
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
    theme5() {
      return "bg-gray-500 text-gray-100";
    },
    theme6() {
      return this.$store.state.theme === "dark"
        ? "bg-gray-600 text-gray-50"
        : "bg-gray-400 text-gray-900";
    },
    theme7() {
      return this.$store.state.theme === "dark"
        ? "bg-gray-700 text-gray-300"
        : "bg-gray-300 text-gray-700";
    },
    theme8() {
      return this.$store.state.theme === "dark"
        ? "bg-gray-800 text-gray-200"
        : "bg-gray-200 text-gray-700";
    },
    theme9() {
      return this.$store.state.theme === "dark"
        ? "bg-gray-900 text-gray-100"
        : "bg-gray-100 text-gray-900";
    },
    searchFields() {
      return {
        name: "Search Name",
        total_seat: "Search Seats",
      };
    },
    filteredLocations() {
      return this.locations.filter((location) => {
        return (
          (!this.searchQueries.name ||
            (location.name ?? "")
              .toLowerCase()
              .includes(this.searchQueries.name.toLowerCase())) &&
          (!this.searchQueries.total_seat ||
            String(location.total_seat ?? "").includes(
              this.searchQueries.total_seat
            ))
        );
      });
    },
    paginatedLocations() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredLocations.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredLocations.length / this.itemsPerPage);
    },
  },
  mounted() {
    this.fetchLocations();
  },
  methods: {
    toggleDetails(index) {
      this.expandedIndex = this.expandedIndex === index ? null : index;
    },
    fetchLocations() {
      this.loading = true;
      const token = localStorage.getItem("token");

      axios
        .get(apiEndpoints.meetingLocations, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.locations = response.data.data;
        })
        .catch((error) => {
          console.error("Error fetching locations:", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },


deleteLocation(locationId){
  this.$refs.deleteConfirmationModal.show(
        "Delete Project",
        "Are you sure you want to delete this project?",
        () => this.confirmDeleteLocation(locationId)
      );
},
    confirmDeleteLocation(locationId) {
      if (confirm("Are you sure you want to delete this location?")) {
        const token = localStorage.getItem("token");

        axios
          .delete(`${apiEndpoints.meetingLocations}/${locationId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            this.fetchLocations();
          })
          .catch((error) => {
            console.error("Error deleting location:", error);
          });
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) this.currentPage = page;
    },
    getRowClass(index) {
      return index % 2 === 0 ? "bg-gray-50" : "bg-gray-100";
    },
  },
};
</script>
