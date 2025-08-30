<template>
  <nav :class="themeClass" class="shadow-lg shadow-grey-100/50 p-4 flex justify-between items-center">
    <SidebarToggle @toggleSidebar="toggleSidebar" :theme="theme" class="hidden md:block" />
    <div class="flex-grow"></div>
    <LanguageSelector v-model="selectedLanguage" />
    <SidebarPositionToggle @togglePosition="togglePosition" :sidebarPosition="sidebarPosition" />
    <ThemeToggle @toggleTheme="toggleTheme" :theme="theme" />
    <LogoutButton @click="showModal = true" />


    <router-link to="/profile"
      class="ml-4 flex items-center space-x-2 bg-white dark:bg-gray-700 px-3 py-1 rounded-full shadow-sm">
      <!-- Icon -->
      <svg class="w-5 h-5 text-gray-500 dark:text-gray-300" fill="none" stroke="currentColor" stroke-width="2"
        viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M5.121 17.804A8 8 0 1116.88 6.196a8 8 0 01-11.757 11.608z" />
      </svg>

      <!-- Username -->
      <span class="text-sm font-medium text-gray-800 dark:text-white truncate max-w-[120px]">
        {{ loginUserName }}
      </span>
    </router-link>


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
      showModal: false, loginUserName: sessionStorage.getItem("login_user_name") || "",

      selectedLanguage: this.$i18n ? this.$i18n.locale : "en",
    };
  },
  computed: {
    ...mapState(["theme", "sidebarPosition"]),
    themeClass() {
      return this.theme === "dark" ? "bg-gray-500 text-white" : "bg-gray-300 text-black";
    },
  },
  watch: {
    selectedLanguage(newLang) {
      if (this.$i18n) {
        this.$i18n.locale = newLang;
      }
    },
    sidebarPosition(newPosition) {
      sessionStorage.setItem("sidebarPosition", newPosition);
    }
  },
  mounted() {
    const savedPosition = sessionStorage.getItem("sidebarPosition");
    if (savedPosition) {
      this.$store.commit("setSidebarPosition", savedPosition);
    }
  },
  methods: {
    ...mapActions(["changeTheme"]),
    toggleSidebar() {
      this.$emit("toggleSidebar");
    },
    toggleTheme() {
      const newTheme = this.theme === "dark" ? "light" : "dark";
      this.changeTheme(newTheme);
    },
    togglePosition() {
      const newPosition = this.sidebarPosition === "left" ? "right" : "left";
      this.$store.commit("setSidebarPosition", newPosition);
      this.$emit("toggle-sidebar-position", newPosition);
    },
    logout() {
      const token = sessionStorage.getItem("token");
      axios.post(apiEndpoints.logout, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(() => {
          sessionStorage.removeItem("token");
          localStorage.removeItem("token");
          this.$router.push("/");
        })
        .catch(error => {
          console.error("Logout failed:", error);
          sessionStorage.removeItem("token");
          localStorage.removeItem("token");

          this.$router.push("/");
        });
    }
  },
};
</script>
