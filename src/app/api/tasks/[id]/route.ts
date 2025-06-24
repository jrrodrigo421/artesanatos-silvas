import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, AuthError } from '@/lib/auth';
import { UpdateTaskData, TaskStatus } from '@/types';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedUser(request);
    const { id } = params;

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
      return NextResponse.json(
        { success: false, error: 'Tarefa não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Erro ao obter tarefa:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedUser(request);
    const { id } = params;
    const body: UpdateTaskData = await request.json();
    const { title, description, status, completedAt } = body;

    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        { success: false, error: 'Tarefa não encontrada' },
        { status: 404 }
      );
    }

    if (title !== undefined) {
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
    }

    if (status && !Object.values(TaskStatus).includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status inválido' },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      data: task,
      message: 'Tarefa atualizada com sucesso',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Erro ao atualizar tarefa:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedUser(request);
    const { id } = params;

    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        { success: false, error: 'Tarefa não encontrada' },
        { status: 404 }
      );
    }

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Tarefa deletada com sucesso',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Erro ao deletar tarefa:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 