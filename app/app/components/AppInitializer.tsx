"use client";

import { useAutoApproval } from "../hooks/useAutoApproval";
import { useEffect } from "react";

/**
 * Component that handles app initialization tasks like token approval.
 * This runs once when the user logs in.
 */
export const AppInitializer = () => {
  const { isChecking, isApproving, isApproved, error } = useAutoApproval();

  useEffect(() => {
    if (isChecking) {
      console.log("🔄 Checking token approval status...");
    } else if (isApproving) {
      console.log("⏳ Requesting token approval...");
    } else if (isApproved) {
      console.log("✅ Token approval ready");
    } else if (error) {
      console.error("❌ Token approval error:", error);
    }
  }, [isChecking, isApproving, isApproved, error]);

  // This component doesn't render anything, it just handles initialization
  return null;
};
