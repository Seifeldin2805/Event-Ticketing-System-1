import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Event APIs
export const eventApi = {
  getAllEvents: () => api.get('/events'),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  getUserEvents: () => api.get('/events/my-events'),
  getAllEventsAdmin: () => api.get('/events/all'),
};

// Booking APIs
export const bookingApi = {
  createBooking: (data) => api.post('/bookings', data),
  getUserBookings: () => api.get('/bookings'),
  getBooking: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
  getOrganizerBookings: () => api.get('/bookings/organizer'),
};

// User APIs
export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAllUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  updateUserRole: (id, role) => api.put(`/users/${id}`, { role }),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Auth APIs
export const authApi = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  logout: () => api.post('/logout'),
  forgotPassword: (email) => api.post('/users/forgetPassword', { email }),
};

export default api; 