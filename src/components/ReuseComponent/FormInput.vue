<template>
    <div class="flex flex-col">
      <label class="text-sm font-semibold mb-1">{{ label }}:</label>
      <input v-bind="$attrs" v-model="inputValue" class="input-field" />
    </div>
  </template>
  
  <script>
  export default {
    props: {
      label: String,
      value: [String, Number],
      type: { type: String, default: "text" },  // Add default type for input field
    },
    data() {
      return {
        inputValue: this.value,
      };
    },
    watch: {
      inputValue(newVal) {
        this.$emit("input", newVal);
      },
    },
  };
  </script>
  