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

export interface CommentProps {
  postID: number | string;
  username: string;
  profilePic?: string;
  comment: string;
  postBy?: string;
  postDetailsPage?: boolean;
  commentCreationDate: Date | number;
  postStatus?: "active" | "pending" | "ended";
  postVotes?: number;
  postComments: number;
  commentLikes: number;
  commentDislikes: number;
}

export interface ProposalCommentsProps extends PostCommentProps {
  comments: PostCommentModalProps[];
}

export interface PostCommentProps {
  proposalId: number | string;
}

export interface PostCommentModalProps extends PostCommentProps {
  commentId: number | string,
  commentText: null,
  createdAt: Date,
  userId: number | string,
}

export interface Proposal {
  id: number | string;
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

export type YourUserType = {
  id: string;
  name: string;
  walletAddress: string;
  // Add any other properties here
};