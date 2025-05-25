import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { showErrorWithDetails, showNetworkError } from '../utils/toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // Base delay in milliseconds
const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504]; // Status codes to retry

// Create the axios instance with improved configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Increased timeout to prevent hanging requests
  timeout: 30000, // 30 seconds
});

// Track pending requests to allow cancellation
const pendingRequests = new Map();

// Generate a unique key for each request to track it
const getRequestKey = (config: AxiosRequestConfig): string => {
  const { method, url, params, data } = config;
  return `${method}-${url}-${JSON.stringify(params)}-${JSON.stringify(data)}`;
};

// Add auth token and request tracking interceptor
apiClient.interceptors.request.use((config) => {
  // Only try to access localStorage on the client side
  if (isClient && config.headers) {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      // Continue with the request even if we can't get the token
    }
  }

  // Add request cancellation support
  const requestKey = getRequestKey(config);
  
  // Cancel previous request with same key if it exists
  if (pendingRequests.has(requestKey)) {
    const controller = pendingRequests.get(requestKey);
    controller.abort();
    pendingRequests.delete(requestKey);
  }
  
  // Create new AbortController for this request
  const controller = new AbortController();
  config.signal = controller.signal;
  pendingRequests.set(requestKey, controller);
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Helper function to determine if a request should be retried
const shouldRetry = (error: AxiosError): boolean => {
  // Don't retry if we've reached max retries
  const retryCount = error.config?.['retryCount'] || 0;
  if (retryCount >= MAX_RETRIES) return false;
  
  // Only retry GET, HEAD, OPTIONS requests (safe methods)
  const method = error.config?.method?.toUpperCase() || '';
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) return false;
  
  // Retry on network errors
  if (error.message === 'Network Error') return true;
  
  // Retry on timeout
  if (error.code === 'ECONNABORTED') return true;
  
  // Retry on specific status codes
  if (error.response && RETRY_STATUS_CODES.includes(error.response.status)) return true;
  
  return false;
};

// Add response interceptor for better error handling and retry logic
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Clean up the pending request on success
    const requestKey = getRequestKey(response.config);
    pendingRequests.delete(requestKey);
    return response;
  },
  async (error: AxiosError) => {
    // Clean up the pending request on error
    if (error.config) {
      const requestKey = getRequestKey(error.config);
      pendingRequests.delete(requestKey);
    }
    
    // Skip error handling for canceled requests - these are expected and not actual errors
    if (error.message === 'canceled' || error.code === 'ERR_CANCELED') {
      // Just log at debug level and don't show toast for canceled requests
      console.debug('Request canceled:', error.config?.url);
      return Promise.reject(error);
    }
    
    // Implement retry logic
    if (shouldRetry(error) && error.config) {
      const retryCount = error.config['retryCount'] || 0;
      error.config['retryCount'] = retryCount + 1;
      
      // Calculate exponential backoff delay
      const delay = RETRY_DELAY_MS * Math.pow(2, retryCount);
      
      // Log retry attempt
      console.log(`Retrying request (${retryCount + 1}/${MAX_RETRIES}) after ${delay}ms...`);
      
      // Wait for the delay
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Retry the request
      return apiClient(error.config);
    }
    
    // Handle network errors with toast notification
    if (error.message === 'Network Error') {
      showNetworkError();
    }
    
    // Handle timeout errors with toast notification
    else if (error.code === 'ECONNABORTED') {
      showErrorWithDetails(
        'Request timeout - API server is taking too long to respond. Please try again later.',
        'API Timeout'
      );
    }
    
    // Log and handle other errors
    else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config?.url,
      });
      
      // Show appropriate error message based on status code
      if (error.response.status === 401) {
        showErrorWithDetails('Authentication error. Please log in again.', 'Auth Error');
      } else if (error.response.status === 403) {
        showErrorWithDetails('You do not have permission to perform this action.', 'Permission Error');
      } else if (error.response.status === 404) {
        showErrorWithDetails('The requested resource was not found.', 'Not Found');
      } else if (error.response.status >= 500) {
        showErrorWithDetails('Server error. Please try again later.', 'Server Error');
      } else {
        // Generic error message for other status codes
        showErrorWithDetails(error, 'API Error');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', error.request);
      showErrorWithDetails('No response received from server. Please check your connection.', 'Connection Error');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error Setup:', error.message);
      showErrorWithDetails(error, 'Request Error');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

// Export a function to cancel all pending requests (useful for page transitions)
export const cancelAllRequests = () => {
  pendingRequests.forEach(controller => {
    controller.abort();
  });
  pendingRequests.clear();
};
