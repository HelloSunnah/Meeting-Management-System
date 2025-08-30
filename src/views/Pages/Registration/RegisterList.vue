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
                <input v-model="searchQueries[key]" :placeholder="placeholder" class="input-field w-full sm:w-auto"
                  type="search" />
              </th>
            </tr>
          </thead>

          <tbody :class="theme7">
            <template v-if="registers.length > 0">
              <template v-for="(register, index) in registers" :key="register.id">
                <tr :class="getRowClass(index)">
               
                  <td class="p-2">
                    <button @click="toggleDetails(index)"
                      class="w-6 h-6 flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow">
                      <span class="text-base font-bold">
                        {{ expandedIndex === index ? "×" : "+" }}
                      </span>
                    </button>
                  </td>

                  <td class="p-2">{{ register.name }}</td>
                  <td class="p-2">{{ register.email }}</td>
                  <td class="p-2">
                    {{ register.department ? register.department.name : "-" }}
                  </td>

               
                </tr>

                <!-- Expandable Edit Form -->
                <tr v-show="expandedIndex === index" :class="theme9">
                  <td colspan="6" class="p-8 rounded-b-lg">
                    <RegistrationEdit v-if="expandedIndex === index" :userId="register.id" :user="register"
                      @updated="fetchRegisters" />
                  </td>
                </tr>
              </template>
            </template>

            <tr v-else>
              <td colspan="6" class="p-6 text-center text-gray-500 italic">
                No users found 
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
    </div>

    <FloatingAddButton :route="'/register/form'" />
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
import useTheme from "@/components/js/ThemeSetting";
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
        { label: "Register", clickable: false },
      ],
      searchQueries: {
        name: "",
        email: "",
        department_name: "",
      },
      registers: [],
      loading: false,
      expandedIndex: null,
      currentPage: 1,
      itemsPerPage: 10,
      totalPages: 0,
    };
  },
  computed: {
    buttonPositionClass() {
      return this.$store.state.sidebarPosition;
    },

    searchFields() {
      return {
        name: "Search Name",
        email: "Search Email",
        department_name: "Search Department",
      };
    },
  },
  watch: {
    searchQueries: {
      handler() {
        this.currentPage = 1;
        this.fetchRegisters();
      },
      deep: true,
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
      const token = sessionStorage.getItem("token");

      axios
        .get(apiEndpoints.allUsers, {
          params: {
            page: this.currentPage,
            limit: this.itemsPerPage,
            name: this.searchQueries.name || undefined,
            email: this.searchQueries.email || undefined,
            dep: this.searchQueries.department_name || undefined,
          },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const data = res.data.users;
          this.registers = data.data;
          this.totalPages = data.last_page;
          this.currentPage = data.current_page;
        })
        .catch((err) => {
          console.error("Fetch registers error:", err);
          this.registers = [];
          this.totalPages = 0;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchRegisters();
      }
    },
    getRowClass(index) {
      return index % 2 === 0 ? this.theme9 : this.theme8;
    },
    isregisterOngoing(register) {
      // Adjust based on your actual status field or logic
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
