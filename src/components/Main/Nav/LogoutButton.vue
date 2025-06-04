<template>
    <button
      class="logout-button flex items-center text-gray-800 text-2xl hover:text-yellow-400 ml-4"
      @click="onLogoutClick"
      aria-label="Logout"
    >
      <img src="@/assets/img/logout.webp" alt="Logout Icon" class="mr-1 w-8 h-8" />
    </button>
  </template>
  
  <script>
  export default {
    name: "LogoutButton",
    methods: {
      onLogoutClick() {
        this.$emit("click");
      },
    },
  };
  </script>
  