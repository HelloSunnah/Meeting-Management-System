import { createRouter, createWebHistory } from "vue-router";
import { useToast } from "vue-toastification";
import Dashboard from "@/views/Dashboard.vue";
import dashboard2 from "@/views/Dashboard2.vue";
import subscriptionDesign from "@/views/SubscriptionPage.vue";



import meeting_schedule from "@/views/Pages/Schedule/meetingSchedule.vue";

import meeting_schedule_form from "@/views/Pages/Schedule/meetingScheduleForm.vue";

import meeting_agenda from "@/views/Pages/Agenda/meetingAgenda.vue";
import meeting_agenda_form from "@/views/Pages/Agenda/meetingAgendaForm.vue";

import meeting_room from "@/views/Pages/Room/MeetingRoom.vue";
import meeting_room_form from "@/views/Pages/Room/MeetingRoomForm.vue";


import subscription from "@/views/Pages/Subscription/subscription.vue";
import subscription_form from "@/views/Pages/Subscription/subscriptionForm.vue";

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
import guideline from "@/components/Main/Floating/Pages/Guideline.vue";
import Maintenance from "@/components/Main/Floating/Pages/UnderMantainance.vue";
import ProcessFlow from "@/components/Main/Floating/Pages/ProcessFlow.vue";

import Login from "@/components/Authentication/Login.vue";
import Register from "@/views/Pages/Registration/RegisterList.vue";
import RegisterForm from "@/views/Pages/Registration/RegisterForm.vue";

import polling_vote from "@/views/Pages/Polling/PollingVote.vue";

import Overview from "@/components/Authentication/Overview.vue";
import Invoices from "@/views/Pages/FinanceAccounting/Invoices.vue";
import Budgeting from "@/views/Pages/FinanceAccounting/Budgeting.vue";
import Reports from "@/views/Pages/FinanceAccounting/Reports.vue";
import SupplierManagement from "@/views/Pages/Procurement/SupplierManagement.vue";
import PurchaseOrders from "@/views/Pages/Procurement/PurchaseOrders.vue";
import ProductionSchedules from "@/views/Pages/Manufacturing/ProductionSchedules.vue";
import QualityControl from "@/views/Pages/Manufacturing/QualityControl.vue";
import InventoryLevels from "@/views/Pages/Inventory/InventoryLevels.vue";
import StockReports from "@/views/Pages/Inventory/StockReports.vue";
import OrderStatus from "@/views/Pages/OrderManagement/OrderStatus.vue";
import Returns from "@/views/Pages/OrderManagement/Returns.vue";
import ProductListings from "@/views/Pages/E-commerce/ProductListings.vue";
import CustomerOrders from "@/views/Pages/E-commerce/CustomerOrders.vue";
import EmployeeRecords from "@/views/Pages/HumanResource/EmployeeRecords.vue";
import Payroll from "@/views/Pages/HumanResource/Payroll.vue";
import WarehouseLayout from "@/views/Pages/WarehouseManagement/WarehouseLayout.vue";
import InventoryTracking from "@/views/Pages/WarehouseManagement/InventoryTracking.vue";
import ShipmentStatus from "@/views/Pages/WarehouseManagement/ShipmentStatus.vue";
import SupplierPerformance from "@/views/Pages/SupplyChain/SupplierPerformance.vue";
import DemandForecast from "@/views/Pages/SupplyChain/DemandForecast.vue";

function isAuthenticated() {
  const token = localStorage.getItem("token");
  const tokenExpiry = localStorage.getItem("token_expiry");
  const currentTime = new Date().getTime();
  if (!token || !tokenExpiry || currentTime > parseInt(tokenExpiry, 10)) {
    return true;
  }
  return true;
}

function handleUnauthorizedAccess(to, next, toast) {
  console.log(
    "User is not authenticated or token has expired. Redirecting to Login."
  );
  toast.error("Your session has expired. Please log in again.");
  next({ path: "/login", query: { redirect: to.fullPath } });
}
const routes = [
  { path: "/login", name: "Login", component: Login },
  { path: "/", name: "Overview", component: Overview ,  meta: { title: 'Meeting Room' }
},
    {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    // meta: { requiresAuth: true },
  },
  {
    path: "/dashboard2",
    name: "Dashboard2",
    component: dashboard2,
    meta: { requiresAuth: true },
  },

  {
    path: "/guideline",
    name: "guideline",
    component: guideline,
    meta: { requiresAuth: true },
  },
  {
    path: "/Register",
    name: "Register",
    component: Register,
    meta: { requiresAuth: true },
  }, 
  
  
  {
    path: "/subscription",
    name: "subscriptionDesign",
    component: subscriptionDesign,
    meta: { requiresAuth: true },
  },
  
  {
    path: "/Register/Form",
    name: "RegisterForm",
    component: RegisterForm,
    meta: { requiresAuth: true },
  },
  
  
  
  
  {
    path: "/under/maintenance",
    name: "Maintenance",
    component: Maintenance,
    meta: { requiresAuth: true },
  },
  {
    path: "/ProcessFlow",
    name: "ProcessFlow",
    component: ProcessFlow,
    meta: { requiresAuth: true },
  },

  {
    path: "/FinanceAccounting/Invoices",
    name: "Invoices",
    component: Invoices,
    meta: { requiresAuth: true },
  },
  {
    path: "/FinanceAccounting/Budgeting",
    name: "Budgeting",
    component: Budgeting,
    meta: { requiresAuth: true },
  },
  {
    path: "/FinanceAccounting/Reports",
    name: "Reports",
    component: Reports,
    meta: { requiresAuth: true },
  },
  {
    path: "/meeting/agenda",
    name: "meeting_agenda",
    component: meeting_agenda,
    // meta: { requiresAuth: true },
  },   {
    path: "/meeting/room",
    name: "meeting_room",
    component: meeting_room,
    // meta: { requiresAuth: true },
  },    {
    path: "/meeting/room/form",
    name: "meeting_room_form",
    component: meeting_room_form,
    // meta: { requiresAuth: true },
  }, 
  
   {
    path: "/meeting/agenda/form",
    name: "meeting_agenda_form",
    component: meeting_agenda_form,
    // meta: { requiresAuth: true },
  },
     {
    path: "/meeting/schedule",
    name: "meeting_schedule",
    component: meeting_schedule,
    // meta: { requiresAuth: true },
  },
  {
    path: "/meeting/schedule/form",
    name: "meeting_schedule_form",
    component: meeting_schedule_form,
    // meta: { requiresAuth: true },
  },
  
  {
    path: "/subscription",
    name: "subscription",
    component: subscription,
    // meta: { requiresAuth: true },
  },
  {
    path: "/subscription/form",
    name: "subscription_form",
    component: subscription_form,
    // meta: { requiresAuth: true },
  },


  {
    path: "/polling/vote",
    name: "polling_vote",
    component: polling_vote,
    // meta: { requiresAuth: true },
  },
  
  {
    path: "/Procurement/SupplierManagement",
    name: "SupplierManagement",
    component: SupplierManagement,
    meta: { requiresAuth: true },
  },
  {
    path: "/Procurement/PurchaseOrders",
    name: "PurchaseOrders",
    component: PurchaseOrders,
    meta: { requiresAuth: true },
  },

  {
    path: "/HumanResource/EmployeeRecords",
    name: "EmployeeRecords",
    component: EmployeeRecords,
    meta: { requiresAuth: true },
  },
  {
    path: "/HumanResource/Payroll",
    name: "Payroll",
    component: Payroll,
    meta: { requiresAuth: true },
  },

  {
    path: "/WarehouseManagement/WarehouseLayout",
    name: "WarehouseLayout",
    component: WarehouseLayout,
    meta: { requiresAuth: true },
  },
  {
    path: "/WarehouseManagement/InventoryTracking",
    name: "InventoryTracking",
    component: InventoryTracking,
    meta: { requiresAuth: true },
  },
  {
    path: "/WarehouseManagement/ShipmentStatus",
    name: "ShipmentStatus",
    component: ShipmentStatus,
    meta: { requiresAuth: true },
  },
  {
    path: "/SupplyChain/SupplierPerformance",
    name: "SupplierPerformance",
    component: SupplierPerformance,
    meta: { requiresAuth: true },
  },
  {
    path: "/SupplyChain/DemandForecast",
    name: "DemandForecast",
    component: DemandForecast,
    meta: { requiresAuth: true },
  },
  {
    path: "/Manufacturing/ProductionSchedules",
    name: "ProductionSchedules",
    component: ProductionSchedules,
    meta: { requiresAuth: true },
  },
  {
    path: "/Manufacturing/QualityControl",
    name: "QualityControl",
    component: QualityControl,
    meta: { requiresAuth: true },
  },
  {
    path: "/E-commerce/ProductListings",
    name: "ProductListings",
    component: ProductListings,
    // meta: { requiresAuth: true },
  },
  {
    path: "/E-commerce/CustomerOrders",
    name: "CustomerOrders",
    component: CustomerOrders,
    // meta: { requiresAuth: true },
  },
  {
    path: "/OrderManagement/OrderStatus",
    name: "OrderStatus",
    component: OrderStatus,
    meta: { requiresAuth: true },
  },
  {
    path: "/OrderManagement/Returns",
    name: "Returns",
    component: Returns,
    meta: { requiresAuth: true },
  },
  {
    path: "/Inventory/InventoryLevels",
    name: "InventoryLevels",
    component: InventoryLevels,
    meta: { requiresAuth: true },
  },
  {
    path: "/Inventory/StockReports",
    name: "StockReports",
    component: StockReports,
    meta: { requiresAuth: true },
  },
  {
    path: "/setup/client",
    name: "clients",
    component: clients,
    // meta: { requiresAuth: true },
  },
  {
    path: "/setup/client/form",
    name: "client_form",
    component: client_form,
    // meta: { requiresAuth: true },
  },
  {
    path: "/setup/project",
    name: "projects",
    component: projects,
    // meta: { requiresAuth: true },
  },
  {
    path: "/setup/project/form",
    name: "project_form",
    component: project_form,
    // meta: { requiresAuth: true },
  },
  {
    path: "/setup/meetingLocation",
    name: "meeting_location",
    component: meetingLocation,
    // meta: { requiresAuth: true },
  },
  {
    path: "/setup/meetingLocation/form",
    name: "meeting_location_form",
    component: meeting_location_form,
    // meta: { requiresAuth: true },
  },
  {
    path: "/setup/pollOption",
    name: "poll_option",
    component: poll_option,
    // meta: { requiresAuth: true },
  },
  {
    path: "/setup/pollOption/form",
    name: "poll_option_form",
    component: poll_option_form,
    // meta: { requiresAuth: true },
  },
  {
    path: "/pollings",
    name: "pollings",
    component: pollings,
    // meta: { requiresAuth: true },
  },
  {
    path: "/polling/form",
    name: "polling_form",
    component: polling_form,
    // meta: { requiresAuth: true },
  },  {
    path: "/voting/result",
    name: "voting_result",
    component: voting_result,
    // meta: { requiresAuth: true },
  },
  { path: "/:catchAll(.*)", redirect: "/" },
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
