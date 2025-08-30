<template>
  <div class="space-y-6 bg-gray-50 p-6 rounded-2xl shadow">
    <h3 class="text-xl font-semibold text-gray-700">Schedule Details</h3>
    <div>
      <label for="meeting_type" class="block text-sm font-medium text-gray-700"
        >Meeting Type</label
      >
      <select
        v-model="localData.meeting_type"
        id="meeting_type"
        :class="[inputClass, 'text-sm px-2 py-1 h-8']"
      >
        <option disabled value="">Select Type</option>
        <option value="1">Internal</option>
        <option value="2">External</option>
        <option value="3">Other</option>
      </select>
    </div>
    <div>
      <label for="date" class="block text-sm font-medium text-gray-700"
        >Meeting Date</label
      >
      <input
        v-model="localData.date"
        id="date"
        type="date"v-auto-date
        :class="[inputClass, 'text-sm px-2 py-1 h-8']"
      />
      <span v-if="formErrors.date" class="text-red-600 text-sm">{{
        formErrors.date
      }}</span>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="start_time" class="block text-sm font-medium text-gray-700"
          >Start Time</label
        >
        <input
          v-model="localData.start_time"
          id="start_time"
          type="time"
          :class="[inputClass, 'text-sm px-2 py-1 h-8']"
        />
      </div>
      <div>
        <label for="end_time" class="block text-sm font-medium text-gray-700"
          >End Time</label
        >
        <input
          v-model="localData.end_time"
          id="end_time"
          type="time"
          :class="[inputClass, 'text-sm px-2 py-1 h-8']"
        />
      </div>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700"
        >Select Internal Participants</label
      >
      <multiselect
        v-model="localData.participants"
        :options="participants"
        :multiple="true"
        :close-on-select="false"
        label="name"
        track-by="id"
        placeholder="Choose participants"
        class="text-sm"
      />
    </div>
    <div v-if="localData.meeting_type === '3'" class="space-y-4">
      <div
        v-for="(outParticipant, index) in localData.outParticipants"
        :key="index"
        class="flex items-end gap-4 bg-white p-4 rounded-lg border border-gray-200"
      >
        <input
          type="text"
          v-model="outParticipant.name"
          placeholder="Participant name"
          :class="[inputClass, 'text-sm px-2 py-1 h-8']"
        />
        <button
          type="button"
          @click="$emit('remove-participant', index)"
          v-if="localData.outParticipants.length > 1"
          class="text-red-600 hover:text-red-800"
        >
          <i class="fas fa-minus-circle text-xl"></i>
        </button>
      </div>
      <button
        type="button"
        @click="$emit('add-participant')"
        class="flex items-center gap-2 text-green-600 hover:text-green-800"
      >
        <i class="fas fa-plus-circle text-lg"></i> Add Participant
      </button>
    </div>
  </div>
</template>
<script>
import Multiselect from "vue-multiselect";
export default {
  components: { Multiselect },
  props: ["value", "formErrors", "inputClass", "participants"
    
  ],
  emits: ["update:value", "add-participant", "remove-participant"],
  computed: {
    localData: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("update:value", newValue);
      },
    },
  },
};
</script>
