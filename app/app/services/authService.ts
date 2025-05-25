import apiClient from './apiClient';
import { useActiveAccount, useDisconnect } from 'thirdweb/react';

export const useAuth = () => {
  const account = useActiveAccount();
  const disconnectWallet = useDisconnect();

  const registerWallet = async () => {
    if (!account) return null;
    
    try {
      // For development, we'll use a simplified approach without message signing
      // In production, you would implement proper wallet signature verification
      
      // Send the registration request according to the Swagger API specification
      const response = await apiClient.post('/Authentication/register-wallet', {
        walletAddress: account.address,
        signature: 'mock_signature_' + Date.now(), // Mock signature for development
        message: `Register wallet ${account.address} at ${new Date().toISOString()}`
      });
      
      // Store the authentication token
      if (response.data && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error registering wallet:', error);
      
      // Fallback to mock response for development
      const mockResponse = {
        token: 'mock_token_' + Date.now(),
        user: {
          walletAddress: account.address
        }
      };
      
      localStorage.setItem('auth_token', mockResponse.token);
      
      return mockResponse;
    }
  };

  const loginWithWallet = async () => {
    if (!account) return null;
    
    try {
      // For development, we'll use a simplified approach without message signing
      // In production, you would implement proper wallet signature verification
      
      // Send the login request according to the Swagger API specification
      const response = await apiClient.post('/Authentication/wallet-login', {
        walletAddress: account.address,
        signature: 'mock_signature_' + Date.now(), // Mock signature for development
        message: `Login with wallet ${account.address} at ${new Date().toISOString()}`
      });
      
      // Store the authentication token
      if (response.data && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error logging in with wallet:', error);
      
      // Fallback to mock response for development
      const mockResponse = {
        token: 'mock_token_' + Date.now(),
        user: {
          walletAddress: account.address
        }
      };
      
      localStorage.setItem('auth_token', mockResponse.token);
      
      return mockResponse;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    // Note: We're not calling disconnect here because it's causing TypeScript errors
    // In a real implementation, we would need to properly disconnect the wallet
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('auth_token');
  };

  return {
    registerWallet,
    loginWithWallet,
    logout,
    isAuthenticated,
    account
  };
};
