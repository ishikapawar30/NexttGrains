import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const getAdminToken = () => {
  return (
    localStorage.getItem("adminToken") ||
    ""
  );
};


const notificationApi = axios.create({

  baseURL:
    `${API_URL}/notifications`,

  headers: {
    "Content-Type":
      "application/json",
  },

});


notificationApi.interceptors.request.use(
  (config) => {

    const token =
      getAdminToken();

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  },

  (error) =>
    Promise.reject(error)

);


// =====================================================
// GET ADMIN NOTIFICATIONS
// =====================================================

export const getAdminNotifications =
async (params = {}) => {

  const response =
    await notificationApi.get(
      "/admin",
      {
        params,
      }
    );

  return response.data;

};


// =====================================================
// GET UNREAD COUNT
// =====================================================

export const getAdminUnreadCount =
async () => {

  const response =
    await notificationApi.get(
      "/admin/unread-count"
    );

  return response.data;

};


// =====================================================
// MARK READ
// =====================================================

export const markNotificationAsRead =
async (notificationId) => {

  const response =
    await notificationApi.put(
      `/read/${notificationId}`
    );

  return response.data;

};


// =====================================================
// MARK ALL READ
// =====================================================

export const markAllNotificationsAsRead =
async () => {

  const response =
    await notificationApi.put(
      "/read-all"
    );

  return response.data;

};


// =====================================================
// DELETE
// =====================================================

export const deleteNotification =
async (notificationId) => {

  const response =
    await notificationApi.delete(
      `/${notificationId}`
    );

  return response.data;

};


export default notificationApi;