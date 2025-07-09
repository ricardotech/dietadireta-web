'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthService, signUpSchema, signInSchema, SignUpData, SignInData } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { X, Eye, EyeOff, Loader2, Mail, Phone, Lock, User, CheckCircle } from 'lucide-react';
import { IMaskInput } from 'react-imask';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (planId: string) => void;
  selectedPlan: string;
  planName: string;
  initialMode?: 'signin' | 'signup'; // Add prop to control initial mode
}

export function AuthModal({ isOpen, onClose, onSuccess, selectedPlan, planName, initialMode = 'signup' }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null);
  const { login, register } = useAuth();

  // Reset modal state when it opens with different mode
  useEffect(() => {
    if (isOpen) {
      setIsSignUp(initialMode === 'signup');
      setError(null);
      setIsForgotPassword(false);
      setForgotPasswordMessage(null);
    }
  }, [isOpen, initialMode]);

  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      phoneNumber: '',
      cpf: '',
      password: '',
    },
  });

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSignUp = async (data: SignUpData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare data for backend - remove empty phoneNumber field
      const signUpData: Partial<SignUpData> = {
        email: data.email,
        cpf: data.cpf,
        password: data.password,
      };
      
      // Only include phoneNumber if it has content
      if (data.phoneNumber && data.phoneNumber.trim() !== '') {
        signUpData.phoneNumber = data.phoneNumber;
      }
      
      const result = await register(signUpData as SignUpData);
      if (!result.error) {
        // Close the modal immediately after successful registration
        onClose();
        onSuccess(selectedPlan);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (data: SignInData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await login(data);
      if (!result.error) {
        // Close the modal immediately after successful login
        onClose();
        onSuccess(selectedPlan);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setIsForgotPassword(false);
    setForgotPasswordMessage(null);
    signUpForm.reset();
    signInForm.reset();
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      setError('Por favor, digite seu email');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthService.forgotPassword(forgotPasswordEmail);
      setForgotPasswordMessage(response.message);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao solicitar redefinição de senha');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center p-4 pt-8 sm:pt-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isForgotPassword ? 'Esqueci minha senha' : isSignUp ? 'Criar Conta' : 'Fazer Login'}
              </h2>
              <p className="text-sm text-gray-600">
                {isForgotPassword ? 'Digite seu email para redefinir' : 'Para finalizar sua compra'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          {/* Selected Plan Info - Only show in purchase flow (signup mode), not for general signin */}
          {!isForgotPassword && initialMode === 'signup' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-900">Plano Selecionado</p>
                  <p className="text-sm text-green-700">{planName}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {forgotPasswordMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-700 text-sm">{forgotPasswordMessage}</p>
            </div>
          )}

          {isForgotPassword ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="forgot-email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={handleForgotPassword}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Enviar Instruções
                  </div>
                )}
              </Button>
            </div>
          ) : isSignUp ? (
            <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    {...signUpForm.register('email')}
                  />
                </div>
                {signUpForm.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {signUpForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Telefone (opcional)
                </Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                  <Controller
                    name="phoneNumber"
                    control={signUpForm.control}
                    render={({ field }) => (
                      <IMaskInput
                        {...field}
                        mask="(00) 00000-0000"
                        id="phone"
                        type="tel"
                        placeholder="(11) 91579-9139"
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                      />
                    )}
                  />
                </div>
                {signUpForm.formState.errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {signUpForm.formState.errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">
                  CPF
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                  <Controller
                    name="cpf"
                    control={signUpForm.control}
                    render={({ field }) => (
                      <IMaskInput
                        {...field}
                        mask="000.000.000-00"
                        id="cpf"
                        type="text"
                        placeholder="000.000.000-00"
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                      />
                    )}
                  />
                </div>
                {signUpForm.formState.errors.cpf && (
                  <p className="text-red-500 text-xs mt-1">
                    {signUpForm.formState.errors.cpf.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    className="pl-10 pr-10"
                    {...signUpForm.register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {signUpForm.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {signUpForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Criando conta...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Criar Conta e Continuar
                  </div>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
              <div>
                <Label htmlFor="signin-email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    {...signInForm.register('email')}
                  />
                </div>
                {signInForm.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {signInForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">
                  Senha
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="signin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    className="pl-10 pr-10"
                    {...signInForm.register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {signInForm.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {signInForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Entrando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Entrar e Continuar
                  </div>
                )}
              </Button>

              {/* Forgot Password Link for Login Form */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Esqueci minha senha
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            {isForgotPassword ? (
              <p className="text-sm text-gray-600">
                Lembrou da senha?
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="ml-1 text-green-600 hover:text-green-700 font-medium"
                >
                  Voltar ao login
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
                <button
                  type="button"
                  onClick={switchMode}
                  className="ml-1 text-green-600 hover:text-green-700 font-medium"
                >
                  {isSignUp ? 'Fazer Login' : 'Criar Conta'}
                </button>
              </p>
            )}
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Ao continuar, você concorda com nossos
              <a href="#" className="text-green-600 hover:text-green-700 mx-1">
                Termos de Uso
              </a>
              e
              <a href="#" className="text-green-600 hover:text-green-700 ml-1">
                Política de Privacidade
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}