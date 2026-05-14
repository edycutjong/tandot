import { POST } from '../tandas/route';
import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({ body, init }))
  }
}));

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn()
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


  it('returns 401 if unauthorized', async () => {
    const mockSupabase = {
      auth: { getSession: jest.fn().mockResolvedValue({ data: { session: null } }) }
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    const request = { json: async () => ({}) } as unknown as NextRequest;
    await POST(request);
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' }, { status: 401 });
  });

  it('returns 400 if required fields are missing', async () => {
    const mockSupabase = {
      auth: { getSession: jest.fn().mockResolvedValue({ data: { session: {} } }) }
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    const request = { json: async () => ({}) } as unknown as NextRequest;
    await POST(request);
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Missing required fields' }, { status: 400 });
  });

  it('returns 201 on success with member creation', async () => {
    const mockTandaInsert = jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: { id: 't1' }, error: null }) }) });
    const mockMemberInsert = jest.fn().mockResolvedValue({ error: null });
    
    const mockSupabase = {
      auth: { getSession: jest.fn().mockResolvedValue({ data: { session: { user: { id: 'u1', email: 'test@example.com' } } } }) },
      from: jest.fn().mockImplementation((table) => {
        if (table === 'tandas') return { insert: mockTandaInsert };
        if (table === 'tanda_members') return { insert: mockMemberInsert };
      })
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    const body = { name: 'n', description: 'd', contribution_amount: 100, frequency: 'weekly', max_members: 10, total_rounds: 10 };
    const request = { json: async () => body } as unknown as NextRequest;
    await POST(request);
    
    expect(NextResponse.json).toHaveBeenCalledWith({ success: true, tanda: { id: 't1' } }, { status: 201 });
  });

  it('handles member creation error gracefully', async () => {
    const mockTandaInsert = jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: { id: 't1' }, error: null }) }) });
    const mockMemberInsert = jest.fn().mockResolvedValue({ error: new Error('Member DB Error') });
    
    const mockSupabase = {

      auth: { getSession: jest.fn().mockResolvedValue({ data: { session: { user: { id: 'u1' } } } }) },
      from: jest.fn().mockImplementation((table) => {
        if (table === 'tandas') return { insert: mockTandaInsert };
        if (table === 'tanda_members') return { insert: mockMemberInsert };
      })
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    const body = { name: 'n', description: 'd', contribution_amount: 100, frequency: 'weekly', max_members: 10, total_rounds: 10 };
    const request = { json: async () => body } as unknown as NextRequest;
    await POST(request);
    
    expect(NextResponse.json).toHaveBeenCalledWith({ success: true, tanda: { id: 't1' } }, { status: 201 });
  });


  it('returns 500 on db error', async () => {
    const mockTandaInsert = jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: null, error: new Error('DB Error') }) }) });
    
    const mockSupabase = {
      auth: { getSession: jest.fn().mockResolvedValue({ data: { session: { user: { id: 'u1' } } } }) },
      from: jest.fn().mockReturnValue({ insert: mockTandaInsert })
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    const body = { name: 'n', description: 'd', contribution_amount: 100, frequency: 'weekly', max_members: 10, total_rounds: 10 };
    const request = { json: async () => body } as unknown as NextRequest;
    await POST(request);
    
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'DB Error' }, { status: 500 });
  });

  it('returns 500 on non-error object', async () => {
    const mockSupabase = {
      auth: { getSession: jest.fn().mockRejectedValue('String error') },
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    const body = { name: 'n', description: 'd', contribution_amount: 100, frequency: 'weekly', max_members: 10, total_rounds: 10 };
    const request = { json: async () => body } as unknown as NextRequest;
    await POST(request);
    
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' }, { status: 500 });
  });
});
