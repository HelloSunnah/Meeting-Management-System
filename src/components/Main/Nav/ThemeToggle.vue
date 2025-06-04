<template>
  <label class="relative inline-block w-14 h-8 ml-4">
    <input
      type="checkbox"
      @click="toggleTheme"
      :checked="theme === 'dark'"
      class="sr-only"
    />
    <!-- Display sun and moon GIFs based on the current theme -->
    <span v-if="theme === 'dark'" class="absolute left-0 top-0 w-10 h-10">
      <img src="@/assets/img/1.gif" alt="Sun" class="w-full h-full object-cover" />
    </span>
    <span v-if="theme === 'light'" class="absolute left-0 top-0 w-10 h-10">
      <img src="@/assets/img/2.gif" alt="Moon" class="w-full h-full object-cover" />
    </span>
  </label>
</template>

<script>
export default {
  name: "ThemeToggle",
  props: {
    theme: {
      type: String,
      required: true,
    },
  },
  methods: {
    toggleTheme() {
      this.$emit("toggleTheme");
    },
  },
};
</script>
