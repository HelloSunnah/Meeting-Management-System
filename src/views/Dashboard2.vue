<template>
  <div :class="['min-h-screen p-6', themeClass]">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-center border-b pb-4" :class="borderClass">
      <h1 class="text-2xl font-bold mb-4 md:mb-0">{{ activeTabName }}</h1>
      <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          class="px-4 py-2 rounded-lg border w-full md:w-auto"
          :class="inputClass"
          placeholder="Jan 20, 2023 - Feb 09, 2023"
          readonly
        />
        <button class="px-4 py-2 rounded-lg flex items-center space-x-2" :class="buttonClass">
          ⬇️ Export Data
        </button>
      </div>
    </div>
    <div class="flex flex-wrap space-x-6 border-b mt-4" :class="borderClass">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        @click="setActiveTab(tab)"
        :class="[
          'py-2 px-4 mb-2',
          activeTab === tab.component ? 'border-b-2 border-blue-500' : ''
        ]"
      >
        {{ tab.name }}
      </button>
    </div>
    <div class="mt-6">
      <component :is="activeTab"></component>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Overview from "@/components/Dashboard/Overview.vue";
import Analytics from "@/components/Dashboard/Analytics.vue";
import Reports from "@/components/Dashboard/Reports.vue";
import Notifications from "@/components/Dashboard/Overview.vue";

export default {
  data() {
    return {
      tabs: [
        { name: 'Overview', component: 'Overview' },
        { name: 'Analytics', component: 'Analytics' },
        { name: 'Reports', component: 'Reports' },
        { name: 'Notifications', component: 'Notifications' },
      ],
      activeTab: 'Analytics',
      activeTabName: 'Analytics',
    };
  },
  computed: {
    ...mapState(['theme']),
    themeClass() {
      return this.theme === 'dark'
        ? 'bg-gray-900 text-white'
        : 'bg-gray-100 text-gray-800';
    },
    borderClass() {
      return this.theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
    },
    inputClass() {
      return this.theme === 'dark'
        ? 'bg-gray-800 text-white border-gray-600'
        : 'bg-white text-gray-800 border-gray-400';
    },
    buttonClass() {
      return this.theme === 'dark'
        ? 'bg-gray-700 text-white'
        : 'bg-gray-200 text-gray-800';
    },
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab.component;
      this.activeTabName = tab.name;
    },
  },
  components: {
    Overview,
    Analytics,
    Reports,
    Notifications,
  },
};
</script>
