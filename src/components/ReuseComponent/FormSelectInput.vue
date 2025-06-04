<template>
    <div class="flex flex-col">
      <label class="text-sm font-semibold mb-1">{{ label }}:</label>
      <select v-bind="$attrs" v-model="selectedValue" class="input-field">
        <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      label: String,
      value: [String, Number, Array],  // Can be a single value or an array for multiple
      options: Array,
      multiple: Boolean,
    },
    data() {
      return {
        selectedValue: this.value,
      };
    },
    watch: {
      selectedValue(newVal) {
        this.$emit("input", newVal);
      },
    },
  };
  </script>
  