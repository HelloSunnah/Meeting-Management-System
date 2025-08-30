<template>
  <aside :class="themeClass"
    class="w-full max-w-full sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg flex flex-col pb-4 bg-white/60 backdrop-blur-2xl border border-gray-200 rounded-t-2xl shadow-2xl overflow-hidden relative">

    <!-- Header -->
    <div class="p-4 border-b border-white/30 bg-white/70 sticky top-0 z-20 backdrop-blur-xl rounded-2xl">
      
      <div class="relative">
        <input :value="searchQuery" @input="$emit('update:searchQuery', $event.target.value)" type="text"
          placeholder="Search users..."
          class="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-gray-300 shadow-inner text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
        <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
      </div>
    </div>

    <!-- User List -->
    <div class="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
      <transition-group name="list" tag="div">
        <div v-for="user in filteredUsers" :key="user.id"  @click="$emit('select-user', user)" c
          class="flex items-center justify-between px-4 mb-2  py-3 bg-white/80 hover:bg-purple-100/60 rounded-2xl cursor-pointer shadow-md backdrop-blur transition-all duration-300 hover:shadow-xl hover:scale-[1.015]">
          <div class="flex items-center space-x-4 ">
            <div class="relative">
              <img :src="getUserImageUrl(user.image, user.name)"
                class="w-14 h-14 rounded-full object-cover border border-white shadow-sm"
                :alt="user.name || 'User Avatar'"
                @error="$event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b5cf6&color=fff&rounded=true&size=128`" />
              <span v-if="user.is_active"
                class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-md"
                title="Active"></span>
            </div>
            <div class="flex flex-col">
              <p :class="user.unread_count > 0 ? 'font-semibold text-purple-800' : 'text-gray-800'"
                class="truncate text-base">
                {{ user.name }}
              </p>
              <p class="text-sm text-gray-500 truncate max-w-[200px] italic">
                {{ user.department_name || 'No department info' }}
              </p>
            </div>
          </div>

          <span v-if="user.unread_count > 0"
            class="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center shadow">
            {{ user.unread_count }}
          </span>
        </div>
      </transition-group>
    </div>
  </aside>
</template>
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>



<script>
import apiEndpoints from '@/config/apiConfig';

export default {
  name: "ChatSidebar",
  props: {
    users: {
      type: Array,
      required: true,
    },
    themeClass: {
      type: String,
      default: "",
    },
    searchQuery: {
      type: String,
      default: "",
    },
  },
  emits: ["select-user", "update:searchQuery"],
  computed: {
    filteredUsers() {
      const query = this.searchQuery.toLowerCase();
      return this.users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          (user.department_name && user.department_name.toLowerCase().includes(query))
      );
    },
  },
  methods: {
    getUserImageUrl(image, name) {
      return this.isImage(image)
        ? `${apiEndpoints.storageUrl2}/${image}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128`;
    },
    isImage(url) {
      return url && /\.(jpg|jpeg|png|gif|bmp)$/i.test(url);
    },
  },
};
</script>
