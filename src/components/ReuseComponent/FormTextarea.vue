<template>
    <div class="flex flex-col">
      <label class="text-sm font-semibold mb-1">{{ label }}:</label>
      <textarea v-bind="$attrs" v-model="inputValue" class="input-field"></textarea>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      label: String,
      value: String,
      rows: { type: Number, default: 3 }, // Set default rows
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
  