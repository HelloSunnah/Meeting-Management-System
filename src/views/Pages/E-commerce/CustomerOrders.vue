<template>
  <div :class="themeClass" class="min-h-screen p-6 transition-all duration-300 ease-in-out">
    <!-- Table Container -->
    <div :class="themeBlock" class="flex-1 w-full pt-20 rounded-lg shadow-lg p-8 space-y-8 relative">

      <!-- Table Header Section -->
      <div :class="themeClass" class="overflow-hidden rounded-lg shadow-xl p-6">
        <!-- Add New Member Button -->
        <button @click="openMemberModal"
          class="absolute top-4 right-6 bg-blue-600 text-white py-3 px-6 rounded-full shadow-md hover:scale-105 transition-all duration-300 ease-in-out"
          aria-label="Add New Member">
          <span class="font-bold text-2xl">+</span> Add Member
        </button>

        <!-- Table -->
        <table :class="tableClass" class="w-full table-auto rounded-lg overflow-hidden shadow-md">

          <!-- Table Head -->
          <thead :class="headerClass">
            <tr class="text-left text-sm font-semibold uppercase">
              <th class="p-4 text-center w-12"></th>
              <th class="p-4 text-center">
                <input v-model="searchName" type="text" placeholder="Search by Name"
                  class="p-3 rounded-lg bg-gray-100 border-gray-300 w-full focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
              </th>
              <th class="p-4 text-center">
                <input v-model="searchPosition" type="text" placeholder="Search by Position"
                  class="p-3 rounded-lg bg-gray-100 border-gray-300 w-full focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
              </th>
              <th class="p-4 text-center">
                <input v-model="searchOffice" type="text" placeholder="Search by Office"
                  class="p-3 rounded-lg bg-gray-100 border-gray-300 w-full focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
              </th>
              <th class="p-4 text-center">
                <input v-model="searchSalary" type="text" placeholder="Search by Salary"
                  class="p-3 rounded-lg bg-gray-100 border-gray-300 w-full focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
              </th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody :class="themeClass">
            <template v-for="(employee, index) in paginatedEmployees" :key="employee.id">
              <tr :class="getRowClass(index)">
                <!-- Toggle Button for Details -->
                <td class="p-4 text-center">
                  <span @click="toggleDetails(index)" :class="getToggleButtonClass(index)">
                    <span class="absolute text-lg font-semibold">
                      {{ expandedIndex === index ? "●" : "•" }}
                    </span>
                  </span>
                </td>

                <!-- Editable Fields -->
                <td class="p-4 text-center">
                  <input v-if="editingField === `name-${index}`" v-model="employee.name" ref="inputField"
                    :class="getInputClass('name', index)" @blur="editingField = null"
                    @keydown.enter="editingField = null" autofocus />
                  <span v-else @click="editingField = `name-${index}`" class="cursor-pointer text-blue-600 ">
                    {{ employee.name }}
                  </span>
                </td>

                <td class="p-4 text-center">
                  <input v-if="editingField === `position-${index}`" v-model="employee.position" ref="inputField"
                    :class="getInputClass('position', index)" @blur="editingField = null"
                    @keydown.enter="editingField = null" autofocus />
                  <span v-else @click="editingField = `position-${index}`" class="cursor-pointer text-blue-600">
                    {{ employee.position }}
                  </span>
                </td>

                <td class="p-4 text-center">
                  <input v-if="editingField === `office-${index}`" v-model="employee.office" ref="inputField"
                    :class="getInputClass('office', index)" @blur="editingField = null"
                    @keydown.enter="editingField = null" autofocus />
                  <span v-else @click="editingField = `office-${index}`" class="cursor-pointer text-blue-600">
                    {{ employee.office }}
                  </span>
                </td>

                <td class="p-4 text-center">
                  <input v-if="editingField === `salary-${index}`" v-model="employee.salary" ref="inputField"
                    :class="getInputClass('salary', index)" @blur="editingField = null"
                    @keydown.enter="editingField = null" autofocus />
                  <span v-else @click="editingField = `salary-${index}`"
                    class="cursor-pointer text-blue-600 hover:underline">
                    {{ employee.salary }}
                  </span>
                </td>
              </tr>

              <!-- Collapsible Row -->
              <tr :class="themeClass" v-if="expandedIndex === index">
                <td colspan="5" class="p-8">
                  <div :class="tableClass" class="p-8 rounded-lg shadow-xl space-y-4">
                    <div>
                      <p><strong>Full Name:</strong></p>
                      <input v-model="employee.name" :class="getInputClass('name')" placeholder="Full Name" />
                    </div>
                    <div>
                      <p><strong>Position:</strong></p>
                      <input v-model="employee.position" :class="getInputClass('position')" placeholder="Position" />
                    </div>
                    <div>
                      <p><strong>Office:</strong></p>
                      <input v-model="employee.office" :class="getInputClass('office')" placeholder="Office" />
                    </div>
                    <div>
                      <p><strong>Salary:</strong></p>
                      <input v-model="employee.salary" :class="getInputClass('salary')" placeholder="Salary" />
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center items-center space-x-4 mt-6">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
          class="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-500 transition-all duration-300"
          aria-label="Previous Page">
          &#8592; Prev
        </button>
        <span class="text-sm font-semibold">{{ currentPage }} / {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
          class="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-500 transition-all duration-300"
          aria-label="Next Page">
          Next &#8594;
        </button>
      </div>

      <!-- Modal for Adding a New Member -->
      <div v-if="isModalOpen" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white p-8 rounded-lg shadow-lg w-96">
          <AddNewMember :isOpen="isModalOpen" :themeClass="themeClass" @close="closeSupportModal" />
        </div>
      </div>
    </div>
  </div>

  <!-- Modal for Adding a New Member -->
  <AddNewMember :isOpen="isModalOpen" @close="closeSupportModal" />
</template>

<script>
import AddNewMember from "@/components/Modals/MemberModal.vue";
import apiEndpoints from '@/config/apiConfig';

import { useToast } from "vue-toastification";

export default {
    setup() {
    const toast = useToast();
    return { toast };
  },  components: {
    AddNewMember,
  },
  data() {
    return {
      expandedIndex: null,
      isModalOpen: false,
      editingField: null,
      searchName: '',
      searchPosition: '',
      searchOffice: '',
      searchSalary: '',
      currentPage: 1,
      itemsPerPage: 3,
      employees: [
        { id: 1, name: "Airi Satou", position: "Accountant", office: "Tokyo", salary: "$162,700" },
        { id: 2, name: "Angelica Ramos", position: "CEO", office: "London", salary: "$1,200,000" },
        { id: 3, name: "Ashton Cox", position: "Jr. Technical Author", office: "San Francisco", salary: "$86,000" },
      ],
    };
  },
  computed: {
    themeBlock() {
      return this.themeClass.includes('dark') ? "bg-gray-600 text-white custom-scrollbar" : "bg-gray-300 text-gray-800 custom-scrollbar";
    },
    headerClass() {
      return this.themeClass.includes('dark') ? "bg-gray-400 text-white custom-scrollbar" : "bg-gray-400 text-gray-800 custom-scrollbar";
    },
    tableClass() {
      return this.themeClass.includes('dark') ? "bg-gray-800 text-white custom-scrollbar" : "bg-gray-200 text-gray-800 custom-scrollbar";
    },
    themeClass() {
      const theme = this.$store.state.theme;
      return theme === "dark" ? "bg-gray-900 text-white custom-scrollbar" : "bg-gray-100 text-gray-800 custom-scrollbar";
    },
    filteredEmployees() {
      return this.employees.filter(employee => {
        return (
          employee.name.toLowerCase().includes(this.searchName.toLowerCase()) &&
          employee.position.toLowerCase().includes(this.searchPosition.toLowerCase()) &&
          employee.office.toLowerCase().includes(this.searchOffice.toLowerCase()) &&
          employee.salary.toLowerCase().includes(this.searchSalary.toLowerCase())
        );
      });
    },
    totalPages() {
      return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
    },
    paginatedEmployees() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      return this.filteredEmployees.slice(start, end);
    }
  },
  methods: {
    openMemberModal() {
      this.isModalOpen = true;
    },
    closeSupportModal() {
      this.isModalOpen = false;
    },
    toggleDetails(index) {
      this.expandedIndex = this.expandedIndex === index ? null : index;
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    getRowClass(index) {
      return this.themeClass.includes('dark') ? 'border-b border-gray-200 hover:bg-gray-700 transition-all duration-300 hover:shadow-md' : 'border-b border-gray-200 hover:bg-gray-50 transition-all duration-300 hover:shadow-md';
    },
    getInputClass(field, index) {
      return this.themeClass.includes('dark') ? 'w-full p-3 rounded-lg text-white bg-gray-700 border focus:outline-none focus:ring-2 focus:ring-blue-500' : 'w-full p-3 rounded-lg text-gray-800 bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-blue-500';
    },
    getToggleButtonClass(index) {
      return {
        'cursor-pointer inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full transition-all duration-300 ease-in-out': true,
        'scale-110 rotate-45 ring-2 ring-blue-300 ring-offset-2': this.expandedIndex === index,
      };
    }
  }
};
</script>
