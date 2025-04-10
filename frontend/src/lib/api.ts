import axios from 'axios';

// Environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const TOKEN_NAME = 'pixel_to_perfection_token';
const USER_NAME = 'pixel_to_perfection_user';

// Utility function to fix URL paths
const fixUrlPath = (url: string) => {
  if (!url) return url;
  
  // If already absolute URL, just fix double slashes
  if (url.startsWith('http')) {
    return url.replace(/([^:])\/+/g, '$1/');
  }
  
  // If relative path, ensure it starts with a slash
  const relativePath = url.startsWith('/') ? url : `/${url}`;
  
  // Join with base URL and fix any double slashes
  return `${API_URL.replace('/api', '')}${relativePath}`.replace(/([^:])\/+/g, '$1/');
};

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
    
    // Log rate limit errors
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data && response.data.token && response.data.user) {
        localStorage.setItem(TOKEN_NAME, response.data.token);
        localStorage.setItem(USER_NAME, JSON.stringify(response.data.user));
        return response.data;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
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
    try {
      const response = await api.post('/auth/signup', userData);
      
      if (response.data && response.data.token && response.data.user) {
        localStorage.setItem(TOKEN_NAME, response.data.token);
        localStorage.setItem(USER_NAME, JSON.stringify(response.data.user));
        return response.data;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      localStorage.removeItem(TOKEN_NAME);
      localStorage.removeItem(USER_NAME);
      return response.data;
    } catch (error) {
      // Still remove tokens even if the API call fails
      localStorage.removeItem(TOKEN_NAME);
      localStorage.removeItem(USER_NAME);
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('GetMe error:', error);
      throw error;
    }
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(USER_NAME);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      // Clear possibly corrupted data
      localStorage.removeItem(USER_NAME);
      return null;
    }
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
  
  createEvent: async (eventData: any) => {
    try {
      const response = await api.post('/events', eventData);
      console.log("API response for event creation:", response);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },
  
  updateEvent: async (id: string, eventData: any) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },
  
  deleteEvent: async (id: string) => {
    const response = await api.delete(`/events/${id}`);
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
  
  getAnnouncement: async (id: string) => {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  },
  
  createAnnouncement: async (data: any) => {
    try {
      const response = await api.post('/announcements', data);
      return response.data;
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  },
  
  updateAnnouncement: async (id: string, data: any) => {
    const response = await api.put(`/announcements/${id}`, data);
    return response.data;
  },
  
  deleteAnnouncement: async (id: string) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  },
  
  pinAnnouncement: async (id: string, isPinned: boolean) => {
    // Backend toggles the pinned status, so we don't need to send isPinned
    const response = await api.put(`/announcements/${id}/pin`);
    return response.data;
  }
};

// Budget services
export const budgetService = {
  getBudgets: async (params: { page?: number; limit?: number; type?: string }) => {
    const response = await api.get('/budgets', { params });
    return response.data;
  },
  
  createBudgetEntry: async (data: any) => {
    try {
      const response = await api.post('/budgets', data);
      console.log("API response for budget entry creation:", response);
      return response.data;
    } catch (error) {
      console.error('Error creating budget entry:', error);
      throw error;
    }
  },
  
  updateBudgetEntry: async (id: string, data: any) => {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
  },
  
  deleteBudgetEntry: async (id: string) => {
    const response = await api.delete(`/budgets/${id}`);
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

  createMember: async (memberData: any) => {
    const response = await api.post('/members', memberData);
    return response.data;
  },
  
  updateMember: async (id: string, memberData: any) => {
    const response = await api.put(`/members/${id}`, memberData);
    return response.data;
  },
  
  deleteMember: async (id: string) => {
    const response = await api.delete(`/members/${id}`);
    return response.data;
  },
};

// Gallery services
export const galleryService = {
  getGalleryImages: async (params: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/gallery', { params });
    return response.data;
  },
  
  getGalleryImage: async (id: string) => {
    const response = await api.get(`/gallery/${id}`);
    return response.data;
  },
  
  createGalleryImage: async (imageData: any) => {
    try {
      const response = await api.post('/gallery', imageData);
      console.log("API response for gallery image creation:", response);
      return {
        data: response.data
      };
    } catch (error) {
      console.error('Error creating gallery image:', error);
      throw error;
    }
  },
  
  deleteGalleryImage: async (id: string) => {
    const response = await api.delete(`/gallery/${id}`);
    return response.data;
  },
};

// Leaderboard services
export const leaderboardService = {
  getLeaderboard: async (params: { limit?: number }) => {
    const response = await api.get('/leaderboard', { params });
    return response.data;
  },
  
  getBadges: async () => {
    const response = await api.get('/leaderboard/badges');
    return response.data;
  },
  
  getMyRanking: async () => {
    const response = await api.get('/leaderboard/me');
    return response.data;
  }
};

// File Upload services
export const uploadService = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  uploadProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    
    const response = await api.post('/uploads/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  uploadEventImage: async (file: File) => {
    const formData = new FormData();
    formData.append('eventImage', file);
    
    const response = await api.post('/uploads/event-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  uploadGalleryImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    
    const response = await api.post('/uploads/gallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  uploadAttachments: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('attachments', file);
    });
    
    const response = await api.post('/uploads/attachments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default api; 