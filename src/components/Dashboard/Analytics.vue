<template>
  <div class="mt-6">
    <h2 class="text-lg font-bold mb-4">Detailed Analytics</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Customer Segmentation Chart -->
      <div class="bg-gray-900 p-4 rounded-lg">
        <h3 class="text-md font-semibold mb-2">Customer Segmentation</h3>
        <canvas ref="segmentationChart"></canvas>
      </div>
      <!-- Customer Retention Chart -->
      <div class="bg-gray-900 p-4 rounded-lg">
        <h3 class="text-md font-semibold mb-2">Customer Retention Rate</h3>
        <canvas ref="retentionChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import apiEndpoints from '@/config/apiConfig';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { useToast } from "vue-toastification";

export default {
    setup() {
    const toast = useToast();
    return { toast };
  },  name: 'Analytics',
  mounted() {
    this.drawSegmentationChart();
    this.drawRetentionChart();
  },
  methods: {
    drawSegmentationChart() {
      new Chart(this.$refs.segmentationChart, {
        type: 'bar',
        data: {
          labels: ['Medium Value', 'At Risk', 'Lost'],
          datasets: [{
            label: 'Customers',
            data: [5000, 8000, 1500],
            backgroundColor: '#3B82F6',
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    },
    drawRetentionChart() {
      new Chart(this.$refs.retentionChart, {
        type: 'line',
        data: {
          labels: ['Feb', 'Apr', 'Jun'],
          datasets: [{
            label: 'Retention Rate',
            data: [98, 96, 97],
            borderColor: '#3B82F6',
            borderWidth: 2,
            fill: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    },
  },
};
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 200px !important;
}
</style>
