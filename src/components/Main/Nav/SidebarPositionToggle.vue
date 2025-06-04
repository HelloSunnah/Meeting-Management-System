<template>
    <label class="relative inline-block w-16 h-8 ml-4">
      <input type="checkbox" @click="togglePosition" class="sr-only" />
      <span class="block absolute inset-0 rounded-full bg-gray-600 transition-all duration-300"></span>
      <span
        :class="{ 'translate-x-8': sidebarPosition === 'right' }"
        class="block absolute inset-0 left-1 top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 transform"
      ></span>
      <span
        v-if="sidebarPosition === 'right'"
        class="absolute right-6 top-1/2 transform -translate-y-1/2 text-white text-xs px-2 py-1 font-bold"
        >Left</span
      >
      <span
        v-if="sidebarPosition === 'left'"
        class="absolute left-5 top-1/2 transform -translate-y-1/2 text-white text-xs px-2 py-1 font-bold"
        >Right</span
      >
    </label>
  </template>
  
  <script>
  export default {
    name: "SidebarPositionToggle",
    props: {
      sidebarPosition: {
        type: String,
        required: true,
      },
    },
    methods: {
      togglePosition() {
        this.$emit("togglePosition");
      },
    },
  };
  </script>
  