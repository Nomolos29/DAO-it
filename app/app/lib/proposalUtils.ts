/**
 * Proposal timing constants
 * PENDING: 7 days from creation
 * ACTIVE: 14 days after pending period
 * ENDED: After active period ends
 */
export const PENDING_DURATION_DAYS = 7;
export const ACTIVE_DURATION_DAYS = 14;
export const TOTAL_PROPOSAL_DURATION_DAYS = PENDING_DURATION_DAYS + ACTIVE_DURATION_DAYS; // 21 days

export type ProposalStatus = "pending" | "active" | "ended";

export interface ProposalStatusInfo {
  status: ProposalStatus;
  daysRemaining: number;
  message: string;
}

/**
 * Calculate proposal status based on creation date
 * @param creationDate - Date when proposal was created
 * @returns ProposalStatusInfo with current status, days remaining, and message
 */
export function getProposalStatus(creationDate: Date | string | number): ProposalStatusInfo {
  const now = Date.now();
  const createdTimestamp = typeof creationDate === 'string' ? new Date(creationDate).getTime() :
                           typeof creationDate === 'number' ? creationDate :
                           creationDate.getTime();

  // Calculate days since creation
  const millisecondsSinceCreation = now - createdTimestamp;
  const daysSinceCreation = Math.floor(millisecondsSinceCreation / (1000 * 60 * 60 * 24));

  // Calculate end timestamp (21 days from creation)
  const endTimestamp = createdTimestamp + (TOTAL_PROPOSAL_DURATION_DAYS * 24 * 60 * 60 * 1000);

  // Determine status
  if (daysSinceCreation < PENDING_DURATION_DAYS) {
    // Still in pending period (days 0-6, becomes active on day 7)
    const daysUntilActive = PENDING_DURATION_DAYS - daysSinceCreation;
    return {
      status: "pending",
      daysRemaining: daysUntilActive,
      message: `Becomes active in ${daysUntilActive} ${daysUntilActive === 1 ? 'day' : 'days'}`,
    };
  } else if (now < endTimestamp) {
    // Pending period over, voting is active (days 7-20)
    const daysUntilEnd = Math.ceil((endTimestamp - now) / (1000 * 60 * 60 * 24));
    return {
      status: "active",
      daysRemaining: daysUntilEnd,
      message: `Ends in ${daysUntilEnd} ${daysUntilEnd === 1 ? 'day' : 'days'}`,
    };
  } else {
    // Voting has ended
    return {
      status: "ended",
      daysRemaining: 0,
      message: "Voting ended",
    };
  }
}

/**
 * Check if a proposal is currently in the active voting period
 * @param creationDate - Date when proposal was created
 * @returns true if proposal is active, false otherwise
 */
export function isProposalActive(creationDate: Date | string | number): boolean {
  const { status } = getProposalStatus(creationDate);
  return status === "active";
}

/**
 * Check if a proposal is currently in the pending period
 * @param creationDate - Date when proposal was created
 * @returns true if proposal is pending, false otherwise
 */
export function isProposalPending(creationDate: Date | string | number): boolean {
  const { status } = getProposalStatus(creationDate);
  return status === "pending";
}

/**
 * Get the end date for a proposal
 * @param creationDate - Date when proposal was created
 * @returns Date when proposal voting ends
 */
export function getProposalEndDate(creationDate: Date | string | number): Date {
  const created = new Date(creationDate);
  const endDate = new Date(created);
  endDate.setDate(created.getDate() + TOTAL_PROPOSAL_DURATION_DAYS);
  return endDate;
}
