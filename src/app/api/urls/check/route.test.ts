import { POST } from './route';
import { getUserId } from '@/lib/supabaseServer';
import { supabaseAdmin } from '@/lib/supabaseServer';

// Mock dependencies
jest.mock('@/lib/supabaseServer');

const mockGetUserId = getUserId as jest.MockedFunction<typeof getUserId>;

// Mock supabaseAdmin
const mockSupabaseAdmin = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
  }))
};

(supabaseAdmin as any) = mockSupabaseAdmin;

// Mock Request object
const createMockRequest = (body?: any): Request => {
  return {
    json: jest.fn().mockResolvedValue(body || {}),
    headers: new Headers(),
  } as any;
};

describe('/api/urls/check', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should return 401 when user is not authenticated', async () => {
      // Arrange
      mockGetUserId.mockResolvedValue(null);
      const request = createMockRequest({ url: 'https://example.com' });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('should return 400 when URL is missing', async () => {
      // Arrange
      mockGetUserId.mockResolvedValue('123');
      const request = createMockRequest({});

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'URL is required' });
    });

    it('should return 400 when URL is empty string', async () => {
      // Arrange
      mockGetUserId.mockResolvedValue('123');
      const request = createMockRequest({ url: '' });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'URL is required' });
    });

    it('should return 400 when user ID is invalid', async () => {
      // Arrange
      mockGetUserId.mockResolvedValue('invalid-id');
      const request = createMockRequest({ url: 'https://example.com' });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid user ID' });
    });

    it('should return 500 when database error occurs', async () => {
      // Arrange
      mockGetUserId.mockResolvedValue('123');
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database connection failed' }
        })
      };
      mockSupabaseAdmin.from.mockReturnValue(mockChain);
      const request = createMockRequest({ url: 'https://example.com' });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to check URL' });
      expect(console.error).toHaveBeenCalledWith('Database error:', { message: 'Database connection failed' });
    });

    it('should return 200 with exists=true when URL exists', async () => {
      // Arrange
      const mockData = [{ id: 1 }];
      mockGetUserId.mockResolvedValue('123');
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockResolvedValue({
          data: mockData,
          error: null
        })
      };
      mockSupabaseAdmin.from.mockReturnValue(mockChain);
      const request = createMockRequest({ url: 'https://example.com' });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({ exists: true });
      expect(mockChain.eq).toHaveBeenCalledWith('url', 'https://example.com');
      expect(mockChain.eq).toHaveBeenCalledWith('user_id', 123);
      expect(mockChain.is).toHaveBeenCalledWith('deleted_at', null);
    });

    it('should return 200 with exists=false when URL does not exist', async () => {
      // Arrange
      mockGetUserId.mockResolvedValue('123');
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockResolvedValue({
          data: [],
          error: null
        })
      };
      mockSupabaseAdmin.from.mockReturnValue(mockChain);
      const request = createMockRequest({ url: 'https://notfound.com' });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({ exists: false });
    });

    it('should return 200 with exists=false when data is null', async () => {
      // Arrange
      mockGetUserId.mockResolvedValue('123');
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockResolvedValue({
          data: null,
          error: null
        })
      };
      mockSupabaseAdmin.from.mockReturnValue(mockChain);
      const request = createMockRequest({ url: 'https://example.com' });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({ exists: false });
    });

    it('should handle server error during execution', async () => {
      // Arrange
      mockGetUserId.mockRejectedValue(new Error('Server error'));
      const request = createMockRequest({ url: 'https://example.com' });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Server error occurred' });
      expect(console.error).toHaveBeenCalledWith('Server error:', expect.any(Error));
    });

    it('should handle malformed JSON in request body', async () => {
      // Arrange
      mockGetUserId.mockResolvedValue('123');
      const request = {
        json: jest.fn().mockRejectedValue(new SyntaxError('Unexpected token')),
        headers: new Headers(),
      } as any;

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Server error occurred' });
    });

    it('should handle special characters in URL', async () => {
      // Arrange
      const specialUrl = 'https://example.com/path?query=value&special=テスト';
      mockGetUserId.mockResolvedValue('123');
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockResolvedValue({
          data: [{ id: 1 }],
          error: null
        })
      };
      mockSupabaseAdmin.from.mockReturnValue(mockChain);
      const request = createMockRequest({ url: specialUrl });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({ exists: true });
      expect(mockChain.eq).toHaveBeenCalledWith('url', specialUrl);
    });
  });
});