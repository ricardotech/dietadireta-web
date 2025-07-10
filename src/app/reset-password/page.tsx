'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { AuthService } from '@/lib/auth';
import { Eye, EyeOff, Lock, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Schema for password reset form
const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string().min(8, 'Confirmação da senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!token) {
      setError('Token de redefinição não encontrado. Solicite um novo link de redefinição.');
    }
  }, [token]);

  const handleResetPassword = async (data: ResetPasswordData) => {
    if (!token) {
      setError('Token não encontrado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await AuthService.resetPassword(token, data.password);
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao redefinir senha');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logo - same style as main page */}
      <header className="p-4 flex border-b border-[#F0F0F0] bg-white w-full h-[75px]">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          <div className="flex flex-col">
            <img
              src="/logo.png"
              alt="Nutri Inteligente Logo"
              className="h-10 w-auto mb-3"
            />
          </div>

          {/* Back to login link */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-sm px-4 py-2 flex items-center hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao início
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex items-center justify-center px-4 py-8 pt-16">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                {success ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <Lock className="w-8 h-8 text-green-600" />
                )}
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {success ? 'Senha Redefinida!' : 'Redefinir Senha'}
            </h1>
            <p className="text-gray-600 text-sm">
              {success 
                ? 'Sua senha foi redefinida com sucesso. Você será redirecionado automaticamente.'
                : 'Digite sua nova senha abaixo'
              }
            </p>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-green-700 text-sm">
                    Senha redefinida com sucesso! Redirecionando em 3 segundos...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(handleResetPassword)} className="space-y-6">
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Nova Senha
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Digite sua nova senha"
                      className="pl-10 pr-10"
                      {...form.register('password')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirmar Nova Senha
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirme sua nova senha"
                      className="pl-10 pr-10"
                      {...form.register('confirmPassword')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-base"
                  disabled={isLoading || !token}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Redefinindo...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Redefinir Senha
                    </div>
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link 
                href="/" 
                className="text-sm text-gray-600 hover:text-green-600 underline"
              >
                Voltar para o início
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
          <span className="text-gray-600">Carregando...</span>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
