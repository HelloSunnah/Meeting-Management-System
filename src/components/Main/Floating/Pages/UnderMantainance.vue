<script>
export default {
  name: "UnderMaintenance",
  data() {
    return {
      hours: "00",
      minutes: "00",
      seconds: "00",
      endTime: new Date().getTime() + 24 * 60 * 60 * 1000, // 24 hours from now
      showCountdown: true, // Set to false if you don't want the countdown
      theme: "light", // Set theme to 'dark' or 'light'
    };
  },
  mounted() {
    if (this.showCountdown) {
      this.startCountdown();
    }
  },
  methods: {
    startCountdown() {
      setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = this.endTime - now;

        this.hours = Math.floor(
          (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        )
          .toString()
          .padStart(2, "0");
        this.minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
          .toString()
          .padStart(2, "0");
        this.seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
          .toString()
          .padStart(2, "0");
      }, 1000);
    },
  },
  computed: {
    themeClass() {
      return this.$store.state.theme === "light"
        ? "bg-gradient-to-br from-gray-100 to-gray-300 text-gray-900" // Light theme styles
        : "bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white"; // Dark theme styles
    },
    themeBorderClass() {
      return this.theme === "dark" ? "border-white" : "border-gray-600";
    },
    themeCountDownClass() {
      return this.theme === "dark"
        ? "bg-white bg-opacity-20"
        : "bg-gray-800 bg-opacity-20";
    },
    themeTitleClass() {
      return this.theme === "dark"
        ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600"
        : "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600";
    },
    fullPageClass() {
      // Apply full-page background color based on theme
      return this.theme === "dark"
        ? "h-full bg-gray-900"
        : "h-full bg-gray-100";
    },
    themeButtonClass() {
      // Define button appearance based on theme
      return this.theme === "dark"
        ? "bg-blue-600 text-white hover:bg-blue-500"
        : "bg-gray-800 text-white hover:bg-gray-700";
    },
    themeTextClass() {
      // Text color for the dark theme
      return this.theme === "dark" ? "text-gray-300" : "text-gray-700";
    },
  },
};
</script>

<template>
  <!-- Full page wrapper that will dynamically change based on the theme -->
  <div
    :class="[themeClass]"
    class="w-full min-h-screen flex items-center justify-center"
  >
    <div
      class="max-w-lg p-10 rounded-3xl bg-opacity-20 backdrop-blur-lg shadow-2xl text-center transition-shadow duration-300 ease-in-out"
    >
      <!-- Circle Animation Section -->
      <div class="relative w-32 h-32 mx-auto mb-10">
        <!-- Animated border rings -->
        <div
          class="absolute w-full h-full rounded-full border-4 animate-pulse delay-0"
          :class="themeBorderClass"
        ></div>
        <div
          class="absolute w-full h-full rounded-full border-4 animate-pulse delay-100"
          :class="themeBorderClass"
        ></div>
        <div
          class="absolute w-full h-full rounded-full border-4 animate-pulse delay-200"
          :class="themeBorderClass"
        ></div>
      </div>

      <!-- Title -->
      <h1 class="text-4xl font-extrabold mb-6" :class="themeTitleClass">
        Under Construction
      </h1>

      <!-- Maintenance Message -->
      <p class="text-lg mb-10" :class="themeTextClass">
        Our website is currently undergoing maintenance to bring you an even
        better experience. We appreciate your patience and can't wait to show
        you what's coming!
      </p>

      <!-- Countdown Timer -->
      <div v-if="showCountdown" class="mt-6">
        <p class="text-xl font-semibold mb-4" :class="themeTextClass">
          We'll be back in:
        </p>
        <div class="flex justify-center gap-6 text-3xl font-bold mt-4">
          <span
            class="px-6 py-3 rounded-lg text-3xl"
            :class="themeCountDownClass"
            >{{ hours }}</span
          >
          <span
            class="px-6 py-3 rounded-lg text-3xl"
            :class="themeCountDownClass"
            >{{ minutes }}</span
          >
          <span
            class="px-6 py-3 rounded-lg text-3xl"
            :class="themeCountDownClass"
            >{{ seconds }}</span
          >
        </div>
      </div>

      <!-- Optional Button Example -->
      <div class="mt-6">
        <button
          :class="themeButtonClass"
          class="px-8 py-3 rounded-lg transition-all duration-300 ease-in-out"
        >
          Stay Updated
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .animate-pulse {
    animation: pulse 3s infinite ease-in-out;
  }
  @keyframes pulse {
    0% {
      transform: scale(0.8);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.3;
    }
    100% {
      transform: scale(0.8);
      opacity: 0.7;
    }
  }
}
</style>
