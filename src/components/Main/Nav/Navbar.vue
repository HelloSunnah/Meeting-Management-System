<template>
  <nav :class="themeClass" class="shadow-lg shadow-grey-100/50 p-4 flex justify-between items-center">
    <!-- Toggle Sidebar Button -->
    <SidebarToggle @toggleSidebar="toggleSidebar" :theme="theme"class="hidden md:block"
  />

    <!-- Spacer between the elements -->
    <div class="flex-grow"></div>

    <!-- Language Selector -->
    <LanguageSelector v-model="selectedLanguage"  />  <!-- Correct usage of v-model -->

    <!-- Toggle Sidebar Position -->
    <SidebarPositionToggle @togglePosition="togglePosition" :sidebarPosition="sidebarPosition" />

    <!-- Theme Toggle -->
    <ThemeToggle @toggleTheme="toggleTheme" :theme="theme" />

    <!-- Logout Button -->
    <LogoutButton @click="showModal = true" />

    <!-- Modal for logout confirmation -->
    <LogoutModal v-if="showModal" :isVisible="showModal" @close="showModal = false" @logout="logout" />
  </nav>
</template>
<script>
import axios from "axios";

import SidebarToggle from "@/components/Main/Nav/SidebarToggle.vue";
import LanguageSelector from "@/components/Main/Nav/LanguageSelector.vue";
import SidebarPositionToggle from "@/components/Main/Nav/SidebarPositionToggle.vue";
import ThemeToggle from "@/components/Main/Nav/ThemeToggle.vue";
import LogoutButton from "@/components/Main/Nav/LogoutButton.vue";
import LogoutModal from "@/components/Modals/LogoutModal.vue";
import { mapState, mapActions } from "vuex";
import apiEndpoints from '@/config/apiConfig';

export default {
  name: "Navbar",
  components: {
    SidebarToggle,
    LanguageSelector,
    SidebarPositionToggle,
    ThemeToggle,
    LogoutButton,
    LogoutModal
  },
  data() {
    return {
      showModal: false,
      selectedLanguage: this.$i18n ? this.$i18n.locale : "en", // Initialize selectedLanguage with i18n locale
    };
  },
  computed: {
    ...mapState(["theme", "sidebarPosition"]), // Get theme and sidebarPosition from Vuex state
    themeClass() {
      return this.theme === "dark" ? "bg-gray-500 text-white" : "bg-gray-300 text-black";
    },
  },
  watch: {
    // Watch selectedLanguage and trigger a change in the i18n locale
    selectedLanguage(newLang) {
      if (this.$i18n) {
        this.$i18n.locale = newLang;
      }
    },
    // Watch sidebarPosition to persist the change to localStorage
    sidebarPosition(newPosition) {
      localStorage.setItem("sidebarPosition", newPosition); // Persist position in localStorage
    }
  },
  mounted() {
    // Check if there's a saved sidebar position in localStorage
    const savedPosition = localStorage.getItem("sidebarPosition");
    if (savedPosition) {
      this.$store.commit("setSidebarPosition", savedPosition); // Sync with Vuex store
    }
  },
  methods: {
    ...mapActions(["changeTheme"]), // Map theme change action from Vuex
    toggleSidebar() {
      this.$emit("toggleSidebar");
    },
    toggleTheme() {
      const newTheme = this.theme === "dark" ? "light" : "dark";
      this.changeTheme(newTheme); // Dispatch action to change theme
    },
    togglePosition() {
      // Toggle sidebar position between left and right
      const newPosition = this.sidebarPosition === "left" ? "right" : "left";
      this.$store.commit("setSidebarPosition", newPosition); // Update the position in Vuex store
      this.$emit("toggle-sidebar-position", newPosition); // Emit event
    },
    logout() {
  const token = localStorage.getItem("token");

  axios.post(apiEndpoints.logout, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(() => {
    localStorage.removeItem("token");
    this.$router.push("/"); // Redirect to login or home
  })
  .catch(error => {
    console.error("Logout failed:", error);
    // Fallback: still remove token to prevent access
    localStorage.removeItem("token");
    this.$router.push("/");
  });
}

  },
};
</script>
