<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <form @submit.prevent="updateLocation">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Left Column -->
        <div class="bg-gray-100 p-4 rounded">
          <!-- Location Name -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Location Name</label>
            <input v-model="formData.name" type="text" class="input-field" required />
          </div>

          <!-- Serial -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Serial</label>
            <input v-model="formData.serial" type="text" class="input-field" />
          </div>

          <!-- Total Seat -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Total Seat</label>
            <input v-model="formData.total_seat" type="number" class="input-field" />
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
  },  props: {
    locationId: {
      type: Number,
      required: true,
    },
    location: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        name: this.location.name || "",
        serial: this.location.serial || "",
        total_seat: this.location.total_seat || "",
        company_id: this.location.company_id || null,
        description: this.location.description || "",
        status: this.location.status ?? 1,
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
 updateLocation() {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      for (const key in this.formData) {
        if (this.formData[key] !== null && this.formData[key] !== undefined) {
          formData.append(key, this.formData[key]);
        }
      }
      formData.append("_method", "PUT"); // Simulate PUT request

      axios.post(apiEndpoints.updateMeetingLocation(this.locationId), formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .then(() => {
          this.$emit("updated");
          this.toast.success("Meeting Location updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating location:", error);
          this.toast.error("Failed to update location.");
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
