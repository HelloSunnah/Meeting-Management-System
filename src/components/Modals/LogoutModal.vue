<template>
  <div v-if="isVisible" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full space-y-4">
      <h3 class="text-2xl font-semibold text-gray-800 text-center">
        Are you sure you want to logout?
      </h3>
      <div class="flex justify-around space-x-4">
        <button
          class="bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-lg transition duration-200 ease-in-out hover:bg-gray-400 focus:outline-none" @click="cancelLogout"> No
        </button>
        <button class="bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200 ease-in-out hover:bg-red-700 focus:outline-none"@click="confirmLogout">
          Yes
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LogoutModal",
  props: {
    isVisible: Boolean,
  },
  methods: {
    cancelLogout() {
      this.$emit("close");
    },
    confirmLogout() {
      this.$emit("logout");
    },
  },
};
</script>
