<template>
  <div  class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 mb-8">
    <div
      v-for="(stat, index) in stats"
      :key="index"
       :class="theme7"
      class="stat-card p-6 rounded-xl shadow-lg border-l-8 transition-all duration-300 hover:scale-105"
    >
      <div class="flex items-center">
        <!-- Stat Icon -->
        <div
          class="stat-icon p-4 rounded-full mr-4 border-2"
          :class="['stat-icon-bg', getStatBgColor(index)]"
        >
          <!-- Icon can be added here -->
        </div>
        <div>
          <h2 :class="themeText" class="text-lg font-semibold text-gray-800">{{ $t(stat.title) }}</h2>
          <p  :class="themeText" class="text-2xl font-bold text-gray-900">{{ $t(stat.value) }}</p>
          <span :class="themeText" class="text-sm text-blue-500">{{ $t(stat.change) }}</span>
        </div>
      </div>
    </div>
 
  </div>
</template>


<script>import themeSetting from "@/components/js/ThemeSetting.js"
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
  },  name: "themeSetting",
  ...themeSetting,
  name: "Card2",
  props: {
    stats: {
      type: Array,
      required: true,
    },
  },

  methods: {
    getStatBgColor(index) {
      const colors = ["bg-blue-500", "bg-sky-400", "bg-sky-500", "bg-sky-600"];
      return colors[index] || "bg-gray-500"; 
    },
  },
};
</script>

<style scoped>
@media (max-width: 640px) {
  .stat-card {
    padding: 4px; 
  }

  .stat-icon {
    padding: 3px; 
  }

  .stat-card h2 {
    font-size: 1rem;
  }

  .stat-card p {
    font-size: 1.25rem;
  }
}

@media (min-width: 640px) {
  .stat-card {
    padding: 8px;
  }

  .stat-icon {
    padding: 6px;
  }
}

@media (min-width: 1024px) {
  .stat-card {
    padding: 12px; 
  }

  .stat-icon {
    padding: 8px; 
  }

  .stat-card h2 {
    font-size: 1.25rem; 
  }

  .stat-card p {
    font-size: 1.5rem; 
  }
}
</style>
