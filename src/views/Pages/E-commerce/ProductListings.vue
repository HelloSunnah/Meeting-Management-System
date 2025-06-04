<template>
  <div :class="themeClass">
    <!-- Chat Button -->
    <button @click="toggleChatWindow" :aria-label="isChatOpen ? 'Close chat' : 'Open chat'"
      :class="[
        'fixed bottom-8 gap-2 p-3 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white rounded-full shadow-lg z-50 transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300',
        buttonPositionClass
      ]" style="box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3)">
      <i class="fas fa-comment text-lg mr-1 transform transition-all duration-300 ease-in-out hover:rotate-12"></i>
      <span class="hidden sm:block text-base font-semibold">{{ $t('Chat') }}</span>
    </button>

    <!-- Floating Chat Window -->
    <div v-if="isChatOpen" :class="[themeClass, chatWindowPositionClass]"
      class="fixed bottom-6 right-6 w-[450px] h-[75vh] bg-white shadow-xl rounded-lg transition-all duration-300 z-50 overflow-hidden scale-in border-2 border-gray-200">
      <div class="flex flex-col h-full">
        <!-- Main Content Container -->
        <div class="flex flex-col flex-grow overflow-hidden">
          <!-- If No User Selected, Show the Full User List -->
          <div v-if="!selectedUser" class="w-full overflow-auto bg-gray-50 space-y-4 p-0">
            <div v-for="user in users" :key="user.id" class="cursor-pointer mb-4" @click="openChat(user)">
              <div class="flex items-center p-1 ml-4 rounded-lg hover:bg-blue-100 transition-all duration-300">
                <img :src="user.avatar || userAvatar" alt="User Avatar" class="w-12 h-12 rounded-full mr-3 shadow-xl" />
                <p class="font-semibold text-gray-800">{{ user.name }}</p>
              </div>
            </div>
          </div>

          <!-- If a User is Selected, Show the Messages List on the Right -->
          <div v-if="selectedUser" class="flex flex-row flex-grow bg-gray-50 overflow-hidden">
            <!-- User List (Sidebar) with only Avatars -->
            <div class="w-1/7 overflow-auto bg-gray-100 border-r rounded-lg space-y-4 p-0">
              <div v-for="user in users" :key="user.id" class="cursor-pointer mb-4 mt-4" @click="openChat(user)">
                <div class="flex items-center p-2 rounded-lg hover:bg-blue-100 transition-all duration-300">
                  <img :src="user.avatar || userAvatar" alt="User Avatar" class="w-10 h-10 rounded-full shadow-xl" />
                </div>
              </div>
            </div>

            <!-- Messages Container (Right Side) -->
            <div class="flex-grow bg-gray-50 space-y-4 overflow-auto pr-4 no-scrollbar">
              <!-- Chat Header with Close Button -->
              <div class="flex justify-between items-center border-b pb-2 mb-2 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg rounded-t-lg">
                <h3 id="chatWindowTitle" class="font-semibold text-lg">{{ selectedUser ? selectedUser.name : 'Chat' }}</h3>
                <button @click="closeChat" class="text-white hover:text-gray-900 text-xl" aria-label="Close Chat">
                  <i class="fas fa-times-circle"></i>
                </button>
              </div>

              <div ref="messagesContainer" class="flex flex-col space-y-4 overflow-auto max-h-[calc(85vh-200px)] pr-4 pb-12">
                <div v-for="message in selectedUser.messages" :key="message.id" :class="messageClass">
                  <div v-if="message.sender_id !== senderId" class="text-left">
                    <div class="text-xs text-gray-500">{{ message.sender_name }}</div>
                    <div class=" ml-3 inline-block max-w-xs mt-1 shadow-md hover:shadow-xl transition-all duration-300">
                      <p v-if="!message.attachment" class="text-sm bg-gray-200 p-3 rounded-lg ">{{ message.content }}</p>
                      <div v-if="message.attachment">
                        <img v-if="isImage(message.attachment)"

                         :src="generateApiUrl(message.attachment)"
                          class="message-attachment max-w-[150px] h-auto rounded-lg" />
                        <a v-else 
                                                 :href="generateApiUrl(message.attachment)" target="_blank"
                          class="text-blue-500 mt-2 inline-block text-xs">Download Attachment</a>
                      </div>
                    </div>
                  </div>

                  <div v-if="message.sender_id === senderId" class="text-right">
                    <div class="  inline-block max-w-xs mt-1 shadow-md hover:shadow-xl transition-all duration-300">
                      <p v-if="!message.attachment" class="text-sm p-3 bg-blue-600 rounded-lg">{{ message.content }}</p>
                      <div v-if="message.attachment">
                        <img v-if="isImage(message.attachment)"
                                                 :src="generateApiUrl(message.attachment)"

                          class="message-attachment max-w-[150px] h-auto rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message Input Section (Fixed to Footer) -->
            <div class="w-5/6 absolute bottom-0 right-0 bg-white border-t shadow-lg p-2">
              <div class="flex items-center space-x-4">
                <!-- Input Field -->
                <input v-model="newMessage" type="text" placeholder="Type a message..."
                  class="w-full p-2 rounded-lg border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition-all duration-300"
                  aria-label="Type your message" />

                <!-- Hidden File Input -->
                <input type="file" @change="handleAttachment" class="ml-4 hidden" ref="fileInput" />

                <!-- Attachment Button -->
                <button @click="triggerFileInput" class="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
                  aria-label="Attach a file">
                  <i class="fas fa-paperclip"></i>
                </button>

                <!-- Send Button -->
                <button @click="sendMessage" class="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
                  aria-label="Send Message">
                  <i class="fas fa-paper-plane"></i>
                </button>
              </div>

              <!-- Show selected attachment file name -->
              <div v-if="attachment" class="mt-2 text-gray-600 text-sm">
                <span>Selected file: <strong>{{ attachment.name }}</strong></span>
              </div>
            </div>
          </div> <!-- End Messages Container -->
        </div> <!-- End Main Content Container -->
      </div> <!-- End Chat Window -->
    </div>
  </div>
</template>


<style scoped>
  /* Tailwind custom scrollbar hide for better design */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* Add shadows and borders to enhance design */
  .message-attachment {
    border: 2px solid #e0e0e0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  /* Custom message bubble shadows */
  .bg-gray-200 {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .bg-blue-600 {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
</style>


<script>import apiEndpoints from '@/config/apiConfig';

import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

import { useToast } from "vue-toastification";

export default {
    setup() {
    const toast = useToast();
    return { toast };
  },  data() {
    return {
      isChatOpen: false,
      selectedUser: null,
      themeClass: "",
      newMessage: "",
      userAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
      users: [],
      senderId: null,
      attachment: null,
      attachmentType: null,
    };
  },
  computed: {
    buttonPositionClass() {
      return this.$store.state.sidebarPosition === "right"
        ? "left-8"
        : "right-8";
    },
    chatWindowPositionClass() {
      return this.$store.state.sidebarPosition === "right"
        ? "left-8"
        : "right-8";
    },
    themeClass() {
      return this.$store.state.theme === "dark"
        ? "bg-gray-600 text-gray-800"
        : "bg-gray-200 text-gray-800";
    },
    buttonClass() {
      return this.$store.state.theme === "dark"
        ? "bg-gray-700 hover:bg-gray-600"
        : "bg-blue-500 hover:bg-blue-600";
    },
    chatWindowClass() {
      return this.$store.state.theme === "dark" ? "bg-gray-800" : "bg-white";
    },
    messageClass() {
      return this.$store.state.theme === "dark"
        ? "bg-gray-600 text-gray-200"
        : "bg-white text-gray-800";
    },
    sidebarClass() {
      return this.$store.state.theme === "dark"
        ? "bg-gray-700 text-gray-200"
        : "bg-white text-gray-800";
    },
    listClass() {
      return this.$store.state.theme === "dark"
        ? "bg-gray-800 text-gray-200"
        : "bg-gray-100 text-gray-800";
    },
    sendSectionClass() {
      return this.$store.state.theme === "dark"
        ? "bg-gray-700 text-gray-200 border-gray-600"
        : "bg-gray-100 text-gray-800 border-gray-300";
    },
  }
,  created() {
    this.token = localStorage.getItem("token")?.trim();
    this.fetchUsers();
  },
  methods: {
    toggleChatWindow() {
      this.isChatOpen = !this.isChatOpen;
      if (this.isChatOpen) {
        this.scrollToBottom();
      }
    },
    closeChat() {
      this.isChatOpen = false;
      this.selectedUser = null;
    },
    openChat(user) {
  this.selectedUser = user;
  this.fetchConversation(user);
  this.$nextTick(this.scrollToBottom);  // Ensure scrolling to bottom after new user chat
},
scrollToBottom() {
  this.$nextTick(() => {
    const messagesContainer = this.$refs.messagesContainer;
    if (messagesContainer) {
      // Scroll to the bottom after the new message has been added
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  });
}
,
  // Helper function to generate the full URL based on the attachment filename
    generateApiUrl(attachment) {
      return `${apiEndpoints.storageUrl}${attachment}`;
    },
    

    isImage(url) {
      return url && (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif') || url.endsWith('.bmp'));
    },
    async fetchUsers() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found!");

        const { data } = await axios.get(apiEndpoints.allUsers, {
          
          headers: { Authorization: `Bearer ${token}` },
        });

        this.users = data.users;
      } catch (error) {
        console.error('Fetch Error:', error.response || error.message);
      }
    },
    async fetchConversation(user) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found!");

        const { data } = await axios.get(apiEndpoints.messageConvo(user.id), {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.selectedUser.messages = data.messages;
        this.senderId = data.loggedInUserId;
        this.listenForNewMessages(user);
      } catch (error) {
        console.error('Error fetching conversation:', error.response || error.message);
      }
    },
  async sendMessage() {
      // If no message and no attachment, don't proceed
      if (!this.newMessage.trim() && !this.attachment) {
        this.toast.error("Please write a message or attach a file.");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("content", this.newMessage);
        formData.append("receiver_id", this.selectedUser.id);
        formData.append("sender_id", this.senderId);

        // Attach the file if there is one
        if (this.attachment) {
          formData.append("attachment", this.attachment);
          formData.append("attachment_type", this.attachmentType);
        }

        // Make the API request
        const response = await axios.post(apiEndpoints.sendMessage, formData, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const message = response.data.message;
        
        // If message has an attachment, set the URL
        if (message.attachment) {
          message.attachment.url = message.attachment.url;
        }

        // Add the new message to the selected user's messages
        this.selectedUser.messages.push(message);
        this.newMessage = '';  // Reset the new message input
        this.attachment = null; // Reset attachment
        this.attachmentType = null; // Reset attachment type

        // Scroll to the bottom of the chat after sending a message
        this.$nextTick(this.scrollToBottom);

        this.toast.success("Message sent successfully!"); // Notify the user
      } catch (error) {
        console.error("Error sending message:", error);
        this.toast.error("❌ Failed to send message. Please try again.");
      }
    },

    scrollToBottom() {
      // Assuming you have a scroll container for messages
      const container = this.$refs.messageContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }


,
    listenForNewMessages(user) {
      const chatChannel = `chat-channel.${Math.min(this.senderId, user.id)}.${Math.max(this.senderId, user.id)}`;
      window.Echo.private(chatChannel).listen('.MessageSent', (data) => {
        if (data?.message) {
          this.selectedUser.messages.push(data.message);
          this.$nextTick(this.scrollToBottom);
        }
      }).error((error) => {
        console.error('Error subscribing to channel:', error);
      });
    },
  
    handleAttachment(event) {
      const file = event.target.files[0];
      if (file) {
        this.attachment = file;
        if (file.type.startsWith('image/')) {
          this.attachmentType = 'image';
        } else if (file.type === 'image/gif') {
          this.attachmentType = 'gif';
        } else {
          this.attachmentType = 'file';
        }
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
  },
};
</script>
<style>.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;  /* For Internet Explorer */
  scrollbar-width: none; /* For Firefox */
}

.messagesContainer {
  overflow-y: auto;  /* Ensure vertical scrolling */
  max-height: calc(85vh - 200px);  /* Adjust height if necessary */
}</style>