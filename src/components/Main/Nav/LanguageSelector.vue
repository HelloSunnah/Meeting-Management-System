<template>
  <div  :class="themeClass" class="relative inline-block">
    <!-- Language Selector Button -->
    <button
      @click="toggleDropdown"
      class="flex items-center justify-between w-48 p-3  rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
    >
      <!-- Flag and Language Name in the same row -->
      <div class="flex items-center">
        <img :src="selectedLanguage.flag" alt="Flag" class="w-6 h-6 mr-3 rounded-full transition-all duration-300" />
        <span class="font-semibold">{{ selectedLanguage.name }}</span>
      </div>
      <!-- Dropdown Arrow -->
      <svg
        class="w-4 h-4 ml-2 transition-transform"
        :class="{'rotate-180': isDropdownOpen}"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isDropdownOpen"
      class="absolute left-0 mt-2 w-full bg-gray-400 text-white rounded-md shadow-lg z-10 transition-all duration-300"
    >
      <div
        v-for="lang in languages"
        :key="lang.code"
        class="flex items-center cursor-pointer hover:bg-gray-800 rounded-lg bg-gray-600 m-2 transition-all duration-300"
        @click="selectLanguage(lang)"
      >
        <div class="flex items-center p-3 w-full space-x-3 rounded-md hover:bg-gray-700 hover:text-gray-200 transition-all">
          <img :src="lang.flag" alt="Flag" class="w-6 h-6 rounded-full transition-all duration-300" />
          <span class="text-sm font-medium">{{ lang.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LanguageSelector",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isDropdownOpen: false,
      languages: [
        { code: 'en', name: 'English', flag: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/2560px-Flag_of_the_United_Kingdom.svg.png' },
        { code: 'bn', name: 'বাংলা', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Flag_of_Bangladesh.svg/2560px-Flag_of_Bangladesh.svg.png' },
        { code: 'fr', name: 'Français', flag: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg' },
        { code: 'ja', name: '日本語', flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg' },
        { code: 'cn', name: '简体中文', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/2560px-Flag_of_the_People%27s_Republic_of_China.svg.png' },
        { code: 'th', name: 'ไทย', flag: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Thailand.svg' },
        { code: 'ms', name: 'Melayu', flag: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Malaysia.svg' },
        { code: 'hi', name: 'हिंदी', flag: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg' },
      ],
      selectedLanguage: { code: 'en', name: 'English', flag: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/2560px-Flag_of_the_United_Kingdom.svg.png' }
    };
  },  computed: {
    themeClass() {
          return this.$store.state.theme === 'dark' ? 'bg-gray-400 text-gray-100 custom-scrollbar' : 'bg-gray-400 text-gray-600 custom-scrollbar';
  },},
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectLanguage(lang) {
      this.selectedLanguage = lang;
      this.isDropdownOpen = false;
      this.$emit("update:modelValue", lang.code);
    },
  },
};
</script>

<style scoped>
/* Custom Styles */
button:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
}

button:active {
  transform: translateY(1px);
}

img {
  transition: transform 0.3s ease;
}

img:hover {
  transform: scale(1.1);
}

svg {
  transition: transform 0.3s ease;
}

svg:hover {
  transform: rotate(180deg);
}

.dropdown-item:hover {
  background-color: #2d3748; /* Hover effect for dropdown items */
}
</style>
