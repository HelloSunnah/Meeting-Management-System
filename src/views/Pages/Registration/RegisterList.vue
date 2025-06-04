<template>
  <div :class="theme8" class="min-h-screen p-2 sm:p-4 transition-all duration-300 ease-in-out">
    <div :class="theme9" class="w-full rounded-lg shadow-xl p-3 sm:p-4">
      <Breadcrumb :items="breadcrumbs" :align="buttonPositionClass" :themeText="themeText" />
      <Loader v-if="loading" />
      <div class="w-full overflow-x-auto">
        <table :class="theme6" class="min-w-full table-auto rounded-lg shadow text-sm">
          <thead :class="theme5" class="text-gray-700 bg-gray-100">
            <tr class="text-left text-xs sm:text-sm font-semibold uppercase">
              <th class="p-2 text-start w-10"></th>
              <th class="p-2 text-start w-10"></th>
              <th v-for="(placeholder, key) in searchFields" :key="key" class="p-2 text-start">
                <input v-model="searchQueries[key]" :placeholder="placeholder" class="input-field w-full sm:w-auto" />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody :class="theme7">
            <template v-for="(register, index) in paginatedRegisters" :key="register.id">
              <tr :class="getRowClass(index)">
                <td class="p-2 text-start">
                  <span @click="toggleDetails(index)"
                    class="cursor-pointer w-6 h-6 flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow">
                    <span class="text-base font-bold">{{ expandedIndex === index ? "×" : "+" }}</span>
                  </span>
                </td>
                <td class="p-2">
                  <div class="flex items-start gap-2">
                    <span>{{ register.title }}</span>
                    <span v-if="isregisterOngoing(register)" class="w-6 h-6">
                      <img src="@/assets/img/workflow.gif" alt="Ongoing"
                        class="w-full h-full object-cover rounded-full" />
                    </span>
                  </div>
                </td>
                <td class="p-2">{{ register.name }}</td>
                <td class="p-2">{{ register.email }}</td>
                <td class="p-2">{{ register.department_name }}</td>
              </tr>
              <tr v-show="expandedIndex === index" :class="theme9">
                <td colspan="6" class="p-8 bg-gray-50 rounded-b-lg">
                  <RegistrationEdit v-if="expandedIndex === index && register.id" :userId="register.id"
                    @updated="fetchRegisters" />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <FloatingAddButton :route="'/register/form'" />
      <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
    </div>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Main/Breadcrumbs.vue";
import Loader from "@/components/Main/Loader.vue";
import RegistrationEdit from "@/components/Pages/Registration/RegistrationEdit.vue";
import Pagination from "@/components/Pages/Schedule/Pagination.vue";
import FloatingAddButton from "@/components/Main/Floating/FloatingAddButton.vue";
import axios from "axios";
import apiEndpoints from "@/config/apiConfig";

export default {
  components: {
    RegistrationEdit,
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
        { label: "User", clickable: false },
        { label: "Register", clickable: false },
      ],
      searchQueries: {
        name: "",
        email: "",
        department_name: ""
      },
      registers: [],
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
        email: "Search Email",
        department_name: "Search Department",
      };
    },
    filteredRegisters() {
      return this.registers.filter(register => {
        return (
          (!this.searchQueries.name || (register.name && register.name.toLowerCase().includes(this.searchQueries.name.toLowerCase()))) &&
          (!this.searchQueries.email || (register.email && register.email.toLowerCase().includes(this.searchQueries.email.toLowerCase()))) &&
          (!this.searchQueries.department_name || (register.department_name && register.department_name.toLowerCase().includes(this.searchQueries.department_name.toLowerCase())))
        );
      });
    },
    paginatedRegisters() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredRegisters.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredRegisters.length / this.itemsPerPage);
    },
  },
  mounted() {
    this.fetchRegisters();
  },
  methods: {
    toggleDetails(index) {
      this.expandedIndex = this.expandedIndex === index ? null : index;
    },
    fetchRegisters() {
      this.loading = true;
      const token = localStorage.getItem("token");

      axios.get(`${apiEndpoints.allUsers}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          this.registers = res.data.users;
          console.log("Fetched users:", this.registers); 
        })
        .catch(err => console.error("Fetch registers error:", err))
        .finally(() => {
          this.loading = false;
        });
    }
    ,
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) this.currentPage = page;
    },
    getRowClass(index) {
      return index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100';
    },
    isregisterOngoing(register) {
      return register.status === "ongoing";
    },
  },
};
</script>

<style scoped>
.input-field {
  @apply px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-400;
}
</style>
