<template>
  <div theme class="metrics grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
    <div v-for="stat in stats" :key="stat.title" >
      <div :class="[sectionCardClass,'relative w-full h-[250px] sm:h-[200px] rounded-xl shadow-2xl p-4 overflow-hidden']">
        <!-- Percentage Label -->
        <div class="absolute top-4 left-4">
          <span class="text-white bg-blue-600 font-semibold text-lg px-4 py-2 rounded-lg shadow-lg">
            {{ stat.progress }}%
          </span>
        </div>

        <!-- Card Content -->
        <div class="flex justify-center items-end h-full">
          <span class="bg-white text-gray-800 font-semibold px-6 py-3 rounded-2xl shadow-xl transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
            {{$t(stat.title) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>import apiEndpoints from '@/config/apiConfig';

export default {
  name: "Card1",
  data() {
    return {
      stats: [
        { title: "Properties", value: "721K", change: "+11.0%", progress: 34 },
        { title: "Deals", value: "1,156", change: "+11.0%", progress: 72 },
        { title: "Amount", value: "367K", change: "+11.0%", progress: 45 },
        { title: "Average", value: "239K", change: "+11.0%", progress: 60 }
      ]
    };
  },
  computed: {
    sectionCardClass() {
      return this.$store.state.theme === 'dark' 
        ? 'bg-gray-700 text-white' 
        : 'bg-sky-200 text-gray-800 shadow-md';
    }
  }
};
</script>

<style scoped>
/* Ensure responsive font size for mobile screens */
@media (max-width: 640px) {
  .metrics .metric {
    font-size: 0.875rem;
  }
  .metrics .metric .title {
    font-size: 1rem;
  }
  .metrics .metric .value {
    font-size: 1.25rem;
  }
}

/* Custom height adjustments for smaller screens */
@media (min-width: 768px) {
  .metrics .metric {
    height: 220px;
  }
}
</style>
