<template>
  <div class="flex flex-col h-screen w-full bg-gradient-to-br from-white via-blue-50 to-blue-100 ">
    
    <!-- Header -->
    <div class="p-4 sm:p-5 border-b bg-white/90 backdrop-blur-md flex justify-between items-center sticky top-0 shadow rounded-t-2xl">
      <h2 class="flex items-center gap-3 text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600">
        <template v-if="user?.name">
          <div class="relative">
            <img :src="getUserImageUrl(user.image, user.name)"
              class="w-10 h-10 rounded-full object-cover border border-white shadow-sm"
              :alt="user.name"
              @error="$event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b5cf6&color=fff&rounded=true&size=128`" />
            <span v-if="user.is_active"
              class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-md"
              title="Active"></span>
          </div>
          <span class="truncate max-w-[160px] sm:max-w-[220px]">{{ user.name }}</span>
        </template>
        <template v-else> 💬 Chat Room </template>
      </h2>
      <button @click="$emit('close-chat')" class="text-gray-400 hover:text-red-500 text-2xl transition" title="Close">×</button>
    </div>

    <!-- Messages -->
    <div ref="messagesContainer"
         class="flex-1 overflow-y-auto px-2 sm:px-5 pb-[90px] sm:pb-[100px] md:pb-[130px] space-y-2"
         @scroll.passive="handleScroll">
      <div v-for="message in user?.messages" :key="message.id"
           :class="['flex', message.sender_id === senderId ? 'justify-end' : 'justify-start']">
        <div class="max-w-[85%] sm:max-w-[70%] md:max-w-[55%] relative">
          <div @click="message.sender_id === senderId && toggleMessageOptions(message.id)"
               :class="[
                'p-2 rounded-2xl shadow-sm relative cursor-pointer',
                message.sender_id === senderId
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none border'
              ]">

            <!-- Message Text -->
            <p v-if="message.content" class="whitespace-pre-wrap break-words text-sm leading-relaxed">
              {{ message.content }}
            </p>

            <!-- Image -->
            <img v-if="isImage(message.attachment_url)" :src="getFullUrl(message.attachment_url)"
              class="mt-2 rounded-md max-h-60 w-auto object-contain border hover:opacity-90 cursor-pointer transition"
              alt="Image" />

            <!-- PDF -->
            <a v-else-if="isPdf(message.attachment_url)" :href="getFullUrl(message.attachment_url)" target="_blank"
              class="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-100 underline hover:text-white">
              📄 View PDF
            </a>

            <!-- Other File -->
            <a v-else-if="message.attachment_url" :href="getFullUrl(message.attachment_url)" download
              class="mt-2 inline-flex items-center gap-2 text-sm text-gray-600 underline hover:text-gray-800">
              📎 Download File
            </a>

            <!-- Unsend Button -->
            <button v-if="message.sender_id === senderId && selectedMessageId === message.id"
              @click.stop="confirmUnsendMessage(message.id)"
              title="Unsend"
              class="absolute top-8 right-10 bg-white text-red-500 hover:text-red-700 w-6 h-6 rounded-full text-xs shadow flex items-center justify-center transition-opacity duration-200">
              🗑
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Input -->
    <div v-if="user?.name" class="p-3 sm:p-4 border-t bg-white/90 backdrop-blur-md sticky bottom-0 z-10">
      <div class="flex items-center gap-2">
        <input v-model="newMessage"
               @keyup.enter="sendMessage"
               type="text"
               placeholder="Type a message..."
               class="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
        <input type="file" ref="fileInput" @change="handleFileUpload" class="hidden" />
        <button @click="$refs.fileInput.click()" class="text-gray-500 hover:text-blue-500 text-xl transition" title="Attach file">
          <i class="fas fa-paperclip"></i>
        </button>
        <button @click="sendMessage"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm shadow-md transition">
          ➤
        </button>
      </div>
    </div>

    <!-- Delete Modal -->
    <DeleteConfirmationModal ref="deleteConfirmationModal" />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.chat-window-scroll::-webkit-scrollbar {
  width: 6px;
}
.chat-window-scroll::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.3);
  border-radius: 4px;
}
</style>


<script>
import axios from "axios";
import apiEndpoints from "@/config/apiConfig";
import DeleteConfirmationModal from "@/components/Modals/ConfirmationModal.vue";

export default {
  components: {
    DeleteConfirmationModal,
  },
  props: {
    user: Object,
    senderId: Number
  },
  data() {
    return {
      newMessage: "",
      attachment: null,
      selectedMessageId: null,
      pendingDeleteMessageId: null
    };
  },
  methods: {
    async sendMessage() {
      if (!this.newMessage && !this.attachment) return;

      const formData = new FormData();
      formData.append("receiver_id", this.user.id);
      formData.append("content", this.newMessage || "");
      if (this.attachment) formData.append("attachment", this.attachment);

      try {
        const { data } = await axios.post(apiEndpoints.sendMessage, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data"
          }
        });

        if (data.message) {
          this.user.messages.push(data.message);
          this.newMessage = "";
          this.attachment = null;
          this.$refs.fileInput.value = null;
          this.selectedMessageId = null;
          this.$nextTick(this.scrollToBottom);
        }
      } catch (error) {
        console.error("Send failed", error);
      }
    },

    confirmUnsendMessage(messageId) {
      this.$refs.deleteConfirmationModal.show(
        "Unsend Message",
        "Are you sure you want to unsend this message?",
        () => this.unsendMessage(messageId)
      );
    },

    async unsendMessage(messageId) {
      try {
        await axios.delete(`${apiEndpoints.messageDelete}/${messageId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        this.user.messages = this.user.messages.filter(m => m.id !== messageId);
        this.selectedMessageId = null;
      } catch (error) {
        console.error("Failed to unsend message", error);
      }
    },

    handleScroll() {
      const container = this.$refs.messagesContainer;
      if (!container) return;

      if (container.scrollTop === 0) {
        this.$emit('load-older-messages');
      }
    },

    handleFileUpload(event) {
      this.attachment = event.target.files[0];
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },

    toggleMessageOptions(messageId) {
      this.selectedMessageId = this.selectedMessageId === messageId ? null : messageId;
    },

    getUserImageUrl(image, name) {
      return this.isImage(image)
        ? `${apiEndpoints.storageUrl2}/${image}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128`;
    },

    isImage(url) {
      return url && /\.(jpg|jpeg|png|gif|bmp)$/i.test(url);
    },

    isPdf(url) {
      return /\.pdf$/i.test(url || "");
    },

    getFullUrl(path) {
      if (!path) return "";
      return path.startsWith("http") ? path : `${apiEndpoints.storageUrl2}/${path.replace(/^\/+/, "")}`;
    }
  },

  watch: {
    'user.messages': {
      handler() {
        this.$nextTick(this.scrollToBottom);
      },
      deep: true,
      immediate: true,
    }
  },

  mounted() {
    this.scrollToBottom();
  }
};
</script>

