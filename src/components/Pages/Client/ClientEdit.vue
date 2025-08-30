<template>
  <div :class="[theme81, 'p-8 rounded-2xl shadow-lg']">
    <form @submit.prevent="updateClient">
      <div :class="[theme61, 'grid grid-cols-1 lg:grid-cols-2 gap-8']">

        <!-- Left Column -->
        <fieldset class="space-y-6 p-4 rounded border border-gray-200">

          <div class="space-y-4">
            <div>
              <label class="block font-medium mb-1" :class="themeText">Name<span class="text-red-500">*</span></label>
              <input v-model="formData.name" type="text" required class="input-field" :class="themeInputText" />
            </div>

            <div>
              <label class="block font-medium mb-1" :class="themeText">Abbreviation</label>
              <input v-model="formData.abbreviation" type="text" class="input-field" :class="themeInputText" />
            </div>        <div>
              <label class="block font-medium mb-1" :class="themeText">Description</label>
              <textarea v-model="formData.description" placeholder="Short description" class="input-field" :class="themeInputText"></textarea>
            </div>

            <div>
              <label class="block font-medium mb-1" :class="themeText">Details</label>
              <textarea v-model="formData.details" placeholder="Additional details" class="input-field" :class="themeInputText"></textarea>
            </div>

            <div>
              <label class="block font-medium mb-1" :class="themeText">Address<span class="text-red-500">*</span> </label>
              <textarea v-model="formData.address" placeholder="Client Address" class="input-field" :class="themeInputText"></textarea>
            </div>

       
 
          </div>
        </fieldset>

        <!-- Right Column -->
        <fieldset class="space-y-6 p-4 rounded border border-gray-200">

          <div class="space-y-4">     <div>
              <label class="block font-medium mb-1" :class="themeText">Website</label>
              <input v-model="formData.website" type="url" placeholder="https://example.com" class="input-field" :class="themeInputText" />
            </div>
           <div>
              <label class="block font-medium mb-1" :class="themeText">Email</label>
              <input v-model="formData.email" type="email" class="input-field" :class="themeInputText" />
            </div>

            <div>
              <label class="block font-medium mb-1" :class="themeText">Phone 1</label>
              <input v-model="formData.phone_1" type="number" v-non-negative class="input-field" :class="themeInputText" />
            </div>

            <div>
              <label class="block font-medium mb-1" :class="themeText">Phone 2</label>
              <input v-model="formData.phone_2" type="number" v-non-negative  class="input-field" :class="themeInputText" />
            </div>

            <div>
              <label class="block font-medium mb-1" :class="themeText">Mobile</label>
              <input v-model="formData.mobile" type="number" v-non-negative class="input-field" :class="themeInputText" />
            </div>
            <div>
              <label class="block font-medium mb-1" :class="themeText">Select Company<span class="text-red-500">*</span></label>
              <select v-model="formData.company_id" class="input-field" :class="themeInputText">
                <option v-for="company in companies" :key="company.id" :value="company.id">
                  {{ company.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block font-medium mb-1" :class="themeText">Status</label>
              <select v-model="formData.status" class="input-field" :class="themeInputText">
                <option :value="1">Active</option>
                <option :value="0">Inactive</option>
              </select>
            </div>

    
          </div>
        </fieldset>
      </div>

      <!-- Submit Button -->
      <div class="mt-8 flex justify-center">
        <button type="submit" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow font-medium">
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
      themeInputText,
      themeText,
    } = useTheme();
    const toast = useToast();
    return {
      theme6,
      theme61,
      theme8,
      theme81,
      theme9,
      themeText,
      themeInputText,
      toast,
    };
  },
  
  props: {
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

    updateClient() {
      const token = sessionStorage.getItem("token");
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
      .catch(error => {
      if (error.response?.data) {
        let errors = error.response.data;

        // Handle stringified error JSON
        if (typeof errors === 'string') {
          try {
            errors = JSON.parse(errors);
          } catch (e) {
            this.toast.error(errors);
            this.errors.general = errors;
            return;
          }
        }

        this.errors = errors;

        // Show each error message
        Object.values(errors).forEach(messages => {
          if (Array.isArray(messages)) {
            messages.forEach(msg => this.toast.error(msg));
          } else {
            this.toast.error(messages);
          }
        });
      }
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
