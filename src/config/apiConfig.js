// const baseUrl = "http://127.0.0.1:8000/api";
const baseUrl = "http://192.168.0.3/meeting-management-system-api/public/api";
// const storageUrl = "http://127.0.0.1:8000";
const storageUrl = "http://192.168.0.3/meeting-management-system-api/public";

const apiEndpoints = {
  baseUrl: baseUrl,
  storageUrl: `${storageUrl}`,
  storageUrl1: `${storageUrl}/storage`,

  // Auth
  login: `${baseUrl}/login`,
  logout: `${baseUrl}/logout`,
  register: `${baseUrl}/register`,
  // Users
  users: `${baseUrl}/all-users`,

  broadcasting: `${baseUrl}/broadcasting/auth`,
  allUsers: `${baseUrl}/all-users`,
  updateUser: (userId) => `${baseUrl}/update-users/${userId}`,
  fetchUser: (userId) => `${baseUrl}/show-users/${userId}`,
  show_users: `${baseUrl}/show-users`,
  getUserImage: (userId) => `${baseUrl}/users/${userId}/image`,
  userActivity: `${baseUrl}/user/activity`,
  togglePublishStatus: (pollingId) => `${baseUrl}/voting/publish/${pollingId}`,
  meetingsByDate: (date) => `${baseUrl}/meetings?date=${date}`,

  // Meetings
  meetings: `${baseUrl}/meetings`,
  messageConvo: (userId) => `${baseUrl}/message-convo/${userId}`,

  updateMeeting: (meetingId) => `${baseUrl}/meetings/${meetingId}`,

  meetingCounts: `${baseUrl}/meeting/counts`,
  meetingsWithDate: (date) => `${baseUrl}/meetings?date=${date}`,
  FormateMeetings: (formattedDate) => `${baseUrl}/meetings?date=${formattedDate}`,
  location: `${baseUrl}/meetings/location`,
  submitCancelReason: `${baseUrl}/meetings/response`,

  // Meeting Minutes
  meetingMinutes: (meetingId) => `${baseUrl}/meetings/${meetingId}/minutes`,

  // Meeting Locations
  meetingLocations: `${baseUrl}/meetingLocations`,
  updateMeetingLocation: (locationId) => `${baseUrl}/meetingLocations/${locationId}`,

  // Agendas
  agendas: `${baseUrl}/agendas/list`,
  createAgenda: `${baseUrl}/agenda`,
  updateAgenda: (agendaId) => `${baseUrl}/agenda/${agendaId}?_method=PUT`,
  agenda: (agendaId) => `${baseUrl}/agenda/${agendaId}`,

  // Pollings and Voting
  pollings: `${baseUrl}/pollings`,
  polling: (pollId) => `${baseUrl}/pollings/${pollId}`,
  pollingId: (id) => `${baseUrl}/pollings/${id}`,
  vote: (pollId) => `${baseUrl}/voting/${pollId}`,

  voting_result: `${baseUrl}/voting/result`,

  // Poll Options
  pollOptions: `${baseUrl}/pollOptions`,
  deletePollOption: (id) => `${baseUrl}/pollOptions/${id}`,
  updatePollOption: (pollOptionId) => `${baseUrl}/pollOptions/${pollOptionId}`,

  // Clients
  clients: `${baseUrl}/clients`,
  // ClientChange: (clientId) => `${baseUrl}/clients/${clientId}`,
  ClientChange: (clientId) => `${baseUrl}/clients/${clientId}`,

  // Departments
  departments: `${baseUrl}/departments`,

  // Companies
  companies: `${baseUrl}/companies`,
 
  // Projects
  projects: `${baseUrl}/projects`,
  updateProject: (projectId) => `${baseUrl}/projects/${projectId}`,
  deleteProject: (projectId) => `${baseUrl}/projects/${projectId}`,

  // Rooms
  createRoom: `${baseUrl}/rooms`,
  getRooms: `${baseUrl}/rooms`,
  updateRoom: (roomId) => `${baseUrl}/rooms/${roomId}?_method=PUT`,

  // Messaging
  sendMessage: `${baseUrl}/message-send`,
  messageConvo: (userId) => `${baseUrl}/message-convo/${userId}`,

  // Dashboard
  dashboard_request: `${baseUrl}/dahsboard/getAllTotalPendingRequest`,

  // Storage and Images
  storage: `${baseUrl}/storage`,
  storageBaseUrl: `${baseUrl}/storage/`,
  imageUrl: (imagePath) => `${baseUrl}/storage/${imagePath}`,
  messageSend: `${baseUrl}/message-send`,
  markAsRead: `${baseUrl}/mark-as-read`,
  messageDelete: `${baseUrl}/message`,

};

export default apiEndpoints;
