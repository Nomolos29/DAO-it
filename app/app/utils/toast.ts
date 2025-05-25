/**
 * Enhanced toast utility that logs messages to the console
 * This is a temporary replacement for react-toastify with improved error handling
 */

// Define types for toast functions
type ToastType = 'success' | 'error' | 'info' | 'warning';

// Interface for toast options (kept for API compatibility)
interface ToastOptions {
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  autoClose?: number;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
}

// Function to show toast messages (console-only implementation)
const showToast = (message: string, type: ToastType, options?: ToastOptions) => {
  // Log to console with appropriate styling
  const styles = {
    success: 'color: green; font-weight: bold;',
    error: 'color: red; font-weight: bold;',
    info: 'color: blue; font-weight: bold;',
    warning: 'color: orange; font-weight: bold;'
  };
  
  console.log(`%c${type.toUpperCase()}: ${message}`, styles[type]);
  
  // In a real implementation, we would show a visual toast notification
  // For now, we're just logging to the console
};

// Export convenience methods with the same API as before
export const toast = {
  success: (message: string, options?: ToastOptions) => showToast(message, 'success', options),
  error: (message: string, options?: ToastOptions) => showToast(message, 'error', options),
  info: (message: string, options?: ToastOptions) => showToast(message, 'info', options),
  warning: (message: string, options?: ToastOptions) => showToast(message, 'warning', options),
};

// Check if an error is a canceled request (which is not a real error)
export const isCanceledError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message === 'canceled' || error.name === 'CanceledError' || (error as any).code === 'ERR_CANCELED';
  }
  
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as { message?: string; name?: string; code?: string; };
    return errorObj.message === 'canceled' || 
           errorObj.name === 'CanceledError' || 
           errorObj.code === 'ERR_CANCELED';
  }
  
  return false;
};

// Enhanced error handling utilities
export const handleApiError = (error: unknown, defaultMessage = 'An error occurred'): string => {
  // Skip logging canceled requests as errors
  if (isCanceledError(error)) {
    // Just return a message but don't log as error
    return 'Request canceled';
  }
  
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    // Handle standard Error objects
    return error.message || defaultMessage;
  } else if (typeof error === 'string') {
    // Handle string errors
    return error;
  } else if (typeof error === 'object' && error !== null) {
    // Handle error objects with message property
    const errorObj = error as { message?: string; error?: string; };
    return errorObj.message || errorObj.error || defaultMessage;
  }
  
  return defaultMessage;
};

// Show error toast with enhanced error handling
export const showErrorWithDetails = (error: unknown, context = 'Operation') => {
  // Skip showing toast for canceled requests
  if (isCanceledError(error)) {
    // Just log at debug level and don't show toast
    console.debug('Request canceled:', context);
    return 'Request canceled';
  }
  
  const message = handleApiError(error, `${context} failed. Please try again.`);
  toast.error(message);
  return message;
};

// Show network error toast
export const showNetworkError = () => {
  const message = 'Network error. Please check your internet connection and try again.';
  toast.error(message);
  return message;
};

export default toast;
