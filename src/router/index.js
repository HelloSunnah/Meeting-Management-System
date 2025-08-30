
import { createRouter, createWebHistory } from "vue-router";
import { useToast } from "vue-toastification";
import Dashboard from "@/views/Dashboard.vue";
import profile from "@/views/Profile.vue";
import dashboard2 from "@/views/Dashboard2.vue";
import meeting_schedule from "@/views/Pages/Schedule/meetingSchedule.vue";
import meeting_schedule_form from "@/views/Pages/Schedule/meetingScheduleForm.vue";
import clients from "@/views/Pages/Client/client.vue";
import client_form from "@/views/Pages/Client/clientForm.vue";
import projects from "@/views/Pages/Project/project.vue";
import project_form from "@/views/Pages/Project/projectForm.vue";
import meetingLocation from "@/views/Pages/MeetingLocation/meetingLocation.vue";
import meeting_location_form from "@/views/Pages/MeetingLocation/meetingLocationForm.vue";
import poll_option from "@/views/Pages/PollOption/pollOption.vue";
import poll_option_form from "@/views/Pages/PollOption/pollOptionForm.vue";
import pollings from "@/views/Pages/Polling/polling.vue";
import polling_form from "@/views/Pages/Polling/pollingForm.vue";
import voting_result from "@/views/Pages/Polling/VotingResult.vue";
import Login from "@/components/Authentication/Login.vue";
import Register from "@/views/Pages/Registration/RegisterList.vue";
import RegisterForm from "@/views/Pages/Registration/RegisterForm.vue";

import polling_vote from "@/views/Pages/Polling/PollingVote.vue";
import MeetingReportPrint from "@/views/Pages/Report/ReportList.vue";
import Overview from "@/components/Authentication/Overview.vue";
import meeting_report from "@/views/Pages/Report/meetingReport.vue";
import LiveChat from "@/views/Pages/Chat/LiveChat.vue";
function isAuthenticated() {
  const token = sessionStorage.getItem("token");
  const tokenExpiry = sessionStorage.getItem("token_expiry");
  const currentTime = new Date().getTime();
  if (token) {
    return true;
  }
}
function handleUnauthorizedAccess(to, next, toast) {
  console.log(
    "User is not authenticated or token has expired. Redirecting to Login."
  );
  toast.error("Your session has expired. Please log in again.");
  next({ path: "/login" });
}

const routes = [
  { path: "/login", name: "Login", component: Login },
  {
    path: "/",
    name: "Overview",
    component: Overview,
    meta: { title: "Meeting Room" },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },  {
    path: "/profile",
    name: "profile",
    component: profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/LiveChat",
    name: "LiveChat",
    component: LiveChat,
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard2",
    name: "Dashboard2",
    component: dashboard2,
    meta: { requiresAuth: true },
  },
  {
    path: "/Register",
    name: "Register",
    component: Register,
    meta: { requiresAuth: true },
  },
  {
    path: "/Register/Form",
    name: "RegisterForm",
    component: RegisterForm,
    meta: { requiresAuth: true },
  },

  {
    path: "/meeting/schedule",
    name: "meeting_schedule",
    component: meeting_schedule,
    meta: { requiresAuth: true },
  },
  {
    path: "/meeting/schedule/form",
    name: "meeting_schedule_form",
    component: meeting_schedule_form,
    meta: { requiresAuth: true },
  },

  {
    path: "/polling/vote",
    name: "polling_vote",
    component: polling_vote,
    meta: { requiresAuth: true },
  },
  {
    path: "/setup/client",
    name: "clients",
    component: clients,
    meta: { requiresAuth: true },
  },
  {
    path: "/setup/client/form",
    name: "client_form",
    component: client_form,
    meta: { requiresAuth: true },
  },
  {
    path: "/setup/project",
    name: "projects",
    component: projects,
    meta: { requiresAuth: true },
  },
  {
    path: "/setup/project/form",
    name: "project_form",
    component: project_form,
    meta: { requiresAuth: true },
  },
  {
    path: "/setup/meetingLocation",
    name: "meeting_location",
    component: meetingLocation,
    meta: { requiresAuth: true },
  },
  {
    path: "/setup/meetingLocation/form",
    name: "meeting_location_form",
    component: meeting_location_form,
    meta: { requiresAuth: true },
  },
  {
    path: "/setup/pollOption",
    name: "poll_option",
    component: poll_option,
    meta: { requiresAuth: true },
  },
  {
    path: "/setup/pollOption/form",
    name: "poll_option_form",
    component: poll_option_form,
    meta: { requiresAuth: true },
  },
  {
    path: "/pollings",
    name: "pollings",
    component: pollings,
    meta: { requiresAuth: true },
  },
  {
    path: "/polling/form",
    name: "polling_form",
    component: polling_form,
    meta: { requiresAuth: true },
  },
  {
    path: "/voting/result",
    name: "voting_result",
    component: voting_result,
    meta: { requiresAuth: true },
  },
  {
    path: "/meeting/report",
    name: "meeting_report",
    component: meeting_report,
    meta: { requiresAuth: true },
  },
  {
    path: "/meeting-report/:id",
    name: "MeetingReportView",
    component: MeetingReportPrint,
  },
  { path: "/", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Get a toast instance here so we don't create it inside navigation guards
const toast = useToast();

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (!isAuthenticated()) {
      handleUnauthorizedAccess(to, next, toast);
    } else {
      console.log("User is authenticated. Allowing access to:", to.name);
      next();
    }
  } else {
    next();
  }
});

export default router;
