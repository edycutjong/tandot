import { POST } from '../route';
import { getFaucetWallet, publicClient } from '@/lib/server/botchain';

// Mock Next.js server components
jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: (body: unknown, init?: { status?: number }) => {
        return {
          status: init?.status ?? 200,
          json: async () => body,
        };
      },
    },
  };
});

// Mock dependencies
jest.mock('@/lib/server/botchain', () => ({
  getFaucetWallet: jest.fn(),
  publicClient: {
    waitForTransactionReceipt: jest.fn(),
  },
}));

jest.mock('viem', () => ({
  isAddress: jest.fn((addr) => addr === '0xVALID'),
  parseUnits: jest.fn((val) => val),
}));

describe('Faucet API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createRequest(body: unknown) {
    return {
      method: 'POST',
      json: async () => body,
    } as unknown as Request;
  }

  it('returns 400 if address is missing', async () => {
    const res = await POST(createRequest({}));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Valid address required');
  });

  it('returns 400 if address is invalid', async () => {
    const res = await POST(createRequest({ address: '0xINVALID' }));
    expect(res.status).toBe(400);
  });

  it('returns 503 if faucet wallet is not configured', async () => {
    (getFaucetWallet as jest.Mock).mockReturnValue(null);
    const res = await POST(createRequest({ address: '0xVALID' }));
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toContain('Faucet not configured');
  });

  it('returns 200 and mints if valid and configured', async () => {
    const mockWriteContract = jest.fn().mockResolvedValue('0xHASH');
    (getFaucetWallet as jest.Mock).mockReturnValue({ writeContract: mockWriteContract });
    (publicClient.waitForTransactionReceipt as jest.Mock).mockResolvedValue({});

    const res = await POST(createRequest({ address: '0xVALID' }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.txHash).toBe('0xHASH');
    expect(data.amount).toBe(1000);
    expect(mockWriteContract).toHaveBeenCalled();
    expect(publicClient.waitForTransactionReceipt).toHaveBeenCalledWith({ hash: '0xHASH' });
  });

  it('returns 429 if called during cooldown', async () => {
    const mockWriteContract = jest.fn().mockResolvedValue('0xHASH');
    (getFaucetWallet as jest.Mock).mockReturnValue({ writeContract: mockWriteContract });
    (publicClient.waitForTransactionReceipt as jest.Mock).mockResolvedValue({});

    // Use a different valid address for this test to avoid collision with previous test
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.mocked(require('viem').isAddress).mockImplementation((addr: string) => addr === '0xVALID2');
    
    // First call
    const res1 = await POST(createRequest({ address: '0xVALID2' }));
    expect(res1.status).toBe(200);

    // Second call immediately
    const res2 = await POST(createRequest({ address: '0xVALID2' }));
    expect(res2.status).toBe(429);
    const data2 = await res2.json();
    expect(data2.error).toContain('Please wait before requesting');
  });

  it('returns 500 on unexpected error', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.mocked(require('viem').isAddress).mockImplementation((addr: string) => addr === '0xVALID3');
    (getFaucetWallet as jest.Mock).mockReturnValue({
      writeContract: jest.fn().mockRejectedValue(new Error('Blockchain error')),
    });

    const res = await POST(createRequest({ address: '0xVALID3' }));
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Blockchain error');
    consoleError.mockRestore();
  });

  it('returns 500 on unexpected error (not an Error instance)', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.mocked(require('viem').isAddress).mockImplementation((addr: string) => addr === '0xVALID4');
    (getFaucetWallet as jest.Mock).mockReturnValue({
      writeContract: jest.fn().mockRejectedValue('String error'),
    });

    const res = await POST(createRequest({ address: '0xVALID4' }));
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Faucet failed');
    consoleError.mockRestore();
  });
});
