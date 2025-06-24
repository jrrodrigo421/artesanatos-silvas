import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, AuthError } from '@/lib/auth';
import { CreateTaskData, TaskStatus } from '@/types';

// GET /api/tasks - Listar todas as tarefas do usuário
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    // Obter parâmetros de query (filtros)
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as TaskStatus | null;

    // Construir filtros
    const where: any = {
      userId: user.id,
    };

    if (status && Object.values(TaskStatus).includes(status)) {
      where.status = status;
    }

    // Buscar tarefas
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

    return NextResponse.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Erro ao listar tarefas:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Criar nova tarefa
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    const body: CreateTaskData = await request.json();
    const { title, description, status = TaskStatus.PENDENTE } = body;

    // Validação dos dados
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Título é obrigatório' },
        { status: 400 }
      );
    }

    if (title.length > 255) {
      return NextResponse.json(
        { success: false, error: 'Título deve ter no máximo 255 caracteres' },
        { status: 400 }
      );
    }

    // Validar status se fornecido
    if (status && !Object.values(TaskStatus).includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status inválido' },
        { status: 400 }
      );
    }

    // Criar tarefa
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

    return NextResponse.json({
      success: true,
      data: task,
      message: 'Tarefa criada com sucesso',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Erro ao criar tarefa:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 