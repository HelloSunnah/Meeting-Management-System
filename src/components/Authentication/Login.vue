<template>
  <div class="flex-1 flex items-center justify-center p-4 lg:p-8 rounded-none lg:rounded-r-3xl">
    <div class="relative w-full max-w-sm p-8 sm:p-10 bg-white rounded-xl lg:rounded-2xl shadow-2xl">
      <img src="@/assets/img/ati-small-logo.png" class="h-12 w-auto mx-auto mb-6 animate__animated animate__fadeIn"
        alt="Logo" />
      <form @submit.prevent="loginUser">
        <div class="mb-6">
          <input v-model="form.email" type="email" placeholder="User Email"
            class="w-full p-3 sm:p-4 border border-gray-300 rounded-md text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-200 ease-in-out shadow-sm"
            required />
        </div>
        <div class="mb-6">
          <input v-model="form.password" type="password" placeholder="Password"
            class="w-full p-3 sm:p-4 border border-gray-300 rounded-md text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-200 ease-in-out shadow-sm"
            required />
        </div>
        <div v-if="error" class="text-red-500 text-sm mb-4">
          {{ error }}
        </div>
        <button type="submit" :disabled="loading"
          class="w-full p-3 sm:p-4 bg-indigo-600 text-white rounded-md text-base sm:text-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out">
          <span v-if="loading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>
    </div>
  </div>
</template>
<script>
import apiEndpoints from '@/config/apiConfig';
import axios from 'axios';
import useTheme from '@/components/js/ThemeSetting';
import { useToast } from "vue-toastification";
export default {

    setup() {
    const {
      theme1,
      theme2,
      theme3,
      theme4,
      theme5,
      theme6,
      theme7,
      theme8,
      theme9,
      themeText,
    } = useTheme();

    const toast = useToast();

    return {
      theme1,
      theme2,
      theme3,
      theme4,
      theme5,
      theme6,
      theme7,
      theme8,
      theme9,
      themeText,
      toast,
    };
  },
  data() {
    return {
      form: { email: '', password: '' },
      loading: false,
      error: ''
    };
  },
  methods: {
    async loginUser() {
      this.loading = true;
      this.error = '';
      try {
        const res = await axios.post(apiEndpoints.login, this.form);
        // sessionStorage.setItem('token', res.data.data.token);
        sessionStorage.setItem('token', res.data.data.token);
        localStorage.setItem('token', res.data.data.token);
        sessionStorage.setItem('user_id', res.data.data.user.id);
        sessionStorage.setItem('login_user_name', res.data.data.user.name);
        sessionStorage.setItem('role_id', res.data.data.role_id);

        sessionStorage.setItem('meeting_create_per', res.data.data.user.meeting_create_per);
        sessionStorage.setItem('polling_create_per', res.data.data.user.polling_create_per);
        sessionStorage.setItem('email', this.form.email);
        console.log(res);
        console.log(sessionStorage.getItem('user_id'));
        this.$router.push('/dashboard');
      } catch (error) {
        this.error = 'Invalid credentials!';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
<style scoped>
</style>
