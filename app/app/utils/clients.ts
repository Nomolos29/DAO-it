import { createThirdwebClient } from "thirdweb";

export const client = createThirdwebClient({
  clientId: process.env.THIRDWEB_CLIENT_ID || "defaultClientId",
  secretKey:
    process.env.VITE_NEXT_PUBLIC_THIRDWEB_SECRET_KEY || "defaultSecretKey",
});
