<template>
  <div :class="theme7" class="min-h-screen transition-all duration-300 ease-in-out py-10 px-4">
    <div :class="theme81" class="max-w-full mx-auto rounded-2xl shadow-lg p-8 space-y-6">
      <h2 :class="themeText" class="text-3xl font-extrabold text-center transition-colors duration-300 ease-in-out">
        Create New Project
      </h2>
      <form @submit.prevent="submitProject" enctype="multipart/form-data" class="space-y-6">

        <!-- Card Grid Layout -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div :class="theme61"
            class="bg-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">

            <!-- Project Name -->
            <div>
              <label :class="themeText" class="form-label">Project Name <span class="text-red-500">*</span></label>
              <input :class="themeInputText" v-model="project.name" type="text" placeholder="Enter Project Name"
                class="input" required />
            </div>

            <!-- Owner Name -->
            <div>
              <label :class="themeText" class="form-label">Owner Name <span class="text-red-500">*</span></label>
              <input :class="themeInputText" v-model="project.owner_name" type="text" placeholder="Owner Name"
                class="input" required />
            </div>

            <!-- Start Time -->
            <div>
              <label :class="themeText" class="form-label">Start Date <span class="text-red-500">*</span></label>
              <input :class="themeInputText" v-model="project.start_time" type="date" v-auto-date class="input"
                required />
            </div>

            <!-- End Time -->
            <div>
              <label :class="themeText" class="form-label">End Date <span class="text-red-500">*</span></label>
              <input :class="[themeInputText, !isEndDateValid() ? 'border-red-500' : '']" v-model="project.end_time"
                type="date" v-auto-date class="input" required />
              <p v-if="!isEndDateValid()" class="text-red-500 text-sm mt-1">
                End Date cannot be earlier than the Start Date
              </p>
            </div>

            <!-- Select Company -->
            <div>
              <label :class="themeText" class="form-label">
                Select Company <span class="text-red-500">*</span>
              </label>
              <select :class="themeInputText" v-model="project.company_id" class="input" required>
                <option value="" disabled selected hidden>-- Select a Company --</option>
                <option v-for="company in companies" :key="company.id" :value="company.id">
                  {{ company.name }}
                </option>
              </select>
            </div>

          </div>

          <!-- Right Column -->
          <div :class="theme61"
            class="bg-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">

            <!-- Select Client -->
            <div>
              <label :class="themeText" class="form-label">Select Client <span class="text-red-500">*</span></label>
              <multiselect :class="themeInputText" v-model="project.client_id" :options="clients"
                :reduce="client => client.id" label="name" track-by="id" placeholder="Select Client" :searchable="true"
                :close-on-select="true" required />
            </div>

            <!-- Description -->
            <div>
              <label :class="themeText" class="form-label">Description</label>
              <textarea :class="themeInputText" v-model="project.description" placeholder="Short description"
                class="input"></textarea>
            </div>

            <!-- Status -->
            <div>
              <label :class="themeText" class="form-label">Status</label>
              <select :class="themeInputText" v-model="project.status" class="input">
                <option :value="1">Active</option>
                <option :value="0">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-center mt-6">
          <button type="submit" :disabled="!isFormValid || isSubmitting"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isSubmitting ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import apiEndpoints from '@/config/apiConfig';
import useTheme from '@/components/js/ThemeSetting';
import { useToast } from "vue-toastification";
import Multiselect from "vue-multiselect";

export default {
  components: {
    Multiselect,
  },
  setup() {
    const {
      theme6,
      theme8, theme61,
      theme9, theme81,
      themeText, theme7,
      themeInputText,
    } = useTheme();

    const toast = useToast();

    return {
      theme61, theme7,
      theme6,
      theme8,
      theme9, theme81,
      themeText,
      toast, themeInputText
    };
  },

  data() {
    return {
      project: {
        name: '',
        description: '',
        owner_name: '',
        start_time: '',
        end_time: '',
        company_id: null,
        client_id: null,
        status: 1,
      },
      isSubmitting: false,
      companies: [],
      clients: [],
      errors: {}
    };
  },

  mounted() {
    this.fetchCompanies();
    this.fetchClients();
  },

  computed: {
    isFormValid() {
      return (
        this.project.name.trim() !== "" &&
        this.project.owner_name.trim() !== "" &&
        this.project.start_time !== "" &&
        this.project.end_time !== "" &&
        this.isEndDateValid() &&
        this.project.company_id !== null &&
        this.project.client_id !== null
      );
    }
  },

  methods: {
    async fetchCompanies() {
      try {
        const token = sessionStorage.getItem('token');
        const res = await fetch(apiEndpoints.companies, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        this.companies = data.data;
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    },

    async fetchClients() {
      try {
        const token = sessionStorage.getItem('token');
        const res = await fetch(apiEndpoints.clients, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        this.clients = data.data.filter(client => client.status === 1);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    },

    isEndDateValid() {
      if (!this.project.start_time || !this.project.end_time) return true;
      return new Date(this.project.end_time) > new Date(this.project.start_time);
    },

    async submitProject() {
      this.errors = {};
      if (!this.isEndDateValid()) {
        this.toast.error("End Date cannot be earlier or same to Start Date");
        return;
      }

      this.isSubmitting = true;

      try {
        const token = sessionStorage.getItem('token');

        // Ensure only IDs sent
        if (typeof this.project.client_id === 'object') {
          this.project.client_id = this.project.client_id.id;
        }
        if (typeof this.project.company_id === 'object') {
          this.project.company_id = this.project.company_id.id;
        }

        const response = await fetch(apiEndpoints.projects, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.project),
        });

        const responseText = await response.text();

        if (!response.ok) {
          let errorData;
          try {
            errorData = JSON.parse(responseText);
          } catch {
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

        this.toast.success("Project created successfully!");
        this.$router.push("/setup/project");

      } catch (error) {
        this.toast.error("An unexpected error occurred. Please try again.");
        console.error(error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.input {
  @apply w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300;
}

.form-label {
  @apply block text-sm font-medium mb-1;
}
</style>
