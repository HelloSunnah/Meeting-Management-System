<template>
  <div class="flex flex-col">
    <label class="text-sm font-semibold mb-1">{{ label }}:</label>
    <input 
      type="file" 
      v-bind="$attrs" 
      v-model="inputValue" 
      class="input-field"
      :multiple="multiple"
      @change="handleFileChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    value: [Array, String, Number],  // Value can now be an array to hold multiple files
    type: { type: String, default: "text" },
    multiple: { type: Boolean, default: false },  // Allow for multiple file selection
  },
  data() {
    return {
      inputValue: this.value || [],
    };
  },
  methods: {
    handleFileChange(event) {
      const files = event.target.files;
      this.inputValue = multiple ? [...files] : files[0];
      this.$emit("input", this.inputValue);  // Emit files back to parent
    },
  },
  watch: {
    inputValue(newVal) {
      this.$emit("input", newVal);  // Ensure input is updated on parent
    },
  },
};
</script>
