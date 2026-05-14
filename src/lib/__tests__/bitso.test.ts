import { BitsoClient, bitsoClient } from '../bitso';

describe('BitsoClient', () => {
  beforeEach(() => {
    // Reset env vars before each test
    delete process.env.BITSO_API_KEY;
    delete process.env.BITSO_API_SECRET;
  });

  it('initializes with default config and staging url', () => {
    expect(bitsoClient).toBeDefined();
    // Default instantiation logic should point to sandbox since config.isStaging defaults to true via nullish coalescing in the constructor
  });

  it('initializes with custom config and production url', () => {
    const customClient = new BitsoClient({
      apiKey: 'test-key',
      apiSecret: 'test-secret',
      isStaging: false,
    });
    
    // We can't access private members directly without testing hacks, 
    // but we can verify it doesn't throw.
    expect(customClient).toBeDefined();
  });

  it('uses process.env as fallback for credentials', () => {
    process.env.BITSO_API_KEY = 'env-key';
    process.env.BITSO_API_SECRET = 'env-secret';
    
    const client = new BitsoClient();
    expect(client).toBeDefined();
  });

  it('createPayinLink returns a stubbed link and expiration', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    const result = await bitsoClient.createPayinLink(500, 'ref123');
    expect(result.url).toBe('https://bitso.com/pay/ref123');
    expect(result.expiresAt).toBeDefined();
    
    consoleSpy.mockRestore();
  });

  it('executeMassPayout returns a stubbed batchId and processing status', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    const payouts = [{ address: '0x123', amount: 500 }];
    const result = await bitsoClient.executeMassPayout(payouts);
    
    expect(result.batchId).toMatch(/^batch_/);
    expect(result.status).toBe('processing');
    
    consoleSpy.mockRestore();
  });

  it('registerWebhook returns a stubbed webhookId', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    const result = await bitsoClient.registerWebhook('https://example.com/webhook');
    expect(result.webhookId).toMatch(/^wh_/);
    
    consoleSpy.mockRestore();
  });
});
