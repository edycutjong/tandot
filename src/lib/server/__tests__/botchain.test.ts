import { getFaucetWallet, publicClient, botChain } from '../botchain';
import * as viemAccounts from 'viem/accounts';

jest.mock('viem/accounts', () => ({
  privateKeyToAccount: jest.fn().mockReturnValue({ address: '0x123' }),
}));

jest.mock('viem', () => ({
  createPublicClient: jest.fn().mockReturnValue({}),
  createWalletClient: jest.fn().mockImplementation((config) => ({ account: config.account })),
  defineChain: jest.fn().mockReturnValue({ id: 1 }),
  http: jest.fn(),
}));

describe('botchain server utils', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('exports publicClient and botChain', () => {
    expect(publicClient).toBeDefined();
    expect(botChain).toBeDefined();
  });

  it('returns null if FAUCET_PRIVATE_KEY is not set', () => {
    delete process.env.FAUCET_PRIVATE_KEY;
    expect(getFaucetWallet()).toBeNull();
  });

  it('creates wallet client when key without 0x is provided', () => {
    process.env.FAUCET_PRIVATE_KEY = 'abcdef123456';
    const wallet = getFaucetWallet();
    expect(viemAccounts.privateKeyToAccount).toHaveBeenCalledWith('0xabcdef123456');
    expect(wallet).toBeDefined();
  });

  it('creates wallet client when key with 0x is provided', () => {
    process.env.FAUCET_PRIVATE_KEY = '0xabcdef123456';
    const wallet = getFaucetWallet();
    expect(viemAccounts.privateKeyToAccount).toHaveBeenCalledWith('0xabcdef123456');
    expect(wallet).toBeDefined();
  });
});
