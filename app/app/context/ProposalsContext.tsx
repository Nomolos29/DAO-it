"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useGetAllProposals } from '../hooks/useGetAllProposals';
import { ProposalState } from '../create-proposal/page';

interface ProposalsContextType {
  proposals: ProposalState[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const ProposalsContext = createContext<ProposalsContextType | undefined>(undefined);

export const ProposalsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const proposalsData = useGetAllProposals();

  const refetch = () => {
    // Force refetch by clearing cache or triggering re-render
    window.location.reload();
  };

  return (
    <ProposalsContext.Provider value={{ ...proposalsData, refetch }}>
      {children}
    </ProposalsContext.Provider>
  );
};

export const useProposalsContext = () => {
  const context = useContext(ProposalsContext);
  if (context === undefined) {
    throw new Error('useProposalsContext must be used within a ProposalsProvider');
  }
  return context;
};
