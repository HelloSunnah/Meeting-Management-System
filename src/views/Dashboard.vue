<template>
  <div :class="theme8" class="p-4  min-h-screen">

    <FloatingChat />
    <Card2 :stats="statsData" />
    <Card3Data :card3Data="card3Data" />
    <FloatingButtons />

    <div
      class="flex flex-col md:flex-row w-full space-y-6 md:space-y-0 md:space-x-6"
    >
      <div class="w-full md:w-1/2">
        <CpaSection :cpaData="cpaData" />
      </div>
      <div class="w-full md:w-1/2">
        <StatsCard />
      </div>
    </div>
    <Chart />
    <Chart1 />
    <MyCalender />
  </div>
</template>
<script>
import axios from "axios";
import FloatingChat from "@/components/Main/Floating/FloatingChat.vue";
import CpaSection from "@/components/Dashboard/CpaChart.vue";
import Card2 from "@/components/Dashboard/card1.vue";
import Card3Data from "@/components/Dashboard/card2.vue";
import Chart from "@/components/Dashboard/ChartCard.vue";
import Chart1 from "@/components/Dashboard/ChartCard1.vue";
import StatsCard from "@/components/Dashboard/StatsCard.vue";
import FloatingButtons from "@/components/Main/Floating/FloatingButton.vue";
import MyCalender from "@/components/Dashboard/calender.vue";
import themeSetting from "@/components/js/ThemeSetting.js"

import apiEndpoints from '@/config/apiConfig';

import { useToast } from "vue-toastification";

export default {
    setup() {
    const toast = useToast();
    return { toast };
  },  name: "themeSetting",
  ...themeSetting,
  components: {
    FloatingChat,
    FloatingButtons,
    Card2,
    Card3Data,
    CpaSection,
    StatsCard,
    Chart,
    Chart1,
    MyCalender,
  },
 
  data() {
    return {
      headerClass: "",
      card3Data: "",
      cpaData: "",
      statsData: [
      { title: "Today's Total Meeting", value: 0, change: "" },
      { title: "Total Running Meeting", value: 0, change: "" },
      { title: "Next Day Total Meeting", value: 0, change: "" },
      { title: "This Month Total Meeting", value: 0, change: "" },
      ],
      activeListings: [
        { country: "United States", percent: 38.6 },
        { country: "Canada", percent: 22.5 },
        { country: "Mexico", percent: 30.8 },
        { country: "Other", percent: 8.1 },
      ],
      properties: [
        { name: "Cedarwood Estates", price: "$200,000" },
        { name: "Lakeview Lofts", price: "$250,000" },
        { name: "Tranquil Oaks", price: "$350,000" },
      ],
    };
  },
  mounted() {
  this.fetchMeetingStats();
  },
  methods: {
    async fetchMeetingStats() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(apiEndpoints.meetingCounts, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;

        this.statsData = [
          { title: "Today's Total Meeting", value: data.today_meeting_count, change: "" },
          { title: "Total Running Meeting", value: data.running_meeting_count, change: "" },
          { title: "Next Day Total Meeting", value: data.next_day_meeting_count, change: "" },
          { title: "This Month Total Meeting", value: data.this_month_meeting_count, change: "" },
        ];
      } catch (error) {
        console.error("Failed to fetch meeting stats:", error);
      }
    }
  }
};
</script>

<style scoped>
.custom-scrollbar {
  overflow: auto;
}

.custom-scrollbar::-webkit-scrollbar {
  display: none; /* Hide the scrollbar */
}

.custom-scrollbar {
  -ms-overflow-style: none; /* Hide the scrollbar in IE */
  scrollbar-width: none; /* Hide the scrollbar in Firefox */
}
</style>
