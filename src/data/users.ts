import type { User } from '../types';

// Lista de usuarios hardcodeados
export const USERS_DB: Array<User & { password: string }> = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin',
    isActive: true,
    createdAt: new Date('2026-02-01'),
  },
  {
    id: '2',
    username: 'juan',
    password: 'juan123',
    name: 'Juan Pérez',
    role: 'user',
    isActive: true,
    createdAt: new Date('2026-02-01'),
  },
  {
    id: '3',
    username: 'maria',
    password: 'maria123',
    name: 'María García',
    role: 'user',
    isActive: true,
    createdAt: new Date('2026-02-01'),
  },
];

// Función para validar credenciales
export const validateCredentials = (
  username: string,
  password: string
): User | null => {
  const user = USERS_DB.find(
    (u) => u.username === username && u.password === password && u.isActive
  );

  if (!user) return null;

  // Devolver usuario sin la password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};