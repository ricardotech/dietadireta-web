import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { cpf } from 'cpf-cnpj-validator';

// Auth schemas matching the API
export const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  phoneNumber: z.string().min(1, 'Telefone é obrigatório').refine(
    (value) => {
      try {
        // Remove mask characters for validation
        const cleanValue = value.replace(/\D/g, '');
        if (cleanValue.length === 0) return false; // Empty is not valid (required)
        
        // Validate as Brazilian phone number
        return isValidPhoneNumber(cleanValue, 'BR');
      } catch {
        return false;
      }
    },
    'Número de telefone inválido'
  ),
  cpf: z.string().min(1, 'CPF é obrigatório').refine(
    (value) => {
      // Use the cpf-cnpj-validator library for proper CPF validation
      return cpf.isValid(value);
    },
    'CPF inválido'
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
    phoneNumber: string;
    cpf: string;
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