import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This is important for handling cookies
});

// Error handler function
const handleApiError = (error: any): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error - Status:', axiosError.response.status);
      console.error('API Error - Data:', axiosError.response.data);
    } else if (axiosError.request) {
      // The request was made but no response was received
      console.error('API Error - No response received:', axiosError.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', axiosError.message);
    }
  } else {
    // Not an Axios error
    console.error('Unexpected error:', error);
  }
  throw error;
};

// Authentication services
export const authService = {
  login: async (username: string, password: string) => {
    try {
      const response = await api.post('/login', { username, password });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  register: async (username: string, password: string) => {
    try {
      const response = await api.post('/register', { username, password });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  forgotPassword: async (username: string) => {
    try {
      const response = await api.post('/forgot-password', { username });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  resetPassword: async (token: string, password: string) => {
    try {
      const response = await api.post(`/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// Link management services
export const linkService = {
  getLinks: async () => {
    try {
      const response = await api.get('/get_links');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  saveLink: async (linkData: {
    title: string;
    url: string;
    category: string;
    privacy: string;
  }) => {
    try {
      const response = await api.post('/save_link', linkData);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    console.error('API Request Failed:', error);
    
    // Check for authentication errors and handle them globally
    if (error.response && error.response.status === 401) {
      // Clear the token cookie if present
      document.cookie = 'access_token_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 