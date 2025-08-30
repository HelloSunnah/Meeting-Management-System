<template>
  <div :class="themeClass">
    <!-- Chat Button -->
    <!-- Floating Chat Button -->
    <button ref="chatButton" @click="toggleChatWindow" :aria-label="isChatOpen ? 'Close chat' : 'Open chat'" :class="[
      'fixed bottom-8 gap-4 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white rounded-full shadow-lg z-50 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300',
      buttonPositionClass
    ]" style="box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25)">

      <i class="fas fa-comment text-lg mr-2 transform transition-all duration-300 ease-in-out hover:rotate-12"></i>
      <span class="hidden sm:block text-base font-semibold">{{ $t('Chat') }}</span>

      <!-- 🔴 Unread Badge -->
      <span v-if="totalUnreadCount > 0"
        class="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5 z-50 shadow">
        {{ totalUnreadCount }}
      </span>
    </button>

    <!-- Floating Chat Window -->
    <div v-if="isChatOpen" :class="[themeClass, chatWindowPositionClass]"
      class="fixed bottom-6 right-6 w-[420px] h-[65vh] bg-white shadow-xl rounded-lg transition-all duration-300 z-50  scale-in border-2 border-gray-200">
      <div class="flex flex-col h-full">
        <!-- Main Content Container -->
        <div class="flex flex-col flex-grow overflow-auto no-scrollbar bg-gray-100">
          <!-- User List / Conversation -->
            <div v-if="!selectedUser" class="w-full space-y-2 p-4">
              <div class="bg-gray-200 text-center p-2 text-xl font-bold shadow-lg rounded-lg cursor-pointer flex items-center justify-between">
                <span class="flex-1 text-center">Users</span>
                <button @click="closeChat" class="text-gray items-end text-end hover:text-gray-900 text-xl" aria-label="Close Chat">
                  <i class="fas fa-minus-circle"></i>
                </button>
              </div>

              <!-- 🔍 Search Field -->
              <div class="relative mb-2">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search users..."
                  class="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
              </div>

              <!-- User Loop -->
              <div v-for="user in filteredUsers" :key="user.id"
                class="cursor-pointer p-3 flex items-center justify-between rounded-lg bg-white shadow-lg hover:bg-blue-100 transition-all duration-300 ease-in-out transform hover:scale-105 max-h-32"
                @click="openChat(user)">

                <!-- Avatar + Info -->
                <div class="flex items-center">
                  <div class="relative">
                    <img :src="getUserImageUrl(user.image, user.name)"
                      class="w-10 h-10 rounded-full shadow-xl transform transition-transform duration-300 ease-in-out hover:scale-110" />
                    <!-- Online Dot -->
                    <span v-if="user.is_active"
                      class="absolute bottom-0 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  </div>
                  <div class="flex flex-col ml-2">
                    <div class="flex items-center space-x-2">
                      <p :class="[
                          'text-md',
                          user.unread_count > 0 && isReceiver
                            ? 'font-extrabold text-blue-900'
                            : 'font-semibold text-gray-900'
                        ]">
                        {{ user.name }}
                      </p>
                      <span v-if="user.unread_count > 0 && isReceiver"
                        class="bg-red-600 text-white text-[10px] font-bold rounded-full px-2 py-0.5">
                        {{ user.unread_count }}
                      </span>
                    </div>

                    <p class="text-sm text-gray-600 truncate max-w-[200px]">
                      {{ user.department_name || 'No bio available' }}
                    </p>
                  </div>
                </div>

              </div>
            </div>

          <!-- Chat Window with Selected User -->
          <div v-if="selectedUser" class="flex bg-gray-50 overflow-hidden">
            <!-- User List (Sidebar) -->
            <div class="w-[15%] overflow-auto  no-scrollbar border-r space-y-4 p-2" :class="sidebarClass">
              <div v-for="user in users" :key="user.id" class="cursor-pointer mb-4" @click="openChat(user)">
                <div class="flex items-center rounded-lg hover:bg-blue-100 transition-all duration-300 ml-2">
                  <img :src="getUserImageUrl(user.image, user.name)"
                    class="w-10 h-10 rounded-full shadow-xl transform transition-transform duration-300 ease-in-out hover:scale-110" />
                </div>
              </div>
            </div>
            <!-- Messages Area -->
            <div class="flex-grow bg-gray-50 space-y-4 overflow-auto no-scrollbar h-[75vh]" :class="messageClass"
              aria-live="polite">
              <!-- Chat Header -->
              <div
                class="flex justify-between items-center border-b p-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg rounded-t-lg">
                <h3 id="chatWindowTitle" class="font-semibold text-lg">{{ selectedUser ? selectedUser.name : "Chat" }}
                </h3>
                <button @click="closeChat" class="text-white hover:text-gray-900 text-xl" aria-label="Close Chat">
                  <i class="fas fa-times-circle"></i>
                </button>
              </div>
              <div ref="messagesContainer"
                class="flex flex-col space-y-4 overflow-auto max-h-[calc(85vh-200px)] pr-4 pb-28">
                <div v-for="message in selectedUser.messages" :key="message.id">
                  <div v-if="message.sender_id !== senderId" class="text-left">
                    <div class="text-xs text-gray-500">{{ message.sender_name }}</div>
                    <div class="ml-3 inline-block max-w-xs hover:shadow-xl transition-all duration-300">
                      <p v-if="!message.attachment" class="text-sm bg-gray-200 p-1 rounded-xl">{{ message.content }}</p>
                      <div v-if="message.attachment" class="flex flex-col space-y-0">
                        <p v-if="message.content" class="text-sm bg-gray-200 p-1 rounded-t-xl">{{ message.content }}</p>
                        <div class="flex justify-start items-center">
                          <img v-if="isImage(message.attachment)" :src="generateApiUrl(message.attachment)"
                            class="message-attachment max-w-[150px] h-auto rounded-lg transition-transform duration-300 transform hover:scale-110" />
                          <a v-else :href="generateApiUrl(message.attachment)" target="_blank"
                            class="text-blue-500 inline-block rounded-full text-xs">Download
                            Attachment</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="message.sender_id === senderId" class="text-right">
                    <div class="ml-3 inline-block max-w-xs hover:shadow-xl transition-all duration-300">
                      <p v-if="!message.attachment" class="text-sm bg-blue-400 p-2 rounded-xl">{{ message.content }}</p>
                      <div v-if="message.attachment" class="flex flex-col space-y-0">
                        <p v-if="message.content" class="text-sm bg-blue-400 rounded-xl">{{ message.content }}</p>
                        <div class="flex justify-start items-center mt-1">
                          <img v-if="isImage(message.attachment)" :src="generateApiUrl(message.attachment)"
                            alt="attachment"
                            class="message-attachment max-w-[150px] h-auto rounded-lg transition-transform duration-300 transform hover:scale-110" />

                          <a v-else :href="generateApiUrl(message.attachment)" target="_blank"
                            class="text-gray-900 p-2 inline-block text-xs rounded-full bg-blue-400">Download
                            Attachment</a>

                        </div>
                      </div>
                    </div>
                    <div v-if="message.sender_id === senderId" class="relative">
                      <button @click="toggleMenu(message.id)" class="text-gray-500 text-xs hover:text-gray-700">
                        ...
                      </button>
                      
                      <div v-if="message.showMenu" class="absolute right-0 mt-1 w-32 bg-white border border-gray-300 shadow-md rounded-lg">
                        <button @click="unsendMessage(message.id)" class="w-full text-left text-red-500 text-sm px-4  hover:bg-gray-200">
                          Unsend
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Message Input Section -->
            <div class="absolute bottom-0 right-0 w-[85%] border-t shadow-lg p-3 bg-gray-100 rounded-b-lg"
              :class="sidebarClass">
              <div class="flex items-center space-x-4">
                <input v-model="newMessage" type="text" placeholder="Type a message..."
                  class="w-full p-3 rounded-lg border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition-all duration-300"
                  aria-label="Type your message" />
                <input type="file" @change="handleAttachment" class="ml-4 hidden" ref="fileInput" />
                <button @click="triggerFileInput"
                  class="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
                  aria-label="Attach a file">
                  <i class="fas fa-paperclip"></i>
                </button>
                <button @click="sendMessage"
                  class="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
                  aria-label="Send Message">
                  <i class="fas fa-paper-plane"></i>
                </button>
              </div>
              <div v-if="attachment" class="mt-2 text-gray-600 text-sm">
                <span>Selected file: <strong>{{ attachment.name }}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* Custom Scrollbars */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Chat Message Bubble Shadows */
.bg-gray-200 {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.bg-blue-600 {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* Attachment Hover Effects */
.message-attachment {
  border: 2px solid #e0e0e0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Animation for Scale-in */
.scale-in {
  animation: scaleIn 0.3s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}
/* Button Hover and Focus Effects */
button:hover {
  transform: scale(1.1);
}


input[type="text"]:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5);
}

/* Add shadows and borders to enhance design */
.message-attachment {
  border: 2px solid #e0e0e0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Chat Message Bubble Shadows */
.bg-gray-200 {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.bg-blue-600 {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* Scale-in Animation */
.scale-in {
  animation: scaleIn 0.3s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Attachment & Button Hover Effects */
button:hover {
  transform: scale(1.1);
}

input[type="text"]:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5);
}
</style>
<script>
import apiEndpoints from "@/config/apiConfig";
import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export default {
  data() {
    return {
      isChatOpen: false,
      sendingMessage: false,
      selectedUser: {
        messages: [],
      },
      newMessage: "",
      userAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
      users: [],
      senderId: null,
      attachment: null,
      attachmentType: null,
      currentChatChannel: null,
      searchQuery: "",
    };
  },
  computed: {
    buttonPositionClass() {
      return this.$store.state.sidebarPosition === "right" ? "left-8" : "right-8";
    },
    chatWindowPositionClass() {
      return this.$store.state.sidebarPosition === "right" ? "left-8" : "right-8";
    },
    themeClass() {
      return this.$store.state.theme === "dark" ? "bg-gray-600 text-gray-800" : "bg-gray-200 text-gray-800";
    },
    messageClass() {
      return this.$store.state.theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800";
    },
    sidebarClass() {
      return this.$store.state.theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-blue-200 text-gray-800";
    },
    totalUnreadCount() {
      return this.users
        .filter(user => user.id !== this.senderId)
        .reduce((sum, user) => sum + (user.unread_count || 0), 0);
    },
    filteredUsers() {
      const query = this.searchQuery.toLowerCase();
      return this.users.filter(user =>
        user.name.toLowerCase().includes(query) ||
        (user.department_name && user.department_name.toLowerCase().includes(query))
      );
    },
  },
  created() {
    const token = this.$store.getters.token;
    if (token && !this.$store.getters.echoInitialized) {
      this.initializeEcho();
      // this.$store.commit("setEchoInitialized", true);
    }
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
    this.scrollToBottom();
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    initializeEcho() {
      const token = this.$store.getters.token;
      if (!token) return;

      window.Pusher = Pusher;

      window.Echo = new Echo({
        broadcaster: "reverb",
        key: "tu2ote1tl8ypu81lft7p",
        wsHost: "192.168.0.3", // 🔧 Set your Reverb host
        wsPort: 4023,   // 🔧 Set WebSocket port
        wssPort: 4023,  // 🔧 Set secure port
        forceTLS: false,
        disableStats: true,
        enabledTransports: ["ws", "wss"],
        authEndpoint: apiEndpoints.broadcasting,
        auth: {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
        debug: true,
      });
      this.initApp();
    },

   async initApp() {
  try {
    const { data } = await axios.get(apiEndpoints.allUsers, {
      headers: { Authorization: `Bearer ${this.$store.getters.token}` },
    });

    this.senderId = data.logged_user.id;
    this.users = data.users;
    this.listenToAllUsers();
  } catch (error) {
    this.handleError(error);
  }
}
,
    async fetchUsers() {
      try {
        const { data } = await axios.get(apiEndpoints.allUsers, {
          headers: { Authorization: `Bearer ${this.$store.getters.token}` },
        });
        this.users = data.users;
        this.listenToAllUsers();
      } catch (error) {
        this.handleError(error);
      }
    },

    async fetchConversation(user) {
      try {
        const { data } = await axios.get(apiEndpoints.messageConvo(user.id), {
          headers: { Authorization: `Bearer ${this.$store.getters.token}` },
        });
        this.selectedUser.messages = data.messages;
        this.senderId = data.loggedInUserId;
        this.listenForNewMessages(user);
      } catch (error) {
        this.handleError(error);
      }
    },

    async sendMessage() {
      if (!this.newMessage.trim() && !this.attachment) return;
      this.sendingMessage = true;

      try {
        const formData = new FormData();
        formData.append("content", this.newMessage);
        formData.append("receiver_id", this.selectedUser.id);
        formData.append("sender_id", this.senderId);

        if (this.attachment) {
          formData.append("attachment", this.attachment);
          formData.append("attachment_type", this.attachmentType);
        }

        const response = await axios.post(apiEndpoints.messageSend, formData, {
          headers: { Authorization: `Bearer ${this.$store.getters.token}` },
        });

        const message = response.data.message;

        this.newMessage = "";
        this.attachment = null;
        this.attachmentType = null;
        this.selectedUser.messages.push(message);
        this.$nextTick(() => this.scrollToBottom());
      } catch (error) {
        this.handleError(error);
      } finally {
        this.sendingMessage = false;
      }
    },

    openChat(user) {
      this.selectedUser = user;
      this.fetchConversation(user);
      user.unread_count = 0;

      axios.post(
        apiEndpoints.markAsRead,
        { sender_id: user.id },
        { headers: { Authorization: `Bearer ${this.$store.getters.token}` } }
      );

      this.listenForNewMessages(user);
      this.$nextTick(() => this.scrollToBottom());
    },

    listenForNewMessages(user) {
      const userIdA = Math.min(this.senderId, user.id);
      const userIdB = Math.max(this.senderId, user.id);
      const chatChannel = `chat-channel.${userIdA}.${userIdB}`;

      if (this.currentChatChannel && this.currentChatChannel !== chatChannel) {
        window.Echo.leave(this.currentChatChannel);
      }

      this.currentChatChannel = chatChannel;

      window.Echo.private(chatChannel)
        .listen(".MessageSent", (data) => {
          if (!data?.message) return;

          const message = data.message;

          const isChatOpen =
            this.selectedUser &&
            (this.selectedUser.id === message.sender_id ||
              this.selectedUser.id === message.receiver_id);

          if (isChatOpen) {
            this.selectedUser.messages.push(message);
            this.$nextTick(() => this.scrollToBottom());
          } else if (message.sender_id !== this.senderId) {
            const targetUser = this.users.find((u) => u.id === message.sender_id);
            if (targetUser) {
              targetUser.unread_count = (targetUser.unread_count || 0) + 1;
            }
          }
        })
        .error(this.handleError);
    },

    listenToAllUsers() {
      this.users.forEach((user) => {
        if (user.id === this.senderId) return;

        const userIdA = Math.min(this.senderId, user.id);
        const userIdB = Math.max(this.senderId, user.id);
        const chatChannel = `chat-channel.${userIdA}.${userIdB}`;

        window.Echo.private(chatChannel)
          .listen(".MessageSent", (data) => {
            if (!data?.message) return;

            const message = data.message;

            if (this.selectedUser && message.sender_id === this.selectedUser.id) {
              this.selectedUser.messages.push(message);
              this.$nextTick(() => this.scrollToBottom());
            } else {
              const targetUser = this.users.find(
                (u) => u.id === message.sender_id
              );
              if (targetUser) {
                targetUser.unread_count = (targetUser.unread_count || 0) + 1;
              }
            }
          })
          .error(this.handleError);
      });
    },

    async unsendMessage(messageId) {
      if (confirm("Are you sure you want to unsend this message?")) {
        try {
          await axios.delete(`${apiEndpoints.messageDelete}/${messageId}`, {
            headers: { Authorization: `Bearer ${this.$store.getters.token}` },
          });

          this.selectedUser.messages = this.selectedUser.messages.filter(
            (msg) => msg.id !== messageId
          );
          this.$nextTick(() => this.scrollToBottom());
        } catch (error) {
          console.error("Failed to unsend message:", error);
          alert("Failed to unsend the message.");
        }
      }
    },

    toggleChatWindow() {
      this.isChatOpen = !this.isChatOpen;
      if (this.isChatOpen) {
        this.$nextTick(() => this.scrollToBottom());
      }
    },

    closeChat() {
      this.isChatOpen = false;
      this.selectedUser = null;
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const messagesContainer = this.$refs.messagesContainer;
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      });
    },
    isImage(url) {
      return url && /\.(jpg|jpeg|png|gif|bmp)$/i.test(url);
    },

    getUserImageUrl(image, name) {
      return this.isImage(image)
        ? `${apiEndpoints.storageUrl2}/${image}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128`;
    },

    handleAttachment(event) {
      const file = event.target.files[0];
      if (file) {
        this.attachment = file;
        this.attachmentType = file.type.startsWith("image/")
          ? "image"
          : file.type === "application/pdf"
          ? "pdf"
          : "file";
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleError(error) {
      console.error("Error occurred:", error);
      // alert("An error occurred. Please try again.");
    },

    handleClickOutside(event) {
      const chatWindow = this.$refs.chatWindow;
      const chatButton = this.$refs.chatButton;
      if (
        this.isChatOpen &&
        chatWindow &&
        !chatWindow.contains(event.target) &&
        chatButton &&
        !chatButton.contains(event.target)
      ) {
        this.closeChat();
      }
    },
  },
};
</script>
