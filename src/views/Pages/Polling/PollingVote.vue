<!-- Main Component -->
<template>
  <div :class="theme8" class="min-h-screen p-6 sm:p-10 bg-gradient-to-br from-white to-gray-100">
    <Breadcrumb :items="breadcrumbs" :align="buttonPositionClass" :themeText="themeText" />
    <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
      <input type="month" v-model="selectedMonth"
        class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300" />

      <select v-model="pollVisibility"
        class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300">
        <option value="active">Active</option>
        <option value="all">All</option>
      </select>
    </div>

    <div v-if="filteredPolls.length === 0" class="flex justify-center items-center">
      <img src="@/assets/img/avail7.gif" alt="No Data Available" class="w-1/4 sm:w-1/6 mx-auto" />
    </div>
<!-- 
    <Loader v-if="loading" /> -->

    <div v-if="filteredPolls.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-8">
     <PollCard
      v-for="poll in filteredPolls"
      :key="poll.id"
      :poll="poll"
      :activePoll="activePoll"
      :selectedOption="selectedOption"
      :reason="reason"
      :selectOption="selectOption"
      :submitVote="submitVote"
      :timeRemaining="timeRemaining"
      :formatDate="formatDate"
      :isPollEnded="isPollEnded"
      :isAdminNotParticipant="isAdminNotParticipant"
      :isReasonRequired="isReasonRequired"
      :reasonPlaceholder="reasonPlaceholder"
      :canSubmit="canSubmit"
      :pollTypeLabel="pollTypeLabel"
      :countdown="countdown"
      :getCountdownBadgeClass="getCountdownBadgeClass"
      :openParticipantsModal="openParticipantsModal"
      :getModalPollTitle="getModalPollTitle"
    />
    </div>
  </div>
   <transition name="fade-scale">
      <div v-if="showModalCongratulations"
        class="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
        <div class="bg-white border-2 border-green-500 shadow-2xl rounded-2xl px-10 py-8 max-w-md w-full text-center">
          <button class="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
            @click="showModalCongratulations = false">&times;</button>
          <div class="text-6xl mb-4 text-green-500">🎉</div>
          <h2 class="text-4xl font-extrabold text-green-600 mb-2">Congratulations!</h2>
          <p class="text-gray-600 text-base mb-4">Your vote was submitted successfully.</p>
          <button @click="showModalCongratulations = false"
            class="mt-4 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition">
            Close
          </button>
        </div>
      </div>
    </transition>
</template>
<script>
import PollCard from "@/components/Pages/Polling/pollingCard.vue";
import Breadcrumb from "@/components/Main/Breadcrumbs.vue";
import Loader from "@/components/Main/Loader.vue";
import apiEndpoints from "@/config/apiConfig";

export default {
  components: { Breadcrumb, Loader,PollCard },
  data() {
    return {
      showModalCongratulations: false,
      breadcrumbs: [
        { label: "Home", clickable: true, onClick: () => this.$router.push("/dashboard") },
        { label: "Polling", clickable: false }
      ],
      polls: [],
      voted: {},
      activePoll: null,
      selectedOption: {},
      selectedMonth: null,
      pollVisibility: "all",
      reason: {},
      loading: false,
      buttonPositionClass: "",
      theme8: "",
      activeModalPollId: null,
      fetchError: false,      activeModalPollId: null, // To manage which poll's participants to show
activeModalPollId:"",
      themeText: "",
      countdownInterval: null,
    };
  },
  mounted() {
    this.selectedMonth = new Date().toISOString().slice(0, 7);
    this.fetchPollsData();
    this.startCountdown();
  },
  beforeDestroy() {
    clearInterval(this.countdownInterval);
  },
  computed: {
    userId() {
      return localStorage.getItem("user_id");
    },
    currentDate() {
      return new Date();
    },
    filteredPolls() {
      const selectedDate = this.selectedMonth ? new Date(this.selectedMonth) : null;
      return this.polls.filter(poll => this.isPollVisible(poll, selectedDate));
    },
  },
  methods: {
    isPollVisible(poll, selectedDate) {
      const pollStart = new Date(poll.start_time);
      const pollEnd = new Date(poll.end_time);
      const isAdmin = poll.admin_id.toString() === this.userId;
      const isParticipant = poll.participants.some(p => p.id.toString() === this.userId);
      const isPollActive = pollStart <= this.currentDate && this.currentDate <= pollEnd;
      if (selectedDate && (pollStart.getMonth() !== selectedDate.getMonth() || pollStart.getFullYear() !== selectedDate.getFullYear())) {
        return false;
      }
      if (this.pollVisibility === "active" && !isPollActive) {
        return false;
      }
      return isAdmin || (isParticipant && isPollActive);
    },
    openParticipantsModal(pollId) {
      this.activeModalPollId = pollId;
    },
    closeParticipantsModal() {
      this.activeModalPollId = null;
    },
    getToken() {
      return localStorage.getItem("token");
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    },
    async fetchPollsData() {
      this.loading = true;
      this.fetchError = false;
      try {
        const response = await fetch(apiEndpoints.pollings, {
          headers: { Authorization: `Bearer ${this.getToken()}`, "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Non-200 response");
        const data = await response.json();
        this.polls = data.data || [];
      } catch (error) {
        console.error("Error fetching polls data:", error);
        this.fetchError = true;
      } finally {
        this.loading = false;
      }
    },
    startCountdown() {
      this.countdownInterval = setInterval(() => {
        this.polls.forEach(poll => {
          if (this.timeRemaining(poll.end_time) <= 0) {
            clearInterval(this.countdownInterval);
          }
        });
      }, 1000);
    },
    selectOption(pollId, optionId) {
      if (this.activePoll !== pollId) {
        this.selectedOption = {};  // Reset for new poll
        this.activePoll = pollId;
      }
      this.selectedOption[pollId] = optionId;
    },
    async submitVote(pollId, optionId) {
      const userId = this.userId;
      try {
        const response = await fetch(apiEndpoints.vote(pollId), {
          method: "POST",
          headers: { Authorization: `Bearer ${this.getToken()}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            option_id: optionId,
            reason: this.reason[pollId] || "",
          }),
        });
        console.log(response)
        if (response.ok) {
          this.voted[pollId] = true;
          this.showModalCongratulations = true;
          setTimeout(() => {
            this.showModalCongratulations = false;
            this.fetchPollsData();  // Refresh polls data
            window.location.reload()
          }, 2000);
        } else {
          console.error("Failed to submit vote");
        }
      } catch (error) {
        console.error("Error submitting vote:", error);
      }
    },
    pollTypeLabel(type) {
      return type === 1 ? "Meeting" : "General Poll";
    },
    isPollEnded(poll) {
      return new Date(poll.end_time) < this.currentDate;
    },
    isAdminNotParticipant(poll) {
      return poll.admin_id.toString() === this.userId && !poll.participants.some(p => p.id.toString() === this.userId);
    },
    isReasonRequired(pollId) {
      const option = this.polls.find(poll => poll.id === pollId)?.options.find(option => option.id === this.selectedOption[pollId]);
      return option?.name === "No";
    },
    reasonPlaceholder(pollId) {
      return this.isReasonRequired(pollId) ? "Please provide a reason for your vote..." : "Optional: Provide a reason for your vote...";
    },
    canSubmit(pollId) {
      return !!this.selectedOption[pollId] && (!this.isReasonRequired(pollId) || !!this.reason[pollId]);
    },
    countdown(pollId) {
      const poll = this.polls.find(p => p.id === pollId);
      if (!poll) return "Voting has ended";
      return this.getTimeRemaining(poll.end_time);
    },
    getTimeRemaining(endTime) {
      const ms = new Date(endTime) - this.currentDate;
      if (ms <= 0) return "Voting has ended";
      const h = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((ms % (1000 * 60)) / 1000);
      return `Voting will end in ${h}h ${m}m ${s}s`;
    },
    timeRemaining(endTime) {
      return new Date(endTime) - this.currentDate;
    },
    getCountdownColor(pollId) {
      const timeLeft = this.timeRemaining(this.polls.find(p => p.id === pollId)?.end_time || 0);
      if (timeLeft <= 0) return "text-gray-500";
      if (timeLeft <= 3600000) return "text-red-500";
      if (timeLeft <= 21600000) return "text-yellow-500";
      return "text-green-500";
    },
    getModalParticipants() {
      return this.polls.find(p => p.id === this.activeModalPollId)?.participants || [];
    },
    getModalPollTitle() {
      return this.polls.find(p => p.id === this.activeModalPollId)?.title || "";
    },   openParticipantsModal(pollId) {
      this.activeModalPollId = pollId;
    },
    closeParticipantsModal() {
      this.activeModalPollId = null;
    },
    getCountdownBadgeClass(pollId) {
      const timeLeft = this.timeRemaining(this.polls.find(p => p.id === pollId)?.end_time || 0);
      if (timeLeft <= 0) return "bg-gray-100 text-gray-500";
      if (timeLeft <= 3600000) return "bg-red-100 text-red-500";
      if (timeLeft <= 21600000) return "bg-yellow-100 text-yellow-500";
      return "bg-green-100 text-green-500";
    },
  },
};
</script>
