import { DELETE } from './route';
import { getUserId } from '@/lib/supabaseServer';
import { supabaseAdmin } from '@/lib/supabaseServer';

// Mock dependencies
jest.mock('@/lib/supabaseServer');

const mockGetUserId = getUserId as jest.MockedFunction<typeof getUserId>;

// Mock supabaseAdmin
const mockSupabaseAdmin = {
  from: jest.fn(() => ({
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  }))
};

(supabaseAdmin as any) = mockSupabaseAdmin;

// Mock Request object
const createMockRequest = (): Request => {
  return {
    headers: new Headers(),
  } as any;
};

describe('/api/urls/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('DELETE', () => {
    it('should return 401 when user is not authenticated', async () => {
      // Arrange
      mockGetUserId.mockResolvedValue(null);
      const request = createMockRequest();
      const params = Promise.resolve({ id: '1' });

      // Act
      const response = await DELETE(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('should return 400 when URL ID is invalid', async () => {
      // Arrange
      mockGetUserId.mockResolvedValue('123');
      const request = createMockRequest();
      const params = Promise.resolve({ id: 'invalid' });

      // Act
      const response = await DELETE(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid URL ID' });
    });

    it('should return 400 when user ID is invalid', async () => {
      // Arrange
      mockGetUserId.mockResolvedValue('invalid-id');
      const request = createMockRequest();
      const params = Promise.resolve({ id: '1' });

      // Act
      const response = await DELETE(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid user ID' });
    });

    it('should return 500 when database error occurs', async () => {
      // Arrange
      mockGetUserId.mockResolvedValue('123');
      const mockChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Update failed' }
        })
      };
      mockSupabaseAdmin.from.mockReturnValue(mockChain);
      const request = createMockRequest();
      const params = Promise.resolve({ id: '1' });

      // Act
      const response = await DELETE(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to delete URL' });
      expect(console.error).toHaveBeenCalledWith('Database error:', { message: 'Update failed' });
    });

    it('should return 404 when URL not found or not owned by user', async () => {
      // Arrange
      mockGetUserId.mockResolvedValue('123');
      const mockChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: null
        })
      };
      mockSupabaseAdmin.from.mockReturnValue(mockChain);
      const request = createMockRequest();
      const params = Promise.resolve({ id: '1' });

      // Act
      const response = await DELETE(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'URL not found or not owned by user' });
    });

    it('should return 200 when deletion is successful', async () => {
      // Arrange
      const mockDeletedUrl = {
        id: 1,
        url: 'https://example.com',
        user_id: 123,
        deleted_at: new Date().toISOString()
      };
      mockGetUserId.mockResolvedValue('123');
      const mockChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockDeletedUrl,
          error: null
        })
      };
      mockSupabaseAdmin.from.mockReturnValue(mockChain);
      const request = createMockRequest();
      const params = Promise.resolve({ id: '1' });

      // Act
      const response = await DELETE(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
      expect(mockChain.update).toHaveBeenCalledWith({
        deleted_at: expect.any(String)
      });
      expect(mockChain.eq).toHaveBeenCalledWith('id', 1);
      expect(mockChain.eq).toHaveBeenCalledWith('user_id', 123);
    });

    it('should handle server error during execution', async () => {
      // Arrange
      mockGetUserId.mockRejectedValue(new Error('Server error'));
      const request = createMockRequest();
      const params = Promise.resolve({ id: '1' });

      // Act
      const response = await DELETE(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Server error occurred' });
      expect(console.error).toHaveBeenCalledWith('Server error:', expect.any(Error));
    });

    it('should handle edge case with zero ID', async () => {
      // Arrange
      mockGetUserId.mockResolvedValue('123');
      const request = createMockRequest();
      const params = Promise.resolve({ id: '0' });

      // Act
      const response = await DELETE(request, { params });

      // Assert
      expect(response.status).not.toBe(400); // 0 is a valid number
    });

    it('should handle negative ID', async () => {
      // Arrange
      mockGetUserId.mockResolvedValue('123');
      const request = createMockRequest();
      const params = Promise.resolve({ id: '-1' });

      // Act
      const response = await DELETE(request, { params });

      // Assert
      expect(response.status).not.toBe(400); // -1 is a valid number, though potentially problematic in business logic
    });

    it('should handle empty string ID', async () => {
      // Arrange
      mockGetUserId.mockResolvedValue('123');
      const request = createMockRequest();
      const params = Promise.resolve({ id: '' });

      // Act
      const response = await DELETE(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid URL ID' });
    });
  });
});