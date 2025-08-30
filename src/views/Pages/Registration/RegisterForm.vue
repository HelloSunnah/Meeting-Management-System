<template>
  <div :class="theme8" class="min-h-screen py-10 px-4">
    <div :class="theme61" class="max-w-full mx-auto rounded-2xl shadow-lg p-8 space-y-6">

      <h2 :class="themeText" class="text-3xl font-extrabold text-center">Create New User</h2>

      <form @submit.prevent="submitForm" enctype="multipart/form-data">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">

          <!-- Left Column -->
          <div :class="theme7" class="p-6 rounded-2xl shadow-md space-y-4">
            <h3 :class="themeText" class="text-lg font-semibold text-gray-700 mb-2 border-b pb-2">User Details</h3>

            <div>
              <label :class="themeText" class="block text-sm font-semibold">Name <span
                  class="text-red-500">*</span></label>
              <input :class="themeInputText" v-model="form.name" type="text" class="input" placeholder="Full name" />
              <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name[0] }}</span>
            </div>
            <div>
              <label :class="themeText" class="block text-sm font-semibold">Email
                <span class="text-red-500">*</span>
              </label>
              <input :class="themeInputText" v-model="form.userName" class="input" type="email"
                placeholder="test@gamil.com" />
            </div>

            <div>
              <label :class="themeText" class="block text-sm font-semibold">Password <span
                  class="text-red-500">*</span></label>
              <input :class="themeInputText" v-model="form.password" type="password" class="input"
                placeholder="••••••••" />
              <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password[0] }}</span>
            </div>

            <div>
              <label :class="themeText" class="block text-sm font-semibold">Confirm Password <span
                  class="text-red-500">*</span></label>
              <input :class="themeInputText" v-model="form.password_confirmation" type="password" class="input"
                placeholder="••••••••" />
              <span v-if="errors.password_confirmation" class="text-red-500 text-sm">{{ errors.password_confirmation
                }}</span>
              <span v-else-if="passwordMismatch" class="text-red-500 text-sm">Passwords do not match.</span>
            </div>


            <div>
              <label :class="themeText" class="block text-sm font-semibold mb-1">Allow Polling Creation</label>
              <label class="inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="form.polling_create_per" class="sr-only peer">
                <div class="toggle-switch peer-checked:bg-gray-500"></div>
                <span :class="themeText" class="ml-3 text-sm">{{ form.polling_create_per ? 'Yes' : 'No' }}</span>
              </label>
            </div>

            <div>
              <label :class="themeText" class="block text-sm font-semibold mb-1">Allow Meeting Creation</label>
              <label class="inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="form.meeting_create_per" class="sr-only peer">
                <div class="toggle-switch peer-checked:bg-gray-500"></div>
                <span :class="themeText" class="ml-3 text-sm">{{ form.meeting_create_per ? 'Yes' : 'No' }}</span>
              </label>
            </div>
          </div>

          <!-- Right Column -->
          <div :class="theme7" class="p-6 rounded-2xl shadow-md space-y-4">
            <h3 :class="themeText" class="text-lg font-semibold text-gray-700 mb-2 border-b pb-2">Profile Settings
            </h3>

            <div>
              <label :class="themeText" class="block text-sm font-semibold">User Name <span
                  class="text-red-500">*</span></label>
              <input :class="themeInputText" v-model="form.email" type="email" class="input"
                placeholder="example@domain.com" />
              <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email[0] }}</span>
            </div>

            <div>
              <label :class="themeText" class="block text-sm font-semibold">Department <span
                  class="text-red-500">*</span></label>
              <select :class="themeInputText" v-model="form.department_id" class="input">
                <option value="">Select a Department</option>
                <option v-for="department in departments" :key="department.id" :value="department.id">
                  {{ department.name }}
                </option>
              </select>
              <span v-if="errors.department_id" class="text-red-500 text-sm">{{ errors.department_id[0] }}</span>
            </div>

            <div>
              <label :class="themeText" class="block text-sm font-semibold">Profile Image</label>
              <input type="file" class="file-input" @change="handleFileUpload($event, 'image')" />
            </div>

            <div>
              <label :class="themeText" class="block text-sm font-semibold">Signature</label>
              <input type="file" class="file-input" @change="handleFileUpload($event, 'signature')" />
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="w-full flex justify-center mt-6">
          <button type="submit"
            class="bg-blue-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition duration-300 ease-in-out">
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import apiEndpoints from '@/config/apiConfig';
import useTheme from '@/components/js/ThemeSetting';
import { useToast } from "vue-toastification";

export default {
  setup() {
    const {
      theme6, theme8, theme61, theme81,
      theme9, theme7, themeText, themeInputText
    } = useTheme();
    const toast = useToast();
    return {
      theme6, theme8, theme61, theme81,
      theme9, theme7, themeText, themeInputText, toast
    };
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        userName: '',
        company_id: '',
        department_id: '',
        designation_id: '',
        image: null,
        signature: null,
        polling_create_per: 0,
        meeting_create_per: 0,
      },
      departments: [],
      errors: {},
    };
  },
  computed: {
    passwordMismatch() {
      return (
        this.form.password &&
        this.form.password_confirmation &&
        this.form.password !== this.form.password_confirmation
      );
    }
  },
  mounted() {
    this.fetchDepartments();
  },
  methods: {
    async fetchDepartments() {
      try {
        const response = await axios.get(apiEndpoints.departments, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        this.departments = response.data.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },

    handleFileUpload(event, field) {
      this.form[field] = event.target.files[0];
    },

async submitForm() {
  this.errors = {};
  this.form.company_id = 1;

  // Basic required field validation
  const requiredFields = ['name', 'email', 'password', 'password_confirmation', 'department_id', 'company_id'];
  const missingField = requiredFields.find(field => !this.form[field]);

  if (missingField) {
    this.errors.general = 'Please fill all required fields.';
    this.toast.error(this.errors.general);
    return;
  }

  // Check if password and confirmation match
  if (this.form.password !== this.form.password_confirmation) {
    this.errors.password_confirmation = 'Passwords do not match.';
    this.toast.error(this.errors.password_confirmation);
    return;
  }

  // Prepare form data for submission
  const formData = new FormData();
  for (const [key, value] of Object.entries(this.form)) {
    if (typeof value === 'boolean') {
      formData.append(key, value ? 1 : 0);
    } else if (value !== null && value !== '') {
      formData.append(key, value);
    }
  }

  try {
    const response = await axios.post(apiEndpoints.register, formData, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    this.toast.success('User registered successfully!');
    this.$router.push("/Register");
  } catch (error) {
    if (error.response?.data) {
      let errors = error.response.data;

      // Try to parse string response if needed
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

      // Show each validation error
      Object.values(errors).forEach(messages => {
        if (Array.isArray(messages)) {
          messages.forEach(msg => this.toast.error(msg));
        } else {
          this.toast.error(messages);
        }
      });
    } else {
      this.toast.error('An unexpected error occurred.');
    }
  }
}


  }
};
</script>

<style scoped>
.input {
  @apply w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none;
}

.file-input {
  @apply w-full text-sm mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100;
}

.toggle-switch {
  @apply w-11 h-6 bg-gray-300 rounded-full relative after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full;
}
</style>
