<template>
  <div :class="themeClass" class="min-h-screen w-full flex p-8 justify-center items-center">
    <div :class="workflowClass" class="w-full p-8 rounded-2xl shadow-xl flex flex-col items-center">
      <FloatingButtons />

      <!-- Header -->
      <header class="text-center mb-8 space-y-4">
        <h1 class="text-3xl md:text-4xl font-extrabold text-teal-600">{{$t('Admin Workflow Dashboard')}}</h1>
        <h2 class="text-lg md:text-xl font-semibold text-gray-700">{{$t('Streamlined Admin Process')}}</h2>
        <p class="text-xs md:text-sm text-gray-500">{{$t('Manage your administrative tasks with precision, efficiency, and control.')}}</p>
      </header>

      <!-- Workflow Container -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
        <!-- Workflow Steps -->
        <div v-for="(step, index) in steps" :key="step.number" class="relative flex flex-col group">

    
          <!-- Step Content Card -->
          <div :class="stepCardClass" class="bg-white p-2 rounded-xl shadow-lg ml-16 md:ml-[96px] transition-transform duration-300 ease-in-out group-hover:scale-105">
            <div class="flex items-center mb-4">
              <span class="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-full shadow-xl">
                <i :class="step.icon" class="text-2xl"></i>
              </span>
              <h4 :class="stepCardClass" class="text-lg font-semibold ml-4">{{$t(step.title)}}</h4>
            </div>
            <p :class="stepCardClass" class="text-gray-600 mb-4 text-sm">{{ $t(step.description) }}</p>
            <div class="flex items-center justify-between mt-4">
              <div class="w-20 h-2 bg-gray-300 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-teal-400 to-blue-600" :style="{ width: step.progress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>import FloatingButtons from "@/components/Main/Floating/FloatingButton.vue";

export default {
  components: {
    FloatingButtons},
  name: "AdminDashboardWorkflow",
  data() {
    return {
      steps: [
        {
          number: "01",
          duration: "2 WEEKS",
          title: "Dashboard Management",
          description: "A powerful, all-in-one dashboard featuring diverse charts, lists, and structures to seamlessly manage your data. Stay on top of everything in one place.",
          icon: "fas fa-user-shield",
          progress: 80,
        },
        {
          number: "02",
          duration: "1 MONTH",
          title: "Navbar Management",
          description: "Take full control of your navigation with the intuitive toggle button to manage the sidebar. Plus, the navbar is equipped with smart buttons for smooth panel navigation.",
          icon: "fas fa-project-diagram",
          progress: 60,
        },
        {
          number: "03",
          duration: "Ongoing",
          title: "Sidebar Management",
          description: "Effortlessly customize your workspace with a menu and submenu in the sidebar. Swap the sidebar from left to right (or vice versa) with a simple toggle from the navbar.",
          icon: "fas fa-tachometer-alt",
          progress: 40,
        },
        {
          number: "04",
          duration: "2 WEEKS",
          title: "Theme Customization",
          description: "Experience ultimate flexibility with two distinct theme options: Dark and Light. Easily tailor each page’s appearance to fit your preference with just a click.",
          icon: "fas fa-check-circle",
          progress: 30,
        },
        {
          number: "05",
          duration: "1 WEEK",
          title: "Multiple Language Support",
          description: "Choose from 8 diverse languages for a truly personalized experience. We support English, Bangla, Hindi, Chinese, Japanese, Malayalam, French, and Thai.",
          icon: "fas fa-chart-line",
          progress: 90,
        },
        {
          number: "06",
          duration: "1 WEEK",
          title: "Live Chatting",
          description: "Stay connected with ease through our integrated live chat feature, making communication and support a breeze whenever you need it.",
          icon: "fas fa-comments",
          progress: 90,
        },
      ],
    };
  },

  computed: {
    themeClass() {
      return this.$store.state.theme === "light"
        ? "bg-gradient-to-br from-gray-100 to-gray-300 text-gray-900"  // Light theme styles
        : "bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white";  // Dark theme styles
    },
    workflowClass() {
      return this.$store.state.theme === "light"
        ? "bg-white text-gray-800 shadow-xl"  // Light workflow section
        : "bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-xl";  // Dark workflow section
    },
    stepCardClass() {
      return this.$store.state.theme === "light"
        ? "bg-white text-gray-800 shadow-sm"  // Light card style
        : "bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-md";  // Dark card style
    },
  },
};
</script>

<style scoped>/* Full page design adjustments */
html, body {
  height: 100%;
  margin: 0;
  overflow: hidden; /* Prevent horizontal scroll */
}

/* Allow vertical scrolling but hide the scrollbar */
body {
  overflow-y: scroll; /* Enable vertical scrolling */
}

/* Hide scrollbar but keep scrolling */
::-webkit-scrollbar {
  display: none; /* Hide the scrollbar */
}

::-webkit-scrollbar-thumb {
  display: none; /* Hide the thumb (the draggable part of the scrollbar) */
}

::-webkit-scrollbar-track {
  display: none; /* Hide the track (the background of the scrollbar) */
}

/* Adjustments for 2-column grid layout */
.grid-cols-1 {
  grid-template-columns: repeat(1, 1fr);
}

.sm\:grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.fas {
  font-size: 1.5rem;
  color: white;
}

.w-full {
  width: 100%;
}

/* Hover Effects */
.group:hover .bg-gradient-to-r {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .text-4xl {
    font-size: 2.5rem;
  }
  .text-xl {
    font-size: 1.25rem;
  }
}

@media (max-width: 768px) {
  .absolute {
    left: 0;
  }
}

@media (max-width: 480px) {
  .text-4xl {
    font-size: 2rem;
  }
  .text-xl {
    font-size: 1rem;
  }
}

</style>
