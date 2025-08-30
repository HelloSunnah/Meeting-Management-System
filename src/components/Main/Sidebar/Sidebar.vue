<template>
  <div :class="['sidebar', positionClass, { 'sidebar-open': isOpen }]" :style="sidebarStyle" :data-theme="theme">
    <!-- Sidebar Header -->
    <router-link to="/dashboard" class="inline-block">
      <img src="@/assets/img/ati-logo.png" alt="Admin Panel" class="h-20 w-60" />
    </router-link>

    <!-- Sidebar Drag Handle -->
    <div class="sidebar-drag-handle" @mousedown="startDrag" v-if="isOpen"></div>

    <!-- Sidebar Menu -->
    <nav class="flex flex-col space-y-4 px-2 pb-6 flex-grow overflow-y-auto max-h-screen">
      <ul class="list-none space-y-1" @dragover.prevent @drop="onDrop" @dragenter.prevent>
        <!-- Menu Items -->
        <li v-for="(item, index) in menuItems" :key="item.id" :data-index="index" class="relative"
          :draggable="item.id !== 'dashboard'" @dragstart="onDragStart(index, item)" @dragend="onDragEnd">
          <!-- Menu Button -->
          <button @click="handleItemClick(item)" :class="[
            theme === 'dark' ? 'text-white bg-gray-800' : 'text-gray-900 bg-gray-300',
            currentRoute === item.route
              ? 'bg-blue-400 text-white border-l-4 border-blue-500'
              : theme === 'dark'
                ? 'text-gray-300 bg-gray-700'
                : 'text-gray-900 bg-gray-100',
            'flex items-center w-full hover:text-white hover:bg-gray-500 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50',
          ]">
            <!-- Label and Unread Badge for Right Position -->
            <span v-if="isOpen && position === 'right'" class="ml-4 text-base font-medium hidden md:flex items-center"
              :title="$t(item.label)">
              {{ $t(item.label) }}
              <span v-if="item.id === 'LiveChat' && unreadCount > 0"
                class="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center shadow ml-2">
                {{ unreadCount }}
              </span>
            </span>

            <!-- Icon -->
            <div :class="iconClass(item)">
              <i :class="[item.icon, item.id === 'LiveChat' ? 'text-blue-500' : '', 'w-6 h-6 mt-2']"></i>
            </div>

            <!-- Label and Unread Badge for Left Position -->
            <span v-if="isOpen && position !== 'right'" class="ml-4 text-base font-medium hidden md:flex items-center"
              :title="$t(item.label)">
              {{ $t(item.label) }}
              <span v-if="item.id === 'LiveChat' && unreadCount > 0"
                class="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center shadow ml-2">
                {{ unreadCount }}
              </span>
            </span>
          </button>

          <!-- Collapsible Submenu -->
          <ul v-show="item.subItems && item.subItems.length && !item.collapsed" class="pl-4 space-y-2 mt-2">
            <li v-for="sub in item.subItems" :key="sub.id" class="bg-blue-100 rounded-lg shadow-md">
              <button @click="handleSubItemClick(sub)" :class="[
                theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-blue-100 text-gray-900',
                'flex items-center w-full hover:text-white hover:bg-gray-500 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50',
                currentRoute === sub.route
                  ? 'bg-blue-200 text-white border-l-4 border-blue-500'
                  : theme === 'dark'
                    ? 'text-gray-300 bg-gray-700'
                    : 'text-gray-900 bg-gray-100',
              ]">
                <span v-if="isOpen && position === 'right'" class="ml-4 text-base font-medium hidden md:block">
                  {{ $t(sub.label) }}
                </span>
                <div :class="iconClass(sub)">
                  <i :class="sub.icon" class="w-6 h-6 mt-2"></i>
                </div>
                <span v-if="isOpen && position !== 'right'" :title="isOpen && position === 'right' ? $t(sub.label) : ''"
                  class="ml-4 text-base font-medium hidden md:block">
                  {{ $t(sub.label) }}
                </span>
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import apiEndpoints from "@/config/apiConfig";

export default {
  props: {
    theme: { type: String, required: true },
    position: { type: String, required: true },
    isOpen: { type: Boolean, default: false },
  },
  setup(props) {
    const unreadCount = ref(0);
    let interval = null;

    const fetchUnreadCount = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found. Skipping unread count fetch.");
        return;
      }

      try {
        const response = await axios.get(apiEndpoints.unreadCount, {
          headers: { Authorization: `Bearer ${token}` },
        });
        unreadCount.value = response.data.unread_count || 0;
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    onMounted(() => {
      const token = localStorage.getItem("token");
      if (token) {
        fetchUnreadCount();
        interval = setInterval(fetchUnreadCount, 10000);
      }
    });

    onUnmounted(() => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    });

    // --- menu building logic ---
    const baseMenuItems = [
      {
        id: "LiveChat",
        label: "Live Chat",
        icon: "fas fa-comments fa-beat",
        route: "/liveChat",
      },
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "fas fa-tachometer-alt fa-bounce",
        route: "/dashboard",
      },
      {
        id: "Schedule",
        label: "Schedule",
        icon: "fas fa-calendar-alt fa-bounce",
        collapsed: true,
        subItems: [
          {
            id: "meeting_schedule",
            label: "Meeting Schedule",
            route: "/meeting/schedule",
            icon: "fas fa-calendar-check",
          },
        ],
      },
      {
        id: "Polling",
        label: "Polling",
        icon: "fas fa-poll fa-fade",
        collapsed: true,
        subItems: [
          {
            id: "pollings",
            label: "Polling",
            route: "/pollings",
            icon: "fas fa-poll",
          },
          {
            id: "pollingVote",
            label: "Vote",
            route: "/polling/vote",
            icon: "fas fa-vote-yea fa-beat",
          },
          {
            id: "voting_result",
            label: "Vote Result",
            route: "/voting/result",
            icon: "fas fa-chart-bar",
          },
        ],
      },
    ];

    const adminMenuItems = [
      {
        id: "Setup",
        label: "Setup",
        icon: "fas fa-cogs fa-spin",
        collapsed: true,
        subItems: [
          {
            id: "register",
            label: "Register",
            route: "/register",
            icon: "fas fa-user-plus",
          },
          {
            id: "clients",
            label: "Client",
            route: "/setup/client",
            icon: "fas fa-user-tie",
          },
          {
            id: "projects",
            label: "Project",
            route: "/setup/project",
            icon: "fas fa-project-diagram",
          },
          {
            id: "meetingLocation",
            label: "Meeting Room",
            route: "/setup/meetingLocation",
            icon: "fas fa-map-marker-alt",
          },
          {
            id: "pollOption",
            label: "Poll Option",
            route: "/setup/pollOption",
            icon: "fas fa-list-ul",
          },
        ],
      },
      {
        id: "Report",
        label: "Report",
        icon: "fas fa-file-alt fa-fade",
        collapsed: true,
        subItems: [
          {
            id: "meeting_report",
            label: "Meeting Report",
            route: "/meeting/report",
            icon: "fas fa-file-contract",
          },
        ],
      },
    ];

    const role_id = parseInt(sessionStorage.getItem("role_id") || "2");

    let menuItemsArray = baseMenuItems.slice();

    if (role_id === 1) {
      menuItemsArray.splice(2, 0, adminMenuItems[0]); // Insert Setup
      menuItemsArray.push(adminMenuItems[1]); // Add Report
    }

    const pollingPermission = sessionStorage.getItem("polling_create_per");
    // if (pollingPermission === "0") {
    //   menuItemsArray = menuItemsArray.filter((item) => item.id !== "Polling");
    // }

    const menuItems = ref(menuItemsArray);
    const isOpen = ref(props.isOpen);

    watch(() => props.isOpen, (newVal) => (isOpen.value = newVal));

    const router = useRouter();
    const route = useRoute();

    const currentRoute = computed(() => route.path);

    const positionClass = computed(() =>
      props.position === "right" ? "right-0" : "left-0"
    );

    const iconClass = (item) => ({
      "w-12 h-10 flex items-center justify-center transition-all": true,
      "rounded-l-full ml-auto": props.position === "right",
      "rounded-r-full": props.position !== "right",
      "bg-white-600 text-black": currentRoute.value === item.route,
      "bg-gray-400 text-gray-600": currentRoute.value !== item.route,
    });

    const handleItemClick = (item) => {
      if (item.subItems && item.subItems.length) {
        menuItems.value.forEach((menuItem) => {
          if (menuItem !== item) menuItem.collapsed = true;
        });
        item.collapsed = !item.collapsed;
        sessionStorage.setItem("menuState", JSON.stringify(menuItems.value));
      } else {
        router.push(item.route);
      }
    };

    const handleSubItemClick = (subItem) => router.push(subItem.route);

    const sidebarStyle = computed(() => ({
      width: isOpen.value ? "14%" : "5%",
      transition: "width 0.3s ease-in-out",
    }));

    let draggedItemIndex = null;

    const onDragStart = (index, item) => {
      if (item.id !== "dashboard") draggedItemIndex = index;
    };

    const onDragEnd = () => {
      draggedItemIndex = null;
    };

    const onDrop = (event) => {
      const targetIndex = parseInt(
        event.target.closest("li").dataset.index,
        10
      );
      if (
        draggedItemIndex !== null &&
        draggedItemIndex !== targetIndex &&
        targetIndex !== 1
      ) {
        const draggedItem = menuItems.value[draggedItemIndex];
        menuItems.value.splice(draggedItemIndex, 1);
        menuItems.value.splice(targetIndex, 0, draggedItem);
      }
    };

    return {
      menuItems,
      isOpen,
      currentRoute,
      positionClass,
      handleItemClick,
      handleSubItemClick,
      iconClass,
      sidebarStyle,
      onDragStart,
      onDragEnd,
      onDrop,
      unreadCount,
    };
  },
};
</script>

<style>
/* Your styles unchanged */
.sidebar button,
.sidebar button i {
  transition: color 0.3s ease;
}

.sidebar[data-theme="dark"] button {
  color: white;
}

.sidebar[data-theme="dark"] button i {
  color: white;
}

.sidebar[data-theme="dark"] .sidebar-drag-handle {
  background-color: #333;
}

.sidebar[data-theme="light"] button {
  color: #1f2937;
}

.sidebar[data-theme="light"] button i {
  color: #1f2937;
}

.sidebar[data-theme="light"] .sidebar-drag-handle {
  background-color: #ccc;
}

.sidebar {
  background-color: #fff;
}

.sidebar[data-theme="dark"] {
  background-color: oklch(0.446 0.03 256.802);
}

.sidebar[data-theme="light"] {
  background-color: #f9f9f9;
}

.sidebar button:hover {
  background-color: #4a5568;
}

.sidebar[data-theme="dark"] button:hover {
  background-color: #4a5568;
}

.sidebar[data-theme="light"] button:hover {
  background-color: #e2e8f0;
}

.sidebar button:focus {
  outline: none;
}
</style>
