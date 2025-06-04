<template>
  <div :class="themeClass" class="w-full mx-auto shadow-xl rounded-xl p-5">
    <!-- Header Section -->
    <div class="header mb-3">
      <h2 class="title text-lg md:text-xl font-extrabold">{{ $t('Top Performers') }}</h2>
      <p class="subtitle text-xs md:text-sm">{{ $t('Top Performers Description') }}</p>
    </div>

    <!-- Table -->
    <div class="table-container overflow-x-auto">
      <table class="w-full text-sm table-auto border-collapse">
        <thead>
          <tr class="table-header bg-gradient-to-r from-blue-500 to-purple-500 text-white uppercase text-left">
            <th class="py-2 px-3 rounded-l-lg">{{ $t('Rank') }}</th>
            <th class="py-2 px-3">{{ $t('Name') }}</th>
            <th class="py-2 px-3">{{ $t('Sales') }}</th>
            <th class="py-2 px-3 rounded-r-lg">{{ $t('Performance') }}</th>
          </tr>
        </thead>
        <tbody :class="themeClass" class="table-body">
          <tr v-for="(person, index) in topPerformers" :key="index"
              class="table-row border-b border-gray-200 transition-all duration-300 hover:bg-gray-100 hover:scale-[1.01] focus:outline-none"
              :aria-selected="index === selectedIndex ? 'true' : 'false'" 
              @click="selectRow(index)"
              :class="{ 'text-white': themeClass.includes('bg-gray-800') }">
            <td class="rank py-2 px-3 font-semibold">{{ $t(person.rank) }}</td>
            <td class="name py-2 px-3 flex items-center space-x-3">
              <div class="initials w-6 h-6 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md text-white font-bold text-xs"
                   :style="{ background: person.color, backdropFilter: 'blur(8px)' }">
                {{ person.initials }}
              </div>
              <span class="name-text">{{ $t(person.name) }}</span>
            </td>
            <td class="sales py-2 px-3 text-green-600 font-semibold">
              <span class="material-icons-outlined"></span>{{ $t(person.sales) }}
            </td>
            <td class="performance py-2 px-3">
              <span v-if="person.performance >= 90" class="text-green-500">{{ $t('Star Performance') }} {{ person.performance }}%</span>
              <span v-else-if="person.performance >= 80" class="text-yellow-500">{{ $t('Good Performance') }} {{ person.performance }}%</span>
              <span v-else class="text-red-500">{{ $t('Needs Improvement') }} {{ $t(person.performance) }}%</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      topPerformers: [
        { rank: 1, name: 'John Doe', initials: 'JD', sales: '150,000', performance: 92, color: 'linear-gradient(135deg, #ff7b7b, #ffcc7b)' },
        { rank: 2, name: 'Jane Smith', initials: 'JS', sales: '135,000', performance: 88, color: 'linear-gradient(135deg, #7bffcc, #7b7bff)' },
        { rank: 3, name: 'Bob Johnson', initials: 'BJ', sales: '120,000', performance: 85, color: 'linear-gradient(135deg, #ff7bff, #ff7b7b)' },
        { rank: 4, name: 'Alice Brown', initials: 'AB', sales: '110,000', performance: 82, color: 'linear-gradient(135deg, #7b7bff, #ffcc7b)' },
      ],
      selectedIndex: null,
    };
  },
  computed: {
    themeClass() {
      return this.$store.state.theme === 'dark'
        ? 'bg-gray-700 text-white'  // Dark background with white text
        : 'bg-white text-gray-800';  // Light background with dark text
    },
  },
  methods: {
    selectRow(index) {
      this.selectedIndex = index;
    },
  },
};
</script>
<style scoped>
.table-container {
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none; /* For Firefox */
  -ms-overflow-style: none;  /* For Internet Explorer and Edge */
}

.table-container::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Opera */
}

.table-header th {
  text-transform: uppercase;
}

.table-row {
  cursor: pointer;
}

.table-row:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
