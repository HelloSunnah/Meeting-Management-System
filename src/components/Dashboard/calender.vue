<template>
  <main :class="themeClass" class="p-4 sm:p-6">
    <div
      :class="calendarWrapperClass"
      class="calendar-wrapper p-4 sm:p-6 rounded-xl shadow-xl w-full max-w-full mx-auto"
    >
      <div :class="calendarHeaderClass" class="p-4 sm:p-6 rounded-xl shadow-md">
        <!-- Calendar Header with Navigation -->
        <div class="flex justify-between items-center mb-4 sm:mb-6">
          <!-- Previous Month Button -->
          <button @click="prevMonth" class="p-2 hover:text-indigo-600">
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
          <!-- Month and Year Display -->
          <p :class="headerTextColor" class="text-lg sm:text-xl font-bold">
            {{$t(currentMonth) }} {{$t(currentYear) }}
          </p>
          <!-- Next Month Button -->
          <button @click="nextMonth" class="p-2 hover:text-indigo-600">
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Weekdays Header -->
        <div
          :class="weekdaysClass"
          class="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs sm:text-sm font-semibold mb-4"
        >
          <div>{{ $t("Sun") }}</div>
          <div>{{ $t("Mon") }}</div>
          <div>{{ $t("Tue") }}</div>
          <div>{{ $t("Wed") }}</div>
          <div>{{ $t("Thu") }}</div>
          <div>{{ $t("Fri") }}</div>
          <div>{{ $t("Sat") }}</div>
        </div>

        <!-- Days Grid -->
        <div class="grid grid-cols-7 gap-1 sm:gap-2 text-center">
          <div
            v-for="(day, index) in daysInMonth"
            :key="index"
            :class="{
              'flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-lg cursor-pointer transition-transform transform': true,
              'bg-indigo-200 text-indigo-700 font-semibold':
                day === new Date().getDate(),
              'hover:bg-indigo-50': day !== '',
              'text-gray-400': day === '',
            }"
          >
            <span
              :class="{ 'text-gray-400': day === '' }"
              class="text-xs sm:text-sm"
              >{{ day }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import apiEndpoints from '@/config/apiConfig';

import useTheme from '@/components/js/ThemeSetting';
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
  },  name: "Calendar",

  data() {
    return {
      currentMonth: this.getMonthName(new Date().getMonth()),
      currentYear: new Date().getFullYear(),
      daysInMonth: this.getDaysInMonth(
        new Date().getMonth(),
        new Date().getFullYear()
      ),
    };
  },

  computed: {
    themeClass() {
      return this.$store.state.theme === "dark" ? "dark" : "light";
    },

    calendarWrapperClass() {
      return this.$store.state.theme === "dark"
        ? "bg-gray-800 text-white" 
        : "bg-white text-gray-800"; 
    },

    calendarHeaderClass() {
      return this.$store.state.theme === "dark"
        ? "bg-gray-600 text-white" 
        : "bg-gradient-to-br from-indigo-100 to-indigo-300 text-gray-800"; 
    },

    headerTextColor() {
      return this.$store.state.theme === "dark"
        ? "text-white"
        : "text-gray-800";
    },

    weekdaysClass() {
      return this.$store.state.theme === "dark"
        ? "text-white" 
        : "text-gray-800";
    },
  },

  methods: {
    getMonthName(monthIndex) {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return months[monthIndex];
    },

    getDaysInMonth(month, year) {
      const firstDayOfMonth = new Date(year, month, 1).getDay();
      const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
      const days = [];
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push("");
      }
      for (let day = 1; day <= lastDateOfMonth; day++) {
        days.push(day);
      }
      while (days.length < 42) {
        days.push("");
      }

      return days;
    },

    prevMonth() {
      let monthIndex = new Date(
        `${this.currentMonth} 1, ${this.currentYear}`
      ).getMonth();
      monthIndex = monthIndex === 0 ? 11 : monthIndex - 1;
      this.currentMonth = this.getMonthName(monthIndex);
      this.currentYear =
        monthIndex === 11 ? this.currentYear - 1 : this.currentYear;
      this.daysInMonth = this.getDaysInMonth(monthIndex, this.currentYear);
    },

    nextMonth() {
      let monthIndex = new Date(
        `${this.currentMonth} 1, ${this.currentYear}`
      ).getMonth();
      monthIndex = monthIndex === 11 ? 0 : monthIndex + 1;
      this.currentMonth = this.getMonthName(monthIndex);
      this.currentYear =
        monthIndex === 0 ? this.currentYear + 1 : this.currentYear;
      this.daysInMonth = this.getDaysInMonth(monthIndex, this.currentYear);
    },
  },
};
</script>
