import { POST } from './route';
import { getServerSession } from 'next-auth';
import { generateJWT } from '@/lib/jwt';
import { NextResponse } from 'next/server';

// Mock dependencies
jest.mock('next-auth');
jest.mock('@/lib/jwt');
jest.mock('@/lib/auth', () => ({
  authOptions: {}
}));

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockGenerateJWT = generateJWT as jest.MockedFunction<typeof generateJWT>;

describe('/api/auth/extension-token', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should return 401 when no session exists', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(null);

      // Act
      const response = await POST();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('should return 401 when session has no user ID', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue({
        user: {},
        expires: '2024-01-01'
      });

      // Act
      const response = await POST();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('should return 500 when JWT generation fails', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user123' },
        expires: '2024-01-01'
      });
      mockGenerateJWT.mockRejectedValue(new Error('JWT generation failed'));

      // Act
      const response = await POST();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Internal server error' });
    });

    it('should return 200 with token when successful', async () => {
      // Arrange
      const mockToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.test';
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user123' },
        expires: '2024-01-01'
      });
      mockGenerateJWT.mockResolvedValue(mockToken);

      // Act
      const response = await POST();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({
        token: mockToken,
        expires_in: 604800
      });
      expect(mockGenerateJWT).toHaveBeenCalledWith('user123');
    });

    it('should return 200 with empty body when generateJWT returns undefined', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user123' },
        expires: '2024-01-01'
      });
      // @ts-ignore - intentionally testing edge case
      mockGenerateJWT.mockResolvedValue(undefined);

      // Act
      const response = await POST();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({
        token: undefined,
        expires_in: 604800
      });
    });

    it('should handle session with null user', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue({
        user: null,
        expires: '2024-01-01'
      });

      // Act
      const response = await POST();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
    });
  });
});