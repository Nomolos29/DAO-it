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
  id: number;
  title: string;
  description: string;
  summary: string;
  startDate: number;
  endDate: number;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
}

export type ProposalTuple = [
  bigint, // id
  string, // proposer (address as string)
  string, // title
  string, // description
  string, // summary
  bigint, // startDate
  bigint, // endDate
  bigint, // yesVotes
  bigint, // noVotes
  bigint // abstainVotes
];
