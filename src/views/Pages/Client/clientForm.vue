<template>
  <div :class="theme81" class="min-h-screen transition-all duration-300 ease-in-out py-12 px-6 sm:px-12">
    <div :class="theme7" class="mx-auto  rounded-2xl shadow-xl p-10 space-y-8">
      <h2 :class="themeText" class="text-4xl font-bold text-center">
        Add New Client
      </h2>

      <form @submit.prevent="submitClient">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Left Column -->
          <div :class="theme61" class="space-y-6 bg-gray-50 p-6 rounded-xl shadow-md">
            <!-- Client Name -->
            <div>
              <label class="form-label">Client Name <span class="text-red-500">*</span></label>
              <input :class="themeInputText" v-model="client.name" type="text" class="input"
                placeholder="Enter Client Name" required />
            </div>

            <!-- Abbreviation -->
            <div>
              <label class="form-label">Abbreviation</label>
              <input :class="themeInputText" v-model="client.abbreviation" type="text" class="input"
                placeholder="Short form (optional)" />
            </div>

            <!-- Description -->
            <div>
              <label class="form-label">Description</label>
              <textarea :class="themeInputText" v-model="client.description" class="input"
                placeholder="Short description"></textarea>
            </div>

            <!-- Details -->
            <div>
              <label class="form-label">Details</label>
              <textarea :class="themeInputText" v-model="client.details" class="input"
                placeholder="Additional details"></textarea>
            </div>

            <!-- Address -->
            <div>
              <label class="form-label">Address <span class="text-red-500">*</span></label>
              <textarea :class="themeInputText" v-model="client.address" class="input" placeholder="Client Address"
                required></textarea>
            </div>
          </div>

          <!-- Right Column -->
          <div :class="theme61" class="space-y-6 bg-gray-50 p-6 rounded-xl shadow-md">
            <!-- Website -->
            <div>
              <label class="form-label">Website</label>
              <input :class="themeInputText" v-model="client.website" type="url" class="input"
                placeholder="https://example.com" />
            </div>

            <!-- Phone 1 -->
            <div>
              <label class="form-label">Phone 1</label>
              <input :class="themeInputText" v-model="client.phone_1" v-non-negative type="number" class="input"
                placeholder="Phone number 1" />
            </div>

            <!-- Phone 2 -->
            <div>
              <label class="form-label">Phone 2</label>
              <input :class="themeInputText" v-model="client.phone_2" v-non-negative type="number" class="input"
                placeholder="Phone number 2" />
            </div>

            <!-- Mobile -->
            <div>
              <label class="form-label">Mobile</label>
              <input :class="themeInputText" v-model="client.mobile" v-non-negative type="number" class="input"
                placeholder="Mobile number" />
            </div>

            <!-- Email -->
            <div>
              <label class="form-label">Email</label>
              <input :class="themeInputText" v-model="client.email" type="email" class="input"
                placeholder="Email address" />
            </div>

            <!-- Company -->
            <div>
              <label class="form-label">Select Company<span class="text-red-500">*</span></label>
              <select :class="themeInputText" v-model="client.company_id" class="input" required>
                <option v-for="company in companies" :key="company.id" :value="company.id">
                  {{ company.name }}
                </option>
              </select>

            </div>

            <!-- Status -->
            <div>
              <label class="form-label">Status</label>
              <select :class="themeInputText" v-model="client.status" class="input">
                <option :value="1">Active</option>
                <option :value="0">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-center pt-6">
          <button type="submit" :disabled="isSubmitting"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-lg transition-all duration-300">
            {{ isSubmitting ? "Saving..." : "Save" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import apiEndpoints from "@/config/apiConfig";

import useTheme from '@/components/js/ThemeSetting';
import { useToast } from "vue-toastification";

export default {
  setup() {
    const toast = useToast();
    return { toast };
  },
  setup() {
    const {
      theme6,
      theme8, theme61,
      theme9, theme81,
      themeText,
      themeInputText, theme7
    } = useTheme();

    const toast = useToast();

    return {
      theme61,
      theme6,
      theme8,
      theme9, theme81,
      themeText,
      toast, themeInputText, theme7
    };
  },
  data() {
    return {
      client: {
        name: "",
        abbreviation: "",
        description: "",
        details: "",
        address: "",
        website: "",
        phone_1: "",
        phone_2: "",
        mobile: "",
        email: "",
        company_id: null,
        status: 1,
      },
      isSubmitting: false,
      companies: [],
    };
  },
  mounted() {
    this.fetchCompanies();
  },
  methods: {
    async fetchCompanies() {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(apiEndpoints.companies, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
        const data = await response.json();
        this.companies = data.data;
        console.log(this.companies);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    },
 async submitClient() {
  this.isSubmitting = true;
  this.errors = {}; // reset errors

  try {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();

    for (const key in this.client) {
      formData.append(key, this.client[key]);
    }

    if (this.logoFile) {
      formData.append("logo", this.logoFile);
    }

    const response = await fetch(apiEndpoints.clients, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorData;

      try {
        errorData = JSON.parse(responseText);
      } catch {
        // If response isn't JSON, just show the raw text
        this.toast.error(responseText);
        this.errors.general = responseText;
        this.isSubmitting = false;
        return;
      }

      this.errors = errorData;

      if (Array.isArray(errorData.errors)) {
        errorData.errors.forEach(err => {
          this.toast.error(err.detail || JSON.stringify(err));
        });
      } else {
        Object.values(errorData).forEach(messages => {
          if (Array.isArray(messages)) {
            messages.forEach(msg => this.toast.error(msg));
          } else {
            this.toast.error(messages);
          }
        });
      }

      this.isSubmitting = false;
      return;
    }

    // If success, you may want to handle success logic here
    this.toast.success("Client submitted successfully!");
              this.$router.push("/setup/client");

  } catch (error) {
    if (error.response?.data) {
      let errors = error.response.data;

      if (typeof errors === "string") {
        try {
          errors = JSON.parse(errors);
        } catch {
          this.toast.error(errors);
          this.errors.general = errors;
          this.isSubmitting = false;
          return;
        }
      }

      this.errors = errors;

      Object.values(errors).forEach(messages => {
        if (Array.isArray(messages)) {
          messages.forEach(msg => this.toast.error(msg));
        } else {
          this.toast.error(messages);
        }
      });
    } else {
      // Fallback generic error toast
      this.toast.error(error.message || "An error occurred");
    }
  } finally {
    this.isSubmitting = false;
  }
}

  },
};
</script>

<style scoped>
.input {
  @apply w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition;
}
</style>
