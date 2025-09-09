import { Router } from 'express';
import { CallRecord } from '@next-genai/shared';

const router = Router();

// Mock call records
const mockCalls: CallRecord[] = [
  {
    id: '1',
    userId: '1',
    phoneNumber: '(555) 123-4567',
    duration: 120,
    timestamp: new Date(),
    aiModelUsed: 'gpt-4',
    transcription: 'Sample call transcription...',
    summary: 'Customer inquiry about project status',
    status: 'completed',
  },
];

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  res.json({
    success: true,
    data: mockCalls,
    pagination: {
      page,
      limit,
      total: mockCalls.length,
      totalPages: Math.ceil(mockCalls.length / limit),
    },
  });
});

router.post('/', async (req, res) => {
  const callData = req.body;
  const newCall: CallRecord = {
    ...callData,
    id: Date.now().toString(),
    timestamp: new Date(),
  };

  mockCalls.push(newCall);

  res.json({
    success: true,
    data: newCall,
  });
});

export default router;