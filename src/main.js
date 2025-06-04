import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; 
import "./index.css"; 
import Toast, { POSITION } from "vue-toastification";
import "@fortawesome/fontawesome-free/css/all.css";
import HighchartsVue from 'highcharts-vue';
import 'vue-multiselect/dist/vue-multiselect.min.css';

import "vue-toastification/dist/index.css";
import { createI18n } from "vue-i18n";
import en from "./i18n/en.json";
import bn from "./i18n/bn.json";
import fr from "./i18n/fr.json";
import ja from "./i18n/ja.json";
import cn from "./i18n/cn.json";
import th from "./i18n/th.json";
import ms from "./i18n/ms.json";
import hi from "./i18n/hi.json";
import thi from "./i18n/thi.json";


import store from "./store"; 

import './registerServiceWorker'

const app = createApp(App);
const i18n = createI18n({
  legacy: false,
  locale: "en", 
  messages: {
    en,
    thi,
    bn,
    fr,
    ja,
    cn,
    th,
    ms,
    hi,
  },
});
const options = {
  position: POSITION.TOP_CENTER,
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: true,
};
router.afterEach((to) => {
  const defaultTitle = 'Meeting Management System';
  document.title = to.meta.title || defaultTitle;
});

app.use(router);
app.use(i18n);
app.use(store); 

app.use(Toast, options);
app.mount("#app");

app.use(HighchartsVue);