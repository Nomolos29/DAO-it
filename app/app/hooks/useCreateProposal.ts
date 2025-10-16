import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { daoitContract, tokenContract, PROPOSAL_DEPOSIT } from "../lib/constants";
import { ProposalState } from "../create-proposal/page";
import { toast } from "react-toastify";
import { uploadProposalToIPFS } from "../actions/ipfs-actions";
import type { DAOProposalData } from "../lib/ipfs-service";

export const useCreateProposal = () => {
  const account = useActiveAccount();
  const isPending = false;

  const createProposal = async ({
    id,
    title,
    summary,
    visibility,
    targetLocation: _targetLocation, // eslint-disable-line @typescript-eslint/no-unused-vars
    proposalType,
    proposalContent,
    startDate,
    endDate,
    walletAddress: _walletAddress, // eslint-disable-line @typescript-eslint/no-unused-vars
  }: ProposalState): Promise<void> => {
    try {
      if (!account) throw new Error("No wallet connected");

      // Step 1: Approve DAO contract to transfer PROPOSAL_DEPOSIT tokens
      toast.info("Step 1/3: Approving token spending...");
      const approveTx = prepareContractCall({
        contract: tokenContract,
        method: "function approve(address spender, uint256 amount)",
        params: [
          process.env.NEXT_PUBLIC_DAO_CONTRACT_ADDRESS || "",
          PROPOSAL_DEPOSIT,
        ],
      });

      await sendAndConfirmTransaction({
        account,
        transaction: approveTx,
      });
      toast.success("✅ Token approval confirmed!");

      // Step 2: Submit to blockchain FIRST using the UUID from the form
      toast.info("Step 2/3: Submitting proposal to blockchain...");
      const proposalTx = await prepareContractCall({
        contract: daoitContract,
        method: "function propose(string memory id, string memory title, string memory summary)",
        params: [id, title, summary], // Use UUID from form as the ID!
      });

      await sendAndConfirmTransaction({
        account,
        transaction: proposalTx,
      });
      toast.success("✅ Proposal submitted to blockchain!");

      // Step 3: Only if blockchain succeeds, upload to IPFS with the same UUID
      toast.info("Step 3/3: Uploading full content to IPFS...");
      const proposalData: DAOProposalData = {
        proposalId: id, // Include the UUID in the data!
        proposer: account.address,
        title,
        summary,
        content: proposalContent,
        proposalType,
        visibility,
        createdAt: startDate,
        endDate,
        metadata: {
          version: '1.0.0',
          status: 'active',
        },
      };

      const ipfsResult = await uploadProposalToIPFS(proposalData);

      if (!ipfsResult.success) {
        console.error('IPFS upload failed:', ipfsResult.error);
        toast.error(`Failed to upload to IPFS: ${ipfsResult.error}`);
        throw new Error('IPFS upload failed');
      }

      toast.success("🎉 Proposal created successfully!");

    } catch (err) {
      console.error("Error creating proposal:", err);
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to create proposal: ${errorMsg}`);
      throw err;
    }
  };

  return {
    createProposal,
    isLoading: isPending,
    error: null,
  };
};
