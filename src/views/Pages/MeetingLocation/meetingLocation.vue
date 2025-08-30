<template>
  <div :class="theme8" class="min-h-screen p-2  sm:p-4 transition-all duration-300 ease-in-out">
    <div :class="theme9" class="w-full rounded-lg shadow-xl p-3 sm:p-4 mt-6">
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
          <tbody  v-if="paginatedLocations.length > 0":class="theme7">
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
                <td colspan="6" :class="theme6" class="p-8 bg-gray-50 rounded-b-lg">
                  <LocationEdit v-if="expandedIndex === index" :location-id="location.id" :location="location"
                    @updated="fetchLocations" />
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
                    No Location found.
                  </td>
                </tr>
              </tbody>
        </table>
      </div>

      <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
    </div>
  </div>   
   <DeleteConfirmationModal ref="deleteConfirmationModal" />
      <FloatingAddButton :route="'/setup/meetingLocation/form'" />

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
import useTheme from '@/components/js/ThemeSetting';
import { useToast } from "vue-toastification";
export default {
  components: {
    LocationEdit,
    Pagination,DeleteConfirmationModal,
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
        {
          label: "Home",
          clickable: true,
          onClick: () => this.$router.push("/dashboard"),
        },
        { label: "Meeting Room", clickable: false },
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
      const token = sessionStorage.getItem("token");

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
        "Delete Room",
        "Are you sure you want to delete this Room?",
        () => this.confirmDeleteLocation(locationId)
      );
},
    confirmDeleteLocation(locationId) {
        const token = sessionStorage.getItem("token");

        axios
          .delete(`${apiEndpoints.meetingLocations}/${locationId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            this.fetchLocations();
            this.toast.success("Meeting Room Deleted Successfully")
          })
          .catch((error) => {
            console.error("Error deleting location:", error);
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
<style scoped>
.input-field {
  @apply px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-400;
}
</style>
