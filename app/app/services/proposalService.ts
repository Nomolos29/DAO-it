import apiClient, { cancelAllRequests } from './apiClient';
import { daoitContract } from '../lib/constants';
import { prepareContractCall, sendAndConfirmTransaction } from 'thirdweb';
import { useActiveAccount } from 'thirdweb/react';
import { showErrorWithDetails } from '../utils/toast';
import toast from '../utils/toast';
import { retryTransaction } from '../utils/blockchain';

export interface ProposalData {
  proposalId?: string;  // Optional ID for the proposal
  proposalTitle: string;
  proposalSummary: string;
  proposalDetails: string;
  proposalStatus: 'Public' | 'Private';
  privateStatus: 'Community' | 'Group';
  proposalType: 'Adoption' | 'FundRaiser';
  adoptionOption?: 'Normal' | 'Emmergency';
  fundRaiserOption?: 'Normal' | 'Emmergency';
  endDate: Date;
  images?: File[];
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export const useProposalService = () => {
  const account = useActiveAccount();

  const createProposal = async (data: ProposalData) => {
    if (!account) throw new Error('No wallet connected');

    try {
      // First create on blockchain with retry mechanism
      // Use the correct contract function signature from the ABI
      // We'll use a unique ID for the proposal - either from the data or generate one
      const proposalId = data.proposalId || `proposal_${Date.now()}_${account.address.substring(0, 6)}`;
      
      toast.info("Creating proposal on blockchain...");
      const proposalTx = await prepareContractCall({
        contract: daoitContract,
        method: "function propose(string memory id, string memory title, string memory summary)",
        params: [
          proposalId,
          data.proposalTitle,
          data.proposalSummary,
        ],
      });

      await retryTransaction(() => 
        sendAndConfirmTransaction({
          account,
          transaction: proposalTx,
        })
      );

      // Then create in backend
      const formData = new FormData();
      if (data.images && data.images.length > 0) {
        data.images.forEach(image => {
          formData.append('Images', image);
        });
      }

      // According to the Swagger API specification, we need to send the proposal data as query parameters
      // while still using a POST request with multipart/form-data for images
      const response = await apiClient.post('/Proposal/CreateProposal', formData, {
        params: {
          ProposalTitle: data.proposalTitle,
          ProposalSummary: data.proposalSummary,
          ProposalDetails: data.proposalDetails,
          ProposalStatus: data.proposalStatus,
          PrivateStatus: data.privateStatus,
          ProposalType: data.proposalType,
          AdoptionOption: data.adoptionOption,
          FundRaiserOption: data.fundRaiserOption,
          CreatedAt: new Date().toISOString(),
          EndDate: data.endDate.toISOString(),
          UserId: account.address
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      showErrorWithDetails(error, 'Create Proposal');
      throw error;
    }
  };

  const getAllProposals = async (pagination?: PaginationParams) => {
    try {
      // Cancel any previous getAllProposals requests that might be pending
      cancelAllRequests();
      
      // Add pagination parameters if provided
      const params: Record<string, string | number> = {};
      
      if (pagination) {
        if (pagination.page !== undefined) params.page = pagination.page;
        if (pagination.pageSize !== undefined) params.pageSize = pagination.pageSize;
        if (pagination.sortBy) params.sortBy = pagination.sortBy;
        if (pagination.sortDirection) params.sortDirection = pagination.sortDirection;
      }
      
      // Default to page 1 with 10 items if not specified
      if (params.page === undefined) params.page = 1;
      if (params.pageSize === undefined) params.pageSize = 10;
      
      const response = await apiClient.get('/Proposal/GetAllProposals', { 
        params,
        // Add a specific timeout for this heavy request
        timeout: 45000 // 45 seconds for this specific endpoint
      });
      
      return response.data;
    } catch (error) {
      showErrorWithDetails(error, 'Get Proposals');
      throw error;
    }
  };

  const getProposal = async (proposalId: string) => {
    try {
      const response = await apiClient.get(`/Proposal/GetProposal/${proposalId}`);
      return response.data;
    } catch (error) {
      showErrorWithDetails(error, `Get Proposal ${proposalId}`);
      throw error;
    }
  };

  const updateProposal = async (proposalId: string, data: Partial<ProposalData>) => {
    try {
      const formData = new FormData();
      if (data.images && data.images.length > 0) {
        data.images.forEach(image => {
          formData.append('Images', image);
        });
      }

      // According to the Swagger API specification, we need to send the proposal data as query parameters
      // while still using a PUT request with multipart/form-data for images
      const params: Record<string, string> = {};
      if (data.proposalTitle) params.ProposalTitle = data.proposalTitle;
      if (data.proposalSummary) params.ProposalSummary = data.proposalSummary;
      if (data.proposalDetails) params.ProposalDetails = data.proposalDetails;
      if (data.proposalStatus) params.ProposalStatus = data.proposalStatus;
      if (data.privateStatus) params.PrivateStatus = data.privateStatus;
      if (data.proposalType) params.ProposalType = data.proposalType;
      if (data.adoptionOption) params.AdoptionOption = data.adoptionOption;
      if (data.fundRaiserOption) params.FundRaiserOption = data.fundRaiserOption;
      if (data.endDate) params.EndDate = data.endDate.toISOString();
      if (account?.address) params.UserId = account.address;

      const response = await apiClient.put(`/Proposal/UpdateProposal/${proposalId}`, formData, {
        params,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      showErrorWithDetails(error, `Update Proposal ${proposalId}`);
      throw error;
    }
  };

  const deleteProposal = async (proposalId: string) => {
    try {
      const response = await apiClient.delete(`/Proposal/DeleteProposal/${proposalId}`);
      return response.data;
    } catch (error) {
      showErrorWithDetails(error, `Delete Proposal ${proposalId}`);
      throw error;
    }
  };

  const reactToProposal = async (proposalId: string, isLike: boolean) => {
    if (!account) throw new Error('No wallet connected');

    try {
      const response = await apiClient.post('/proposal/ProposalReaction/react', {
        proposalId,
        userId: account.address,
        isLike
      });

      return response.data;
    } catch (error) {
      showErrorWithDetails(error, `React to Proposal ${proposalId}`);
      throw error;
    }
  };

  return {
    createProposal,
    getAllProposals,
    getProposal,
    updateProposal,
    deleteProposal,
    reactToProposal
  };
};
