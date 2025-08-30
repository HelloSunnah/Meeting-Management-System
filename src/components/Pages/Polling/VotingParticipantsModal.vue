<template>
  <div
    v-if="show"
    class="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-50"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg transition-transform transform"
      :class="{ 'scale-105': show }"
    >
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none text-2xl"
      >
        <i class="fas fa-times"></i>
      </button>
      <h2 class="text-xl font-semibold text-center text-indigo-600 mb-4">
        {{ title }}
      </h2>
      <div class="space-y-3">
        <div v-if="voters.length === 0" class="text-center text-gray-500">
          No participants yet.
        </div>
        <ul v-else>
          <li
            v-for="voter in voters"
            :key="voter.user_id"
            class="flex justify-between items-center p-3 bg-gray-50 hover:bg-indigo-100 rounded-lg transition-colors duration-200"
          >
            <strong class="text-gray-800">{{
              voter.user_name || voter.name || "Unnamed User"
            }}</strong>
            <span v-if="voter.reason" class="text-sm text-gray-500"
              >— {{ voter.reason }}</span
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    voters: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    closeModal() {
      this.$emit("update:show", false);
    },
  },
};
</script>

<style scoped>
/* Keep your existing styles here */
</style>
