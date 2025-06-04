<template>
  <div :class="themeClass" class="min-h-screen transition-all duration-300 ease-in-out py-12 px-6 sm:px-12">
    <div :class="formClass" class="mx-auto bg-white rounded-2xl shadow-xl p-10 space-y-8">
      <h2 :class="themeClass === 'bg-gray-900 text-white' ? 'text-white' : 'text-gray-800'"
        class="text-4xl font-bold text-center">
        Add New Client
      </h2>

      <form @submit.prevent="submitClient" >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

          <!-- Left Column -->
          <div class="space-y-6 bg-gray-50 p-6 rounded-xl shadow-md">
            <!-- Client Name -->
            <div>
              <label class="form-label">Client Name <span class="text-red-500">*</span></label>
              <input  v-model="client.name" type="text" class="input" placeholder="Enter Client Name" required />
            </div>

            <!-- Abbreviation -->
            <div>
              <label class="form-label">Abbreviation</label>
              <input v-model="client.abbreviation" type="text" class="input" placeholder="Short form (optional)" />
            </div>

            <!-- Description -->
            <div>
              <label class="form-label">Description <span class="text-red-500">*</span></label>
              <textarea v-model="client.description" class="input" placeholder="Short description" required></textarea>
            </div>

            <!-- Details -->
            <div>
              <label class="form-label">Details</label>
              <textarea v-model="client.details" class="input" placeholder="Additional details"></textarea>
            </div>

            <!-- Address -->
            <div>
              <label class="form-label">Address <span class="text-red-500">*</span></label>
              <textarea v-model="client.address" class="input" placeholder="Client Address" required></textarea>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-6 bg-gray-50 p-6 rounded-xl shadow-md">
            <!-- Website -->
            <div>
              <label class="form-label">Website</label>
              <input v-model="client.website" type="url" class="input" placeholder="https://example.com" />
            </div>

            <!-- Phone 1 -->
            <div>
              <label class="form-label">Phone 1</label>
              <input v-model="client.phone_1" type="text" class="input" placeholder="Phone number 1" />
            </div>

            <!-- Phone 2 -->
            <div>
              <label class="form-label">Phone 2</label>
              <input v-model="client.phone_2" type="text" class="input" placeholder="Phone number 2" />
            </div>

            <!-- Mobile -->
            <div>
              <label class="form-label">Mobile</label>
              <input v-model="client.mobile" type="text" class="input" placeholder="Mobile number" />
            </div>

            <!-- Email -->
            <div>
              <label class="form-label">Email</label>
              <input v-model="client.email" type="email" class="input" placeholder="Email address" />
            </div>

            <!-- Company -->
            <div>
      <label class="form-label">Select Company</label>
<select v-model="client.company_id" class="input" required>
  <option v-for="company in companies" :key="company.id" :value="company.id">
    {{ company.name }}
  </option>
</select>

            </div>

            <!-- Status -->
            <div>
              <label class="form-label">Status</label>
              <select v-model="client.status" class="input">
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
            {{ isSubmitting ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>import apiEndpoints from '@/config/apiConfig';

import { useToast } from "vue-toastification";

export default {
    setup() {
    const toast = useToast();
    return { toast };
  },  data() {
    return {
      client: {
        name: '',
        abbreviation: '',
        description: '',
        details: '',
        address: '',
        website: '',
        phone_1: '',
        phone_2: '',
        mobile: '',
        email: '',
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
        const token = localStorage.getItem('token');
        const response = await fetch(apiEndpoints.companies, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
        const data = await response.json();
        this.companies = data.data;
        console.log(this.companies)
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    },
    async submitClient() {
      this.isSubmitting = true;
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        
        for (const key in this.client) {
          formData.append(key, this.client[key]);
        }
        if (this.logoFile) {
          formData.append('logo', this.logoFile);
        }

        const response = await fetch(apiEndpoints.clients, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          alert('Client created successfully!');
          this.$router.push('/setup/client');
        } else {
          console.error('Error creating client:', data);
          alert('Failed to create client.');
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
  @apply w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition;
}
</style>
