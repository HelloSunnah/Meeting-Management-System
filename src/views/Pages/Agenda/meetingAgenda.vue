<template>
  <div :class="theme8" class="min-h-screen p-6 transition-all duration-300 ease-in-out">
    <div :class="theme9" class="flex-1 w-full rounded-lg shadow-xl p-4 mt-4 relative">
      <div :class="[buttonPositionClass === 'right'
        ? 'mb-4 flex justify-end items-center text-right'
        : 'mb-4 flex justify-start items-center text-left']">
        <nav class="text-md font-semibold text-gray-700 mb-2">
          <span :class="themeText" class="cursor-pointer hover:text-blue-500">{{ $t("Home") }}</span>
          <span class="mx-2">/</span>
          <span :class="themeText"> {{ $t("Agenda") }}</span>
          <span class="mx-2">/</span>
          <span :class="themeText"> {{ $t("Meeting") }}</span>
        </nav>
      </div>
      <div v-if="loading || error || agendas.length === 0" class="flex justify-center items-center h-96">
        <img src="@/assets/img/avai98.gif" alt="Loading or No Data" class="w-80 h-auto" />
      </div>
      <table v-else :class="theme6" class="w-full table-auto rounded-lg overflow-hidden shadow-lg">
        <thead :class="theme5">
          <tr class="text-left text-sm font-semibold uppercase">
            <th class="p-3 text-center w-12"></th>
            <th class="p-3 text-center">
              <input v-model="searchTitle" type="text" placeholder="Search by Title" class="input-field" />
            </th>
            <th class="p-3 text-center">
              <input v-model="searchDescription" type="text" placeholder="Search by Description" class="input-field" />
            </th>
            <th class="p-3 text-center">
              <input v-model="searchRemarks" type="text" placeholder="Search by Remarks" class="input-field" />
            </th>
            <th class="p-3 text-center">
              <input v-model="searchAgendaType" type="text" placeholder="Search by Agenda Type" class="input-field" />
            </th>
          </tr>
        </thead>
        <tbody :class="theme7">
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
                <input v-if="editingField === `description-${index}`" v-model="agenda.description"
                  @blur="resetEditField" @keydown.enter="resetEditField" class="input-field" autofocus />
                <span v-else>{{ agenda.description }}</span>
              </td>
              <td class="p-3 text-center">
                <input v-if="editingField === `remarks-${index}`" v-model="agenda.remarks" @blur="resetEditField"
                  @keydown.enter="resetEditField" class="input-field" autofocus />
                <span v-else>{{ agenda.remarks }}</span>
              </td>
              <td class="p-3 text-center">
                <select v-if="editingField === `agendaType-${index}`" v-model="agenda.agendaType" @blur="resetEditField"
                  @keydown.enter="resetEditField" class="input-field" autofocus>
                  <option value="Meeting"> {{ $t("Meeting") }}</option>
                  <option value="Presentation"> {{ $t("Presentation") }}</option>
                  <option value="Workshop"> {{ $t("Workshop") }}</option>
                  <option value="Conference"> {{ $t("Conference") }}</option>
                </select>
                <span>{{ agenda.agendaType }}</span>
              </td>
            </tr>
            <tr v-show="expandedIndex === index" :class="theme9">
              <td colspan="5" class="p-8">
                <div :class="theme7" class="p-8 rounded-lg shadow-lg space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="flex flex-col">
                      <label class="text-sm font-semibold" for="title"> {{ $t("Title:") }}</label>
                      <input v-model="agenda.title" id="title"
                        class="input-field p-2 border rounded-lg focus:outline-none focus:ring-2" placeholder="Title" />
                    </div>
                    <div class="flex flex-col">
                      <label class="text-sm font-semibold" for="remarks">{{ $t("Remarks") }}</label>
                      <input v-model="agenda.remarks" id="remarks"
                        class="input-field p-2 border rounded-lg focus:outline-none focus:ring-2"
                        placeholder="Remarks" />
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="flex flex-col">
                      <label class="text-sm font-semibold" for="agendaType"> {{ $t("Agenda Type:") }}</label>
                      <select v-model="agenda.agendaType" id="agendaType"
                        class="input-field p-2 border rounded-lg focus:outline-none focus:ring-2">
                        <option value="Meeting"> {{ $t("Meeting") }} </option>
                        <option value="Presentation"> {{ $t("Presentation") }}</option>
                        <option value="Workshop"> {{ $t("Workshop") }}</option>
                        <option value="Conference"> {{ $t("Conference") }}</option>
                      </select>
                    </div>
                    <div class="flex flex-col">
                      <label class="text-sm font-semibold">{{ $t("Active Status:") }}</label>
                      <label class="inline-flex items-center space-x-2">
                        <input type="radio" :value="1" v-model="agenda.isActive" class="form-radio" />
                        <span class="text-sm"> {{ $t("Active:") }}</span>
                      </label>
                      <label class="inline-flex items-center space-x-2">
                        <input type="radio" :value="0" v-model="agenda.isActive" class="form-radio" />
                        <span class="text-sm"> {{ $t("Inactive:") }}</span>
                      </label>
                    </div>
                  </div>
                  <div class="flex flex-col">
                    <label class="text-sm font-semibold" for="description">{{ $t("Description:") }}</label>
                    <textarea v-model="agenda.description" id="description"
                      class="input-field p-2 border rounded-lg focus:outline-none focus:ring-2"
                      placeholder="Description"></textarea>
                  </div>
                  <div class="flex flex-col">
                    <label class="text-sm font-semibold">{{ $t("Attachments:") }} </label>
                    <input :key="agenda.id" type="file" @change="handleFileUpload($event, agenda)"
                      class="input-field p-2 border rounded-lg focus:outline-none focus:ring-2" />
                    <img v-if="isImage(agenda.attachment)"
                      :src="typeof agenda.attachment === 'string' ? `http://192.168.0.3/meeting-management-system-api/public/storage/${agenda.attachment}` : URL.createObjectURL(agenda.attachment)"
                      alt="attachment"
                      class="message-attachment  mt-4 max-w-[100px]  max-h-[200px]  h-auto rounded-lg transition-transform duration-300 transform hover:scale-110" />
               
                    </div>

                  <div class="flex justify-center mt-4">
                    <button @click="submitAgenda(agenda)"
                      class="px-8 py-4 bg-blue-700 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-all duration-300 ease-in-out">
                      {{ $t("Submit") }}
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <FloatingAddButton :route="'/meeting/agenda/form'"> </FloatingAddButton>
      <!-- Pagination -->
      <div v-if="!loading && !error && agendas.length > 0" class="flex justify-center items-center space-x-4 mt-4">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
          class="px-4 py-2 bg-gradient-to-r to-blue-500 from-teal-500 text-white text-center rounded-lg shadow-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
          aria-label="Previous Page">
          &#8592;
          {{ $t("Prev") }}
        </button>
        <span class="text-sm font-semibold">{{ currentPage }} / {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-4 py-2 bg-gradient-to-r to-blue-500 from-teal-500 text-white text-center rounded-lg shadow-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-300
       " aria-label="Next Page">
          {{ $t("Next") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>

import axios from "axios";
import apiEndpoints from '@/config/apiConfig';

import { useToast } from "vue-toastification";
import FloatingAddButton from "@/components/Main/Floating/FloatingAddButton.vue";
import themeSetting from "@/components/js/ThemeSetting.js";

export default {
    setup() {
    const toast = useToast();
    return { toast };
  },  name: "themeSetting",
  ...themeSetting,
  components: {
    FloatingAddButton,
  },
  data() {
    return {
      computedThemeClass: "",
      expandedIndex: null,
      isModalOpen: false, 
      loading: true,
      error: false,
      modalImage: "",
      editingField: null,
      searchTitle: "",
      searchDescription: "",
      searchRemarks: "",
      searchAgendaType: "",
      currentPage: 1,
      itemsPerPage: 5,
      agendas: [],
    };
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
      this.loading = true;
      this.error = false;

      axios
        .get(apiEndpoints.agendas, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.agendas = response.data;
          this.loading = false;
        })
        .catch((error) => {
          console.error("Error fetching agendas:", error);
          this.error = true;
          this.loading = false;
        });
    }


    ,
    async submitAgenda(updatedAgenda) {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      for (const key in updatedAgenda) {
        if (key === "attachment") {
          if (updatedAgenda.attachment instanceof File) {
            formData.append("attachment", updatedAgenda.attachment);
          }
        } else {
          formData.append(key, updatedAgenda[key]);
        }
      }

      try {
        const response = await axios.post(apiEndpoints.updateAgenda(updatedAgenda.id), formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Indicate the request contains form data
            Authorization: `Bearer ${token}`, // Bearer token for authorization
          },
        });

        // Show a success toast message
        this.toast.success("Agenda Updated Successfully");

        // Fetch the updated list of agendas
        this.fetchAgendas();

        // Reset the edit field
        this.resetEditField();
      }



      catch (error) {
        console.error("Error updating agenda:", error);
        this.toast.error("Failed to update agenda.");
      }
    }
    ,

    handleFileUpload(event, agenda) {
      const file = event.target.files[0];
      if (file) {
        agenda.attachment = file;
        console.log("Uploaded file for agenda ID:", agenda.id, file.name);
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
