"use client";

import { useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { useRouter } from "next/navigation";

export const AuthHandler = ({
  onConnected,
}: {
  onConnected: (connected: boolean) => void;
}) => {
  const router = useRouter();
  const account = useActiveAccount();

  useEffect(() => {
    if (account) {
      onConnected(true);
      router.push("/app/create-proposal");
    }
  }, [account, router, onConnected]);

  return null;
};
