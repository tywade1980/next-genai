import { Router } from 'express';
import { CBMSTask } from '@next-genai/shared';

const router = Router();

// Mock tasks
const mockTasks: CBMSTask[] = [
  {
    id: '1',
    projectId: '1',
    title: 'Design Review',
    description: 'Review architectural designs',
    assigneeId: '1',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date('2024-02-01'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

router.get('/', async (req, res) => {
  const projectId = req.query.projectId as string;
  let tasks = mockTasks;

  if (projectId) {
    tasks = mockTasks.filter(task => task.projectId === projectId);
  }

  res.json({
    success: true,
    data: tasks,
  });
});

router.post('/', async (req, res) => {
  const taskData = req.body;
  const newTask: CBMSTask = {
    ...taskData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockTasks.push(newTask);

  res.json({
    success: true,
    data: newTask,
  });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const taskIndex = mockTasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Task not found',
    });
  }

  mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updateData, updatedAt: new Date() };

  res.json({
    success: true,
    data: mockTasks[taskIndex],
  });
});

export default router;