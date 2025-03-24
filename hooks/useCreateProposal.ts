// import { useContract, useContractWrite } from "@thirdweb-dev/react";
// import { ethers } from "ethers";

// export const useCreateProposal = () => {
//   // Access the DAO contract using the address from environment variables
//   const { contract } = useContract(
//     process.env.NEXT_PUBLIC_DAO_CONTRACT_ADDRESS
//   );

//   // Prepare the contract write function for 'createProposal'
//   const {
//     mutateAsync: createProposal,
//     isLoading,
//     error,
//   } = useContractWrite(
//     contract,
//     "createProposal" 
//   );

//   // Function to execute the proposal creation
//   const executeCreateProposal = async (title: string, description: string) => {
//     if (!contract) {
//       throw new Error("Contract not initialized");
//     }

//     try {
//       const tx = await createProposal({
//         args: [title, description],
//         overrides: {
//           value: ethers.utils.parseEther("0.01"), // Fee of 0.01 ether
//         },
//       });
//       return { success: true, transaction: tx };
//     } catch (err) {
//       console.error("Error creating proposal:", err);
//       return {
//         success: false,
//         error: err instanceof Error ? err.message : "Unknown error",
//       };
//     }
//   };

//   return {
//     createProposal: executeCreateProposal,
//     isLoading,
//     error,
//   };
// };
