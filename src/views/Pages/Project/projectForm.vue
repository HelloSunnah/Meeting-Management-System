<template>
  <div :class="themeClass" class="min-h-screen transition-all duration-300 ease-in-out py-10 px-4">
    <div :class="formClass" class="max-w-full mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <h2 :class="themeClass === 'bg-gray-900 text-white' ? 'text-white' : 'text-gray-800'"
        class="text-3xl font-extrabold text-center transition-colors duration-300 ease-in-out">
        Create New Project
      </h2>
      <form @submit.prevent="submitProject" enctype="multipart/form-data" class="space-y-6">

        <!-- Card Grid Layout -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div class="bg-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
              <!-- Project Name -->
              <div>
                <label class="form-label">Project Name <span class="text-red-500">*</span></label>
                <input v-model="project.name" type="text" placeholder="Enter Project Name" class="input" required />
              </div>

              <!-- Owner Name -->
              <div>
                <label class="form-label">Owner Name <span class="text-red-500">*</span></label>
                <input v-model="project.owner_name" type="text" placeholder="Owner Name" class="input" required />
              </div>

              <!-- Start Time -->
              <div>
                <label class="form-label">Start Date <span class="text-red-500">*</span></label>
                <input v-model="project.start_time" type="date" class="input" required />
              </div>

              <!-- End Time -->
              <div>
                <label class="form-label">End Date <span class="text-red-500">*</span></label>
                <input v-model="project.end_time" type="date" class="input" required />
              </div>

              <!-- Select Company -->
              <div>
                <label class="form-label">Select Company <span class="text-red-500">*</span></label>
                <select v-model="project.company_id" class="input" required>
                  <option v-for="company in companies" :key="company.id" :value="company.id">
                    {{ company.name }}
                  </option>
                </select>
              </div>
          </div>

          <!-- Right Column -->
          <div class="bg-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
            <!-- Select Client -->
            <div>
              <label class="form-label">Select Client <span class="text-red-500">*</span></label>
              <select v-model="project.client_id" class="input" required>
                <option v-for="client in clients" :key="client.id" :value="client.id">
                  {{ client.name }}
                </option>
              </select>
            </div>

            <!-- Description -->
            <div>
              <label class="form-label">Description</label>
              <textarea v-model="project.description" placeholder="Short description" class="input"></textarea>
            </div>

            <!-- Status -->
            <div>
              <label class="form-label">Status</label>
              <select v-model="project.status" class="input">
                <option :value="1">Active</option>
                <option :value="0">Inactive</option>
              </select>
            </div>

          </div>
        </div>
            <!-- Submit Button -->
            <div class="flex justify-center mt-6">
              <button type="submit" :disabled="isSubmitting"
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300">
                {{ isSubmitting ? 'Saving...' : 'Save' }}
              </button>
            </div>
      </form>
    </div>
  </div>
</template>

<script>
import apiEndpoints from '@/config/apiConfig';

import { useToast } from "vue-toastification";

export default {
    setup() {
    const toast = useToast();
    return { toast };
  },  data() {
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
    };
  },
  mounted() {
    this.fetchCompanies();
    this.fetchClients();
  },
  methods: {
    async fetchCompanies() {
      try {
        const token = localStorage.getItem('token');
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
        const token = localStorage.getItem('token');
        const res = await fetch(apiEndpoints.clients, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        this.clients = data.data;
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    },
    async submitProject() {
      this.isSubmitting = true;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(apiEndpoints.projects, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.project),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Project created successfully!');
          this.$router.push('/setup/project');
        } else {
          console.error('Error creating project:', data);
          alert('Failed to create project.');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
.input {
  @apply w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
</style>
