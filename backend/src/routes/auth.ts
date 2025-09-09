import { Router } from 'express';
import { LoginRequest } from '@next-genai/shared';

const router = Router();

// Mock authentication - replace with real implementation
router.post('/login', async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    // Mock user - in real implementation, verify against database
    const user = {
      id: '1',
      email,
      name: 'Demo User',
      role: 'user' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const token = 'mock-jwt-token';
    const refreshToken = 'mock-refresh-token';

    res.json({
      success: true,
      data: {
        user,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
    });
  }
});

router.post('/logout', async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export default router;