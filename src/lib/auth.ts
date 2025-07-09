import { z } from 'zod';

// Auth schemas matching the API
export const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  phoneNumber: z.string().optional().refine(
    (value) => {
      if (!value) return true; // Optional field
      // Remove mask characters and validate
      const digitsOnly = value.replace(/\D/g, '');
      return digitsOnly.length >= 10;
    },
    'Número deve ter pelo menos 10 dígitos'
  ),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

export const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    phoneNumber?: string;
  };
  token: string;
  userToken: string;
}

export interface AuthError {
  error: string;
  details?: string;
}

// API service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100';

export class AuthService {
  static async signUp(data: SignUpData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: AuthError = await response.json();
      throw new Error(error.error || 'Erro ao criar conta');
    }

    return response.json();
  }

  static async signIn(data: SignInData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: AuthError = await response.json();
      throw new Error(error.error || 'Erro ao fazer login');
    }

    return response.json();
  }

  static saveAuth(authData: AuthResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));
    }
  }

  static getAuth(): AuthResponse | null {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) return null;

    return {
      token,
      userToken: '', // Not used in frontend
      user: JSON.parse(userData),
    };
  }

  static clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  static isAuthenticated(): boolean {
    return this.getAuth() !== null;
  }

  static async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error: AuthError = await response.json();
      throw new Error(error.error || 'Erro ao solicitar redefinição de senha');
    }

    return response.json();
  }

  static async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    });

    if (!response.ok) {
      const error: AuthError = await response.json();
      throw new Error(error.error || 'Erro ao redefinir senha');
    }

    return response.json();
  }
}