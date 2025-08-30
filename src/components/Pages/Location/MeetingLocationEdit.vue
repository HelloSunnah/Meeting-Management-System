<template>
  <div :class="theme81" class=" p-6 rounded-lg shadow-md">
    <form @submit.prevent="updateLocation">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Left Column -->
        <div :class="theme7" class=" p-4 rounded">
          <!-- Location Name -->
          <div class="mb-4">
            <label :class="themeText" class="block font-semibold mb-1">Meeting Room Name
              <span class="text-red-500">*</span>
            </label>
            <input :class="themeInputText" v-model="formData.name" type="text" class="input-field" required />
          </div>

          <!-- Serial -->
          <div class="mb-4">
            <label :class="themeText" class="block font-semibold mb-1">Serial <span class="text-red-500">*</span>
            </label>
            <input :class="themeInputText" v-model="formData.serial" required type="number" v-non-negative class="input-field" />
          </div>

          <!-- Total Seat -->
          <div class="mb-4">
            <label :class="themeText" class="block font-semibold mb-1">Total Seat <span class="text-red-500">*</span>
            </label>
            <input :class="themeInputText" v-model="formData.total_seat" required v-non-negative type="number"
              class="input-field" />
          </div>
        </div>

        <!-- Right Column -->
        <div :class="theme7" class=" p-4 rounded">
          <!-- Select Company -->
          <div class="mb-4">
            <label :class="themeText" class="block font-semibold mb-1">Select Company <span
                class="text-red-500">*</span>
            </label>
            <select :class="themeInputText" v-model="formData.company_id" class="input-field">
              <option v-for="company in companies" :key="company.id" :value="company.id">
                {{ company.name }}
              </option>
            </select>
          </div>

          <!-- Description -->
          <div class="mb-4">
            <label :class="themeText" class="block font-semibold mb-1">Description</label>
            <textarea :class="themeInputText" v-model="formData.description" class="input-field"></textarea>
          </div>

          <!-- Status -->
          <div class="mb-4">
            <label :class="themeText" class="block font-semibold mb-1">Status</label>
            <select :class="themeInputText" v-model="formData.status" class="input-field">
              <option :value="1">Active</option>
              <option :value="0">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-center">
        <button type="submit" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow">
          Update
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import apiEndpoints from '@/config/apiConfig';


import useTheme from '@/components/js/ThemeSetting';
import { useToast } from "vue-toastification";

export default {

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
      theme61,
      theme6, theme7,
      theme8,
      theme9, theme81,
      themeText,
      toast, themeInputText
    };
  },
  props: {
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
      const token = sessionStorage.getItem("token");
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
    async updateLocation() {
      const token = sessionStorage.getItem("token");
      const formData = new FormData();

      for (const key in this.formData) {
        if (this.formData[key] !== null && this.formData[key] !== undefined) {
          formData.append(key, this.formData[key]);
        }
      }
      formData.append("_method", "PUT"); // Simulate PUT request

      try {
        await axios.post(apiEndpoints.updateMeetingLocation(this.locationId), formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        this.$emit("updated");
        this.toast.success("Meeting Room updated successfully!");
      } catch (error) {
        if (error.response?.data) {
          let errors = error.response.data;

          // If error data is a stringified JSON, parse it
          if (typeof errors === "string") {
            try {
              errors = JSON.parse(errors);
            } catch {
              this.toast.error(errors);
              this.errors.general = errors;
              return;
            }
          }

          this.errors = errors;

          // Handle backend error format: array of errors with "detail" field
          if (Array.isArray(errors.errors)) {
            errors.errors.forEach((err) => {
              if (err.detail) {
                this.toast.error(err.detail);
              } else {
                this.toast.error(JSON.stringify(err));
              }
            });
          } else {
            // Fallback: show all error messages
            Object.values(errors).forEach((messages) => {
              if (Array.isArray(messages)) {
                messages.forEach((msg) => this.toast.error(msg));
              } else {
                this.toast.error(messages);
              }
            });
          }
        } else {
          this.toast.error("An unexpected error occurred. Please try again.");
          console.error(error);
        }
      }
    }


  },
};
</script>

<style scoped>
.input-field {
  border: 1px;
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
