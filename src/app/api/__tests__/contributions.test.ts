import { POST } from '../contributions/route';
import { NextResponse, NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({ body, init }))
  }
}));

jest.mock('@/lib/supabase/server', () => ({
  createAdminClient: jest.fn()
}));

describe('Contributions API', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('returns 400 if required fields are missing', async () => {
    const mockSupabase = {
      from: jest.fn()
    };
    (createAdminClient as jest.Mock).mockResolvedValue(mockSupabase);

    const request = { json: async () => ({}) } as unknown as NextRequest;
    await POST(request);
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Missing required fields' }, { status: 400 });
  });

  it('returns 201 on success', async () => {
    const mockInsert = jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null }) }) });
    const mockSupabase = {
      from: jest.fn().mockReturnValue({ insert: mockInsert })
    };
    (createAdminClient as jest.Mock).mockResolvedValue(mockSupabase);

    const body = { tanda_id: 't1', member_id: 'm1', round: 1, amount: 100, botchain_tx_hash: '0xabc' };
    const request = { json: async () => body } as unknown as NextRequest;
    await POST(request);
    
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ status: 'confirmed' }));
    expect(NextResponse.json).toHaveBeenCalledWith({ success: true, contribution: { id: 1 } }, { status: 201 });
  });

  it('returns 500 on db error', async () => {
    const mockInsert = jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: null, error: new Error('DB Error') }) }) });
    const mockSupabase = {
      from: jest.fn().mockReturnValue({ insert: mockInsert })
    };
    (createAdminClient as jest.Mock).mockResolvedValue(mockSupabase);

    const body = { tanda_id: 't1', member_id: 'm1', round: 1, amount: 100 };
    const request = { json: async () => body } as unknown as NextRequest;
    await POST(request);
    
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'DB Error' }, { status: 500 });
  });

  it('returns 500 on non-error object', async () => {
    const mockInsert = jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: null, error: 'String error' }) }) });
    const mockSupabase = {
      from: jest.fn().mockReturnValue({ insert: mockInsert })
    };
    (createAdminClient as jest.Mock).mockResolvedValue(mockSupabase);

    const body = { tanda_id: 't1', member_id: 'm1', round: 1, amount: 100 };
    const request = { json: async () => body } as unknown as NextRequest;
    await POST(request);
    
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' }, { status: 500 });
  });
});
