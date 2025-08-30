# 📅 Meeting Management System

This is the **frontend application** of the **Meeting Management System**, built with **Vue.js 3**.  
It provides a responsive and modern user interface for managing meetings, live chat, polling, voting, and reporting.  
The app integrates with a **Laravel + PostgreSQL backend** (via REST API) secured with **Laravel Passport authentication**.

---

## ✨ Features

### 👤 User Features
- 💬 **Live Chat** – Real-time team communication.
- 📊 **Dashboard** – Centralized overview of activities.
- 📅 **Meeting Schedule** – Create, view, and manage meetings.
- 🗳️ **Polling**
  - Create and view polls
  - Vote securely
  - See live results

### 👨‍💼 Admin Features
- ⚙️ **Setup Module**
  - Manage users, clients, projects, meeting rooms, and poll options
- 📑 **Reports**
  - Generate meeting reports with details

---

## 🛠️ Tech Stack (Frontend)

| Category        | Technology |
|-----------------|------------|
| **Framework**   | [Vue.js 3](https://vuejs.org/) (options API) |
| **Build Tool**  | [Vite](https://vitejs.dev/) |
| **UI Libraries**| Tailwind CSS / Bootstrap, [Font Awesome](https://fontawesome.com/) (animated icons) |
| **State Mgmt.** | Pinia / Vuex *(if configured)* |
| **Routing**     | Vue Router 4 |
| **Auth**        | Token-based (via Laravel Passport API) |
| **Backend API** | Laravel REST API with PostgreSQL (separate repo) |

---

## ⚡ Installation & Setup

1. **Clone repository**
   ```bash
   git clone http://192.168.0.13/php/meeting-management-system.git
   cd meeting-management-system-frontend
