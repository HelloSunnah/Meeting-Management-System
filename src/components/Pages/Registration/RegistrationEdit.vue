<template>
  <div :class="theme81" v-if="user" class="max-w-8xl mx-auto p-6 shadow-lg rounded-lg space-y-6">
    <h2 class="text-2xl font-semibold text-gray-800 border-b pb-2">Edit User: {{ user.name }}</h2>

    <form @submit.prevent="submitForm" enctype="multipart/form-data" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Name -->
        <div class="space-y-1">
          <label :class="themeText" class="block text-sm font-medium">Name <span class="text-red-500">*</span></label>
          <input :class="[themeInputText, errors.name ? 'border-red-500' : '']" v-model="form.name"
            class="input-field w-full" placeholder="Enter full name" />
          <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
        </div>

        <!-- Email -->
        <div class="space-y-1">
          <label :class="themeText" class="block text-sm font-medium">Username<span
              class="text-red-500">*</span></label>

          <input :class="[themeInputText, errors.email ? 'border-red-500' : '']" v-model="form.email"
            class="input-field w-full" type="email" placeholder="example@email.com" />
          <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
        </div>

        <!-- Username -->
        <div class="space-y-1">
          <label :class="themeText" class="block text-sm font-medium">Email <span class="text-red-500">*</span></label>

          <input :class="themeInputText" v-model="form.userName" class="input-field w-full" placeholder="username123" />
        </div>

        <!-- Department -->
        <div class="space-y-1">
          <label :class="themeText" class="block text-sm font-medium">Department <span
              class="text-red-500">*</span></label>
          <multiselect v-model="form.department_id" :options="departments" label="name" track-by="id"
            placeholder="Select department" :class="[inputClass, errors.department_id ? 'border-red-500' : '']"
            :searchable="true" :close-on-select="true" :loading="loadingDepartments" :disabled="loadingDepartments" />
          <p v-if="errors.department_id" class="text-red-500 text-sm">{{ errors.department_id }}</p>
          <div v-if="loadingDepartments" class="text-gray-500 text-sm">Loading departments...</div>
        </div>

        <!-- Polling Toggle -->
        <div class="space-y-1">
          <label :class="themeText" class="block text-sm font-medium">Polling Create Permission</label>
          <div class="flex items-center space-x-3">
            <button type="button" @click="form.polling_create_per = form.polling_create_per === 1 ? 0 : 1"
              :class="[form.polling_create_per ? 'bg-indigo-600' : 'bg-gray-300', 'relative inline-flex h-6 w-11 items-center rounded-full transition']">
              <span
                :class="[form.polling_create_per ? 'translate-x-6' : 'translate-x-1', 'inline-block h-4 w-4 transform bg-white rounded-full transition']" />
            </button>
            <span class="text-sm text-gray-600">{{ form.polling_create_per ? 'Yes' : 'No' }}</span>
          </div>
        </div>

        <!-- Meeting Toggle -->
        <div class="space-y-1">
          <label :class="themeText" class="block text-sm font-medium">Meeting Create Permission</label>
          <div class="flex items-center space-x-3">
            <button type="button" @click="form.meeting_create_per = form.meeting_create_per === 1 ? 0 : 1"
              :class="[form.meeting_create_per ? 'bg-indigo-600' : 'bg-gray-300', 'relative inline-flex h-6 w-11 items-center rounded-full transition']">
              <span
                :class="[form.meeting_create_per ? 'translate-x-6' : 'translate-x-1', 'inline-block h-4 w-4 transform bg-white rounded-full transition']" />
            </button>
            <span class="text-sm text-gray-600">{{ form.meeting_create_per ? 'Yes' : 'No' }}</span>
          </div>
        </div>
      </div>

      <!-- Image and Signature -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label :class="themeText" class="block text-sm font-medium">Profile Image</label>
          <div v-if="form.image_url" class="mb-2">
            <img v-if="isValidImage(form.image_url)" :src="getImageUrl(form.image_url)" alt="Profile"
              class="w-32 h-32 object-cover rounded-md shadow border border-gray-300" />
            <p v-else class="text-red-500 text-xs">Invalid image URL</p>
          </div>
          <input :class="themeInputText" @change="handleFileUpload($event, 'image')" type="file" accept="image/*" />
        </div>

        <div class="space-y-2">
          <label :class="themeText" class="block text-sm font-medium">Signature</label>
          <div v-if="form.signature_url" class="mb-2">
            <img v-if="isValidImage(form.signature_url)" :src="getImageUrl(form.signature_url, 'signature')"
              alt="Signature" class="w-32 h-32 object-cover rounded-md shadow border border-gray-300" />
          </div>
          <input :class="themeInputText" @change="handleFileUpload($event, 'signature')" type="file" accept="image/*" />
        </div>
      </div>

      <div class="flex justify-center pt-4">
        <button type="submit"
          class="px-8 py-3 bg-indigo-600 text-white font-medium rounded-md shadow hover:bg-indigo-700 transition">
          Update
        </button>
      </div>
    </form>
  </div>
  <Loader v-else />
</template>
<script>
import axios from 'axios';
import apiEndpoints from '@/config/apiConfig';
import Loader from '@/components/Main/Loader.vue';
import Multiselect from 'vue-multiselect';
import useTheme from '@/components/js/ThemeSetting';
import { useToast } from "vue-toastification";

export default {
  components: {
    Loader,
    Multiselect,
  },
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const theme = useTheme();
    const toast = useToast();

    return {
      ...theme,
      toast,
    };
  },
  data() {
    return {
      user: null,
      departments: [],
      loadingDepartments: true,
      errors: {}, inputClass: "",
      form: {
        name: '',
        email: '',
        userName: '',
        polling_create_per: 0,
        meeting_create_per: 0,
        password: '',
        password_confirmation: '',
        company_id: '',
        department_id: '',
        designation_id: '',
        image: null,
        image_url: '',
        signature: null,
        signature_url: '',
      },
    };
  },
  mounted() {
    this.loadInitialData();
  },
  methods: {
    // Initialization
    async loadInitialData() {
      await this.fetchDepartments();
      await this.fetchUser();
    },

    getAuthToken() {
      return sessionStorage.getItem("token");
    },

    // Data Fetching
    async fetchDepartments() {
      try {
        const token = this.getAuthToken();
        const res = await axios.get(apiEndpoints.departments, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.departments = res.data.data || [];
      } catch (err) {
        this.toast.error("Failed to fetch departments.");
      } finally {
        this.loadingDepartments = false;
      }
    },

    async fetchUser() {
      try {
        const token = this.getAuthToken();
        const res = await axios.get(apiEndpoints.fetchUser(this.userId), {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.user = res.data;
        const department = this.departments.find(d => d.id === res.data.department_id);

        this.form = {
          ...res.data,
          password: '',
          password_confirmation: '',
          department_id: department || null,
          polling_create_per: res.data.polling_create_per ?? 0,
          meeting_create_per: res.data.meeting_create_per ?? 0,
        };
      } catch (err) {
        this.toast.error("Failed to fetch user data.");
      }
    },

    // Utilities
    getImageUrl(url) {
      return `${apiEndpoints.storageUrl2}/${url}`;
    },

    isValidImage(url) {
      return /\.(jpg|jpeg|png|gif|bmp)$/i.test(url);
    },

    handleFileUpload(event, field) {
      const file = event.target.files[0];
      if (file) {
        this.form[field] = file;
      }
    },

    // Validation
    validateForm() {
      this.errors = {};

      if (!this.form.name) this.errors.name = "Name is required.";
      if (!this.form.email) {
        this.errors.email = "Email is required.";
      } else if (!/^\S+@\S+\.\S+$/.test(this.form.email)) {
        this.errors.email = "Invalid email format.";
      }

      if (!this.form.department_id || !this.form.department_id.id) {
        this.errors.department_id = "Department is required.";
      }

      return Object.keys(this.errors).length === 0;
    },

    // Submit
    async submitForm() {
      if (!this.validateForm()) {
        this.toast.error("Please fix the form errors.");
        return;
      }

      const token = this.getAuthToken();
      this.form.department_id = this.form.department_id.id;

      const formData = this.prepareFormData();

      try {
        await axios.post(`${apiEndpoints.updateUser(this.userId)}?_method=PUT`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        this.toast.success("User updated successfully.");

        window.location.reload();

      }
      catch (error) {
        if (error.response?.data) {
          let errors = error.response.data;

          // Parse if errors is a string (JSON string)
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

          // Show each error message in toast
          Object.values(errors).forEach(messages => {
            if (Array.isArray(messages)) {
              messages.forEach(msg => this.toast.error(msg));
            } else {
              this.toast.error(messages);
            }
          });
        }
      }
    },

    prepareFormData() {
      const formData = new FormData();
      for (const key in this.form) {
        if (this.form[key] !== null && this.form[key] !== '') {
          formData.append(key, this.form[key]);
        }
      }
      return formData;
    },

    handleFormErrors(error) {
      if (error.response?.data) {
        let errors = error.response.data;
        if (typeof errors === 'string') {
          try {
            errors = JSON.parse(errors);
          } catch {
            this.toast.error(errors);
            return;
          }
        }

        this.errors = errors;
        Object.values(errors).forEach(msg => {
          Array.isArray(msg)
            ? msg.forEach(this.toast.error)
            : this.toast.error(msg);
        });
      } else {
        this.toast.error("An unexpected error occurred.");
      }
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
