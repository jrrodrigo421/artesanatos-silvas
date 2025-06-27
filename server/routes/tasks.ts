import { Router, Request, Response } from 'express';
import { prisma } from '../../src/lib/prisma';
import { authenticateToken, AuthenticatedRequest } from '../../src/lib/auth-express';
import { CreateTaskData, UpdateTaskData, TaskStatus } from '../../src/types';

const router = Router();

router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const status = req.query.status as TaskStatus | undefined;

    const where: any = {
      userId: user.id,
    };

    if (status && Object.values(TaskStatus).includes(status)) {
      where.status = status;
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error('Erro ao listar tarefas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { title, description, status = TaskStatus.PENDENTE }: CreateTaskData = req.body;

    if (!title || title.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Título é obrigatório'
      });
      return;
    }

    if (title.length > 255) {
      res.status(400).json({
        success: false,
        error: 'Título deve ter no máximo 255 caracteres'
      });
      return;
    }

    if (status && !Object.values(TaskStatus).includes(status)) {
      res.status(400).json({
        success: false,
        error: 'Status inválido'
      });
      return;
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: task,
      message: 'Tarefa criada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!task) {
      res.status(404).json({
        success: false,
        error: 'Tarefa não encontrada'
      });
      return;
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Erro ao obter tarefa:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { id } = req.params;
    const { title, description, status, completedAt }: UpdateTaskData = req.body;

    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingTask) {
      res.status(404).json({
        success: false,
        error: 'Tarefa não encontrada'
      });
      return;
    }

    if (title !== undefined) {
      if (!title || title.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Título é obrigatório'
        });
        return;
      }

      if (title.length > 255) {
        res.status(400).json({
          success: false,
          error: 'Título deve ter no máximo 255 caracteres'
        });
        return;
      }
    }

    if (status && !Object.values(TaskStatus).includes(status)) {
      res.status(400).json({
        success: false,
        error: 'Status inválido'
      });
      return;
    }

    const updateData: any = {};

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (status !== undefined) {
      updateData.status = status;
      if (status === TaskStatus.CONCLUIDA && !existingTask.completedAt) {
        updateData.completedAt = new Date();
      }
      if (status !== TaskStatus.CONCLUIDA && existingTask.completedAt) {
        updateData.completedAt = null;
      }
    }
    if (completedAt !== undefined) updateData.completedAt = completedAt;

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: task,
      message: 'Tarefa atualizada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { id } = req.params;

    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingTask) {
      res.status(404).json({
        success: false,
        error: 'Tarefa não encontrada'
      });
      return;
    }

    await prisma.task.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Tarefa deletada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

export default router; 