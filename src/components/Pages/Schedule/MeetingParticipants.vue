<template>
  <div class="bg-gray-100 shadow-md rounded-xl border border-gray-200 p-6 space-y-6">
    <h2 class="text-xl font-semibold text-gray-800">Participants</h2>

    <ul class="grid gap-4 max-h-[200px] overflow-y-auto"
        :class="participants.length === 1 ? 'grid-cols-1' : 'grid-cols-2'">
      <li v-for="(p, index) in participants" :key="p.user_id"
          class="p-4 bg-white border rounded-xl shadow-sm hover:shadow-lg transition-all">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <img :src="getUserImageUrl(p.user_image, p.user_name)"
                 class="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                 alt="Participant Image" />
            <span class="font-semibold text-blue-900 text-lg">{{ p.user_name }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="p.attendance_status === 1" class="text-green-500">✔</span>
            <span v-else-if="p.attendance_status === 0" class="text-red-500">✘</span>
            <button v-if="isHostUser" @click="$emit('removeParticipant', p.user_id)"
                    class="text-red-500 hover:text-red-700 ml-2">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
        <div v-if="isAccordionOpen(index)" class="mt-2 text-sm text-gray-600 bg-gray-100 p-4 rounded-lg shadow-inner">
          {{ p.remarks }}
        </div>
      </li>
    </ul>
<Multiselect
  :model-value="modelValue"
  @update:modelValue="$emit('update:modelValue', $event)"
  :options="availableParticipants"
  :multiple="true"
  label="name"
  track-by="id"
  placeholder="Select Participants..."
  class="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
/>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import apiEndpoints from "@/config/apiConfig";

export default {
  components: { Multiselect },
 props: {
  modelValue: Array, // this replaces selectedParticipants
  participants: Array,
  availableParticipants: Array,
  isHostUser: Boolean,
},
emits: ['update:modelValue', 'removeParticipant'],
  data() {
    return {
      openAccordions: new Set(),
    };
  },
  methods: {
    isAccordionOpen(index) {
      return this.openAccordions.has(index);
    },
    toggleAccordion(index) {
      this.openAccordions.has(index)
        ? this.openAccordions.delete(index)
        : this.openAccordions.add(index);
    },
    getUserImageUrl(image, name) {
      return this.isImage(image)
        ? `${apiEndpoints.storageUrl}/storage/${image}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128`;
    },
    isImage(path) {
      return /\.(jpe?g|png|gif|bmp|webp)$/i.test(path);
    },
  },
};
</script>
