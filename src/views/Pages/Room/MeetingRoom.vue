<template>
  <div :class="theme8" class="min-h-screen p-6 transition-all duration-300 ease-in-out">
    <div :class="theme9" class="flex-1 w-full rounded-lg shadow-xl p-4 mt-4 relative">
      <div :class="[buttonPositionClass === 'right'
        ? 'mb-4 flex justify-end items-center text-right'
        : 'mb-4 flex justify-start items-center text-left']">
        <nav class="text-md font-semibold text-gray-700 mb-2">
          <span :class="themeText" class="cursor-pointer hover:text-blue-500">{{ $t("Home") }}</span>
          <span class="mx-2">/</span>
          <span :class="themeText"> {{ $t("Meeting") }}</span>
          <span class="mx-2">/</span>
          <span :class="themeText"> {{ $t("Room") }}</span>
        </nav>
      </div>
       <!-- Show No Data GIF if not loading and no results -->
      <div v-if="paginatedRooms.length === 0" class="flex flex-col items-center justify-center p-10">
        <img src="@/assets/img/avai98.gif" alt="No Data" class="w-60 h-auto mb-4" />
      </div>

      <table v-else :class="theme6" class="w-full table-auto rounded-lg overflow-hidden shadow-lg">
        <thead :class="theme5">
          <tr class="text-left text-sm font-semibold uppercase">
            <th class="p-3 text-center w-12"></th>
            <th class="p-3 text-center">
              <input v-model="searchRoomName" type="text" placeholder="Search by Title" class="input-field" />
            </th>
            <th class="p-3 text-center">
              <input v-model="searchRoomDesc" type="text" placeholder="Search by Description" class="input-field" />
            </th>
            <th class="p-3 text-center">
              <input v-model="searchRoomSerial" type="text" placeholder="Search by Remarks" class="input-field" />
            </th>
            <th class="p-3 text-center">
              <input v-model="searchTotalSeat" type="text" placeholder="Search by Agenda Type" class="input-field" />
            </th>
          </tr>
        </thead>
        <tbody :class="theme7">
          <template v-for="(room, index) in paginatedRooms" :key="room.id">
            <tr :class="getRowClass(index)">
              <td class="p-4 text-center">
                <span @click="toggleDetails(index)" :class="getToggleButtonClass(index)"
                  class="inline-flex items-center justify-center w-6 h-6">
                  <span class="text-lg font-bold mb-1">{{ expandedIndex === index ? "×" : "+" }}</span>
                </span>
              </td>
              <td class="p-3 text-center">
                <input v-if="editingField === `roomName-${index}`" v-model="room.roomName" @blur="resetEditField"
                  @keydown.enter="resetEditField" class="input-field" autofocus />
                <span v-else>{{ room.roomName }}</span>
              </td>
              <td class="p-3 text-center">
                <input v-if="editingField === `roomDesc-${index}`" v-model="room.roomDesc" @blur="resetEditField"
                  @keydown.enter="resetEditField" class="input-field" autofocus />
                <span v-else>{{ room.roomDesc }}</span>
              </td>
              <td class="p-3 text-center">
                <input v-if="editingField === `roomSerial-${index}`" v-model="room.roomSerial" @blur="resetEditField"
                  @keydown.enter="resetEditField" class="input-field" autofocus />
                <span v-else>{{ room.roomSerial }}</span>
              </td>
              <td class="p-3 text-center">
                <select v-if="editingField === `totalSeat-${index}`" v-model="room.totalSeat" @blur="resetEditField"
                  @keydown.enter="resetEditField" class="input-field" autofocus>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span v-else>{{ room.totalSeat }}</span>
              </td>
            </tr>

            <tr v-show="expandedIndex === index" :class="theme9">
              <td colspan="5" class="p-8">
                <div :class="theme7" class="p-8 rounded-lg shadow-lg space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="flex flex-col">
                      <label class="text-sm font-semibold" for="roomName"> {{ $t("Room Name:") }}</label>
                      <input v-model="room.roomName" id="roomName"
                        class="input-field p-2 border rounded-lg focus:outline-none focus:ring-2"
                        placeholder="Room Name" />
                    </div>
                    <div class="flex flex-col">
                      <label class="text-sm font-semibold" for="roomSerial">{{ $t("Room Serial") }}</label>
                      <input v-model="room.roomSerial" id="roomSerial"
                        class="input-field p-2 border rounded-lg focus:outline-none focus:ring-2"
                        placeholder="Room Serial" />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="flex flex-col">
                      <label class="text-sm font-semibold" for="totalSeat"> {{ $t("Total Seat:") }}</label>
                      <select v-model="room.totalSeat" id="totalSeat"
                        class="input-field p-2 border rounded-lg focus:outline-none focus:ring-2">
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                    </div>
                    <div class="flex flex-col">
                      <label class="text-sm font-semibold">{{ $t("Status:") }}</label>
                      <label class="inline-flex items-center space-x-2">
                        <input type="radio" :value="1" v-model="room.status" class="form-radio" />
                        <span class="text-sm"> {{ $t("Active") }}</span>
                      </label>
                      <label class="inline-flex items-center space-x-2">
                        <input type="radio" :value="0" v-model="room.status" class="form-radio" />
                        <span class="text-sm"> {{ $t("Inactive") }}</span>
                      </label>
                    </div>
                  </div>

                  <div class="flex flex-col">
                    <label class="text-sm font-semibold" for="roomDesc">{{ $t("Description:") }}</label>
                    <textarea v-model="room.roomDesc" id="roomDesc"
                      class="input-field p-2 border rounded-lg focus:outline-none focus:ring-2"
                      placeholder="Room Description"></textarea>
                  </div>



                  <div class="flex justify-center mt-4">
                    <button @click="submitRoom(room)"
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

      <FloatingAddButton :route="'/meeting/room/form'"></FloatingAddButton>

      <div  class="flex justify-center items-center space-x-4 mt-4">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
          class="px-4 py-2 bg-gradient-to-r to-blue-500 from-teal-500 text-white text-center rounded-lg shadow-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
          aria-label="Previous Page">
          &#8592; {{ $t("Prev") }}
        </button>
        <span class="text-sm font-semibold">{{ currentPage }} / {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gradient-to-r to-blue-500 from-teal-500 text-white text-center rounded-lg shadow-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
          aria-label="Next Page">
          {{ $t("Next") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import FloatingAddButton from "@/components/Main/Floating/FloatingAddButton.vue";
import themeSetting from "@/components/js/ThemeSetting.js";
import apiEndpoints from '@/config/apiConfig';

import { useToast } from "vue-toastification";

export default {
    setup() {
    const toast = useToast();
    return { toast };
  },  name: "RoomManager",
  ...themeSetting,
  components: {
    FloatingAddButton,
  },
  data() {
    return {
      expandedIndex: null,
      editingField: null,
      searchRoomName: "",
      searchRoomDesc: "",
      searchRoomSerial: "",
      searchTotalSeat: "",
      rooms: [],
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  computed: {
    buttonPositionClass() {
      return this.$store.state.sidebarPosition;
    },
    themeText() {
      return this.$store.state.theme === "dark" ? "text-white" : "text-gray-800";
    },
    inputClass() {
      return this.theme7 === "bg-gray-900 text-white"
        ? "bg-gray-700 text-white border-gray-600"
        : "bg-white text-gray-800 border-gray-300";
    },
    theme1() {
      return this.$store.state.theme === "dark"
        ? "bg-gray-100 text-gray-900 custom-scrollbar"
        : "bg-gray-900 text-gray-100 custom-scrollbar";
    },
    theme2() {
      return this.$store.state.theme === "dark"
        ? "bg-gray-200 text-gray-800 custom-scrollbar"
        : "bg-gray-800 text-gray-200 custom-scrollbar";
    },
    theme3() {
      return this.$store.state.theme === "dark"
        ? "bg-gray-300 text-gray-700 custom-scrollbar"
        : "bg-gray-700 text-gray-300 custom-scrollbar";
    },
    theme4() {
      return this.$store.state.theme === "dark"
        ? "bg-gray-400 text-gray-600 custom-scrollbar"
        : "bg-gray-600 text-gray-400 custom-scrollbar";
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
    filteredRooms() {
      return this.rooms.filter((room) =>
        String(room.roomName).toLowerCase().includes(this.searchRoomName.toLowerCase()) &&
        String(room.roomDesc).toLowerCase().includes(this.searchRoomDesc.toLowerCase()) &&
        String(room.roomSerial).toLowerCase().includes(this.searchRoomSerial.toLowerCase()) &&
        String(room.totalSeat).toLowerCase().includes(this.searchTotalSeat.toLowerCase())
      );
    }
    ,
    totalPages() {
      return Math.ceil(this.filteredRooms.length / this.itemsPerPage);
    },
    paginatedRooms() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredRooms.slice(start, start + this.itemsPerPage);
    },
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.fetchRooms();
  },
  methods: {
    isImage(url) {
      return url && /\.(jpg|jpeg|png|gif|bmp)$/i.test(url);
    },
    navigateToRoomForm() {
      this.$router.push("/meeting/room/form");
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
        "scale-110 rotate-45 ring-2 ring-blue-300 ring-offset-2": this.expandedIndex === index,
        flex: true,
        "text-center": true,
      };
    },
    async fetchRooms() {
      const token = localStorage.getItem("token");

      if (!token) {
        this.toast.error("❌ You are not logged in. Please log in.");
        return;
      }

      try {
        const response = await axios.get(apiEndpoints.getRooms, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response.data); 
        this.rooms = Array.isArray(response.data) ? response.data : response.data.data;
        
        if (this.rooms.length === 0) {
          this.toast.error("No rooms available.");
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        this.toast.error("❌ Failed to fetch rooms. Please try again.");
      }
    }
    ,

    async submitRoom(updatedRoom) {
      const token = localStorage.getItem("token");

      if (!token) {
        this.toast.error("❌ You are not logged in. Please log in to update the room.");
        return;
      }

      if (!updatedRoom || !updatedRoom.id) {
        this.toast.error("❌ Invalid room data.");
        return;
      }

      const formData = new FormData();
      
      // Assuming updatedRoom contains fields to be sent in formData, for example:
      // formData.append("name", updatedRoom.name);
      // formData.append("location", updatedRoom.location);
      // formData.append("capacity", updatedRoom.capacity);
      
      for (const key in updatedRoom) {
        if (updatedRoom[key] !== null && updatedRoom[key] !== undefined) {
          formData.append(key, updatedRoom[key]);
        }
      }

      try {
        const response = await axios.post(apiEndpoints.updateRoom(updatedRoom.id), formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          this.toast.success("Room updated successfully!");
          this.fetchRooms(); // Refresh room list
          this.resetEditField(); // Reset form or fields after submission
        } else {
          this.toast.error("❌ Failed to update room. Please try again.");
        }
      } catch (error) {
        console.error("Error updating room:", error);
        this.toast.error("❌ Failed to update room. Please try again later.");
      }
    },
    fetchRooms() {
    },

    resetEditField() {
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
