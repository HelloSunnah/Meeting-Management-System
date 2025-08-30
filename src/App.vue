<template>
  <div :class="themeClass" class="flex flex-col min-h-screen overflow-auto scrollbar-hidden">
    <div class="flex flex-grow flex-col">


<Sidebar
  v-if="!isAuthPage"
  :isOpen="isSidebarOpen"
  :theme="theme"
  :position="sidebarPosition"
  :class="[
    sidebarPosition === 'left' ? 'sidebar-left' : 'sidebar-right',
    'sidebar'
  ]"
/>



    </div>
    <div class="flex-1 flex flex-col relative">
<Navbar
  v-if="!isAuthPage"
  class="navbar fixed top-0 left-0 right-0 z-10"
  @toggleSidebar="toggleSidebar"
  @toggle-sidebar-position="toggleSidebarPosition"
  :class="navbarClasses"
/>
      <main :class="mainContentClasses" class="flex-1 overflow-y-auto pt-[60px] pb-[60px] no-scrollbar">
        <router-view />
      </main>
<Footer
  v-if="!isAuthPage"
  class="footer fixed bottom-0 left-0 right-0 z-10"
/>    </div>
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
      sidebarPosition: this.getsessionStorage('sidebarPosition', 'left'),
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
    getsessionStorage(key, defaultValue) {
      return sessionStorage.getItem(key) || defaultValue;
    },
    setsessionStorage(key, value) {
      sessionStorage.setItem(key, value);
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    toggleSidebarPosition(position) {
      this.sidebarPosition = position;
      this.setsessionStorage('sidebarPosition', this.sidebarPosition);
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
  sessionStorage.setItem('lastActivity', now)
}
// function sendPingToServer() {
//   const last = parseInt(sessionStorage.getItem('lastActivity') || Date.now());
//   const isInactive = Date.now() - last > 5 * 60 * 1000;
//   const token = sessionStorage.getItem("token");

//   if (isInactive) {
//     // Call logout API
//     axios.post(apiEndpoints.logout, {}, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//     .then(() => {
//       sessionStorage.clear(); // Optionally clear session
//       window.location.href = "/login"; // Redirect to login or home page
//     })
//     .catch(() => {
//       console.warn("Logout failed.");
//     });
//     return; // Skip sending the activity ping if logging out
//   }
//   // Send user activity ping if active
//   axios.post(apiEndpoints.userActivity, {}, {
//     headers: { Authorization: `Bearer ${token}` },
//   })
//   .catch(() => {
//     console.warn("Failed to update activity.");
//   });
// }

function sendPingToServer() {
  const token = sessionStorage.getItem("token");

  if (!token) return; // Skip if no token available

  axios.post(apiEndpoints.userActivity, {}, {
    headers: { Authorization: `Bearer ${token}` },
  })
  .catch(() => {
    console.warn("Failed to update activity.");
  });

  // Optionally update lastActivity time
  sessionStorage.setItem('lastActivity', Date.now());
}

// Start pinging every 30 seconds
setInterval(sendPingToServer, 30 * 1000); // 30,000 ms = 30 seconds


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
@media print {
  .navbar,
  .footer,
  .sidebar-left,
  .sidebar-right {
    display: none !important;
  }

  body {
    margin: 0 !important;
  }

  main {
    padding: 0 !important;
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
