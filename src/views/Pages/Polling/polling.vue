<template>
  <div :class="theme8"  class="min-h-screen p-2 sm:p-4 transition-all duration-300 ease-in-out">
    <!-- Polls Table -->
    <div   :class="theme7" class="w-full rounded-lg shadow-xl p-3 sm:p-4 mt-4">
      <Breadcrumb :items="breadcrumbs" :align="buttonPositionClass" :class="themeText" :themeText="themeText" />
      <Loader v-if="loading" />

      <div  class="w-full overflow-x-auto">
        <table class="min-w-full table-auto rounded-lg shadow text-sm">
          <thead :class="theme4" class="text-gray-700 bg-gray-100">
            <tr class="text-left text-xs sm:text-sm font-semibold uppercase">
              <th class="p-2 text-start w-10"></th>
              <th v-for="(placeholder, key) in searchFields" :key="key" class="p-2 text-start">
                <input v-model="searchQueries[key]" :placeholder="placeholder" class="input-field w-full sm:w-auto" />
              </th>
              <th class="p-2 w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(poll, index) in paginatedPolls" :key="poll.id">
              <tr :class="getRowClass(index)">
                <td class="p-2">
                  <span @click="toggleDetails(index)"
                    class="cursor-pointer w-6 h-6 flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow">
                    <span class="text-base font-bold">{{
                      expandedIndex === index ? "×" : "+"
                    }}</span>
                  </span>
                </td>
                <td class="p-2">{{ poll.title }}</td>
                <td class="p-2">{{ poll.date }}</td>
                <td class="p-2">{{ poll.start_time }}</td>
                <td class="p-2">
                  <button @click="deletePolling(poll.id)"
                    class="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded">
                    Delete
                  </button>
                </td>
              </tr>

              <!-- Expanded Poll details for editing -->
              <tr v-show="expandedIndex === index">
                <td colspan="6" class="p-8 bg-gray-50 rounded-b-lg">
                  <PollEdit v-if="expandedIndex === index" :poll-id="poll.id" :poll="poll" @submitted="fetchPolls" />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <FloatingAddButton :route="'/polling/form'" />
      <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
    </div>
  </div>   <DeleteConfirmationModal ref="deleteConfirmationModal" />

</template>
<script>
import PollEdit from "@/components/Pages/Polling/PollEdit.vue"; // Adjust path as needed
import Breadcrumb from "@/components/Main/Breadcrumbs.vue";
import Loader from "@/components/Main/Loader.vue";
import Pagination from "@/components/Pages/Schedule/Pagination.vue";
import FloatingAddButton from "@/components/Main/Floating/FloatingAddButton.vue";
import axios from "axios";
import apiEndpoints from "@/config/apiConfig";
import DeleteConfirmationModal from "@/components/Modals/ConfirmationModal.vue";
import { useToast } from "vue-toastification";

export default {
      
  setup() {
    const toast = useToast();
    return { toast };
  },
  components: {
    PollEdit,
    Pagination,
    Loader,
    Breadcrumb,DeleteConfirmationModal,
    FloatingAddButton,
  },
  data() {
    return {
      breadcrumbs: [
        {
          label: "Home",
          clickable: true,
          onClick: () => this.$router.push("/dashboard"),
        },
        { label: "Polls", clickable: false },
        { label: "List", clickable: false },
      ],
      searchQueries: {
        title: "",
        date: "",
        time: "",
      },
      polls: [],
      loading: false,
      expandedIndex: null,
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    buttonPositionClass(){

    },
    themeText(){

    },
  
      theme1() {
          return this.$store.state.theme === 'dark' ? 'bg-gray-100 text-gray-900 custom-scrollbar' : 'bg-gray-900 text-gray-100 custom-scrollbar';
        },
        theme2() {
          return this.$store.state.theme === 'dark' ? "bg-gray-200 text-gray-800 custom-scrollbar" : "bg-gray-800 text-gray-200 custom-scrollbar";
        },
        theme3() {
          return this.$store.state.theme === 'dark' ? "bg-gray-300 text-gray-700 custom-scrollbar" : "bg-gray-700 text-gray-300 custom-scrollbar";
        },
        theme4() {
          return this.$store.state.theme === 'dark' ? "bg-gray-400 text-gray-600 custom-scrollbar" : "bg-gray-600 text-gray-400 custom-scrollbar";
        },
        theme5() {
          return this.$store.state.theme === 'dark' ? "bg-gray-500 text-gray-100" : "bg-gray-500 text-gray-100";
        },
        theme6() {
          return this.$store.state.theme === 'dark' ? "bg-gray-600 text-gray-50" : "bg-gray-400 text-gray-900";
        },
        theme7() {
          return this.$store.state.theme === 'dark' ? "bg-gray-700 text-gray-300" : "bg-gray-300 text-gray-700";
        },
        theme8() {
            return this.$store.state.theme === 'dark' ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-700";
          }, 
        theme9() {
            return this.$store.state.theme === 'dark' ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900";
          },
        themeText(){
          return this.$store.state.theme === 'dark' ? 'text-white' : 'text-gray-800';
    
        },
    searchFields() {
      return {
        title: "Search Title",
        date: "Search Date",
        time: "Search Time",
      };
    },
    filteredPolls() {
      return this.polls.filter((poll) => {
        const dateStr = poll.date ? poll.date : "";
        return (
          poll.title
            .toLowerCase()
            .includes(this.searchQueries.title.toLowerCase()) &&
          dateStr.includes(this.searchQueries.date) &&
          poll.start_time
            .toLowerCase()
            .includes(this.searchQueries.time.toLowerCase())
        );
      });
    },
    paginatedPolls() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredPolls.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredPolls.length / this.itemsPerPage);
    },
  },
  mounted() {
    this.fetchPolls();
  },
  methods: {
    toggleDetails(index) {
      this.expandedIndex = this.expandedIndex === index ? null : index;
    },
    async fetchPolls() {
      this.loading = true;
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(apiEndpoints.pollings, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.polls = res.data.data || [];
      } catch (err) {
        console.error("Fetch polling error:", err);
      } finally {
        this.loading = false;
      }
    },


    deletePolling(locationId){
  this.$refs.deleteConfirmationModal.show(
        "Delete Project",
        "Are you sure you want to delete this project?",
        () => this.confirmDeleteLocation(locationId)
      );
},   
    confirmDeleteLocation(pollingId) {

       {
        const token = localStorage.getItem("token");
        axios
          .delete(apiEndpoints.polling(pollingId), {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            this.fetchPolls(); 
            this.toast.success("Polling deleted successfully!");
          })
          .catch((error) => {
            console.error("Error deleting polling:", error);
            this.toast.error("Failed to delete polling.");
          });
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) this.currentPage = page;
    },
   
     getRowClass(index) {
    if (index % 2 === 0) {
      return this.theme9;
    } else {
      return this.theme8;
    } 
  }
  },
};
</script>
