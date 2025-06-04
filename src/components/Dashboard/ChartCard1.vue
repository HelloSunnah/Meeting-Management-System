<template>
  <!-- Charts Section -->
  <div :class="Theme" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
    <!-- Investment Overview -->
    <div
      :class="['investment-overview-card', containerTheme]"
      class="p-6 rounded-xl shadow-lg border-t-4 transition-all duration-300 hover:scale-105">
      <h2 :class="headerTextColor" class="text-lg font-semibold mb-4">Investment Overview</h2>
      <canvas ref="pieChart" class="w-full h-auto max-h-48"></canvas>
    </div>

    <!-- Revenue Trends -->
    <div
      :class="['revenue-trends-card', containerTheme]"
      class="p-6 rounded-xl shadow-lg border-t-4 transition-all duration-300 hover:scale-105">
      <h2 :class="headerTextColor" class="text-lg font-semibold mb-4">Revenue Trends</h2>
      <canvas ref="barChart" class="w-full h-auto max-h-48"></canvas>
    </div>

    <!-- User Growth -->
    <div
      :class="['user-growth-card', containerTheme]"
      class="p-6 rounded-xl shadow-lg border-t-4 transition-all duration-300 hover:scale-105">
      <h2 :class="headerTextColor" class="text-lg font-semibold mb-4">User Growth</h2>
      <canvas ref="lineChart" class="w-full h-auto max-h-48"></canvas>
    </div>

    <!-- Profit Distribution -->
    <div
      :class="['profit-distribution-card', containerTheme]"
      class="p-6 rounded-xl shadow-lg border-t-4 transition-all duration-300 hover:scale-105">
      <h2 :class="headerTextColor" class="text-lg font-semibold mb-4">Profit Distribution</h2>
      <canvas ref="doughnutChart" class="w-full h-auto max-h-48"></canvas>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'Chart',
  computed: {
    // Updated Theme without background color
    Theme() {
      return this.$store.state.theme === 'dark' ? 'text-white' : 'text-gray-800';
    },

    // Apply the container background color based on the theme
    containerTheme() {
      return this.$store.state.theme === 'dark' ? 'bg-gray-700' : 'bg-white';
    },

    // Header text color based on the theme
    headerTextColor() {
      return this.$store.state.theme === 'dark' ? 'text-white' : 'text-gray-800';
    }
  },

  mounted() {
    this.renderCharts();
  },

  methods: {
    renderCharts() {
      this.createChart(this.$refs.pieChart, 'pie', [38.6, 22.5, 30.8, 8.1]);
      this.createChart(this.$refs.barChart, 'bar', [30, 50, 70, 100]);
      this.createChart(this.$refs.lineChart, 'line', [10, 20, 30, 50, 70]);
      this.createChart(this.$refs.doughnutChart, 'doughnut', [25, 25, 25, 25]);
    },

    createChart(canvasRef, type, data) {
      new Chart(canvasRef.getContext('2d'), {
        type: type,
        data: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [{
            data: data,
            backgroundColor: this.getChartColors(type),
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' }
          },
          maintainAspectRatio: false // Allows the chart to resize based on the container size
        }
      });
    },

    getChartColors(type) {
      const lightColors = {
        pie: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        bar: ['#FF9F40', '#4BC0C0', '#FF6384', '#36A2EB'],
        line: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        doughnut: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      };

      const darkColors = {
        pie: ['#F472B6', '#60A5FA', '#34D399', '#FBBF24'],
        bar: ['#F472B6', '#34D399', '#60A5FA', '#FBBF24'],
        line: ['#F472B6', '#60A5FA', '#34D399', '#FBBF24'],
        doughnut: ['#F472B6', '#60A5FA', '#34D399', '#FBBF24']
      };

      return this.$store.state.theme === 'dark' ? darkColors[type] : lightColors[type];
    }
  }
};
</script>

<style scoped>
/* Tooltip visibility */
span:hover .absolute {
  display: block;
}
</style>
