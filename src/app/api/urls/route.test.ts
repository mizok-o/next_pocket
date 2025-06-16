import { GET, POST } from './route';
import { getUserId } from '@/lib/supabaseServer';
import { supabaseAdmin } from '@/lib/supabaseServer';

// Mock dependencies
jest.mock('@/lib/supabaseServer');

const mockGetUserId = getUserId as jest.MockedFunction<typeof getUserId>;

// Mock supabaseAdmin
const mockSupabaseAdmin = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
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

describe('/api/urls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return 401 when user is not authenticated', async () => {
      // Arrange
      mockGetUserId.mockResolvedValue(null);
      const request = createMockRequest();

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('should return 500 when database error occurs', async () => {
      // Arrange
      mockGetUserId.mockResolvedValue('123');
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database connection failed' }
        })
      };
      mockSupabaseAdmin.from.mockReturnValue(mockChain);
      const request = createMockRequest();

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to fetch URLs' });
      expect(console.error).toHaveBeenCalledWith('Database error:', { message: 'Database connection failed' });
    });

    it('should return 200 with data when successful', async () => {
      // Arrange
      const mockUrls = [
        { id: 1, url: 'https://example.com', title: 'Example', user_id: 123 },
        { id: 2, url: 'https://test.com', title: 'Test', user_id: 123 }
      ];
      mockGetUserId.mockResolvedValue('123');
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: mockUrls,
          error: null
        })
      };
      mockSupabaseAdmin.from.mockReturnValue(mockChain);
      const request = createMockRequest();

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({ data: mockUrls });
      expect(mockChain.eq).toHaveBeenCalledWith('user_id', 123);
      expect(mockChain.is).toHaveBeenCalledWith('deleted_at', null);
    });

    it('should return 200 with empty array when no data', async () => {
      // Arrange
      mockGetUserId.mockResolvedValue('123');
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: null,
          error: null
        })
      };
      mockSupabaseAdmin.from.mockReturnValue(mockChain);
      const request = createMockRequest();

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({ data: [] });
    });

    it('should handle server error during execution', async () => {
      // Arrange
      mockGetUserId.mockRejectedValue(new Error('Server error'));
      const request = createMockRequest();

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Server error occurred' });
      expect(console.error).toHaveBeenCalledWith('Server error:', expect.any(Error));
    });
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
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Insert failed' }
        })
      };
      mockSupabaseAdmin.from.mockReturnValue(mockChain);
      const request = createMockRequest({ url: 'https://example.com', title: 'Example' });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to create URL' });
      expect(console.error).toHaveBeenCalledWith('Database error:', { message: 'Insert failed' });
    });

    it('should return 200 with created data when successful', async () => {
      // Arrange
      const mockCreatedUrl = {
        id: 1,
        url: 'https://example.com',
        title: 'Example',
        description: 'Test description',
        image_url: 'https://example.com/image.jpg',
        user_id: 123
      };
      mockGetUserId.mockResolvedValue('123');
      const mockChain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockCreatedUrl,
          error: null
        })
      };
      mockSupabaseAdmin.from.mockReturnValue(mockChain);
      const request = createMockRequest({
        url: 'https://example.com',
        title: 'Example',
        description: 'Test description',
        image_url: 'https://example.com/image.jpg'
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({ data: mockCreatedUrl });
      expect(mockChain.insert).toHaveBeenCalledWith({
        url: 'https://example.com',
        title: 'Example',
        description: 'Test description',
        image_url: 'https://example.com/image.jpg',
        user_id: 123
      });
    });

    it('should handle partial data (only URL provided)', async () => {
      // Arrange
      const mockCreatedUrl = {
        id: 1,
        url: 'https://example.com',
        title: undefined,
        description: undefined,
        image_url: undefined,
        user_id: 123
      };
      mockGetUserId.mockResolvedValue('123');
      const mockChain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockCreatedUrl,
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
      expect(data).toEqual({ data: mockCreatedUrl });
      expect(mockChain.insert).toHaveBeenCalledWith({
        url: 'https://example.com',
        title: undefined,
        description: undefined,
        image_url: undefined,
        user_id: 123
      });
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
  });
});