import { useState, useEffect } from 'react';
import { useActiveAccount, useReadContract } from 'thirdweb/react';
import { tokenContract } from '../lib/constants';
import { formatUnits } from 'ethers';

/**
 * Hook to get DAOit token balance for the connected wallet
 * Returns balance in both raw (BigInt) and formatted (string) forms
 */
export const useTokenBalance = () => {
  const account = useActiveAccount();
  const [formattedBalance, setFormattedBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);

  // Read balance from token contract
  const { data: rawBalance, isLoading: isBalanceLoading, refetch } = useReadContract({
    contract: tokenContract,
    method: 'function balanceOf(address account) view returns (uint256)',
    params: account?.address ? [account.address] : ["0x0000000000000000000000000000000000000000"],
  });

  useEffect(() => {
    if (!account) {
      setFormattedBalance('0');
      setIsLoading(false);
      return;
    }

    if (!isBalanceLoading && rawBalance !== undefined) {
      try {
        // Format from 18 decimals to human-readable format
        const formatted = formatUnits(rawBalance.toString(), 18);
        setFormattedBalance(parseFloat(formatted).toFixed(2));
        setIsLoading(false);
      } catch (error) {
        console.error('Error formatting balance:', error);
        setFormattedBalance('0');
        setIsLoading(false);
      }
    }
  }, [rawBalance, isBalanceLoading, account]);

  return {
    balance: rawBalance || BigInt(0),
    formattedBalance,
    isLoading: isLoading || isBalanceLoading,
    refetch,
    hasBalance: rawBalance ? rawBalance > BigInt(0) : false,
  };
};
