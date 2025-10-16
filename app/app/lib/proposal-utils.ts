/**
 * Utility functions for proposal status calculation
 *
 * Status rules:
 * - PENDING: First 7 days after creation
 * - ACTIVE (Live): Days 8-14 (or 8-21 depending on config)
 * - CLOSED: After end date
 */

export type ProposalStatus = 'pending' | 'active' | 'closed';

export interface ProposalDates {
  createdAt: string | number;
  endDate: string | number;
}

export interface ProposalStatusInfo {
  status: ProposalStatus;
  daysRemaining: number;
  daysTotal: number;
  daysSinceCreation: number;
  isPending: boolean;
  isActive: boolean;
  isClosed: boolean;
  pendingEndsAt: Date;
  votingEndsAt: Date;
}

const PENDING_DURATION_DAYS = 7; // First 7 days is pending

/**
 * Calculate the current status of a proposal based on dates
 */
export function calculateProposalStatus(
  createdAt: string | number,
  endDate: string | number
): ProposalStatusInfo {
  const now = Date.now();
  const createdTimestamp = typeof createdAt === 'string' ? new Date(createdAt).getTime() : createdAt;
  const endTimestamp = typeof endDate === 'string' ? new Date(endDate).getTime() : endDate;

  // Calculate days since creation
  const millisecondsSinceCreation = now - createdTimestamp;
  const daysSinceCreation = Math.floor(millisecondsSinceCreation / (1000 * 60 * 60 * 24));

  // Pending period ends after PENDING_DURATION_DAYS
  const pendingEndsAt = new Date(createdTimestamp + (PENDING_DURATION_DAYS * 24 * 60 * 60 * 1000));
  const votingEndsAt = new Date(endTimestamp);

  // Calculate total duration
  const totalDuration = Math.floor((endTimestamp - createdTimestamp) / (1000 * 60 * 60 * 24));

  // Determine status
  let status: ProposalStatus;
  let daysRemaining: number;

  if (daysSinceCreation < PENDING_DURATION_DAYS) {
    // Still in pending period
    status = 'pending';
    daysRemaining = PENDING_DURATION_DAYS - daysSinceCreation;
  } else if (now < endTimestamp) {
    // Pending period over, voting is active
    status = 'active';
    daysRemaining = Math.ceil((endTimestamp - now) / (1000 * 60 * 60 * 24));
  } else {
    // Voting period ended
    status = 'closed';
    daysRemaining = 0;
  }

  return {
    status,
    daysRemaining,
    daysTotal: totalDuration,
    daysSinceCreation,
    isPending: status === 'pending',
    isActive: status === 'active',
    isClosed: status === 'closed',
    pendingEndsAt,
    votingEndsAt,
  };
}

/**
 * Get a human-readable status label
 */
export function getStatusLabel(statusInfo: ProposalStatusInfo): string {
  if (statusInfo.isPending) {
    return `Pending (${statusInfo.daysRemaining} days left)`;
  } else if (statusInfo.isActive) {
    return `Active (${statusInfo.daysRemaining} days left)`;
  } else {
    return 'Closed';
  }
}

/**
 * Get status color for UI
 */
export function getStatusColor(status: ProposalStatus): string {
  switch (status) {
    case 'pending':
      return 'orange';
    case 'active':
      return 'green';
    case 'closed':
      return 'gray';
    default:
      return 'gray';
  }
}

/**
 * Get status badge color classes for Tailwind
 */
export function getStatusBadgeClasses(status: ProposalStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'active':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'closed':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

/**
 * Check if voting is allowed (only during active period)
 */
export function canVote(statusInfo: ProposalStatusInfo): boolean {
  return statusInfo.isActive;
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | number | Date): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | number | Date): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
