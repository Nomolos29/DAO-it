import { Address } from "thirdweb";

export enum VoteOption {
  Yes = 0,
  No = 1,
  Abstain = 2,
}

export interface Vote {
  option: VoteOption;
  votes: bigint;
  tokensLocked: bigint;
}

export interface Proposal {
  id: bigint;
  proposer: Address;
  title: string;
  description: string;
  summary: string;
  startDate: bigint;
  endDate: bigint;
  yesVotes: bigint;
  noVotes: bigint;
  abstainVotes: bigint;
}
