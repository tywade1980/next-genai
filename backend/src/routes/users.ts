import { Router } from 'express';

const router = Router();

router.get('/me', async (req, res) => {
  // Mock user data - in real implementation, extract from JWT token
  const user = {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    role: 'user' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  res.json({
    success: true,
    data: user,
  });
});

export default router;