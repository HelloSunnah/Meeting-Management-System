// const baseUrl = "http://127.0.0.1:8000/api";
// const storageUrl = "http://127.0.0.1:8000";
// const storageUrl2 = "http://127.0.0.1:8000/storage/app/public";

// live

// const baseUrl = "http://192.168.0.3/meeting-management-system-api/public/api";
// const storageUrl = "http://192.168.0.3/meeting-management-system-api/public";
// const storageUrl2 ="http://192.168.0.3/meeting-management-system-api/storage/app/public";

// Qa Build'

const baseUrl="http://192.168.0.3/meeting-management-system-api-qa/public/api";
const storageUrl="http://192.168.0.3/meeting-management-system-api-qa/public";
const storageUrl2="http://192.168.0.3/meeting-management-system-api-qa/storage/app/public";


// Ati Personal domain

// const baseUrl = "https://meetingapi.atilimited.net/api";
// const storageUrl = "https://meetingapi.atilimited.net";
// const storageUrl2 ="https://meetingapi.atilimited.net/storage/";

const apiEndpoints = {
  baseUrl: baseUrl,
  storageUrl: `${storageUrl}`,
  storageUrl1: `${storageUrl}/storage`,
  storageUrl2: `${storageUrl2}`,
  login: `${baseUrl}/login`,
  logout: `${baseUrl}/logout`,
  register: `${baseUrl}/register`,

  broadcasting: `${baseUrl}/broadcasting/auth`,
  meetingbyId: (id) => `${baseUrl}/meetings/${id}`,

  allUsers: `${baseUrl}/all-users`,
  chatUsers: `${baseUrl}/chat-users`,
  unreadCount:`${baseUrl}/unread-count`,

  meetingReport: `${baseUrl}/report/meetings`,

  updateUser: (userId) => `${baseUrl}/update-users/${userId}`,
  updateProfile: (userId) => `${baseUrl}/update-profile/${userId}`,
  fetchUser: (userId) => `${baseUrl}/show-users/${userId}`,

  show_users: `${baseUrl}/show-users`,
  getUserImage: (userId) => `${baseUrl}/users/${userId}/image`,
  userActivity: `${baseUrl}/user/activity`,
  togglePublishStatus: (pollingId) => `${baseUrl}/voting/publish/${pollingId}`,
  meetingsByDate: (date) => `${baseUrl}/meetings?date=${date}`,
  meetings: `${baseUrl}/meetings`,
  meetingsPresent: `${baseUrl}/meetings/present`,
  meetingsPast: `${baseUrl}/meetings/past`,
  meetingsUpcoming: `${baseUrl}/meetings/upcoming`,

  messageConvo: (userId) => `${baseUrl}/message-convo/${userId}`,
  updateMeeting: (meetingId) => `${baseUrl}/meetings/${meetingId}`,
  meetingCounts: `${baseUrl}/meeting/counts`,
  meetingsWithDate: (date) => `${baseUrl}/meetings?date=${date}`,
  FormateMeetings: (formattedDate) =>
    `${baseUrl}/meetings?date=${formattedDate}`,
  location: `${baseUrl}/meetings/location`,
  submitCancelReason: `${baseUrl}/meetings/response`,
  meetingMinutes: (meetingId) => `${baseUrl}/meetings/${meetingId}/minutes`,
  meetingLocations: `${baseUrl}/meetingLocations`,
  updateMeetingLocation: (locationId) =>
    `${baseUrl}/meetingLocations/${locationId}`,
  agendas: `${baseUrl}/agendas/list`,
  createAgenda: `${baseUrl}/agenda`,
  updateAgenda: (agendaId) => `${baseUrl}/agenda/${agendaId}?_method=PUT`,
  agenda: (agendaId) => `${baseUrl}/agenda/${agendaId}`,

  pollings: `${baseUrl}/pollings`,
  polling: (pollId) => `${baseUrl}/pollings/${pollId}`,
  pollingId: (id) => `${baseUrl}/pollings/${id}`,

  vote: (pollId) => `${baseUrl}/voting/${pollId}`,

  voting_result: `${baseUrl}/voting/result`,
  pollOptions: `${baseUrl}/pollOptions`,
  deletePollOption: (id) => `${baseUrl}/pollOptions/${id}`,
  updatePollOption: (pollOptionId) => `${baseUrl}/pollOptions/${pollOptionId}`,
  clients: `${baseUrl}/clients`,
  // ClientChange: (clientId) => `${baseUrl}/clients/${clientId}`,
  ClientChange: (clientId) => `${baseUrl}/clients/${clientId}`,
  departments: `${baseUrl}/departments`,
  companies: `${baseUrl}/companies`,
  projects: `${baseUrl}/projects`,
  updateProject: (projectId) => `${baseUrl}/projects/${projectId}`,
  deleteProject: (projectId) => `${baseUrl}/projects/${projectId}`,
  createRoom: `${baseUrl}/rooms`,
  getRooms: `${baseUrl}/rooms`,
  updateRoom: (roomId) => `${baseUrl}/rooms/${roomId}?_method=PUT`,
  sendMessage: `${baseUrl}/message-send`,
  messageConvo: (userId) => `${baseUrl}/message-convo/${userId}`,
  dashboard_request: `${baseUrl}/dahsboard/getAllTotalPendingRequest`,
  storage: `${baseUrl}/storage`,
  storageBaseUrl: `${baseUrl}/storage/`,
  imageUrl: (imagePath) => `${baseUrl}/storage/${imagePath}`,
  messageSend: `${baseUrl}/message-send`,
  markAsRead: `${baseUrl}/mark-as-read`,
  messageDelete: `${baseUrl}/message`,
};
export default apiEndpoints;
