<template>
  <div :class="['sidebar', positionClass, { 'sidebar-open': isOpen }]" :style="sidebarStyle" :data-theme="theme">
    <!-- Sidebar Header -->
    <router-link to="/dashboard">
      <button class="text-gray-500 focus:outline-none">
        <img src="@/assets/img/ati-logo.png" alt="Admin Panel" class="h-12 w-auto" />
      </button>
    </router-link>

    <!-- Sidebar Drag Handle -->
    <div class="sidebar-drag-handle" @mousedown="startDrag" v-if="isOpen"></div>

    <!-- Sidebar Menu -->
    <nav class="flex flex-col space-y-4 px-2 pb-6 pt-8 flex-grow overflow-y-auto max-h-screen">
      <ul class="list-none space-y-1" @dragover.prevent @drop="onDrop" @dragenter.prevent>
        <!-- Fixed "Dashboard" Item -->
        <li v-for="(item, index) in menuItems" :key="item.id" :data-index="index" class="relative"
          :draggable="item.id !== 'dashboard'" @dragstart="onDragStart(index, item)" @dragend="onDragEnd">
          <!-- Menu Button -->
          <button @click="handleItemClick(item)" :class="[
            theme === 'dark'
              ? 'text-white bg-gray-800'
              : 'text-gray-900 bg-gray-300', // text and background based on theme
            currentRoute === item.route
              ? 'bg-blue-400 text-white border-l-4 border-blue-500' // Highlighted/Bordered when active
              : theme === 'dark'
                ? 'text-gray-300 bg-gray-700'
                : 'text-gray-900 bg-gray-100',
            'flex items-center w-full hover:text-white hover:bg-gray-500 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50',
          ]">
            <span v-if="isOpen && position === 'right'" class="ml-4 text-base font-medium hidden md:block"
              :title="isOpen && position === 'right' ? $t(item.label) : ''">{{ $t(item.label) }}</span>
            <div :class="iconClass(item)">
              <i :class="item.icon" class="w-6 h-6 mt-2"></i>
            </div>
            <span v-if="isOpen && position !== 'right'" class="ml-4 text-base font-medium hidden md:block"
              :title="isOpen && position === 'right' ? $t(item.label) : ''">{{ $t(item.label) }}</span>
          </button>

          <!-- Collapsible Submenu -->
          <ul v-show="item.subItems && item.subItems.length && !item.collapsed" class="pl-4 space-y-2 mt-2">
            <li v-for="sub in item.subItems" :key="sub.id" class="bg-blue-100 rounded-lg shadow-md">
              <button @click="handleSubItemClick(sub)" :class="[
                theme === 'dark'
                  ? 'bg-gray-800 text-white'
                  : 'bg-blue-100 text-gray-900', // text and background for sub-items
                'flex items-center w-full hover:text-white hover:bg-gray-500 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50',
                currentRoute === sub.route
                  ? 'bg-blue-200 text-white border-l-4 border-blue-500' // Highlighted/Bordered when active
                  : theme === 'dark'
                    ? 'text-gray-300 bg-gray-700'
                    : 'text-gray-900 bg-gray-100',
              ]">
                <span v-if="isOpen && position === 'right'" class="ml-4 text-base font-medium hidden md:block">{{
                  $t(sub.label) }}</span>
                <div :class="iconClass(sub)">
                  <i :class="sub.icon" class="w-6 h-6 mt-2"></i>
                </div>
                <span v-if="isOpen && position !== 'right'" :title="isOpen && position === 'right' ? $t(sub.label) : ''"
                  class="ml-4 text-base font-medium hidden md:block">{{ $t(sub.label) }}</span>
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";

export default {
  props: {
    theme: { type: String, required: true },
    position: { type: String, required: true },
    isOpen: { type: Boolean, default: false },
  },

  setup(props, { emit }) {

    // onMounted(() => {
    //   const savedState = localStorage.getItem("menuState");
    //   if (savedState) {
    //     menuItems.value = JSON.parse(savedState);
    //   }
    // });
    // Menu Items
    const menuItems = ref([
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "fas fa-tachometer-alt", // ✅ Good as-is
        route: "/dashboard",
      },

      {
        id: "Schedule",
        label: "Schedule",
        icon: "fas fa-clock", // More appropriate for scheduling
        collapsed: true,
        subItems: [
          {
            id: "meeting_schedule",
            label: "Meeting Schedule",
            route: "/meeting/schedule",
            icon: "fas fa-calendar-check", // Represents scheduled meetings
          },
      
        ],
      },
    
      {
        id: "Polling",
        label: "Polling",
        icon: "fas fa-poll", // Specific for polling
        collapsed: true,
        subItems: [
          {
            id: "pollings",
            label: "Polling",
            route: "/pollings",
            icon: "fas fa-poll", // Matches parent
          },
          {
            id: "pollingVote",
            label: "Vote",
            route: "/polling/vote",
            icon: "fas fa-vote-yea", // Perfect for voting
          }, {
            id: "voting_result",
            label: "Vote Result",
            route: "/voting/result",
            icon: "fas fa-vote-yea", // Perfect for voting
          },
        ],
      },
      {
        id: "Setup",
        label: "Setup",
        icon: "fas fa-cogs", // Gear icon suits setup/configuration
        collapsed: true,
        subItems: [
          {
            id: "register",
            label: "Register",
            route: "/register",
            icon: "fas fa-user-plus", // User registration
          },
          {
            id: "clients",
            label: "Client",
            route: "/setup/client",
            icon: "fas fa-user-tie", // Represents clients
          },
          {
            id: "projects",
            label: "Project",
            route: "/setup/project",
            icon: "fas fa-project-diagram", // Matches project concept
          },
          {
            id: "meetingLocation",
            label: "Meeting Room",
            route: "/setup/meetingLocation",
            icon: "fas fa-map-marker-alt", // Location marker
          },
          {
            id: "pollOption",
            label: "Poll Option",
            route: "/setup/pollOption",
            icon: "fas fa-list-ul", // Represents poll options
          },
        ],
      },
    ]);

    // Refs & Watchers
    const isOpen = ref(props.isOpen);
    watch(
      () => props.isOpen,
      (newVal) => (isOpen.value = newVal)
    );

    const router = useRouter();
    const route = useRoute();
    const currentRoute = computed(() => route.path);

    // Position class for the sidebar
    const positionClass = computed(() =>
      props.position === "right" ? "right-0" : "left-0"
    );

    // Dynamic class for icon
    const iconClass = (item) => ({
      "w-12 h-10 flex items-center justify-center transition-all": true,
      "rounded-l-full ml-auto": props.position === "right",
      "rounded-r-full": props.position !== "right",
      "bg-white-600 text-black": currentRoute.value === item.route,
      "bg-gray-400 text-gray-600": currentRoute.value !== item.route,
    });

    const handleItemClick = (item) => {
      if (item.subItems && item.subItems.length) {
        // Close all other submenus before opening the clicked one
        menuItems.value.forEach((menuItem) => {
          if (menuItem !== item) {
            menuItem.collapsed = true; // Close other submenus
          }
        });
        // Toggle the current submenu
        item.collapsed = !item.collapsed;

        // Save the updated collapsed state in localStorage
        localStorage.setItem("menuState", JSON.stringify(menuItems.value));
      } else {
        router.push(item.route); // If no subitems, navigate to the route
      }
    };


    // Handle sub-menu item click
    const handleSubItemClick = (subItem) => router.push(subItem.route);

    // Sidebar style (dynamic width)
    const sidebarStyle = computed(() => ({
      width: isOpen.value ? "14%" : "5%",
      transition: "width 0.3s ease-in-out",
    }));

    // Drag-and-drop logic
    let draggedItemIndex = null;

    const onDragStart = (index, item) => {
      if (item.id !== "dashboard") {
        draggedItemIndex = index;
      }
    };

    const onDragEnd = () => {
      draggedItemIndex = null;
    };

    const onDrop = (event) => {
      const targetIndex = parseInt(
        event.target.closest("li").dataset.index,
        10
      );

      // Prevent the "Dashboard" item from being dragged or dropped in the first position
      if (
        draggedItemIndex !== null &&
        draggedItemIndex !== targetIndex &&
        targetIndex !== 0
      ) {
        // Reorder the menu items, skip "dashboard" (fixed in first position)
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
    };
  },
};
</script>

<style>
/* Base Sidebar Styles */
.sidebar button,
.sidebar button i {
  transition: color 0.3s ease;
  /* Smooth transition for color changes */
}

/* Dark theme - Ensure all text and icons are white */
.sidebar[data-theme="dark"] button {
  color: white;
  /* All text white in dark theme */
}

.sidebar[data-theme="dark"] button i {
  color: white;
  /* Icons are white in dark theme */
}

.sidebar[data-theme="dark"] .sidebar-drag-handle {
  background-color: #333;
  /* Darker drag handle */
}

/* Light theme - Ensure all text and icons are dark */
.sidebar[data-theme="light"] button {
  color: #1f2937;
  /* Dark gray text (gray-900) for light theme */
}

.sidebar[data-theme="light"] button i {
  color: #1f2937;
  /* Dark gray icons (gray-900) for light theme */
}

.sidebar[data-theme="light"] .sidebar-drag-handle {
  background-color: #ccc;
  /* Lighter drag handle */
}

/* Additional styles to ensure the overall design looks great */
.sidebar {
  background-color: #fff;
  /* Default white background */
}

.sidebar[data-theme="dark"] {
  background-color: oklch(0.446 0.03 256.802);
  /* Darker background for dark theme */
}

.sidebar[data-theme="light"] {
  background-color: #f9f9f9;
  /* Light background for light theme */
}

.sidebar button:hover {
  background-color: #4a5568;
  /* Hover effect for dark theme */
}

.sidebar[data-theme="dark"] button:hover {
  background-color: #4a5568;
  /* Hover effect for dark theme */
}

.sidebar[data-theme="light"] button:hover {
  background-color: #e2e8f0;
  /* Hover effect for light theme */
}

.sidebar button:focus {
  outline: none;
  /* Remove the default outline on focus */
}
</style>
