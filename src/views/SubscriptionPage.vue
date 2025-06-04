<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800">Choose Your Meeting Plan</h1>
        <p class="mt-4 text-gray-600 text-lg">
          Our flexible plans are designed for individuals, teams, and enterprises to manage meetings with ease.
        </p>
      </div>

      <!-- Plans -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(plan, index) in plans"
          :key="index"
          class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-6 flex flex-col"
        >
          <h2 class="text-2xl font-semibold text-indigo-700 mb-2">{{ plan.name }} Plan</h2>
          <p class="text-gray-700 mb-4">{{ plan.description }}</p>

          <ul class="text-sm text-gray-600 space-y-2 flex-1">
            <li v-for="(feature, i) in plan.features" :key="i" class="flex items-start">
              <span class="text-green-500 mr-2">✔</span>
              <span>{{ feature }}</span>
            </li>
          </ul>

          <div class="mt-6 text-center">
            <p class="text-3xl font-bold text-indigo-600">{{ plan.price }}</p>
            <p class="text-sm text-gray-500">per month</p>
            <button
              class="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium"
              @click="selectPlan(plan.name)"
            >
              Choose {{ plan.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Confirmation -->
      <div v-if="selectedPlan" class="mt-12 text-center">
        <p class="text-lg text-gray-700">
          You've selected the <span class="font-bold text-indigo-600">{{ selectedPlan }}</span> plan.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const selectedPlan = ref(null);

const plans = [
  {
    name: 'Starter',
    price: '$10',
    description: 'Ideal for individuals and freelancers managing occasional meetings.',
    features: [
      'Up to 10 meetings/month',
      'Max 10 participants per meeting',
      'Email reminders',
      'Meeting notes & summaries',
      'Basic calendar integration'
    ]
  },
  {
    name: 'Team',
    price: '$25',
    description: 'Great for small teams needing collaborative scheduling and recordings.',
    features: [
      'Unlimited meetings',
      'Up to 50 participants',
      'Meeting recording & playback',
      'Google & Outlook calendar sync',
      'Team workspace & shared notes'
    ]
  },
  {
    name: 'Enterprise',
    price: '$59',
    description: 'Designed for large organizations with high security and customization needs.',
    features: [
      'Unlimited everything',
      'Up to 500 participants',
      'Custom branding',
      'Advanced reporting & analytics',
      '24/7 live support',
      'SSO & Admin controls'
    ]
  }
];

function selectPlan(name) {
  selectedPlan.value = name;
}
</script>
