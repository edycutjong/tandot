import { createClient as createBrowserClient } from '../client';
import { createClient as createServerClient, createAdminClient } from '../server';
import { createBrowserClient as mockCreateBrowserClient, createServerClient as mockCreateServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Mock the dependencies
jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn().mockReturnValue({ isMockBrowserClient: true }),
  createServerClient: jest.fn((url, key, options) => {
    // Call the cookie methods to get coverage on them
    if (options && options.cookies) {
      options.cookies.getAll();
      options.cookies.setAll([{ name: 'test', value: 'value', options: {} }]);
    }
    return { isMockServerClient: true };
  }),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

describe('Supabase Clients', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-key';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('Browser Client', () => {
    it('creates a browser client with the correct environment variables', () => {
      const client = createBrowserClient();
      
      expect(mockCreateBrowserClient).toHaveBeenCalledWith(
        'https://mock.supabase.co',
        'mock-anon-key'
      );
      expect(client).toEqual({ isMockBrowserClient: true });
    });
  });

  describe('Server Client', () => {
    it('creates a server client and interacts with cookies', async () => {
      const mockCookieStore = {
        getAll: jest.fn().mockReturnValue([]),
        set: jest.fn(),
      };
      (cookies as jest.Mock).mockResolvedValue(mockCookieStore);

      const client = await createServerClient();
      
      expect(cookies).toHaveBeenCalled();
      expect(mockCreateServerClient).toHaveBeenCalledWith(
        'https://mock.supabase.co',
        'mock-anon-key',
        expect.any(Object)
      );
      expect(client).toEqual({ isMockServerClient: true });
      expect(mockCookieStore.getAll).toHaveBeenCalled();
      expect(mockCookieStore.set).toHaveBeenCalledWith('test', 'value', {});
    });

    it('creates an admin client and interacts with cookies', async () => {
      const mockCookieStore = {
        getAll: jest.fn().mockReturnValue([]),
        set: jest.fn(),
      };
      (cookies as jest.Mock).mockResolvedValue(mockCookieStore);

      const client = await createAdminClient();
      
      expect(cookies).toHaveBeenCalled();
      expect(mockCreateServerClient).toHaveBeenCalledWith(
        'https://mock.supabase.co',
        'mock-service-key',
        expect.any(Object)
      );
      expect(client).toEqual({ isMockServerClient: true });
      expect(mockCookieStore.getAll).toHaveBeenCalled();
      expect(mockCookieStore.set).toHaveBeenCalledWith('test', 'value', {});
    });

    it('handles errors when setting cookies from a Server Component', async () => {
      const mockCookieStore = {
        getAll: jest.fn().mockReturnValue([]),
        set: jest.fn().mockImplementation(() => {
          throw new Error('Cannot set cookies from Server Component');
        }),
      };
      (cookies as jest.Mock).mockResolvedValue(mockCookieStore);

      // This should not throw an unhandled error because of the try/catch in server.ts
      await expect(createServerClient()).resolves.toBeDefined();
      
      // Also for admin client
      await expect(createAdminClient()).resolves.toBeDefined();
    });
  });
});
