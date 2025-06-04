<template>
  <div>
    <button
      @click="navigateToRoute"
      ref="chatButton"
      :aria-label="ariaLabel"
      :class="buttonClasses"
      :style="customStyles"
    
    >
      <!-- Icon: Plus -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    route: {
      type: String,
      required: true,
    },
    ariaLabel: {
      type: String,
      default: 'Open Chat',
    },
  },
  computed: {
    buttonClasses() {
      return [
        'fixed z-50 flex items-center justify-center',
        'transition-all duration-300 ease-in-out transform',
        'hover:scale-105 active:scale-95',
        'focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400',
        'rounded-2xl shadow-lg sm:hover:shadow-2xl',
        'w-8 h-8 sm:w-10 sm:h-10',
        this.buttonPositionClass,
      ];
    },
    buttonPositionClass() {
      return this.$store.state.sidebarPosition === 'right'
        ? 'left-6 sm:left-8'
        : 'right-6 sm:right-8';
    },
    customStyles() {
      return {
        top: '100px',
        background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',

        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
      };
    },
  },
  methods: {
    navigateToRoute() {
      this.$router.push(this.route);
    },
  },
};
</script>
