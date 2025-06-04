<template>
  <div class="min-h-screen p-6 sm:p-10 bg-gradient-to-br from-white to-gray-100">
    <Breadcrumb :items="breadcrumbs" />

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
      <h2 class="text-2xl font-semibold text-gray-800">Polls</h2>

      <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
        <input
          type="month"
          v-model="selectedMonth"
          class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />

        <select
          v-model="pollVisibility"
          class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="all">All</option> <!-- Added 'All' option -->
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
      </div>
    </div>

    <Loader v-if="loading" />

    <div v-else-if="!filteredPolls.length" class="text-center mt-16">
      <img src="@/assets/img/avai98.gif" alt="No polls" class="mx-auto w-60 h-60 object-contain mb-4 opacity-80" />
      <p class="text-xl text-gray-700">
        {{ fetchError ? "⚠️ Failed to load polls. Please try again later." : "No polls available." }}
      </p>
    </div>

    <div v-else class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <PollCard
        v-for="poll in filteredPolls"
        :key="poll.polling_id"
        :poll="poll"
        :user-id="userId"
        :admin-id="adminId"
        @open-modal="handleModal"
        @toggle-publish="handleTogglePublish"
      />
    </div>

    <ConfirmModal ref="confirmModal" />
    <Modal
      :show="isModalVisible"
      :title="modalTitle"
      :voters="modalVoters"
      @update:show="isModalVisible = $event"
    />
  </div>
</template><script>
import Breadcrumb from "@/components/Main/Breadcrumbs.vue";
import Loader from "@/components/Main/Loader.vue";
import Modal from "@/components/Pages/Polling/VotingParticipantsModal.vue";
import PollCard from "@/components/Pages/Polling/PollCard.vue";
import ConfirmModal from "@/components/Modals/ConfirmationModal.vue";
import apiEndpoints from "@/config/apiConfig";

export default {
  components: { Breadcrumb, Loader, Modal, PollCard, ConfirmModal },
  data() {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    return {
      breadcrumbs: [
        { label: "Home", clickable: true, onClick: () => this.$router.push("/dashboard") },
        { label: "Polling", clickable: false }
      ],
      polls: [],
      loading: false,
      fetchError: false,
      isModalVisible: false,
      modalTitle: "",
      modalMessage: "",
      modalVoters: [],
      modalAction: null,
      selectedMonth: currentMonth,
      pollVisibility: "all", // <-- Default to "All"
      userId: localStorage.getItem("user_id"),
      adminId: null
    };
  },
  computed: {
    filteredPolls() {
      if (!this.selectedMonth) return [];

      const [selectedYear, selectedMonth] = this.selectedMonth.split("-").map(Number);

      return this.polls.filter(poll => {
        const startDate = new Date(poll.start_time);
        const endDate = new Date(poll.end_time);

        const matchesMonth =
          (startDate.getFullYear() === selectedYear && startDate.getMonth() + 1 === selectedMonth) ||
          (endDate.getFullYear() === selectedYear && endDate.getMonth() + 1 === selectedMonth);

        const isPublished = poll.publish_status === 1;
        const shouldShow =
          this.pollVisibility === "all" || (this.pollVisibility === "published" ? isPublished : !isPublished);

        return matchesMonth && shouldShow;
      });
    }
  },
  mounted() {
    this.fetchPolls();
  },
  methods: {
    async fetchPolls() {
      this.loading = true;
      this.fetchError = false;

      try {
        const res = await fetch(apiEndpoints.voting_result, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!res.ok) throw new Error("API response error");

        const data = await res.json();
        this.adminId = String(data.admin_id);

        const isAdmin = data.admin_id == this.userId;

        const allPolls = data.polls.filter(poll => {
          const isParticipant = poll.participants?.some(p => p.user_id == this.userId);
          return isAdmin || (poll.publish_status === 1 && isParticipant);
        });

        this.polls = allPolls;
        localStorage.setItem("poll_cache", JSON.stringify(data));
      } catch (err) {
        console.error("Poll fetch error:", err);
        this.fetchError = true;
      } finally {
        this.loading = false;
      }
    },

    handleTogglePublish(poll) {
      this.modalTitle = poll.publish_status === 1 ? "Unpublish Poll" : "Publish Poll";
      this.modalMessage = `Are you sure you want to ${poll.publish_status === 1 ? "unpublish" : "publish"} this poll?`;
      this.modalAction = () => this.togglePublishStatus(poll);
      this.$refs.confirmModal.show(this.modalTitle, this.modalMessage, this.modalAction);
    },

    async togglePublishStatus(poll) {
      try {
        const res = await fetch(apiEndpoints.togglePublishStatus(poll.polling_id), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ publish_status: poll.publish_status === 1 ? 0 : 1 })
        });

        if (!res.ok) throw new Error("Failed to toggle publish status");

        const updated = await res.json();

        this.polls = this.polls.map(p =>
          p.polling_id === poll.polling_id
            ? { ...p, publish_status: updated.publish_status }
            : p
        );
      } catch (err) {
        console.error("Toggle publish error:", err);
        this.toast.error("❌ Failed to update publish status.");
      }
    },

    handleModal(poll, option) {
      this.modalTitle = option.option_name;
      this.modalVoters = option.voters || [];
      this.isModalVisible = true;
    }
  }
};
</script>
