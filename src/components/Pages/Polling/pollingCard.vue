<template>
  <div :class="[
    'bg-white rounded-3xl shadow-xl border flex flex-col justify-between transition-transform transform hover:scale-[1.05] hover:shadow-2xl overflow-hidden group',
    activePoll === poll.id ? 'border-green-500' : 'border-gray-200',
  ]">
    <div class="h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>

    <div :class="theme81" class="p-6 flex flex-col h-full">
      <div :class="themeText" class="flex justify-between items-center mb-4">
        <h2 :class="themeText" class="text-2xl font-semibold text-gray-800">
          {{ poll.title }}
        </h2>
        <span class="px-4 py-2 text-xs rounded-full font-semibold" :class="poll.type === 1
          ? 'bg-blue-100 text-blue-700'
          : 'bg-yellow-100 text-yellow-700'
          ">
          {{ pollTypeLabel(poll.type) }}
        </span>
      </div>


      <!-- Description with toggle -->
      <div :class="themeText" class="prose max-w-none text-blue-800 mt-1 text-base">
        <span v-html="getDescription(poll)"></span>

        <!-- See More / See Less -->
        <button v-if="needsTruncate(poll)" @click="toggleDescription(poll.id)"
          class="text-blue-500 hover:underline text-sm ml-1">
          {{ expandedDescriptions[poll.id] ? 'See less' : 'See more' }}
        </button>
      </div>


      <div :class="themeText"
        class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 text-xs text-gray-500 mb-6 mt-4">
        <!-- Time Info -->
        <div class="space-y-3 sm:w-1/2">
          <div class="flex items-center space-x-2">
            <i class="fas fa-calendar-alt text-green-500"></i>
            <p :class="themeText" class="text-sm font-semibold text-gray-700">
              Start:
              <span :class="themeText" class="text-gray-500">{{
                formatDate(poll.start_time)
              }}</span>
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <i class="fas fa-hourglass-end text-red-400"></i>
            <p :class="themeText" class="text-sm font-semibold text-gray-700">
              End:
              <span :class="themeText" class="text-gray-500">{{ formatDate(poll.end_time) }}</span>
            </p>
          </div>

          <!-- Countdown Timer (if active) -->
          <div v-if="timeRemaining(poll.end_time) > 0">
            <div class="flex items-center space-x-2">
              <i class="fas fa-clock text-yellow-500"></i>
              <span :class="[
                'px-3 py-1 rounded-full text-sm font-semibold',
                getCountdownBadgeClass(poll.id),
              ]">
                ⏳ {{ countdown(poll.id) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Participants List -->
        <!-- Participants List -->
        <div class="sm:w-1/2 text-sm text-gray-700">
          <p class="font-semibold mb-2 flex items-center space-x-1">
            <i class="fas fa-user-friends text-indigo-400"></i>
            <span :class="themeText">
              Participants ({{ poll.participants.length }})
            </span>
          </p>

          <!-- Display first 6 participants and add a clickable trigger -->
          <div :class="themeText" class="grid grid-cols-2 gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded"
            @click="openParticipantsModal(poll.id)">
            <div v-for="(participant, index) in poll.participants.slice(0, 6)" :key="participant.id"
              class="flex items-center space-x-2">
              <i class="fas fa-user-circle text-gray-600"></i>
              <span :class="themeText">{{ participant.name || "Unnamed User" }}</span>
            </div>
            <div v-if="poll.participants.length > 6" class="text-blue-500 text-xs mt-1">
              + {{ poll.participants.length - 6 }} more
            </div>
          </div>
        </div>

      </div>

      <div v-if="isPollEnded(poll)" class="text-center text-gray-500">
        <p :class="themeText" class="text-sm">This poll has ended. Voting is disabled.</p>
      </div>

      <div v-if="isAdminNotParticipant(poll)" class="text-center text-gray-500">
        <p :class="themeText" class="text-sm">
          You are not a participant in this poll. Voting is disabled.
        </p>
      </div>
      <!-- Disable voting if the poll has ended -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
        <button v-for="option in poll.options" :key="option.id" @click="selectOption(poll.id, option.id)"
          :aria-label="'Select ' + option.name + ' for ' + poll.title" :class="[
            'w-full py-3 px-4 rounded-xl text-sm font-semibold transition',
            selectedOption[poll.id] === option.id
              ? 'bg-gradient-to-r from-green-500 to-green-700 text-white shadow-md scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:scale-105 hover:shadow-sm',
          ]" :disabled="isPollEnded(poll) || isAdminNotParticipant(poll)">
          {{ option.name }}
        </button>
      </div>

      <!-- Additional logic for reason and vote submission -->
      <div v-if="selectedOption[poll.id] && isReasonRequired(poll.id)" class="mt-4">
        <textarea v-model="reason[poll.id]" rows="3" class="w-full p-3 border border-gray-300 rounded-xl text-sm"
          :placeholder="reasonPlaceholder(poll.id)" :required="isReasonRequired(poll.id)">
        </textarea>
      </div>

      <button @click="submitVote(poll.id, selectedOption[poll.id])" :disabled="!canSubmit(poll.id) || isPollEnded(poll)"
        class="mt-5 px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-semibold hover:from-green-500 hover:to-green-400 transition disabled:opacity-40">
        ✅ Submit Vote
      </button>
    </div>
  </div>
  <!-- Modal -->
  <div v-if="activeModalPollId === poll.id"
    class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto p-6 relative">
      <button @click="closeParticipantsModal" class="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl">
        &times;
      </button>
      <h3 class="text-lg font-semibold mb-4 text-gray-800">All Participants</h3>
      <ul class="space-y-2">
        <li v-for="participant in poll.participants" :key="participant.id"
          class="flex items-center space-x-2 text-gray-700">
          <i class="fas fa-user text-indigo-400"></i>
          <span>{{ participant.name || 'Unnamed User' }}</span>
        </li>
      </ul>
    </div>
  </div>

</template>

<script>
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
      theme61,
      theme9,
      themeText, theme81
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
      theme61,
      theme8,
      theme9,
      themeText,
      toast, theme81
    };
  },

  props: {
    poll: Object,
    activePoll: Number,
    selectedOption: Object,
    reason: Object,
    selectOption: Function,
    submitVote: Function,
    timeRemaining: Function,
    formatDate: Function,
    isPollEnded: Function,
    isAdminNotParticipant: Function,
    isReasonRequired: Function,
    reasonPlaceholder: Function,
    canSubmit: Function,
    pollTypeLabel: Function,
    countdown: Function,
    getCountdownBadgeClass: Function,
    getModalPollTitle: Function,
  },
  data() {
    return {
      activeModalPollId: null,
      expandedDescriptions: {}
    };
  },
  methods: {
    // Show See more if more than 10 words
    needsTruncate(poll) {
      if (!poll.description) return false;
      const plainText = this.stripHtml(poll.description);
      return plainText.split(/\s+/).length > 10;
    },

    // Toggle open/close
    toggleDescription(pollId) {
      this.expandedDescriptions[pollId] = !this.expandedDescriptions[pollId];
    },

    // Get the truncated or full HTML
    getDescription(poll) {
      if (!poll.description) return "<p>No description provided.</p>";

      if (this.expandedDescriptions[poll.id] || !this.needsTruncate(poll)) {
        return poll.description; // show full HTML
      }

      const plainText = this.stripHtml(poll.description);
      const truncated = plainText.split(/\s+/).slice(0, 10).join(" ") + "...";
      return `<p>${truncated}</p>`;
    },

    // Strip HTML tags to count words safely
    stripHtml(html) {
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    },

    openParticipantsModal(pollId) {
      this.activeModalPollId = pollId;
    },
    closeParticipantsModal() {
      this.activeModalPollId = null;
    }
  }


};
</script>
