
import { globals } from "@/config/globals";
import useTheme from '@/components/js/ThemeSetting';
import { useToast } from "vue-toastification";
import axios from "axios";

export default {
  name: "Login",

  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      loading: false,
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    async loginUser() {
      try {


        const response = await axios.post(apiEndpoints.login, {

          
          email: this.email,
          password: this.password
        });
  
        sessionStorage.setItem('token', response.data.token);
  
        this.$router.push('/dashboard'); 
      } catch (error) {
        console.error("Login Error:", error.response ? error.response.data : error);
        this.error = "Invalid credentials!";
      }
    }
  }
  
    };