"use client";

import { useEffect, useCallback, memo } from "react";
import { useActiveAccount } from "thirdweb/react";
import { useRouter } from "next/navigation";

export const AuthHandler = memo(({
  onConnected,
}: {
  onConnected: (connected: boolean) => void;
}) => {
  const router = useRouter();
  const account = useActiveAccount();

  // Memoize the connection handler to prevent unnecessary re-renders
  const handleConnection = useCallback(() => {
    if (account) {
      // Check if we're already on the app page to avoid unnecessary navigation
      const isAppPage = window.location.pathname.startsWith('/app');
      onConnected(true);
      
      if (!isAppPage) {
        // Navigate to the app page
        router.push("/app");
      }
    } else {
      onConnected(false);
    }
  }, [account, router, onConnected]);

  useEffect(() => {
    // Use a small timeout to avoid blocking the main thread during initial load
    const timer = setTimeout(() => {
      handleConnection();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [handleConnection]);

  // Add a listener for wallet connection changes
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'walletConnection' || event.key === 'auth_token') {
        handleConnection();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [handleConnection]);

  return null;
});

// Add display name for better debugging
AuthHandler.displayName = 'AuthHandler';
