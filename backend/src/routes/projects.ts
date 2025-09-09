import { Router } from 'express';
import { CBMSProject } from '@next-genai/shared';

const router = Router();

// Mock projects
const mockProjects: CBMSProject[] = [
  {
    id: '1',
    name: 'Office Renovation',
    description: 'Complete office space renovation project',
    status: 'active',
    startDate: new Date('2024-01-01'),
    managerId: '1',
    teamMembers: ['1'],
    budget: 50000,
    tasks: [],
  },
];

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  res.json({
    success: true,
    data: mockProjects,
    pagination: {
      page,
      limit,
      total: mockProjects.length,
      totalPages: Math.ceil(mockProjects.length / limit),
    },
  });
});

router.post('/', async (req, res) => {
  const projectData = req.body;
  const newProject: CBMSProject = {
    ...projectData,
    id: Date.now().toString(),
    tasks: [],
  };

  mockProjects.push(newProject);

  res.json({
    success: true,
    data: newProject,
  });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const projectIndex = mockProjects.findIndex(p => p.id === id);
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Project not found',
    });
  }

  mockProjects[projectIndex] = { ...mockProjects[projectIndex], ...updateData };

  res.json({
    success: true,
    data: mockProjects[projectIndex],
  });
});

export default router;