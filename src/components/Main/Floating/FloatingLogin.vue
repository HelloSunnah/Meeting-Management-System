<template>
  <div class="fixed right-0 top-[50%] flex flex-col items-end z-10" :aria-label="ariaLabel">
    <button @click="toggleMenu" :style="getButtonStyle(mainButton, 'main')"
      class="custom-button button-scale relative mb-2" aria-label="Menu">
      <div class="flex items-center justify-center w-full h-full">
        <img :src="mainButton.imgSrc" alt="Menu" class="w-6 h-6" v-show="!menuOpen" />
        <span v-show="menuOpen">{{ $t(mainButton.text) }}</span>
      </div>
    </button>
    <transition-group name="fade" tag="div" class="flex flex-col items-end">
      <button v-for="(button, index) in buttons" v-show="menuOpen" :key="index" @click="button.action"
        @mouseover="setHoveredButton(index)" @mouseleave="setHoveredButton(null)" :style="getButtonStyle(button, index)"
        class="custom-button button-scale relative mb-2" :aria-label="$t(button.text)">
        <div class="flex items-center justify-center w-full h-full">
          <i :class="button.iconClass" class="icon-only text-md" v-show="hoveredButtonIndex !== index"></i>
          <span class="button-text" v-show="hoveredButtonIndex === index">
            {{ $t(button.text) }}
          </span>
        </div>
      </button>
    </transition-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ariaLabel: "",
      menuOpen: false,
      hoveredButtonIndex: null,
      mainButton: {
        text: "Menu",
        imgSrc: new URL("@/assets/img/s4.gif", import.meta.url).href, // Vite image handling
        bgColor: "#0a4926",
        textColor: "#ffffff",
      },

      buttons: [
        {
          text: "Login",
          action: () => window.open("/login", "_blank"),
          bgColor: "#537D5D",
          textColor: "#ffffff",
          iconClass: "fas fa-sign-in-alt",
        },

        {
          text: "Subscription",
          action: () => this.$router.push("/subscription", "_blank"),
          bgColor: "#9EBC8A",
          textColor: "#ffffff",
          iconClass: "fas fa-user-check",
        },
      ],
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    setHoveredButton(index) {
      this.hoveredButtonIndex = index;
    },
    getButtonStyle(button, index) {
      const isMain = index === "main";
      const isHovered = this.hoveredButtonIndex === index;
      const isExpanded = isMain ? this.menuOpen : isHovered;

      return {
        backgroundColor: button.bgColor,
        color: button.textColor,
        width: isExpanded ? "100px" : "40px",
        height: "45px",
        opacity: isExpanded ? 1 : 0.85,
        clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%)",
        fontSize: "0.85rem",
        fontWeight: "600",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "none",
        transition: "width 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease",
        boxShadow: isExpanded
          ? "0px 6px 14px rgba(0, 0, 0, 0.25)"
          : "0px 2px 8px rgba(0, 0, 0, 0.15)",
        marginBottom: "6px",
      };
    },
  },
};
</script>

<style scoped>
.button-scale:hover {
  transform: scale(1.05);
}

.custom-button {
  cursor: pointer;
  padding: 0;
}

.icon-only {
  transition: opacity 0.3s ease;
}

.button-text {
  transition: opacity 0.3s ease;
  margin-left: 6px;
  font-size: 0.85rem;
  white-space: nowrap;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 640px) {
  .button-text {
    font-size: 0.7rem;
  }
}
</style>
