<template>
  <div
    :class="buttonContainerClass"
    class="fixed top-48 flex flex-col space-y-4 md:space-y-6 lg:space-y-4"
    ref="buttonContainer"
    @mousedown="startDrag"
    @mouseup="stopDrag"
    @mousemove="onDrag"
    :aria-label="ariaLabel"
  >
    <!-- Loop through buttons to avoid redundancy -->
    <button v-for="(button, index) in buttons" :key="index" @click="button.action" :class="buttonClass"
      :style="getButtonStyle(button)"
      class="py-3 px-2 shadow-lg transition duration-200 relative button-scale custom-button"
      :aria-label="$t(button.text)">
      <!-- Conditionally render icon and text -->
      <div class="flex items-center">
        <template v-if="buttonClass === 'clip-right'">
          <span class="button-text">{{ $t(button.text) }}</span>
          <i :class="button.iconClass" class="ml-2 mt-1 text-md"></i>
        </template>
        <template v-else>
          <i :class="button.iconClass" class="mr-2 mt-1 text-md"></i>
          <span class="button-text">{{ $t(button.text) }}</span>
        </template>
      </div>
    </button>
  </div>

  <!-- Support Modal -->
  <SupportModal :isOpen="isModalOpen" @close="closeSupportModal" />
</template>

<script>
import SupportModal from "@/components/Modals/SupportModal.vue";

export default {
  components: {
    SupportModal,
  },
  computed: {
    buttonContainerClass() {
      const position = this.$store.state.sidebarPosition;
      return `fixed top-48 ${position === "left" ? "right-0" : "left-0"} flex flex-col space-y-4 z-10`;
    },

    buttonClass() {
      return this.$store.state.sidebarPosition === "left" ? "clip-right" : "clip-left";
    },

    buttonOpacity() {
      return 0.8;
    },
  },
  data() {

    return {
      ariaLabel:"",
      isModalOpen: false, // Manage modal state
      isDragging: false, // Flag to track if dragging is in progress
      dragOffset: { x: 0, y: 0 }, // To track the position offset during dragging
      buttons: [
        {
          text: "Support",
          action: this.openSupportModal,
          bgColor: "#7242f5",
          textColor: "white",
          iconClass: "fa-solid fa-phone",
        },
        {
          text: "Guideline",
          action: this.guideline,
          bgColor: "#32a0a8",
          textColor: "#f7f7f7",
          iconClass: "fas fa-book",
        },
        {
          text: "Manual",
          action: this.userManual,
          bgColor: "#4d88ff",
          textColor: "white",
          iconClass: "fa-solid fa-user",
        },
        {
          text: "Process",
          action: this.process,
          bgColor: "#1e188c",
          textColor: "white",
          iconClass: "fas fa-project-diagram",
        },
      ],
    };
  },
  methods: {
    startDrag(event) {
      this.isDragging = true;
      // Capture initial mouse position
      this.dragOffset.x = event.clientX - this.$refs.buttonContainer.offsetLeft;
      this.dragOffset.y = event.clientY - this.$refs.buttonContainer.offsetTop;
    },
    stopDrag() {
      this.isDragging = false;
    },
    onDrag(event) {
      if (this.isDragging) {
        // Update the position of the container while dragging
        const left = event.clientX - this.dragOffset.x;
        const top = event.clientY - this.dragOffset.y;
        this.$refs.buttonContainer.style.left = `${left}px`;
        this.$refs.buttonContainer.style.top = `${top}px`;
      }
    },

    openSupportModal() {
      this.isModalOpen = true; // Show the modal
    },
    closeSupportModal() {
      this.isModalOpen = false; // Close the modal
    },

    userManual() {
      const pdfUrl = '/pdf/user.pdf';
      window.open(pdfUrl, '_blank');
    },
    guideline() {
      this.$router.push('/guideline'); // Update route for guideline
    },
    process() {
      this.$router.push('/ProcessFlow'); // Update route for guideline
    },

    getButtonStyle(button) {
      return {
        backgroundColor: button.bgColor,
        color: button.textColor,
        opacity: this.buttonOpacity,
      };
    },
  },
};
</script>

<style scoped>
.button-scale:hover {
  transform: scale(1.05); /* Slightly enlarges the button on hover */
}

.custom-button {
  clip-path: polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%);
  border: none;
  font-size: 1rem;
  font-weight: bold;
  overflow: hidden;
  transition: transform 0.3s ease, background-color 0.3s ease, opacity 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-button:hover {
  background-color: #37a397;
  transform: scale(1.1);
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
}

.clip-left {
  clip-path: polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%);
}

.clip-right {
  clip-path: polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%);
}

.fixed {
  transition: all 0.3s ease;
}

/* Hide text on mobile */
.button-text {
  display: inline-block;
}

@media (max-width: 640px) {
  /* Hide text and show only icon on mobile */
  .button-text {
    display: none;
  }

  .fixed {
    top: 94px; /* Make the button container closer to the top on mobile */
  }

  .button-scale {
    transform: scale(1); /* Reduce scaling effect on small screens */
  }

  .custom-button {
    font-size: 0.875rem; /* Smaller font size for mobile */
    padding: 12px 14px; /* Adjust button padding */
  }

  .clip-left {
    clip-path: polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%);
  }

  .clip-right {
    clip-path: polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%);
  }
}

@media (min-width: 768px) {
  .button-scale {
    transform: scale(1.05); /* Slightly enlarge button on larger screens */
  }

  .custom-button {
    font-size: 1rem; /* Keep standard font size for tablets */
  }
}

@media (min-width: 1024px) {
  .button-scale {
    transform: scale(1.05); /* Keep button scaling effect for desktop */
  }

  .custom-button {
    font-size: 1rem; /* Standard font size for desktops */
  }
}
</style>
