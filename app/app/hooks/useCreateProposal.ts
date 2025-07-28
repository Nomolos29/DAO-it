import { useActiveAccount } from "thirdweb/react";
import {
  prepareContractCall,
  sendAndConfirmTransaction,
} from "thirdweb";
import { daoitContract, tokenContract, PROPOSAL_DEPOSIT } from "../lib/constants";
import { apiFetch } from "../lib/apiFetch";
import { ProposalState } from "../create-proposal/page";

export const useCreateProposal = () => {
  const account = useActiveAccount();
  const isPending = false;

  const createProposal = async ({
    id,
    title,
    summary,
    visibility,
    targetLocation,
    proposalType,
    proposalContent,
    startDate,
    endDate,
    // destinationAddress,
    walletAddress,
  }: ProposalState): Promise<void> => {
    try {
      if (!account) throw new Error("No wallet connected");

      // Step 1: Approve DAO contract to transfer PROPOSAL_DEPOSIT tokens on user's behalf
      const approveTx = await prepareContractCall({
        contract: tokenContract,
        method: "function approve(address spender, uint256 amount)",
        params: [
          process.env.NEXT_PUBLIC_DAO_CONTRACT_ADDRESS || "", // DAO contract needs approval
          PROPOSAL_DEPOSIT,      // amount to approve
        ],
      });

      await sendAndConfirmTransaction({
        account,
        transaction: approveTx,
      });

      // Step 2: Call propose() on DAO contract
      const proposalTx = await prepareContractCall({
        contract: daoitContract,
        method:
          "function propose(string memory id, string memory title, string memory summary)",
        params: [id, title, summary],
      });

      await sendAndConfirmTransaction({
        account,
        transaction: proposalTx,
      });

       // Step 3: Prepare FormData for backend
      const formData = new FormData();
      formData.append("ProposalId", id);
      formData.append("ProposalTitle", title);
      formData.append("ProposalSummary", summary);
      formData.append("ProposalDetails", proposalContent);
      formData.append("ProposalStatus", visibility);
      formData.append("PrivateStatus", targetLocation);
      formData.append("ProposalType", proposalType);
      formData.append("CreatedAt", startDate);
      formData.append("EndDate", endDate);
      formData.append("UserId", walletAddress);

      // ✅ Step 4: Get access and refresh tokens from localStorage
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        throw new Error("Missing authentication tokens");
      }

      // ✅ Step 5: Send API request with Authorization headers
      const response = await apiFetch("/Proposal/CreateProposal", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      }) as Response;

      if (!response.ok) {
        const data = await response.json();
        console.error("API Error:", data);
        throw new Error(`API Error: ${data.message || response.statusText}`);
      }


    } catch (err) {
      console.error("Error creating proposal:", err);
      throw err;
    }
  };

  return {
    createProposal,
    isLoading: isPending,
    error: null,
  };
};
