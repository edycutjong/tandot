import { POST } from '../tandas/route';
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

describe('Tandas API', () => {
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

  it('returns 400 if valid creator wallet is missing', async () => {
    const mockSupabase = {
      from: jest.fn()
    };
    (createAdminClient as jest.Mock).mockResolvedValue(mockSupabase);

    const request = { json: async () => ({ name: 'Test', contribution_amount: 100, frequency: 'weekly', max_members: 10 }) } as unknown as NextRequest;
    await POST(request);
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Valid creator wallet required' }, { status: 400 });
  });

  it('returns 400 if frequency is invalid', async () => {
    const mockSupabase = { from: jest.fn() };
    (createAdminClient as jest.Mock).mockResolvedValue(mockSupabase);

    const request = { json: async () => ({ name: 'Test', contribution_amount: 100, frequency: 'daily', max_members: 10, creator_wallet: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' }) } as unknown as NextRequest;
    await POST(request);
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Invalid frequency' }, { status: 400 });
  });

  it('returns 201 on success with member creation', async () => {
    const mockTandaInsert = jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: { id: 't1' }, error: null }) }) });
    const mockMemberInsert = jest.fn().mockResolvedValue({ error: null });
    const mockSupabase = {
      from: jest.fn((table) => {
        if (table === 'tandas') return { insert: mockTandaInsert };
        if (table === 'tanda_members') return { insert: mockMemberInsert };
        return { insert: jest.fn() };
      })
    };
    (createAdminClient as jest.Mock).mockResolvedValue(mockSupabase);

    const body = { name: 'Test', contribution_amount: 100, frequency: 'weekly', max_members: 10, creator_wallet: '0x0000000000000000000000000000000000000000' };
    const request = { json: async () => body } as unknown as NextRequest;
    await POST(request);
    
    expect(NextResponse.json).toHaveBeenCalledWith({ success: true, tanda: { id: 't1' } }, { status: 201 });
  });

  it('handles member creation error gracefully', async () => {
    const mockTandaInsert = jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: { id: 't1' }, error: null }) }) });
    const mockMemberInsert = jest.fn().mockResolvedValue({ error: new Error('Member DB Error') });
    const mockSupabase = {
      from: jest.fn((table) => {
        if (table === 'tandas') return { insert: mockTandaInsert };
        if (table === 'tanda_members') return { insert: mockMemberInsert };
        return { insert: jest.fn() };
      })
    };
    (createAdminClient as jest.Mock).mockResolvedValue(mockSupabase);

    const body = { name: 'Test', contribution_amount: 100, frequency: 'weekly', max_members: 10, creator_wallet: '0x0000000000000000000000000000000000000000' };
    const request = { json: async () => body } as unknown as NextRequest;
    await POST(request);
    
    expect(NextResponse.json).toHaveBeenCalledWith({ success: true, tanda: { id: 't1' } }, { status: 201 });
  });

  it('returns 500 on db error', async () => {
    const mockTandaInsert = jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: null, error: new Error('DB Error') }) }) });
    const mockSupabase = {
      from: jest.fn().mockReturnValue({ insert: mockTandaInsert })
    };
    (createAdminClient as jest.Mock).mockResolvedValue(mockSupabase);

    const body = { name: 'Test', contribution_amount: 100, frequency: 'weekly', max_members: 10, creator_wallet: '0x0000000000000000000000000000000000000000' };
    const request = { json: async () => body } as unknown as NextRequest;
    await POST(request);
    
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'DB Error' }, { status: 500 });
  });

  it('returns 500 on non-error object', async () => {
    const mockTandaInsert = jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: null, error: 'String error' }) }) });
    const mockSupabase = {
      from: jest.fn().mockReturnValue({ insert: mockTandaInsert })
    };
    (createAdminClient as jest.Mock).mockResolvedValue(mockSupabase);

    const body = { name: 'Test', contribution_amount: 100, frequency: 'weekly', max_members: 10, creator_wallet: '0x0000000000000000000000000000000000000000' };
    const request = { json: async () => body } as unknown as NextRequest;
    await POST(request);
    
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' }, { status: 500 });
  });
});
