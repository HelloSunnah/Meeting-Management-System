<template>
  <div :class="['grid grid-cols-1 sm:grid-cols-2 rounded-lg lg:grid-cols-1 gap-6', Theme]">
    <div class="card shadow-lg p-5 rounded-lg">
      <h3 :class="headerTextClass" class="text-sm font-semibold">{{$t('CPA by Campaign')}}</h3>
      <div class="mt-6">
        <div v-for="(campaign, index) in cpaData" :key="index" class="mb-4">
          <div :class="['text-sm font-medium mb-2', textClass]">{{$t(campaign.name)}}</div>
          <div :class="['relative w-full h-7 rounded-full overflow-hidden', barWrapperClass]">
            <div
              class="absolute top-0 left-0 h-full text-white text-sm flex items-center justify-center rounded-full px-2 transition-all ease-in-out duration-300"
              :style="{
                width: (Math.min(campaign.value, 1200) / 1200 * 100) + '%',
                background: progressBarGradient,
              }">
              €{{ campaign.value.toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CPAViz',
  data() {
    return {
      cpaData: [
        { name: 'Campaign 1', value: 419 },
        { name: 'Campaign 2', value: 1118 },
        { name: 'Campaign 3', value: 678 },
        { name: 'Campaign 4', value: 278 }
      ]
    }
  },
  computed: {
    // Dynamically apply theme classes for the entire component
    Theme() {
      return this.$store.state.theme === 'dark' 
        ? 'bg-gray-700 text-white'  // Dark mode classes
        : 'bg-white text-gray-800'; // Light mode classes
    },
    // Adjust text color for campaign names based on theme
    textClass() {
      return this.$store.state.theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
    },
    // Dynamically apply background color for the wrapper in light mode/dark mode
    barWrapperClass() {
      return this.$store.state.theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200';
    },
    // Dynamically set a gradient background for progress bars
    progressBarGradient() {
      return this.$store.state.theme === 'dark'
        ? 'linear-gradient(to right, #4C9EFF, #42A5F5)'  // Dark mode gradient
        : 'linear-gradient(to right, #d2c1e3, #9682ab)'; // Light mode gradient
    },
    // Set color for the header dynamically based on theme
    headerTextClass() {
      return this.$store.state.theme === 'dark' ? 'text-white' : 'text-gray-900';
    }
  }
}
</script>

<style scoped>
/* Smooth transition for the progress bar */
.card {
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
