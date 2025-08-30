<template>
  <div :class="theme81" class="min-h-screen p-6 bg-gray-100 transition-all duration-300 ease-in-out print:bg-white">
    <div :class="theme61" class="mx-auto max-w-5xl rounded-xl shadow-xl p-10 space-y-8 print:shadow-none print:p-4 print:mx-0 print:w-full print:max-w-none mt-6">

      <!-- Header -->
      <div class="flex justify-between items-center border-b pb-4">
        <h1 class="text-4xl font-extrabold text-blue-900 tracking-tight">📝 Meeting Report</h1>
        <button
          @click="printPage"
          class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 print:hidden"
        >
          🖨️ Print
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center text-blue-600 font-semibold">Loading...</div>

      <!-- Not Found -->
      <div v-else-if="!meeting" class="text-center text-red-600 font-semibold">Meeting not found.</div>

      <!-- Meeting Content -->
      <div v-else class="space-y-10">

        <!-- Info Grid -->
        <section :class="theme6" class="grid grid-cols-1 md:grid-cols-2 gap-6 text-[16px] bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
          <div><strong>📌 Title:</strong> {{ meeting.title }}</div>
          <div><strong>🏢 Client:</strong> {{ meeting.client_name }}</div>
          <div><strong>📂 Project:</strong> {{ meeting.project_name }}</div>
          <div><strong>📍 Location:</strong> {{ meeting.location_name }}</div>
          <div><strong>📅 Date:</strong> {{ meeting.date }}</div>
          <div><strong>⏰ Time:</strong> {{ meeting.start_time }} - {{ meeting.end_time }}</div>
          <div><strong>👤 Host:</strong> {{ meeting.host_name }}</div>
          <div class="md:col-span-2"><strong>📝 Description:</strong><div v-html="meeting.description"></div></div>
        </section>

        <!-- Participants -->
        <section>
          <h2 :class="themeText" class="text-2xl font-bold text-blue-800 mb-3">👥 Participants</h2>
          <ul class="list-disc pl-6 space-y-1 text-gray-800">
            <li :class="themeText" v-for="p in meeting.participants" :key="p.id">{{ p.user_name }}</li>
          </ul>
        </section>

        <!-- Attachments (Hidden on Print) -->
        <section v-if="meeting.attachments.length" class="print:hidden">
          <h2 class="text-2xl font-bold text-blue-800 mb-4">Attachments</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              v-for="file in meeting.attachments"
              :key="file.id"
              class="border border-gray-300 p-4 rounded-lg shadow bg-white hover:shadow-md transition"
            >
              <p class="font-semibold mb-2 text-gray-700">{{ file.attachment_title }}</p>
              <div>
                <template v-if="isImage(file.attachment_path)">
                  <a :href="generateApiUrl(file.attachment_path)" target="_blank">
                    <img :src="generateApiUrl(file.attachment_path)" class="object-contain max-h-32" />
                  </a>
                </template>
              </div>
            </div>
          </div>
        </section>

        <!-- Timestamp -->
        <div :class="themeText" class="text-sm text-gray-500 mt-4 italic print:hidden">
          Last updated: {{ meeting.updated_at }}
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import apiEndpoints from "@/config/apiConfig";
import useTheme from '@/components/js/ThemeSetting';
import { useToast } from "vue-toastification";
export default {
      setup() {
    const {
      theme6,
      theme8, theme61,
      theme9,theme81,
      themeText,
      themeInputText,
    } = useTheme();

    const toast = useToast();

    return {
      theme61,
      theme6,
      theme8,
      theme9,theme81,
      themeText,
      toast,themeInputText
    };
  },
  data() {
    return {
      meeting: null,
      loading: false,
      isPrinting: false,
    };
  },
  async created() {
    this.loading = true;
    const token = sessionStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const id = this.$route.params.id;

    try {
      const res = await fetch(`${apiEndpoints.meetings}/${id}`, { headers });
      const data = await res.json();
      this.meeting = data?.data;
    } catch (err) {
      console.error("Error fetching meeting detail:", err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    isImage(path) {
      return /\.(jpe?g|png|gif|bmp|webp)$/i.test(path);
    },

    isPDF(path) {
      return /\.pdf$/i.test(path);
    },

    generateApiUrl(path) {
      return `${apiEndpoints.storageUrl2}/${path}`;
    },

printPage() {
  document.body.classList.add('printing');
  window.print();
  setTimeout(() => {
    document.body.classList.remove('printing');
  }, 1000);
}

  },
};
</script><style scoped>
img {
  max-height: 300px;
  object-fit: contain;
}

@media print {
  body {
    margin: 0;
    padding: 0;
  }

  .print\\:hidden {
    display: none !important;
  }

  .print\\:p-4 {
    padding: 1rem !important;
  }

  .print\\:shadow-none {
    box-shadow: none !important;
  }

  .hide-on-print, .sidebar {
    display: none !important;
  }
}
</style>
