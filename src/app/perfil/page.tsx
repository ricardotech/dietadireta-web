'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  ChevronLeft,
  Download,
  Eye
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Diet {
  id: string;
  description: string;
  createdAt: string;
  paymentStatus: 'pending' | 'confirmed';
  totalCalories?: number;
}

export default function PerfilPage() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [diets, setDiets] = useState<Diet[]>([]);
  const [loadingDiets, setLoadingDiets] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchDiets = async () => {
      if (!user) return;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100'}/api/diets/history`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setDiets(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching diets:', error);
      } finally {
        setLoadingDiets(false);
      }
    };

    fetchDiets();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleViewDiet = (dietId: string) => {
    // Navigate to diet view page or load diet in main page
    localStorage.setItem('viewDietId', dietId);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="mr-4"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Voltar
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Meu Perfil</h1>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="text-red-600 hover:bg-red-50 border-red-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>{user.name || user.email.split('@')[0] || 'Usuário'}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Membro desde {format(new Date(user.createdAt || Date.now()), 'MMMM yyyy', { locale: ptBR })}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="h-4 w-4 mr-2" />
                    {diets.length} {diets.length === 1 ? 'dieta criada' : 'dietas criadas'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => router.push('/')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Nova Dieta
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  disabled
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações (Em breve)
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Diet History */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Dietas</CardTitle>
                <CardDescription>
                  Visualize e baixe suas dietas anteriores
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingDiets ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : diets.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Você ainda não criou nenhuma dieta</p>
                    <Button
                      className="mt-4"
                      onClick={() => router.push('/')}
                    >
                      Criar Primeira Dieta
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {diets.map((diet) => (
                      <div
                        key={diet.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {diet.description || 'Dieta Personalizada'}
                            </h3>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-gray-500">
                                {format(new Date(diet.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                              </span>
                              {diet.totalCalories && (
                                <span className="text-sm text-gray-500">
                                  {diet.totalCalories} kcal/dia
                                </span>
                              )}
                              <span className={`text-sm px-2 py-1 rounded-full ${
                                diet.paymentStatus === 'confirmed' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {diet.paymentStatus === 'confirmed' ? 'Pago' : 'Pendente'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {diet.paymentStatus === 'confirmed' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewDiet(diet.id)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Ver
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  PDF
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}