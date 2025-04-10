import axios from 'axios';

// Environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const TOKEN_NAME = import.meta.env.VITE_TOKEN_NAME || 'token';
const USER_NAME = import.meta.env.VITE_USER_NAME || 'user';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  timeoutErrorMessage: 'Server request timed out. Please try again.'
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_NAME);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token refresh logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await api.post('/auth/refresh-token');
        const { token } = refreshResponse.data;
        
        if (token) {
          localStorage.setItem(TOKEN_NAME, token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, logout user
        localStorage.removeItem(TOKEN_NAME);
        localStorage.removeItem(USER_NAME);
        window.location.href = '/signin';
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem(TOKEN_NAME, response.data.token);
    localStorage.setItem(USER_NAME, JSON.stringify(response.data.user));
    return response.data;
  },
  
  signup: async (userData: { 
    name: string; 
    email: string; 
    password: string;
    role?: string;
    rollNumber?: string;
    year?: string;
    division?: string;
    skills?: string[];
    profilePicture?: string;
    registrationCode?: string;
  }) => {
    const response = await api.post('/auth/signup', userData);
    localStorage.setItem(TOKEN_NAME, response.data.token);
    localStorage.setItem(USER_NAME, JSON.stringify(response.data.user));
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem(TOKEN_NAME);
    localStorage.removeItem(USER_NAME);
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem(USER_NAME);
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_NAME);
  },
};

// Student services
export const studentService = {
  getStudents: async (params: { page?: number; limit?: number; search?: string; year?: string; division?: string }) => {
    const response = await api.get('/students', { params });
    return response.data;
  },
  
  getStudent: async (id: string) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },
};

// Event services
export const eventService = {
  getEvents: async (params: { page?: number; limit?: number; search?: string; type?: string }) => {
    const response = await api.get('/events', { params });
    return response.data;
  },
  
  getEvent: async (id: string) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  
  registerForEvent: async (eventId: string, data: { studentId?: string }) => {
    const response = await api.post(`/events/${eventId}/register`, data);
    return response.data;
  },
};

// Announcement services
export const announcementService = {
  getAnnouncements: async (params: { page?: number; limit?: number; search?: string; type?: string }) => {
    const response = await api.get('/announcements', { params });
    return response.data;
  },
};

// Budget services
export const budgetService = {
  getBudgets: async (params: { page?: number; limit?: number; type?: string }) => {
    const response = await api.get('/budgets', { params });
    return response.data;
  },
  
  createBudgetEntry: async (data: { 
    amount: number;
    description: string;
    type: 'income' | 'expense';
    category: string;
    date: string;
  }) => {
    const response = await api.post('/budgets', data);
    return response.data;
  },
};

// Member services
export const memberService = {
  getMembers: async (params: { page?: number; limit?: number; search?: string; role?: string }) => {
    const response = await api.get('/members', { params });
    return response.data;
  },
  
  getMember: async (id: string) => {
    const response = await api.get(`/members/${id}`);
    return response.data;
  },
};

export default api; 