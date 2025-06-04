<template>
    <div>
      <h4 class="text-gray-700 text-xs font-semibold mb-3">👥 Participants</h4>
      <div class="overflow-y-auto no-scrollbar max-h-80">
        <ul class="space-y-3">
          <div :class="participants.length >= 3 ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-1 gap-3'">
            <li v-for="(p, index) in participants" :key="p.id"
              class="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:scale-102 transition-all duration-200 ease-in-out transform overflow-auto no-scrollbar">
              
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <!-- User Image -->
                  <img :src="getImageUrl(p)"
                      class="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-sm hover:shadow-md transition-shadow duration-200"
                      alt="Participant image" />
                  <div class="flex flex-col ml-2">
                    <span class="font-semibold text-blue-900 text-sm hover:text-blue-700 transition-colors duration-150">{{ p.user_name }}</span>
                    <span class="text-xs text-gray-500 mt-0.5">{{ p.department_name }}</span>
                  </div>
                </div>
  
                <!-- Attendance Status -->
                <div class="flex items-center gap-2">
                  <span :class="getAttendanceClass(p.attendance_status)" aria-label="Attendance Status">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 14 14" stroke="currentColor">
                      <path v-if="p.attendance_status === 1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                        d="M1 5.917L5.724 10.5L15 1.5" />
                      <path v-else stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                  </span>
  
                  <!-- Expand remarks button -->
                  <svg v-if="p.remarks" @click="toggleAccordion(index)" :class="{'rotate-180': isAccordionOpen(index)}"
                      class="w-4 h-4 text-gray-600 cursor-pointer transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Expand remarks">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
  
              <!-- Remarks Section -->
              <div v-if="isAccordionOpen(index)"
                class="mt-1 text-xs text-gray-600 bg-gray-100 p-3 rounded-lg shadow-inner transition-all duration-200">
                {{ p.remarks }}
              </div>
            </li>
          </div>
        </ul>
      </div>
    </div>
  </template>
  
  <script>import apiEndpoints from '@/config/apiConfig';

import { useToast } from "vue-toastification";

export default {
    setup() {
    const toast = useToast();
    return { toast };
  },
    props: {
      participants: Array,
    },
    data() {
      return {
        openAccordions: new Set(),
        userAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
      };
    },
    methods: {
      toggleAccordion(index) {
        this.openAccordions.has(index)
          ? this.openAccordions.delete(index)
          : this.openAccordions.add(index);
      },
      isAccordionOpen(index) {
        return this.openAccordions.has(index);
      },
      getImageUrl(p) {
      // Check if the user has a valid image and its file extension is valid
      if (p.user_image && /\.(jpg|jpeg|png|gif|bmp)$/i.test(p.user_image)) {
        return apiEndpoints.imageUrl(p.user_image); // Construct the image URL
      }
      // Return avatar if user_image is not a valid image
      return p.avatar || this.userAvatar;
    },
      getAttendanceClass(status) {
        return status === 1 ? 'text-green-500' : status === 0 ? 'text-red-500' : '';
      },
    },
  };
  </script>
  
  <style scoped>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  li:hover {
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
    transform: scale(1.02);
  }
  
  img:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease-in-out;
  }
  
  span:hover {
    color: #1D4ED8;
    transition: color 0.15s ease-in-out;
  }
  </style>
  