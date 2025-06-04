<template>
    <button
      @click="toggleSidebar"
      :class="{
        'text-white': theme === 'dark',
        'text-black': theme === 'light',
      }"
      class="focus:outline-none"
      aria-label="Toggle Sidebar"
    >
      <svg
        class="MuiSvgIcon-root cursor-pointer"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        height="24"
        width="24"
      >
        <path :fill="theme === 'dark' ? 'white' : 'black'" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
      </svg>
    </button>
  </template>
  
  <script>
  export default {
    name: "SidebarToggle",
    props: {
      theme: {
        type: String,
        required: true,
      },
    },
    methods: {
      toggleSidebar() {
        this.$emit("toggleSidebar");
      },
    },
  };
  </script>
  