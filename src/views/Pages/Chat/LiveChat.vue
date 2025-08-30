<template>
  <div class="chat-container">
    <div :class="themeClass" class="flex h-full w-full overflow-hidden rounded-lg shadow-md">

      <ChatSidebar :users="users" :themeClass="themeClass" :searchQuery="searchQuery"
        @update:searchQuery="searchQuery = $event" @select-user="openChat" />

      <ChatWindow class="rounded-xl" :user="selectedUser" :senderId="senderId" @send="handleSend"
        @close-chat="selectedUser = null" @unsend="unsendMessage" @load-older-messages="loadOlderMessages" />
    </div>
  </div>
</template>
<style scoped>
.chat-container {
  height: 90vh;
  padding-top: 2%;
  padding-bottom: 2%;
  background-color: #f3f4f6;
  overflow: hidden;

}

.chat-container * {
  scrollbar-width: none !important;
  /* Firefox */
  -ms-overflow-style: none !important;
  /* IE/Edge */
}

.chat-container ::-webkit-scrollbar {
  display: none !important;
  /* Chrome/Safari */
}

/* Optional: Smooth scaling & transitions for better feel */
button:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease-in-out;
}

input[type="text"]:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3);
}

/* Optional shadow polish */
.bg-gray-200 {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.bg-blue-600 {
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
}
</style>
<script>
import apiEndpoints from "@/config/apiConfig";
import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import ChatSidebar from "@/views/Pages/Chat/ChatList.vue";
import ChatWindow from "@/views/Pages/Chat/ChatWindow.vue";

export default {
  components: {
    ChatSidebar,
    ChatWindow,
  },
  data() {
    return {
      handleSend: "",
      unsendMessage: "",
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
      offset: 0,
      limit: 30,
      allMessagesLoaded: false,
      loadingOlderMessages: false,
      chatListeners: {},
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
      return "bg-gray-200 text-gray-800";
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
  },
  created() {
    const token = localStorage.getItem("token");
    if (token) {
      this.initializeEcho();
    }
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
    this.scrollToBottom();
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
    if (this.currentChatChannel) {
      window.Echo.leave(this.currentChatChannel);
      delete this.chatListeners[this.currentChatChannel];
    }
  },
  methods: {
    //   initializeEcho() {
    //   const token = localStorage.getItem("token");
    //   if (!token) return;

    //   window.Pusher = Pusher;
    //   window.Echo = new Echo({
    //   broadcaster: "reverb",
    //   key: "tu2ote1tl8ypu81lft7p",
    //   wsHost: "127.0.0.1",
    //   wsPort: 8090,
    //   forceTLS: false,
    //   enabledTransports: ["ws"],
    //   authEndpoint: apiEndpoints.broadcasting,
    //   auth: {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       Accept: "application/json",
    //     },
    //   },
    // });

    //   this.initApp();
    //   },

    initializeEcho() {
      const token = localStorage.getItem("token");
      if (!token) return;

      // window.Pusher = Pusher;
      window.Echo = new Echo({
        broadcaster: "reverb",
        key: "tu2ote1tl8ypu81lft7p",
        wsHost: "meetingapi.atilimited.net",
        wsPort: 80,
        wssPort: 443,
        // wss: true,
        // forceTLS: true,
        wsPath: "",
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
        const { data } = await axios.get(apiEndpoints.chatUsers, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        
        this.senderId = data.logged_user.id;
        this.users = data.users;

        // Sort the users by 'is_active' (active users first)
        this.users.sort((a, b) => b.is_active - a.is_active);

        this.listenPublicUnreadCount();
      } catch (error) {
        this.handleError(error);
      }
    },

    listenPublicUnreadCount() {
      if (!this.senderId) return;
      window.Echo.channel(`unread-count-channel.${this.senderId}`)
        .listen('.PublicUnreadCount', (data) => {
          const targetUser = this.users.find(u => u.id === Number(data.sender_id));
          if (targetUser) {
            targetUser.unread_count = data.count;
          }
        });
    },

    async sendMessage() {

      if (!this.newMessage.trim() && !this.attachment) return;

      // ✅ Check WebSocket connection before sending
      const connectionState = window?.Echo?.connector?.pusher?.connection?.state;
      if (connectionState !== 'connected') {
        this.$toast?.error?.("WebSocket not connected. Please wait or reload.");
        return;
      }

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
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
      this.offset = 0;
      this.allMessagesLoaded = false;
      this.selectedUser = user;
      this.fetchConversation(user);
      user.unread_count = 0;
      axios.post(
        apiEndpoints.markAsRead,
        { sender_id: user.id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      this.listenForNewMessages(user);
      this.$nextTick(() => this.scrollToBottom());
    },

    async loadOlderMessages() {
      await this.fetchConversation(this.selectedUser, true); // true = append older
    },


    async fetchConversation(user, append = false) {
      if (this.loadingOlderMessages || this.allMessagesLoaded) return;

      this.loadingOlderMessages = true;

      const container = this.$refs.messagesContainer;
      const previousScrollHeight = container?.scrollHeight || 0;

      try {
        const { data } = await axios.get(apiEndpoints.messageConvo(user.id), {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: { limit: this.limit, offset: this.offset },
        });

        const newMessages = data.messages;

        if (append && this.selectedUser.messages.length) {
          this.selectedUser.messages = [...newMessages, ...this.selectedUser.messages];
        } else {
          this.selectedUser.messages = newMessages;
        }

        if (newMessages.length < this.limit) {
          this.allMessagesLoaded = true;
        }

        this.offset += this.limit;
        this.senderId = data.loggedInUserId;

        this.$nextTick(() => {
          if (append && container) {
            const scrollDiff = container.scrollHeight - previousScrollHeight;
            container.scrollTop = scrollDiff;
          } else {
            this.scrollToBottom();
          }
        });
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loadingOlderMessages = false;
      }
    },

    listenForNewMessages(user) {
      const userIdA = Math.min(this.senderId, user.id);
      const userIdB = Math.max(this.senderId, user.id);
      const chatChannel = `chat-channel.${userIdA}.${userIdB}`;

      // Prevent multiple listeners on same channel
      if (this.chatListeners[chatChannel]) {
        console.log("🛑 Listener already attached to:", chatChannel);
        return;
      }

      // Leave old channel if changed
      if (this.currentChatChannel && this.currentChatChannel !== chatChannel) {
        window.Echo.leave(this.currentChatChannel);
        delete this.chatListeners[this.currentChatChannel];
        console.log("🚪 Left old channel:", this.currentChatChannel);
      }

      this.currentChatChannel = chatChannel;
      console.log("📡 Subscribing to:", `private-${chatChannel}`);

      window.Echo.private(chatChannel)
        .listen(".MessageSent", (data) => {
          const message = data.message;

          if (message.attachment) {
            message.attachment_url = this.getFullUrl(message.attachment);
          }

          const isChatOpen = this.selectedUser?.id &&
            (this.selectedUser.id == message.sender_id || this.selectedUser.id == message.receiver_id);

          if (isChatOpen) {
            const alreadyExists = this.selectedUser.messages.some(m => m.id === message.id);
            if (!alreadyExists) {
              this.selectedUser.messages.push(message);
              this.$nextTick(() => this.scrollToBottom());
            }
          } else if (message.sender_id !== this.senderId) {
            const targetUser = this.users.find(u => u.id === message.sender_id);
            if (targetUser) {
              targetUser.unread_count = (targetUser.unread_count || 0) + 1;
            }
          }
        })
        .error(e => console.error("🚨 Echo error:", e));

      // Mark this channel as listened
      this.chatListeners[chatChannel] = true;
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
      if (this.currentChatChannel) {
        window.Echo.leave(this.currentChatChannel);
        this.currentChatChannel = null;
      }
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

    getFullUrl(path) {
      if (!path) return "";
      return path.startsWith("http") ? path : `${apiEndpoints.storageUrl2}/${path.replace(/^\/+/, "")}`;
    },

    handleError(error) {
      console.error("Error occurred:", error);
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
