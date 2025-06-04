<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <form @submit.prevent="updateProject">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Left Column -->
        <div class="bg-gray-100 p-4 rounded">
          <!-- Project Name -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Project Name</label>
            <input v-model="formData.name" type="text" class="input-field" required />
          </div>

          <!-- Owner Name -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Owner Name</label>
            <input v-model="formData.owner_name" type="text" class="input-field" />
          </div>

          <!-- Start Time -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Start Date</label>
            <input v-model="formData.start_time" type="date" class="input-field" />
          </div>

          <!-- End Time -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">End Date</label>
            <input v-model="formData.end_time" type="date" class="input-field" />
          </div>
        </div>

        <!-- Right Column -->
        <div class="bg-gray-100 p-4 rounded">
          <!-- Select Company -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Select Company</label>
            <select v-model="formData.company_id" class="input-field">
              <option v-for="company in companies" :key="company.id" :value="company.id">
                {{ company.name }}
              </option>
            </select>
          </div>

          <!-- Select Client -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Select Client</label>
            <select v-model="formData.client_id" class="input-field">
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.name }}
              </option>
            </select>
          </div>

          <!-- Description -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Description</label>
            <textarea v-model="formData.description" class="input-field"></textarea>
          </div>

          <!-- Status -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Status</label>
            <select v-model="formData.status" class="input-field">
              <option :value="1">Active</option>
              <option :value="0">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-center">
        <button type="submit" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow">
          Save Changes
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import apiEndpoints from '@/config/apiConfig';

import { useToast } from "vue-toastification";

export default {
    setup() {
    const toast = useToast();
    return { toast };
  },
  props: {
    projectId: {
      type: Number,
      required: true,
    },
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        name: this.project.name || "",
        description: this.project.description || "",
        owner_name: this.project.owner_name || "",
        start_time: this.project.start_time || "",
        end_time: this.project.end_time || "",
        company_id: this.project.company_id || null,
        client_id: this.project.client_id || null,
        status: this.project.status ?? 1,
      },
      companies: [],
      clients: [],
    };
  },
  mounted() {
    this.fetchCompanies();
    this.fetchClients();
  },
  methods: {
    fetchCompanies() {
      const token = localStorage.getItem("token");
      axios.get(apiEndpoints.companies, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          this.companies = res.data.data;
        })
        .catch((err) => {
          console.error("Error fetching companies:", err);
        });
    },
    fetchClients() {
      const token = localStorage.getItem("token");
      axios.get(apiEndpoints.clients, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          this.clients = res.data.data;
        })
        .catch((err) => {
          console.error("Error fetching clients:", err);
        });
    },
   updateProject() {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      const formData = new FormData();

      // Loop through form data and append only valid fields
      for (const key in this.formData) {
        if (this.formData[key] !== null && this.formData[key] !== undefined) {
          formData.append(key, this.formData[key]);
        }
      }

      // Simulate a PUT request by appending _method
      formData.append("_method", "PUT");

      // Make the POST request (using _method to simulate PUT)
      axios.post(apiEndpoints.updateProject(this.projectId), formData, {
        headers: {
          Authorization: `Bearer ${token}`,   // Bearer token for authorization
          "Content-Type": "multipart/form-data", // Header for file uploads
        },
      })
        .then(() => {
          this.$emit("updated");
          this.toast.success("Project updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating project:", error);
          this.toast.error("Failed to update project.");
        });
    }
  },
};
</script>

<style scoped>
.input-field {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  width: 100%;
  transition: all 0.3s ease-in-out;
}
.input-field:focus {
  border-color: #007bff;
  outline: none;
}
</style>
