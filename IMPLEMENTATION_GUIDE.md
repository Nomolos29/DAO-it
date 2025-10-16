# IPFS Implementation Guide

## Setup

1. **Install Pinata SDK**
```bash
npm install pinata
```

2. **Environment Variables**
Update `.env`:
```env
NEXT_PUBLIC_PINATA_SECRET_JWT_KEY=eyJhbGci...
NEXT_PUBLIC_PINATA_GATEWAY=gateway.pinata.cloud
```

3. **Initialize Groups**
Run once to set up file groups:
```typescript
import { getIPFSService } from '@/app/lib/ipfs-service';

const ipfs = getIPFSService();
await ipfs.init();
```

---

## Key Concept: CID as ID

**The IPFS CID becomes the proposal ID used on-chain.**

### Before (Backend-based):
```
1. Generate UUID
2. Submit to backend
3. Use UUID in blockchain
```

### After (IPFS-based):
```
1. Upload to IPFS → get CID
2. Use CID directly as proposal ID in blockchain
3. No backend needed
```

---

## Implementation Examples

### 1. User Registration

**File:** `app/app/hooks/useRegister.ts`

```typescript
import { getIPFSService } from '../lib/ipfs-service';
import type { DAOUserData } from '../lib/ipfs-service';

export const useRegister = () => {
  const ipfs = getIPFSService();

  return useMutation({
    mutationFn: async () => {
      // ... wallet connection code ...

      // Upload user data to IPFS
      const userData: DAOUserData = {
        walletAddress: currentAccount.address,
        profile: {},
        activity: {
          proposalsCreated: [],
          votesCount: 0,
          commentsCount: 0,
          joinedAt: Date.now(),
        },
        metadata: {
          version: '1.0.0',
          lastUpdated: Date.now(),
        },
      };

      const userCID = await ipfs.uploadUser(userData);

      // Store CID in localStorage
      localStorage.setItem('userCID', userCID);
      localStorage.setItem('wallet', currentAccount.address);

      router.push('/app');
      return { userCID };
    },
  });
};
```

### 2. User Login

**File:** `app/app/hooks/useLogin.ts`

```typescript
export const useLogin = () => {
  const ipfs = getIPFSService();

  return useMutation({
    mutationFn: async () => {
      if (!account) throw new Error("Wallet not connected");

      // Fetch user from IPFS
      const userData = await ipfs.getUser(account.address);

      if (!userData) {
        throw new Error("User not found. Please register first.");
      }

      // Store in localStorage
      localStorage.setItem('wallet', account.address);
      localStorage.setItem('user', JSON.stringify(userData));

      return { userData };
    }
  });
};
```

### 3. Create Proposal

**File:** `app/app/hooks/useCreateProposal.ts`

```typescript
import { getIPFSService } from '../lib/ipfs-service';
import type { DAOProposalData } from '../lib/ipfs-service';

export const useCreateProposal = () => {
  const account = useActiveAccount();
  const ipfs = getIPFSService();

  const createProposal = async (data: ProposalState) => {
    if (!account) throw new Error("No wallet connected");

    // 1. Prepare proposal data
    const proposalData: DAOProposalData = {
      proposer: account.address,
      title: data.title,
      summary: data.summary,
      content: data.proposalContent, // Full markdown content
      proposalType: data.proposalType,
      visibility: data.visibility,
      createdAt: data.startDate,
      endDate: data.endDate,
      metadata: {
        version: '1.0.0',
        status: 'active',
      },
    };

    // 2. Upload to IPFS - CID becomes the ID
    const proposalCID = await ipfs.uploadProposal(proposalData);

    // 3. Approve tokens
    const approveTx = prepareContractCall({
      contract: tokenContract,
      method: "function approve(address spender, uint256 amount)",
      params: [
        process.env.NEXT_PUBLIC_DAO_CONTRACT_ADDRESS || "",
        PROPOSAL_DEPOSIT,
      ],
    });

    await sendAndConfirmTransaction({ account, transaction: approveTx });

    // 4. Submit to blockchain using CID as ID
    const proposalTx = await prepareContractCall({
      contract: daoitContract,
      method: "function propose(string memory id, string memory title, string memory summary)",
      params: [proposalCID, data.title, data.summary], // CID is the ID!
    });

    await sendAndConfirmTransaction({ account, transaction: proposalTx });

    toast.success("Proposal created!");
  };

  return { createProposal };
};
```

### 4. Get All Proposals

**File:** `app/app/hooks/useGetAllProposals.ts`

```typescript
import { getIPFSService } from '../lib/ipfs-service';

export const useGetAllProposals = () => {
  const ipfs = getIPFSService();
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        // Fetch from IPFS
        const ipfsProposals = await ipfs.listProposals('active');
        setProposals(ipfsProposals);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching proposals:', err);
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, []);

  return { proposals, isLoading };
};
```

### 5. Get Single Proposal

**File:** `app/app/hooks/useGetProposal.ts`

```typescript
export async function fetchProposalById(proposalCID: string) {
  const ipfs = getIPFSService();

  try {
    const proposalData = await ipfs.getProposal(proposalCID);
    const comments = await ipfs.getCommentsByProposal(proposalCID);

    return {
      proposalData,
      proposalComments: comments,
      error: null,
    };
  } catch (error) {
    return {
      proposalData: null,
      proposalComments: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}
```

### 6. Post Comment

**File:** `app/app/components/PostComment.tsx`

```typescript
import { getIPFSService } from '../lib/ipfs-service';
import type { DAOCommentData } from '../lib/ipfs-service';
import { v4 as uuidv4 } from 'uuid';

const postComment = async (proposalCID: string, text: string) => {
  const ipfs = getIPFSService();
  const wallet = localStorage.getItem('wallet');

  if (!wallet) throw new Error('Not logged in');

  const commentData: DAOCommentData = {
    commentId: uuidv4(),
    proposalCID,
    author: wallet,
    text,
    createdAt: Date.now(),
    reactions: {
      likes: 0,
      dislikes: 0,
    },
  };

  const commentCID = await ipfs.uploadComment(commentData);
  console.log('Comment posted:', commentCID);
};
```

### 7. Sentiment Analysis

**File:** `app/app/services/sentimentAnalysis.ts`

```typescript
import { getIPFSService } from '../lib/ipfs-service';
import type { DAOSentimentData } from '../lib/ipfs-service';

export async function analyzeSentiment(
  proposalCID: string,
  proposalTitle: string,
  proposalSummary: string,
  proposalDescription: string
): Promise<void> {
  const ipfs = getIPFSService();

  // Generate analysis with OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Analyze DAO proposal sentiment..." },
      { role: "user", content: `Analyze: ${proposalTitle}...` }
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(completion.choices[0].message.content);

  // Upload to IPFS
  const sentimentData: DAOSentimentData = {
    proposalCID,
    overallSentiment: result.overallSentiment,
    sentimentScore: result.sentimentScore,
    breakdown: result.breakdown,
    keyThemes: result.keyThemes,
    insights: result.insights,
    generatedAt: Date.now(),
  };

  const sentimentCID = await ipfs.uploadSentiment(sentimentData);
  console.log('Sentiment uploaded:', sentimentCID);
}
```

### 8. Upload Avatar

**File:** `app/app/components/ProfileSettings.tsx`

```typescript
const uploadAvatar = async (file: File) => {
  const ipfs = getIPFSService();
  const wallet = localStorage.getItem('wallet');

  if (!wallet) throw new Error('Not logged in');

  // 1. Upload file to IPFS
  const { cid, url } = await ipfs.uploadFile(file, 'avatar');

  // 2. Get current user data
  const userData = await ipfs.getUser(wallet);

  if (!userData) throw new Error('User not found');

  // 3. Update user data with new avatar
  userData.profile.avatar = { cid, url };
  userData.metadata.lastUpdated = Date.now();

  // 4. Re-upload updated user data
  const newUserCID = await ipfs.uploadUser(userData);

  console.log('Avatar updated:', newUserCID);
};
```

---

## Smart Contract Update

**Current contract expects:**
```solidity
function propose(string id, string title, string summary)
```

**No changes needed!** Just pass the IPFS CID as the `id` parameter:
```typescript
params: [proposalCID, title, summary]
```

The CID is already a string, so it works perfectly.

---

## Data Migration

Since you're starting fresh (no backend to migrate from), just:

1. Remove all `apiFetch` calls
2. Replace with `ipfs.upload*()` and `ipfs.get*()` calls
3. Delete `app/app/lib/apiFetch.ts` when done

---

## Caching Strategy

Use React Query for automatic caching:

```typescript
import { useQuery } from '@tanstack/react-query';

export const useProposal = (cid: string) => {
  const ipfs = getIPFSService();

  return useQuery({
    queryKey: ['proposal', cid],
    queryFn: () => ipfs.getProposal(cid),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

---

## Testing

```typescript
// Test IPFS connection
const ipfs = getIPFSService();
await ipfs.testConnection();

// Initialize groups
await ipfs.init();

// Test upload
const testProposal = {
  proposer: '0x123...',
  title: 'Test Proposal',
  summary: 'Testing IPFS',
  content: 'Full content here',
  proposalType: 'governance',
  visibility: 'public',
  createdAt: new Date().toISOString(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  metadata: { version: '1.0.0', status: 'active' },
};

const cid = await ipfs.uploadProposal(testProposal);
console.log('Test proposal CID:', cid);

// Fetch it back
const fetched = await ipfs.getProposal(cid);
console.log('Fetched:', fetched);
```

---

## Summary

**What changes:**
- `apiFetch()` → `ipfs.upload*()` or `ipfs.get*()`
- Backend-generated IDs → IPFS CIDs
- Centralized storage → Decentralized IPFS

**What stays the same:**
- Smart contract interface (CID is just a string)
- UI components
- Wallet authentication
- Voting logic

**Result:**
Fully decentralized DAO with no backend dependency.
