<template>
  <div class="w-full">
    <label class="block text-gray-700 font-semibold mb-1">{{ label }}</label>
    <select
      v-bind="$attrs"
      class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">-- All --</option>
      <option
        v-for="item in normalizedItems"
        :key="item?.id"
        :value="item?.id"
      >
        {{ item?.name || item?.title || item?.user_name || item?.label || 'Unnamed' }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "FilterDropdown",
  props: {
    label: String,
    items: {
      type: [Array, Object],
      default: () => [],
    },
    modelValue: [String, Number],
  },
  computed: {
    normalizedItems() {
      // If items is paginated object, extract the .data
      if (this.items?.data && Array.isArray(this.items.data)) {
        return this.items.data;
      }
      // If items is already an array, return directly
      if (Array.isArray(this.items)) {
        return this.items;
      }
      return [];
    },
  },
};
</script>
