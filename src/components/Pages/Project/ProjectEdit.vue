<template>
  <div :class="theme81" class="p-6 rounded-lg shadow-md">
    <form @submit.prevent="updateProject">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Left Column -->
        <div :class="theme61" class="p-4 rounded">

          <!-- Project Name -->
          <div class="mb-4">
            <label :class="themeText" class="block font-semibold mb-1">
              Project Name<span class="text-red-500">*</span>
            </label>
            <input :class="themeInputText" v-model="formData.name" type="text" class="input-field" required />
          </div>

          <!-- Owner Name -->
          <div class="mb-4">
            <label :class="themeText" class="block font-semibold mb-1">
              Owner Name<span class="text-red-500">*</span>
            </label>
            <input :class="themeInputText" v-model="formData.owner_name" type="text" required class="input-field" />
          </div>

          <!-- Start Time -->
          <div class="mb-4">
            <label :class="themeText" class="block font-semibold mb-1">
              Start Date<span class="text-red-500">*</span>
            </label>
            <input :class="themeInputText" v-model="formData.start_time" type="date" v-auto-date required class="input-field" />
          </div>

          <!-- End Time -->
          <div class="mb-4">
            <label :class="themeText" class="block font-semibold mb-1">
              End Date<span class="text-red-500">*</span>
            </label>
            <input :class="[themeInputText, !isEndDateValid ? 'border-red-500' : '']" v-model="formData.end_time"
              type="date" v-auto-date required class="input-field" />
            <p v-if="!isEndDateValid" class="text-red-500 text-sm mt-1">
              End Date cannot be earlier than Start Date
            </p>
          </div>
        </div>

        <!-- Right Column -->
        <div :class="theme61" class="p-4 rounded">
          <!-- Select Company -->
          <div class="mb-4">
            <label :class="themeText" class="block font-semibold mb-1">
              Select Company<span class="text-red-500">*</span>
            </label>
            <select :class="themeInputText" v-model="formData.company_id" required class="input-field">
              <option value="" disabled>-- Select a Company --</option>
              <option v-for="company in companies" :key="company.id" :value="company.id">
                {{ company.name }}
              </option>
            </select>
          </div>

          <!-- Select Client -->
    
      <!-- Searchable Select Client -->
<div class="mb-4">
  <label :class="themeText" class="block font-semibold mb-1">
    Select Client<span class="text-red-500">*</span>
  </label>
  <Multiselect
    v-model="formData.client_id"
    :options="clients"
    :searchable="true"
    :close-on-select="true"
    :clear-on-select="false"
    label="name"
    track-by="id"
    placeholder="-- Search & Select Client --"
    :class="themeInputText"
  />
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

      <!-- Submit -->
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
import Multiselect from 'vue-multiselect';

export default {
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
  components: {
    Multiselect
  },
  setup() {
    const {
      theme6,
      theme8,
      theme61,
      theme9,
      theme81,
      themeText,
      themeInputText,
    } = useTheme();

    const toast = useToast();

    return {
      theme6,
      theme8,
      theme61,
      theme9,
      theme81,
      themeText,
      themeInputText,
      toast,
    };
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
      client_id: this.project.client_id ? { id: this.project.client_id, name: this.project.client_name } : null,
      status: this.project.status ?? 1,
    },
    companies: [],
    clients: [],
  };
},


  computed: {
    isEndDateValid() {
      if (!this.formData.start_time || !this.formData.end_time) return true;
      return new Date(this.formData.end_time) >= new Date(this.formData.start_time);
    }
  },

  mounted() {
    this.fetchCompanies();
    this.fetchClients();
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

 fetchClients() {
  const token = sessionStorage.getItem("token");
  axios.get(apiEndpoints.clients, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      // Only include clients with status === 1
      this.clients = res.data.data.filter(client => client.status === 1);
    })
    .catch((err) => {
      console.error("Error fetching clients:", err);
    });
}
,
updateProject() {
  if (!this.isEndDateValid) {
    this.toast.error("End Date cannot be earlier than Start Date.");
    return;
  }

  const payload = {
    ...this.formData,
    client_id: this.formData.client_id?.id || null
  };

  const token = sessionStorage.getItem("token");
  axios.put(apiEndpoints.updateProject(this.projectId), payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
  .then(() => {
    this.$emit("updated");
    this.toast.success("Project updated successfully!");
  })
  .catch(error => {
    if (error.response?.data) {
      let errors = error.response.data;
      if (Array.isArray(errors.errors)) {
        errors.errors.forEach(err => this.toast.error(err.detail || JSON.stringify(err)));
      } else if (errors.detail) {
        this.toast.error(errors.detail);
      } else {
        this.toast.error(JSON.stringify(errors));
      }
    }
  });
}

  }
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
