<template>
  <div :class="theme8" class="min-h-screen p-6 transition-all duration-300 ease-in-out">
    <div :class="theme7" class="flex-1 w-full rounded-lg shadow-xl p-4 mt-4 relative">
      <div :class="[buttonPositionClass === 'right'
        ? 'mb-4 flex justify-end items-center text-right'
        : 'mb-6 flex justify-start items-center text-left']">
        <nav class="text-md font-semibold text-gray-700 mb-2">
          <span :class="themeText" class="cursor-pointer hover:text-blue-500">Home</span>
          <span class="mx-2">/</span>
          <span :class="themeText">Agenda</span>
          <span class="mx-2">/</span>
          <span :class="themeText">Meeting</span>
        </nav>
      </div>
      <table :class="theme6" class="w-full table-auto rounded-lg overflow-hidden shadow-lg">
        <thead :class="theme5">
          <tr class="text-left text-sm font-semibold uppercase">
            <th class="p-3 text-center w-12"></th>
            <th class="p-3 text-center">
              <input v-model="searchTitle" type="text" placeholder="Search by Title" class="input-field" />
            </th>
            <th class="p-3 text-center">
              <input v-model="searchorganizer" type="text" placeholder="Search by organizer" class="input-field" />
            </th>
          </tr>
        </thead>
        <tbody :class="theme6">
          <template v-for="(agenda, index) in paginatedAgendas" :key="agenda.id">
            <tr :class="getRowClass(index)">
              <td class="p-4 text-center">
                <span @click="toggleDetails(index)" :class="getToggleButtonClass(index)"
                  class="inline-flex items-center justify-center w-6 h-6">
                  <span class="text-lg font-bold mb-1">{{
                    expandedIndex === index ? "×" : "+"
                  }}</span>
                </span>
              </td>
              <td class="p-3 text-center">
                <input v-if="editingField === `title-${index}`" v-model="agenda.title" @blur="resetEditField"
                  @keydown.enter="resetEditField" class="input-field" autofocus />
                <span v-else>{{ agenda.title }}</span>
              </td>
              <td class="p-3 text-center">
                <input v-if="editingField === `organizer-${index}`" v-model="agenda.organizer" @blur="resetEditField"
                  @keydown.enter="resetEditField" class="input-field" autofocus />
                <span v-else>{{ agenda.organizer }}</span>
              </td>

            </tr>
            <tr v-show="expandedIndex === index" :class="theme9">
              <td colspan="5" class="p-8">
                <div :class="theme6" class="p-8 rounded-lg shadow-lg space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="flex flex-col">
                      <label class="text-sm font-semibold" for="title">Title:</label>
                      <input v-model="agenda.title" id="title"
                        class="input-field p-2 border rounded-lg focus:outline-none focus:ring-2" placeholder="Title" />
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  </div>
                  <div class="flex flex-col">
                    <label class="text-sm font-semibold" for="organizer">organizer:</label>
                    <textarea v-model="agenda.organizer" id="organizer"
                      class="input-field p-2 border rounded-lg focus:outline-none focus:ring-2"
                      placeholder="organizer"></textarea>
                  </div>
                  <div class="flex justify-center mt-4">
                    <button @click="submitAgenda(agenda)"
                      class="px-8 py-4 bg-blue-700 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-all duration-300 ease-in-out">
                      Submit
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <FloatingAddButton :route="'/subscription/form'"> </FloatingAddButton>
      <!-- Pagination -->
      <div class="flex justify-center items-center space-x-4 mt-4">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-button"
          aria-label="Previous Page">
          &#8592; Prev
        </button>
        <span class="text-sm font-semibold">{{ currentPage }} / {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="pagination-button"
          aria-label="Next Page">
          Next &#8594;
        </button>
      </div>
    </div>
  </div>
</template>
<script>

import axios from "axios";
import apiEndpoints from '@/config/apiConfig';

import FloatingAddButton from "@/components/Main/Floating/FloatingAddButton.vue";
import { useToast } from "vue-toastification";

export default {
    setup() {
    const toast = useToast();
    return { toast };
  },  components: {
    FloatingAddButton,
  },
  data() {
    return {
      computedThemeClass: "",
      expandedIndex: null,
      editingField: null,
      searchTitle: "",
      searchorganizer: "",
      currentPage: 1,
      itemsPerPage: 8,
      agendas: [],
    };
  },
  computed: {
    buttonPositionClass() {
      return this.$store.state.sidebarPosition;
    },
    themeText() {
      return this.$store.state.theme === 'dark' ? 'text-white' : 'text-gray-800';

    },
    inputClass() {
      return this.theme7 === 'bg-gray-900 text-white'
        ? 'bg-gray-700 text-white border-gray-600'
        : 'bg-white text-gray-800 border-gray-300';
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
    }, theme9() {
      return this.$store.state.theme === 'dark' ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900";
    },
    filteredAgendas() {
  return this.agendas.filter(agenda =>
    String(agenda.title || "").toLowerCase().includes(this.searchTitle.toLowerCase()) &&
    String(agenda.organizer || "").toLowerCase().includes(this.searchorganizer.toLowerCase())
  );
}

    
    
    ,
    totalPages() {
      return Math.ceil(this.filteredAgendas.length / this.itemsPerPage);
    },
    paginatedAgendas() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredAgendas.slice(start, start + this.itemsPerPage);
    }
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.fetchAgendas();
  },
  methods: {
    isImage(url) {
      return url && /\.(jpg|jpeg|png|gif|bmp)$/i.test(url);
    },
    navigateToAgendaForm() {
      this.$router.push("/meeting/agenda/form");
    },
    toggleDetails(index) {
      this.expandedIndex = this.expandedIndex === index ? null : index;
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    setEditingField(field, index) {
      this.editingField = `${field}-${index}`;
    },
    resetEditField() {
      this.editingField = null;
    },
    getRowClass(index) {
      return `border-b border-gray-200 hover:bg-gray-400 transition-all duration-300 hover:shadow-md`;
    },
    getToggleButtonClass(index) {
      return {
        "cursor-pointer inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full transition-all duration-300 ease-in-out": true,
        "scale-110 rotate-45 ring-2 ring-blue-300 ring-offset-2":
          this.expandedIndex === index,
        flex: true,
        "text-center": true,
      };
    },
    fetchAgendas() {
      const token = localStorage.getItem("token");
      axios
        .get(
        apiEndpoints.meetings, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.agendas = response.data.data;
          console.log(response.data.data)
        })
        .catch((error) => {
          console.error("Error fetching agendas:", error);
        });
    },
    async submitAgenda(updatedAgenda) {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      try {
        const response = await axios.post(
          `${apiEndpoints.agenda(updatedAgenda.id)}?_method=PUT`, // Dynamically constructed URL
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.toast.success(" Agenda Created Successfully");
        this.fetchAgendas();
        this.resetEditField();
      } catch (error) {
        console.error("Error updating agenda:", error);
        this.toast.error("Failed to update agenda.");
      }
    },
  },
};
</script>

<style scoped>
.input-field {
  @apply w-full p-2 rounded-lg text-gray-800 bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200;
}

.message-attachment {
  max-width: 150px;
  height: auto;
  border-radius: 8px;
  transition: transform 0.3s ease-in-out;
}

.message-attachment:hover {
  transform: scale(1.1);
}

.pagination-button {
  @apply bg-gradient-to-r from-blue-600 to-blue-400 text-white p-2 rounded-lg hover:scale-105 transition-all duration-300;
}

/* Lightbox Modal Styles */
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}

.bg-black {
  background-color: rgba(0, 0, 0, 0.8);
}
</style>
