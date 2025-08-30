<!-- components/PollCard.vue -->
<template>
  <div :class="[
    'bg-white rounded-3xl shadow-xl border flex flex-col justify-between transition-transform transform hover:scale-[1.05] hover:shadow-2xl overflow-hidden group',
    poll.publish_status === 1 ? 'border-green-500' : 'border-gray-200',
  ]">
    <div class="h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>

    <!-- Apply themeText globally inside content -->
    <div :class="[theme61, themeText, 'p-6 flex flex-col h-full']">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 :class="themeText" class="text-2xl font-semibold text-gray-800 leading-tight">
          {{ poll.polling_title }}
        </h2>
        <span :class="[
          themeText,
          poll.type === 1
            ? 'bg-blue-100 text-blue-700'
            : 'bg-yellow-100 text-yellow-700',
        ]" class="px-4 py-2 text-xs rounded-full font-semibold">
          {{ pollTypeLabel }}
        </span>
      </div>

      <!-- Description -->
      <p class="text-sm mb-4 line-clamp-3">
        {{ poll.description || "No description available." }}
      </p>

      <!-- Meta Info -->
      <div class="text-xs mb-4 space-y-1">
        <p>
          <i class="fas fa-calendar-alt mr-1 text-green-500"></i>
          Start: {{ formatDate(poll.start_time) }}
        </p>
        <p>
          <i class="fas fa-hourglass-end mr-1 text-red-400"></i>
          End: {{ formatDate(poll.end_time) }}
        </p>
        <p>
          <i class="fas fa-users mr-1 text-indigo-400"></i>
          Participants: {{ poll.total_votes }}
        </p>
      </div>

      <!-- Results Section -->
      <div>
        <h3 class="text-sm font-semibold text-gray-700 mb-2">Results:</h3>
        <ul class="space-y-2">
          <li v-for="option in poll.results" :key="option.option_id">
            <button @click="$emit('open-modal', poll, option)" class="w-full text-left hover:text-blue-600 font-medium"
              :class="themeText">
              <div class="flex justify-between">
                <span>{{ option.option_name }}</span>
                <span>{{ option.votes }} votes</span>
              </div>
            </button>
          </li>
        </ul>

        <!-- Pie Chart -->
        <div class="mt-6">
          <PollPieChart :votes="poll.results.map((opt) => ({
            option: opt.option_name,
            count: opt.votes,
          }))
            " />
        </div>

        <!-- Winner Display -->
        <div v-if="winner"
          class="mt-4 p-3 rounded bg-green-50 border border-green-300 text-green-800 text-sm font-semibold">
          🏆 Winner: {{ winner.option_name }} ({{ winner.votes }} votes)
        </div>

        <!-- Publish Toggle for Admin -->
        <button v-if="isAdmin" @click="$emit('toggle-publish', poll)"
          class="mt-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
          :class="themeText">
          {{ poll.publish_status === 1 ? "Unpublish" : "Publish" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import PollPieChart from "@/components/Pages/Polling/Chart.vue";
import apiEndpoints from "@/config/apiConfig";

import useTheme from "@/components/js/ThemeSetting";
import { useToast } from "vue-toastification";

export default {
  setup() {
    const {
      theme6,
      theme8, theme61,
      theme9,
      themeText,
    } = useTheme();

    const toast = useToast();

    return {
      theme61,
      theme6,
      theme8,
      theme9,
      themeText,
      toast,
    };
  },
  props: {
    poll: Object,
    userId: [String, Number],
    adminId: [String, Number],
  },
  components: { PollPieChart },
  computed: {
    isAdmin() {
      return this.userId === this.adminId;
    },
    pollTypeLabel() {
      return this.poll.type === 1 ? "General" : "Meeting";
    },
    winner() {
      if (!this.poll?.results?.length) return null;

      const maxVotes = Math.max(...this.poll.results.map((o) => o.votes || 0));
      const topOptions = this.poll.results.filter((o) => o.votes === maxVotes);

      // Handle tie
      if (topOptions.length > 1) {
        return {
          option_name: "Tie",
          votes: maxVotes,
        };
      }

      return topOptions[0];
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
</script>
