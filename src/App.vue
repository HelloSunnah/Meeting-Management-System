<template>
  <div :class="themeClass" class="flex flex-col min-h-screen overflow-auto scrollbar-hidden">
    <!-- Sidebar -->
    <div class="flex flex-grow flex-col">
      <Sidebar v-if="!isAuthPage" :isOpen="isSidebarOpen" :theme="theme" :position="sidebarPosition"
        :class="sidebarPosition === 'left' ? 'sidebar-left' : 'sidebar-right'" />
    </div>

    <div class="flex-1 flex flex-col relative">
      <!-- Navbar -->
      <Navbar v-if="!isAuthPage" @toggleSidebar="toggleSidebar" @toggle-sidebar-position="toggleSidebarPosition"
        :class="navbarClasses" class="fixed top-0 left-0 right-0 z-10" />

      <!-- Main Content -->
      <main :class="mainContentClasses" class="flex-1 overflow-y-auto pt-[60px] pb-[60px] no-scrollbar">
        <router-view />
      </main>

      <!-- Footer -->
      <Footer v-if="!isAuthPage" class="fixed bottom-0 left-0 right-0 z-10" />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Navbar from "./components/Main/Nav/Navbar.vue";
import Sidebar from "./components/Main/Sidebar/Sidebar.vue";
import Footer from "./components/Main/Footer.vue";
import { useToast } from "vue-toastification";

export default {
    setup() {
    const toast = useToast();
    return { toast };
  },
  components: {
    Navbar,
    Sidebar,
    Footer,
  },
  data() {
    return {
      isSidebarOpen: true,
      sidebarPosition: this.getLocalStorage('sidebarPosition', 'left'),
    };
  },
  computed: {
    ...mapState(["theme"]), 
    isAuthPage() {
      return (
        this.$route.name === "Login" || this.$route.name === "Registration" || this.$route.name === "Overview" ||this.$route.name === "subscriptionDesign" 
      );
    },
    navbarClasses() {
      if (this.isAuthPage) return {}; 
      return {
        'ml-[14%]': this.isSidebarOpen && this.sidebarPosition === 'left',
        'ml-[5%]': !this.isSidebarOpen && this.sidebarPosition === 'left',
        'mr-[14%]': this.isSidebarOpen && this.sidebarPosition === 'right',
        'mr-[5%]': !this.isSidebarOpen && this.sidebarPosition === 'right',
      };
    },
    mainContentClasses() {
      if (this.isAuthPage) return {};
      return {
        'ml-[14%]': this.isSidebarOpen && this.sidebarPosition === 'left',
        'ml-[5%]': !this.isSidebarOpen && this.sidebarPosition === 'left',
        'mr-[14%]': this.isSidebarOpen && this.sidebarPosition === 'right',
        'mr-[5%]': !this.isSidebarOpen && this.sidebarPosition === 'right',
        'transition-all': true,
        ...(this.theme === "dark" ? { 'bg-gray-800': true } : { 'bg-gray-200': true }),
      };
    },
    themeClass() {
      return this.theme === "dark" ? "dark-theme" : "light-theme";
    },
  },
  methods: {
    getLocalStorage(key, defaultValue) {
      return localStorage.getItem(key) || defaultValue;
    },
    setLocalStorage(key, value) {
      localStorage.setItem(key, value);
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    toggleSidebarPosition(position) {
      this.sidebarPosition = position;
      this.setLocalStorage('sidebarPosition', this.sidebarPosition);
    },
  },
};
</script>

<script setup>
import apiEndpoints from '@/config/apiConfig';
import { onMounted, onUnmounted } from 'vue'
import axios from 'axios'


let activityEvents = ['mousemove', 'keydown', 'click']
let activityTimeout

function updateLastActivity() {
  const now = Date.now()
  localStorage.setItem('lastActivity', now)
}

function sendPingToServer() {
  const last = parseInt(localStorage.getItem('lastActivity') || Date.now())
  const isInactive = Date.now() - last > 5 * 60 * 1000
  const token = localStorage.getItem("token");
  axios.post(apiEndpoints.userActivity, {}, {
  headers: { Authorization: `Bearer ${token}` },
})
    .catch(() => {
      console.warn("Failed to update activity.")
    })
}

onMounted(() => {
  activityEvents.forEach(event =>
    window.addEventListener(event, updateLastActivity)
  )
  updateLastActivity()

  activityTimeout = setInterval(sendPingToServer, 60000) // every 1 min
})

onUnmounted(() => {
  activityEvents.forEach(event =>
    window.removeEventListener(event, updateLastActivity)
  )
  clearInterval(activityTimeout)
})
</script>


<style scoped>

.sidebar-left {
  position: fixed;
  top: 0;
  left: 0;
  height: calc(100% - 60px);
  width: 250px;
  z-index: 10;
  transition: left 0.3s ease;
}

.sidebar-right {
  position: fixed;
  top: 0;
  right: 0;
  height: calc(100% - 60px);
  width: 250px;
  z-index: 10;
  transition: right 0.3s ease;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.scrollbar-hidden {
  scrollbar-width: none; 
  -ms-overflow-style: none;
}
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.navbar-left {
  margin-left: 250px;
  transition: margin-left 0.3s ease-in-out;
}

.navbar-right {
  margin-right: 250px;
  transition: margin-right 0.3s ease-in-out;
}

.navbar-no-sidebar {
  margin-left: 0;
  margin-right: 0;
  width: 100%;
  transition: margin-left 0.3s ease-in-out, margin-right 0.3s ease-in-out;
}
.content {
  padding: 20px;
  transition: margin-left 0.3s ease-in-out, margin-right 0.3s ease-in-out;
}
body:not(.auth-page) .sidebar-left,
body:not(.auth-page) .sidebar-right {
}

footer {
  height: 60px;
  background-color: #f1f1f1;
}

.auth-page .content {
  margin-left: 0;
  margin-right: 0;
}
@media screen and (max-width: 768px) {

  .sidebar-left,
  .sidebar-right {
    width: 70%;
  }

  .navbar-left,
  .navbar-right {
    margin-left: 0;
    margin-right: 0;
  }

  .content {
    margin-left: 0;
    margin-right: 0;
  }
}

@media screen and (max-width: 480px) {

  .sidebar-left,
  .sidebar-right {
    width: 100%;
  }

  .content {
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
