<template>
    <tr :class="getRowClass(index)">
      <td class="p-4 text-center">
        <span @click="toggleDetails(index)" class="cursor-pointer w-8 h-8 flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow transition">
          <span class="text-lg font-bold">{{ expandedIndex === index ? "×" : "+" }}</span>
        </span>
      </td>
      <td class="p-3">{{ meeting.title }}</td>
      <td class="p-3">{{ meeting.client_name }}</td>
      <td class="p-3">{{ meeting.project_name }}</td>
      <td class="p-3">{{ new Date(meeting.date).toLocaleDateString() }}</td>
      <td class="p-3">{{ meeting.start_time }}--{{ meeting.end_time }}</td>
      <td class="p-3">
        <button @click="toggleMinutes(index)" class="p-2 w-full sm:w-auto bg-gray-600 hover:bg-gray-800 text-white rounded">Minutes</button>
      </td>
    </tr>
    <tr v-show="expandedIndex === index">
      <td colspan="12" class="p-4 sm:p-8 bg-gray-50 rounded-b-lg">
        <MeetingDetail v-if="showMinutesIndex !== index" :meeting="meeting" />
      </td>
    </tr>
  </template>
  
  <script>
  import MeetingDetail from "@/components/Pages/Schedule/MeetingDetails.vue";
  import apiEndpoints from '@/config/apiConfig';

import { useToast } from "vue-toastification";

export default {
    setup() {
    const toast = useToast();
    return { toast };
  },
    components: { MeetingDetail },
    props: ['meeting', 'index', 'expandedIndex', 'showMinutesIndex'],
    methods: {
      toggleDetails(index) {
        this.$emit('toggleDetails', index);
      },
      toggleMinutes(index) {
        this.$emit('toggleMinutes', index);
      }
    },
    computed: {
      getRowClass() {
        // Your logic to determine row class
      }
    }
  };
  </script>
  