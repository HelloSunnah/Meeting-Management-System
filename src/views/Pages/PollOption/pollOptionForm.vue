<template>
  <div :class="theme81" class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
    <div :class="theme61" class="w-full max-w-3xl rounded-2xl shadow-lg border border-gray-200 p-10">
      <h2 :class="themeText" class="text-3xl font-bold text-center mb-8">Create Poll Option</h2>

      <form @submit.prevent="submitPollOption" class="space-y-6">
        <!-- Name -->
        <div>
          <label :class="themeText" class="block text-sm font-medium mb-2">
            Poll Option Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="pollOption.name"
            type="text"
            placeholder="Enter poll option name"
            :class="themeInputText"
            class="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:outline-none"
          />
          <p v-if="errors.name" class="text-sm text-red-500 mt-1">{{ errors.name }}</p>
        </div>

        <!-- Description -->
        <div>
          <label :class="themeText" class="block text-sm font-medium mb-2">Description</label>
          <textarea
            v-model="pollOption.description"
            placeholder="Write a short description"
            rows="4"
            :class="themeInputText"
            class="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:outline-none"
          ></textarea>
          <p v-if="errors.description" class="text-sm text-red-500 mt-1">{{ errors.description }}</p>
        </div>

        <!-- Status -->
        <div>
          <label :class="themeText" class="block text-sm font-medium mb-2">Status</label>
          <select
            v-model="pollOption.status"
            :class="themeInputText"
            class="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:outline-none"
          >
            <option :value="1">Active</option>
            <option :value="0">Inactive</option>
          </select>
        </div>

        <!-- Submit -->
        <div class="pt-4 flex justify-center">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-8 rounded-xl transition disabled:opacity-50"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import apiEndpoints from '@/config/apiConfig';
import useTheme from '@/components/js/ThemeSetting';
import { useToast } from 'vue-toastification';

export default {
  name: 'CreatePollOption',
  setup() {
    const toast = useToast();
    const {
      theme6, theme8, theme9, theme61, theme81,
      themeText, themeInputText
    } = useTheme();

    return {
      toast,
      theme6, theme8, theme9, theme61, theme81,
      themeText, themeInputText
    };
  },
  data() {
    return {
      pollOption: {
        name: '',
        description: '',
        status: 1
      },
      errors: {},
      isSubmitting: false
    };
  },
methods: {
  async submitPollOption() {
    this.errors = {};

    // ✅ Basic client-side validation
    if (!this.pollOption.name.trim()) {
      this.errors.name = 'Poll option name is required.';
      return;
    }

    this.isSubmitting = true;

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(apiEndpoints.pollOptions, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.pollOption),
      });

      const result = await response.json();

   if (!response.ok) {
  this.errors = result.errors || [];

  if (Array.isArray(this.errors) && this.errors.length) {
    this.errors.forEach(err => {
      if (err.detail) this.toast.error(err.detail);
      else this.toast.error('An unknown error occurred.');
    });
  } else if (result.message) {
    this.toast.error(result.message);
  } else {
    this.toast.error('Something went wrong. Please try again.');
  }
}
 else {
        this.errors = result.errors || {};
        if (result.message) {
          this.toast.error(result.message);
        }
        Object.values(this.errors).forEach(msgs => {
          (Array.isArray(msgs) ? msgs : [msgs]).forEach(msg => this.toast.error(msg));
        });
      }
    }
    catch (error) {
      console.error('Network or unexpected error:', error);
      this.toast.error('Something went wrong. Please try again.');
      this.errors.general = 'Unexpected error occurred.';
    } finally {
      this.isSubmitting = false;
    }
  }
}

};
</script>

<style scoped>
input:focus,
textarea:focus,
select:focus {
  border-color: #3b82f6;
  outline: none;
  ring: 2px solid #3b82f6;
}

button:disabled {
  cursor: not-allowed;
}
</style>
