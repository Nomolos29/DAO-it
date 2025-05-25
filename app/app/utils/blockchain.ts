import toast from './toast';

/**
 * Retry a blockchain transaction with exponential backoff
 * @param fn Function that returns a Promise for the transaction
 * @param maxRetries Maximum number of retry attempts
 * @returns Result of the successful transaction
 * @throws Last error encountered if all retries fail
 */
export const retryTransaction = async (fn: () => Promise<any>, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      toast.info(`Submitting blockchain transaction (attempt ${attempt}/${maxRetries})...`);
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a timeout error or network error
      const isTimeoutError = 
        error.message?.includes('timeout') || 
        error.message?.includes('timed out') ||
        error.message?.includes('ERR_TIMED_OUT') ||
        error.message?.includes('network error');
      
      if (!isTimeoutError || attempt === maxRetries) {
        throw error;
      }
      
      // Calculate backoff time: 2^attempt * 1000ms (1s, 2s, 4s, etc.)
      const backoffTime = Math.min(2 ** attempt * 1000, 10000); // Cap at 10 seconds
      toast.info(`Transaction attempt ${attempt} failed. Retrying in ${backoffTime/1000} seconds...`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }
  
  throw lastError;
};
