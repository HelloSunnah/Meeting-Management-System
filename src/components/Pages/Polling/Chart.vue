<template>
    <div class="w-full h-64 bg-white rounded-xl shadow-md p-4">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </template>
  
  <script>
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
  } from 'chart.js';
  import { Bar } from 'vue-chartjs';
  
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement
  );
  
  export default {
    name: 'PollBarChart',
    components: { Bar },
    props: {
      votes: {
        type: Array,
        required: true,
      },
    },
    computed: {
      chartData() {
        const colors = [
          'rgba(34,197,94,0.9)',  // Green
          'rgba(59,130,246,0.9)', // Blue
          'rgba(245,158,11,0.9)', // Amber
          'rgba(239,68,68,0.9)',  // Red
          'rgba(139,92,246,0.9)', // Violet
          'rgba(236,72,153,0.9)', // Pink
          'rgba(249,115,22,0.9)', // Orange
          'rgba(99,102,241,0.9)', // Indigo
        ];
  
        return {
          labels: this.votes.map(v => v.option),
          datasets: [
            {
              label: 'Votes',
              data: this.votes.map(v => v.count),
              backgroundColor: colors,
              borderRadius: 10,
              borderSkipped: false,
              borderColor: '#fff',
              barPercentage: 0.55,
              categoryPercentage: 0.6,
              hoverBackgroundColor: colors.map(c => c.replace('0.9', '1')),
            },
            {
              label: 'Trend',
              type: 'line',
              data: this.votes.map(v => v.count),
              borderColor: 'rgba(107,114,128,0.8)',
              borderWidth: 2,
              backgroundColor: 'transparent',
              tension: 0.4,
              pointBackgroundColor: '#F87171',
              pointRadius: 5,
              pointHoverRadius: 7,
              pointBorderWidth: 2,
            },
          ],
        };
      },
      chartOptions() {
        return {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1000,
            easing: 'easeOutQuart',
          },
          plugins: {
            tooltip: {
              backgroundColor: '#1F2937',
              titleColor: '#F9FAFB',
              bodyColor: '#D1D5DB',
              padding: 12,
              callbacks: {
                label: (context) => {
                  const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                  const value = context.raw;
                  const percent = ((value / total) * 100).toFixed(1);
                  return `${context.label}: ${value} vote(s) (${percent}%)`;
                },
              },
            },
            legend: {
              position: 'bottom',
              labels: {
                color: '#6B7280',
                boxWidth: 14,
                padding: 20,
                font: {
                  size: 13,
                  family: 'Inter, sans-serif',
                },
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: '#6B7280',
                font: {
                  family: 'Inter',
                },
              },
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                color: '#6B7280',
                font: {
                  family: 'Inter',
                },
              },
              grid: {
                color: '#F3F4F6',
                drawBorder: false,
              },
            },
          },
        };
      },
    },
  };
  </script>
  