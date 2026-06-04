const signMessageAsyncMock = jest.fn();
const switchChainAsyncMock = jest.fn();
const writeContractAsyncMock = jest.fn(() => Promise.resolve('0xdeadbeef'));
const waitForTransactionReceiptMock = jest.fn(() => Promise.resolve({ status: 'success' }));
const refetchBalanceMock = jest.fn(() => Promise.resolve({ data: 10n ** 30n }));

module.exports = {
  useSignMessage: jest.fn(() => ({ signMessageAsync: signMessageAsyncMock })),
  signMessageAsyncMock,
  switchChainAsyncMock,
  writeContractAsyncMock,
  waitForTransactionReceiptMock,
  refetchBalanceMock,
  useSwitchChain: jest.fn(() => ({ switchChainAsync: switchChainAsyncMock })),
  useChainId: jest.fn(() => 968), // BOT_CHAIN_ID by default
  useAccount: jest.fn(() => ({ address: '0x123', isConnected: true })),
  useWriteContract: jest.fn(() => ({ writeContractAsync: writeContractAsyncMock })),
  usePublicClient: jest.fn(() => ({ waitForTransactionReceipt: waitForTransactionReceiptMock })),
  // Default: wallet holds plenty of MXNB so the deposit path is enabled.
  useReadContract: jest.fn(() => ({ data: 10n ** 30n, refetch: refetchBalanceMock })),
  useConfig: jest.fn(),
  useWalletClient: jest.fn(() => ({ data: null })),
};
