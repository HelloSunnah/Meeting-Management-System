<template>
  <div>
    <h4 :class="themeText" class="text-gray-700 text-xs font-semibold mb-3">👥 Participants</h4>

    <div class="overflow-y-auto no-scrollbar max-h-80">
      <!-- Always display 2 participants per row -->
      <div class="grid gap-4 grid-cols-2">
        <div v-for="(p, index) in participants" :key="p.id"
          class="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all duration-200 ease-in-out transform">

          <div class="flex items-start justify-between gap-3">
            <!-- User Info -->
            <div class="flex items-center gap-3 w-full">
              <img :src="getImageUrl(p)"
                class="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-blue-500 shadow-sm hover:shadow-md transition-transform duration-200"
                alt="Participant image" />
              <div class="flex flex-col flex-1">
                <span class="font-semibold text-sm text-blue-900 hover:text-blue-700 transition-colors">
                  {{ p.user_name }}
                </span>
                <span class="text-xs text-gray-500">{{ p.department_name }}</span>
              </div>
            </div>

            <!-- Attendance + Remarks toggle (compact & stacked) -->
            <div class="flex flex-col items-end justify-start gap-1 min-w-[16px]">
              <!-- Attendance icon -->
              <span :class="getAttendanceClass(p.attendance_status)"
                class="w-3.5 h-3.5 flex items-center justify-center" aria-label="Attendance Status">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor">
                  <path v-if="p.attendance_status === 1" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                    d="M1 5.917L5.724 10.5L15 1.5" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
              </span>

              <!-- Remarks toggle -->
              <svg v-if="p.remarks" @click="toggleAccordion(index)" :class="{ 'rotate-180': isAccordionOpen(index) }"
                class="w-3.5 h-3.5 text-gray-600 cursor-pointer transition-transform duration-200" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" aria-label="Toggle remarks">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Remarks Section -->
          <div v-if="isAccordionOpen(index)"
            class="mt-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg shadow-inner transition-all">
            {{ p.remarks }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiEndpoints from '@/config/apiConfig';
import useTheme from '@/components/js/ThemeSetting';
import { useToast } from 'vue-toastification';

export default {
  setup() {
    const { themeText } = useTheme();
    const toast = useToast();
    return { themeText, toast };
  },

  props: {
    participants: Array,
  },

  data() {
    return {
      openAccordions: new Set(),
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
      if (p.user_image && /\.(jpg|jpeg|png|gif|bmp)$/i.test(p.user_image)) {
        return `${apiEndpoints.storageUrl2}/${p.user_image}`;
      }
      const name = p.user_name || 'User';
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8b5cf6&color=fff&rounded=true&size=128`;
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
</style>
