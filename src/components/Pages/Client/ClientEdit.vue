<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <form @submit.prevent="updateClient">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div class="bg-gray-100 p-4 rounded">
          <!-- Name -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Name</label>
            <input v-model="formData.name" type="text" class="input-field" required />
          </div>

          <!-- Abbreviation -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Abbreviation</label>
            <input v-model="formData.abbreviation" type="text" class="input-field" />
          </div>

          <!-- Website -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Website</label>
            <input v-model="formData.website" type="text" placeholder="https://example.com" class="input-field" />
          </div>

          <!-- Email -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Email</label>
            <input v-model="formData.email" type="email" class="input-field" />
          </div>

          <!-- Phone 1 -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Phone 1</label>
            <input v-model="formData.phone_1" type="text" class="input-field" />
          </div>

          <!-- Phone 2 -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Phone 2</label>
            <input v-model="formData.phone_2" type="text" class="input-field" />
          </div>

          <!-- Mobile -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Mobile</label>
            <input v-model="formData.mobile" type="text" class="input-field" />
          </div>
        </div>

        <!-- Right Column -->
        <div class="bg-gray-100 p-4 rounded">
          <!-- Company -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Select Company</label>
            <select v-model="formData.company_id" class="input-field">
              <option v-for="company in companies" :key="company.id" :value="company.id">
                {{ company.name }}
              </option>
            </select>
          </div>

          <!-- Status -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Status</label>
            <select v-model="formData.status" class="input-field">
              <option :value="1">Active</option>
              <option :value="0">Inactive</option>
            </select>
          </div>

          <!-- Description -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Description</label>
            <textarea v-model="formData.description" placeholder="Short description" class="input-field"></textarea>
          </div>

          <!-- Details -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Details</label>
            <textarea v-model="formData.details" placeholder="Additional details" class="input-field"></textarea>
          </div>

          <!-- Address -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Address</label>
            <textarea v-model="formData.address" placeholder="Client Address" class="input-field"></textarea>
          </div>
        </div>
      </div>

      <!-- Submit -->
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
  },  props: {
    clientId: {
      type: Number,
      required: true,
    },
    client: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        name: this.client.name || "",
        abbreviation: this.client.abbreviation || "",
        description: this.client.description || "",
        details: this.client.details || "",
        address: this.client.address || "",
        website: this.client.website || "",
        phone_1: this.client.phone_1 || "",
        phone_2: this.client.phone_2 || "",
        mobile: this.client.mobile || "",
        email: this.client.email || "",
        company_id: this.client.company_id || null,
        status: this.client.status ?? 1,
      },
      companies: [],
    };
  },
  mounted() {
    this.fetchCompanies();
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

    updateClient() {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      for (const key in this.formData) {
        if (this.formData[key] !== null && this.formData[key] !== undefined) {
          formData.append(key, this.formData[key]);
        }
      }
      formData.append("_method", "PUT");

      axios.post(apiEndpoints.ClientChange(this.clientId), formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .then(() => {
          this.$emit("updated");
           this.toast.success("Client updated successfully!")

        })
        .catch((error) => {
          console.error("Error updating client:", error);
          this.toast.error("Failed to update client.")

        });
    },
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
