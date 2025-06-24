import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'silva-artesanatos-secret-key';

export interface JWTPayload {
  userId: string;
  email: string;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// Hash da senha
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verificar senha
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Gerar JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verificar JWT token
export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new AuthError('Token inválido');
  }
}

// Extrair token do header Authorization
export function extractToken(request: NextRequest): string {
  const authorization = request.headers.get('Authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Token não fornecido');
  }

  return authorization.split(' ')[1];
}

// Obter usuário autenticado a partir do token
export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const token = extractToken(request);
    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AuthError('Usuário não encontrado');
    }

    return user;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('Erro de autenticação');
  }
} 