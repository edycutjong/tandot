// Minimal ABI for TandaEscrow (deployed on BOT Chain testnet 968).
// Source: contracts/contracts/TandaEscrow.sol
export const TANDA_ESCROW_ABI = [
  {
    type: 'function',
    name: 'deposit',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'tandaId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'tandaBalances',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'userDeposits',
    stateMutability: 'view',
    inputs: [
      { name: '', type: 'address' },
      { name: '', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'paymentToken',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'event',
    name: 'DepositReceived',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'tandaId', type: 'uint256', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
] as const;
