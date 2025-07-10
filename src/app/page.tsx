"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Home, FileText, User, HelpCircle, LogOut, X, Check, Lock, ArrowRight, MenuIcon, AlertCircle, LineChart, CheckCircle, Pencil, Copy, Download, Loader2 } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, Controller, Control, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FoodSelector } from "@/components/FoodSelector";
import { DietCreationFlow } from "@/components/DietCreationFlow";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { usePDF } from 'react-to-pdf';
import { toast } from "sonner";

// Form validation schema
const formSchema = z.object({
  weight: z.string().min(1, "Por favor, informe seu peso atual em quilogramas").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Peso deve ser um número válido"
  ),
  height: z.string().min(1, "Por favor, informe sua altura em centímetros").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Altura deve ser um número válido"
  ),
  age: z.string().min(1, "Por favor, informe sua idade em anos").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Idade deve ser um número válido"
  ),
  objective: z.string().min(1, "Por favor, selecione qual é o seu objetivo principal"),
  // calories: z.string().min(1, "Por favor, selecione quantas calorias você deseja consumir por dia"),
  // schedule: z.string().min(1, "Por favor, selecione o horário que melhor se adapta à sua rotina"),
  includeCafeManha: z.boolean(),
  includeLancheManha: z.boolean(),
  includeAlmoco: z.boolean(),
  includeLancheTarde: z.boolean(),
  includeJantar: z.boolean(),
  breakfastItems: z.array(z.string()),
  morningSnackItems: z.array(z.string()),
  lunchItems: z.array(z.string()),
  afternoonSnackItems: z.array(z.string()),
  dinnerItems: z.array(z.string()),
});

type FormData = z.infer<typeof formSchema>;


// Food data
const foodData = {
  breakfast: [
    { value: "tapioca_frango", emoji: "🍗", label: "Tapioca + Frango" },
    { value: "crepioca_queijo", emoji: "🧀", label: "Crepioca + Queijo" },
    { value: "fruta", emoji: "🍎", label: "Fruta" },
    { value: "iogurte", emoji: "🥛", label: "Iogurte" },
    { value: "cafe", emoji: "☕", label: "Café" },
    { value: "pao_queijo", emoji: "🧀", label: "Pão de Queijo" },
    { value: "pao_ovo", emoji: "🥚", label: "Pão + Ovo" },
    { value: "cafe_leite", emoji: "☕", label: "Café + Leite" },
    { value: "cuscuz", emoji: "⚪", label: "Cuscuz" },
  ],
  morningSnack: [
    { value: "whey", emoji: "🥛", label: "Whey" },
    { value: "biscoito", emoji: "🍪", label: "Biscoito" },
    { value: "maca", emoji: "🍎", label: "Maçã" },
    { value: "banana", emoji: "🍌", label: "Banana" },
    { value: "laranja", emoji: "🍊", label: "Laranja" },
    { value: "morango", emoji: "🍓", label: "Morango" },
    { value: "uva", emoji: "🍇", label: "Uva" },
    { value: "abacaxi", emoji: "🍍", label: "Abacaxi" },
    { value: "pera", emoji: "🍐", label: "Pera" },
  ],
  lunch: [
    { value: "frango", emoji: "🍗", label: "Frango" },
    { value: "patinho", emoji: "🥩", label: "Patinho" },
    { value: "alcatra", emoji: "🥩", label: "Alcatra" },
    { value: "carne_moida", emoji: "🥩", label: "Carne Moída" },
    { value: "mandioca", emoji: "🍠", label: "Mandioca" },
    { value: "batata_doce", emoji: "🍠", label: "Batata-Doce" },
    { value: "tilapia", emoji: "🐟", label: "Tilápia" },
    { value: "arroz", emoji: "🍚", label: "Arroz" },
    { value: "feijao", emoji: "🫘", label: "Feijão" },
  ],
  afternoonSnack: [
    { value: "vitamina", emoji: "🥤", label: "Vitamina" },
    { value: "sanduiche", emoji: "🥪", label: "Sanduíche" },
    { value: "bolo", emoji: "🍰", label: "Bolo" },
    { value: "pipoca", emoji: "🍿", label: "Pipoca" },
    { value: "iogurte_snack", emoji: "🥛", label: "Iogurte" },
    { value: "fruta_snack", emoji: "🍊", label: "Fruta" },
    { value: "castanha", emoji: "🥜", label: "Castanha" },
    { value: "aveia", emoji: "🥣", label: "Aveia" },
    { value: "granola", emoji: "🥣", label: "Granola" },
  ],
  dinner: [
    { value: "sopa", emoji: "🍲", label: "Sopa" },
    { value: "salada", emoji: "🥗", label: "Salada" },
    { value: "omelete", emoji: "🍳", label: "Omelete" },
    { value: "peixe", emoji: "🐟", label: "Peixe" },
    { value: "frango_janta", emoji: "🍗", label: "Frango" },
    { value: "legumes_janta", emoji: "🥕", label: "Legumes" },
    { value: "quinoa", emoji: "🌾", label: "Quinoa" },
    { value: "batata", emoji: "🥔", label: "Batata" },
    { value: "verduras", emoji: "🥬", label: "Verduras" },
  ],
};

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const { user, signOut, loading } = useAuth();

  const navigationItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: FileText, label: "Dietas", href: "/dietas" },
    { icon: User, label: "Perfil", href: "/perfil" },
    { icon: HelpCircle, label: "Suporte", href: "/suporte" },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const handleAuthSuccess = () => {
    // Modal already closes in AuthModal component
    // This just ensures consistency if needed
  };

  return (
    <header className="p-4 flex border-b border-[#F0F0F0] bg-white fixed w-full z-50 h-[75px]">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
        <div className="flex flex-col">
          <img
            src="/logo.png"
            alt="Nutri Inteligente Logo"
            className="h-10 w-auto mb-3"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {!loading && (
            user ? (
              <>
                <Button
                  variant="ghost"
                  className="text-sm px-4 py-2 flex items-center hover:bg-gray-100"
                >
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="text-sm px-4 py-2 flex items-center hover:bg-gray-100 border-gray-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setAuthModalMode('signin');
                  setShowAuthModal(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-md font-medium"
              >
                Já possuo uma conta
              </Button>
            )
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button className="bg-gray-100 hover:bg-gray-200 p-2">
                <MenuIcon className="w-8 h-8 text-black" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0 bg-white [&>button:first-of-type]:hidden">
              <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <img
                        src="/logo.png"
                        alt="Logo"
                        className="h-8 w-auto"
                      />
                      <p className="text-xs text-gray-500">Sua alimentação ideal</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-9 w-9 p-0 hover:bg-white/50 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </Button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 py-2">
                  {navigationItems.map((item, index) => (
                    <div key={item.label} className="relative">
                      <Button
                        variant="ghost"
                        className={`w-full justify-start px-6 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-none relative group ${index === 0 ? 'bg-gray-50' : ''
                          }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-green-500 transition-opacity ${index === 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`} />
                        <item.icon className="w-5 h-5 mr-4 text-gray-600" />
                        {item.label}
                      </Button>
                    </div>
                  ))}
                </div>

                {/* User Profile Section */}
                <div className="border-t border-gray-100 p-6 space-y-4">
                  {!loading && (
                    user ? (
                      <>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Meu Perfil</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">📧</span>
                            <span>{user.email}</span>
                          </div>
                          {user.phoneNumber && (
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">📱</span>
                              <span>{user.phoneNumber}</span>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-0 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          onClick={handleSignOut}
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sair
                        </Button>
                      </>
                    ) : (
                      <div className="text-center">
                        <Button
                          onClick={() => {
                            setAuthModalMode('signin');
                            setShowAuthModal(true);
                            setIsOpen(false);
                          }}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
                        >
                          Já possuo uma conta
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        selectedPlan="basic"
        planName="Acesso à Dieta"
        initialMode={authModalMode}
      />
    </header>
  )
}

function MedidasCorporais({ control, errors }: { control: Control<FormData>, errors: FieldErrors<FormData> }) {
  const objectives = [
    { value: "emagrecer", emoji: "📉", label: "Emagrecer" },
    { value: "emagrecer_massa", emoji: "💪", label: "Emagrecer + Massa" },
    { value: "definicao_ganho", emoji: "🏋️", label: "Definicao Muscular + Ganhar Massa" },
    { value: "ganhar_massa", emoji: "💪", label: "Ganhar Massa Muscular" },
  ];

  const calories = [
    { value: "0", emoji: "❓", label: "Não sei dizer" },
    { value: "1200", emoji: "🔥", label: "1200 kcal" },
    { value: "1500", emoji: "🔥", label: "1500 kcal" },
    { value: "1800", emoji: "🔥", label: "1800 kcal" },
    { value: "2000", emoji: "🔥", label: "2000 kcal" },
    { value: "2200", emoji: "🔥", label: "2200 kcal" },
    { value: "2500", emoji: "🔥", label: "2500 kcal" },
    { value: "3000", emoji: "🔥", label: "3000 kcal" },
  ];

  // const schedules = [
  //   { value: "custom", label: "Tenho meu próprio horário" },
  //   { value: "05:30-08:30-12:00-15:00-19:00", label: "05:30, 08:30, 12:00, 15:00, 19:00" },
  //   { value: "06:00-09:00-12:00-15:00-19:00", label: "06:00, 09:00, 12:00, 15:00, 19:00" },
  //   { value: "06:30-09:30-13:00-16:00-20:00", label: "06:30, 09:30, 13:00, 16:00, 20:00" },
  //   { value: "07:00-10:00-12:30-15:30-19:30", label: "07:00, 10:00, 12:30, 15:30, 19:30" },
  //   { value: "07:30-10:30-12:00-15:00-19:00", label: "07:30, 10:30, 12:00, 15:00, 19:00" },
  //   { value: "08:00-11:00-13:30-16:30-20:30", label: "08:00, 11:00, 13:30, 16:30, 20:30" },
  //   { value: "09:00-11:00-13:00-16:00-21:00", label: "09:00, 11:00, 13:00, 16:00, 21:00" },
  // ];

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl">
      <div className="shadow rounded-xl">
        <div className="border-b border-[#F0F0F0] p-4">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg flex items-center justify-center mr-3 p-2">
              <LineChart className="text-green-600 w-5 h-5" />
            </div>
            <h1 className="text-xl font-black">Medidas Corporais</h1>
          </div>
          <p className="text-md mt-2">Preencha para calcular sua dieta personalizada</p>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <Controller
              name="weight"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Peso (kg)"
                  className={`py-8 px-4 text-xl ${errors.weight ? 'border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-2' : ''}`}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    field.onChange(value);
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              )}
            />
            {errors.weight && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.weight.message}
              </p>
            )}
          </div>

          <div>
            <Controller
              name="height"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Altura (cm)"
                  className={`py-8 px-4 text-xl ${errors.height ? 'border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-2' : ''}`}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    field.onChange(value);
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              )}
            />
            {errors.height && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.height.message}
              </p>
            )}
          </div>

          <div>
            <Controller
              name="age"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Idade"
                  className={`py-8 px-4 text-xl ${errors.age ? 'border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-2' : ''}`}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    field.onChange(value);
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              )}
            />
            {errors.age && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.age.message}
              </p>
            )}
          </div>

          <div>
            <Controller
              name="objective"
              control={control}
              render={({ field }) => (
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-gray-800">Seu objetivo</label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {objectives.map((objective) => (
                      <button
                        key={objective.value}
                        type="button"
                        onClick={() => field.onChange(objective.value)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${field.value === objective.value
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                      >
                        <div className="text-2xl mb-2">{objective.emoji}</div>
                        <div className="font-medium text-sm">{objective.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            />
            {errors.objective && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.objective.message}
              </p>
            )}
          </div>

          {/* <div>
            <Controller
              name="calories"
              control={control}
              render={({ field }) => (
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-gray-800">Sua meta de Calorias diárias</label>
                  <div className="grid grid-cols-2 gap-3">
                    {calories.map((calorie) => (
                      <button
                        key={calorie.value}
                        type="button"
                        onClick={() => field.onChange(calorie.value)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          field.value === calorie.value
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{calorie.emoji}</div>
                        <div className="font-medium text-sm">{calorie.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            />
            {errors.calories && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.calories.message}
              </p>
            )}
          </div> */}

          {/* 
          <div>
            <Controller
              name="schedule"
              control={control}
              render={({ field }) => (
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger className={`w-full text-xl py-8 px-4 ${errors.schedule ? 'border-red-500 focus:border-red-500' : ''}`}>
                    <SelectValue placeholder="Horários para Refeição ⏱️" />
                  </SelectTrigger>
                  <SelectContent className="my-1">
                    {schedules.map((s) => (
                      <SelectItem key={s.value} value={s.value} className="text-xl py-4 px-6">
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.schedule && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.schedule.message}
              </p>
            )}
          </div>
          */}
        </div>
      </div>
    </div>
  )
}

function DietaPersonalizada({
  onClick,
  isSubmitting,
  currentStep,
  onUnlock,
  onLoadingComplete,
  onPaymentSuccess,
  formData
}: {
  onClick: () => void,
  isSubmitting: boolean,
  currentStep: 'form' | 'loading' | 'preview',
  onUnlock: () => void,
  onLoadingComplete: () => void,
  onPaymentSuccess: () => void,
  formData?: FormData
}) {
  const [loadingStep, setLoadingStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [dietData, setDietData] = useState<any>(null);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [shouldContinueAfterAuth, setShouldContinueAfterAuth] = useState(false);
  const { user } = useAuth();
  const { toPDF, targetRef } = usePDF({ filename: 'minha-dieta-personalizada.pdf' });

  // Debug: Log dietData changes
  useEffect(() => {
    console.log('dietData changed:', dietData);
  }, [dietData]);

  // Persist dietData in localStorage to survive state changes
  useEffect(() => {
    if (dietData && dietData.dietId) {
      console.log('Saving dietData to localStorage:', dietData);
      localStorage.setItem('dietabox-diet-data', JSON.stringify(dietData));
    }
  }, [dietData]);

  // Restore dietData from localStorage on mount
  useEffect(() => {
    const savedDietData = localStorage.getItem('dietabox-diet-data');
    if (savedDietData && !dietData) {
      try {
        const parsedDietData = JSON.parse(savedDietData);
        console.log('Restoring dietData from localStorage:', parsedDietData);
        setDietData(parsedDietData);
      } catch (error) {
        console.error('Error parsing saved diet data:', error);
      }
    }
  }, []);

  const loadingSteps = [
    { icon: LineChart, title: "Analisando Preferências", description: "Processando seus alimentos favoritos" },
    { icon: AlertCircle, title: "Calculando Calorias", description: "Ajustando para seu objetivo" },
    { icon: CheckCircle, title: "Personalizando Dieta", description: "Criando sua dieta ideal" },
    { icon: Check, title: "Finalizando", description: "Sua dieta está pronta!" }
  ];

  // API call to generate diet plan (step 1: create Diet record)
  const generateDiet = useCallback(async () => {
    console.log('generateDiet called with formData:', formData);
    try {
      // Get auth token from localStorage or context - use correct key 'token' not 'authToken'
      const token = localStorage.getItem('token');
      console.log('Auth check in generateDiet:', { token: token ? 'exists' : 'missing', user: user ? 'exists' : 'missing' });

      if (!token || !user) {
        console.log('Authentication failed, showing auth modal');
        // Instead of throwing error, show auth modal with signup as default and mark for continuation
        setShouldContinueAfterAuth(true);
        setShowAuthModal(true);
        return null;
      }

      console.log('Making API call to /api/generatePrompt...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100'}/api/generatePrompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          weight: formData?.weight || '70',
          height: formData?.height || '170',
          age: formData?.age || '30',
          goal: formData?.objective || 'emagrecer',
          calories: '2000',
          gender: 'm', // Fixed: use valid gender enum
          schedule: 'padrao', // Fixed: use valid schedule value
          activityLevel: 'moderado', // Fixed: use valid activity level enum
          workoutPlan: 'nenhum', // Fixed: use valid workout plan enum
          breakfast: formData?.breakfastItems?.join(', ') || 'ovos, aveia, frutas',
          morningSnack: formData?.morningSnackItems?.join(', ') || 'frutas, castanhas',
          lunch: formData?.lunchItems?.join(', ') || 'frango, arroz, verduras',
          afternoonSnack: formData?.afternoonSnackItems?.join(', ') || 'iogurte, frutas',
          dinner: formData?.dinnerItems?.join(', ') || 'peixe, batata, salada',
        }),
      });

      console.log('API response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response error:', errorText);
        throw new Error(`Failed to generate diet: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Diet Generation API Response:', data);

      // Store dietId for later checkout
      if (data.success && data.data.dietId) {
        console.log('Setting dietData with dietId:', data.data.dietId);
        // Store the dietId for checkout process
        setDietData({
          dietId: data.data.dietId,
          // Initialize with preview data
          breakfast: [
            { name: "Tapioca + Frango", quantity: "1 unidade média", calories: 250 },
            { name: "Café com Leite", quantity: "200ml", calories: 80 },
            { name: "Banana", quantity: "1 unidade", calories: 90 }
          ],
          lunch: [
            { name: "Frango Grelhado", quantity: "150g", calories: 330 },
            { name: "Arroz Integral", quantity: "4 colheres", calories: 160 },
            { name: "Brócolis", quantity: "1 xícara", calories: 55 }
          ],
          dinner: [
            { name: "Salmão Grelhado", quantity: "120g", calories: 280 },
            { name: "Batata Doce", quantity: "1 unidade pequena", calories: 120 },
            { name: "Salada Verde", quantity: "1 prato", calories: 50 }
          ],
          totalCalories: 1425
        });
        console.log('dietData set successfully');
        return data;
      }

      console.error('Invalid API response - missing success or dietId:', data);
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Error generating diet:', error);
      // Fallback to mock data if API fails
      const mockData = {
        dietId: 'fallback-diet-id',
        breakfast: [
          { name: "Tapioca + Frango", quantity: "1 unidade média", calories: 250 },
          { name: "Café com Leite", quantity: "200ml", calories: 80 },
          { name: "Banana", quantity: "1 unidade", calories: 90 }
        ],
        lunch: [
          { name: "Frango Grelhado", quantity: "150g", calories: 330 },
          { name: "Arroz Integral", quantity: "4 colheres", calories: 160 },
          { name: "Feijão", quantity: "2 colheres", calories: 140 }
        ],
        dinner: [
          { name: "Salmão Grelhado", quantity: "120g", calories: 280 },
          { name: "Batata Doce", quantity: "1 unidade média", calories: 130 },
          { name: "Brócolis", quantity: "1 xícara", calories: 40 }
        ],
        totalCalories: 1980,
        notes: "Lembre-se de beber pelo menos 2 litros de água por dia e fazer as refeições nos horários indicados."
      };
      console.log('Setting fallback dietData:', mockData);
      setDietData(mockData);
      return mockData;
    }
  }, [user, formData, setShouldContinueAfterAuth, setShowAuthModal, setDietData]);

  // API call to create checkout (step 2: create payment order)
  const createCheckout = useCallback(async (dietId?: string) => {
    setIsCreatingCheckout(true);
    try {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        setShouldContinueAfterAuth(true);
        setShowAuthModal(true);
        return null;
      }

      // Prepare request body - include dietId if available, otherwise include form data
      const requestBody: any = {};

      if (dietId) {
        requestBody.dietId = dietId;
      }

      // Always include user information for payment processing
      if (user) {
        requestBody.userInfo = {
          email: user.email,
          phoneNumber: user.phoneNumber, // Include phone number for payment gateway
          cpf: user.cpf, // Include CPF for payment gateway
        };
      }

      // Always include userData as fallback in case dietId doesn't exist or is invalid
      if (formData) {
        // Map frontend values to backend enum values
        const goalMapping: Record<string, string> = {
          'emagrecer': 'emagrecer',
          'emagrecer_massa': 'emagrecer+massa',
          'ganhar_massa': 'ganhar massa muscular',
          'definicao_ganho': 'definicao muscular + ganhar massa'
        };

        requestBody.userData = {
          weight: formData.weight,
          height: formData.height,
          age: formData.age,
          goal: goalMapping[formData.objective] || formData.objective, // Map to correct enum value
          calories: "2000", // Default fallback
          gender: "m", // Use correct enum value: 'm' or 'f'
          schedule: "07:00-10:00-12:30-15:30-19:30", // Use valid schedule enum value
          activityLevel: "moderado", // Use valid activity level enum
          workoutPlan: "academia", // Use correct enum value: 'academia', 'casa', or 'nenhum'
          breakfast: formData.breakfastItems.join(', ') || "pao, cafe",
          morningSnack: formData.morningSnackItems.join(', ') || "fruta",
          lunch: formData.lunchItems.join(', ') || "arroz, feijao, carne",
          afternoonSnack: formData.afternoonSnackItems.join(', ') || "iogurte",
          dinner: formData.dinnerItems.join(', ') || "salada, proteina"
        };
      }

      console.log('Checkout request body:', requestBody);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100'}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout');
      }

      const data = await response.json();
      console.log('Checkout API Response:', data);

      if (data.success) {
        setOrderData(data.data);
        return data;
      }

      throw new Error('Invalid checkout response');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Erro ao criar pedido. Tente novamente.');
      return null;
    } finally {
      setIsCreatingCheckout(false);
    }
  }, [user, formData, setOrderData, setShouldContinueAfterAuth, setShowAuthModal]);

  // Function to check payment status
  const checkPaymentStatus = async (orderId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        setShouldContinueAfterAuth(true);
        setShowAuthModal(true);
        throw new Error('Authentication required');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100'}/api/payment-status/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check payment status');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  };

  // Reset loading state when entering loading step
  useEffect(() => {
    if (currentStep === 'loading') {
      setLoadingStep(0);
      setCompletedSteps([]);
    }
  }, [currentStep]);

  // Handle loading progress with increased time
  useEffect(() => {
    if (currentStep === 'loading') {
      const interval = setInterval(() => {
        setLoadingStep((prev) => {
          const nextStep = prev + 1;
          if (nextStep < loadingSteps.length) {
            setCompletedSteps((completed) => [...completed, prev]);
            return nextStep;
          } else {
            setCompletedSteps((completed) => [...completed, prev]);
            // Generate diet after loading completes
            setTimeout(async () => {
              console.log('Loading completed, generating diet...');
              // Check if user is authenticated before generating diet
              const token = localStorage.getItem('token');
              console.log('Token check:', { token: token ? 'exists' : 'missing', user: user ? 'exists' : 'missing' });

              if (token && user) {
                // User is authenticated, proceed with diet generation
                console.log('User authenticated, calling generateDiet...');
                const result = await generateDiet();
                console.log('generateDiet result:', result);
                if (result !== null) {
                  console.log('Diet generated successfully, going to preview with real data...');
                  // Go to preview step with the generated diet data
                  onLoadingComplete();
                } else {
                  console.log('generateDiet returned null, going to preview with mock data');
                  // Still go to preview even if generation failed (fallback data will be used)
                  onLoadingComplete();
                }
              } else {
                // User is not authenticated, show auth modal
                console.log('User not authenticated, showing auth modal');
                setShouldContinueAfterAuth(true);
                setShowAuthModal(true);
              }
            }, 1500);
            return prev;
          }
        });
      }, 3000); // Increased from 2000 to 3000ms

      return () => clearInterval(interval);
    }
  }, [currentStep, user, generateDiet, onLoadingComplete]);

  // Watch for user authentication changes - only continue if we were waiting for auth
  useEffect(() => {
    if (user && shouldContinueAfterAuth && !showAuthModal) {
      // User has logged in, continue with diet generation
      setShouldContinueAfterAuth(false);

      // Continue the diet generation process
      generateDiet().then((result) => {
        if (result !== null) {
          console.log('Diet generated after auth, going to preview...');
          onLoadingComplete();
        } else {
          console.log('Diet generation failed after auth, going to preview with mock data');
          onLoadingComplete();
        }
      });
    }
  }, [user, shouldContinueAfterAuth, showAuthModal, generateDiet, onLoadingComplete]);

  // Effect to handle immediate progression for already authenticated users
  useEffect(() => {
    // If user is already authenticated and we're in loading step, proceed directly to diet generation
    if (currentStep === 'loading' && user && !shouldContinueAfterAuth && !showAuthModal) {
      const token = localStorage.getItem('token');
      if (token && currentStep === 'loading') {
        // User is authenticated, skip auth modal and proceed with diet generation
        // This will be handled by the main loading useEffect above
      }
    }
  }, [currentStep, user, shouldContinueAfterAuth, showAuthModal]);

  const handleAuthSuccess = () => {
    // The useEffect above will handle the continuation
    // This function is called when auth is successful
    // Modal already closes in AuthModal component
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    setShouldContinueAfterAuth(false);
  };

  const handleOpenAuthModal = () => {
    setShouldContinueAfterAuth(true);
    setShowAuthModal(true);
  };

  const handlePaymentConfirm = async () => {
    if (!orderData?.orderId) {
      toast.error('Erro: ID do pedido não encontrado.');
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token || !user) {
      setShouldContinueAfterAuth(true);
      setShowAuthModal(true);
      setShowPaymentModal(false);
      return;
    }

    setIsCheckingPayment(true);
    try {
      const paymentStatus = await checkPaymentStatus(orderData.orderId);

      if (paymentStatus.success && paymentStatus.paid) {
        // Payment confirmed successfully
        setIsPaymentConfirmed(true);
        setShowPaymentModal(false);

        // If diet is ready, parse and set the diet data
        if (paymentStatus.data?.aiResponse) {
          const parsedDiet = parseDietResponse(paymentStatus.data.aiResponse);
          setDietData(parsedDiet);
          toast.success('Pagamento confirmado! Sua dieta personalizada está pronta.');
        } else if (paymentStatus.processing) {
          toast.success('Pagamento confirmado! Sua dieta está sendo gerada...');
        }

        onPaymentSuccess();
      } else {
        // Payment not confirmed yet
        toast.error('Pagamento ainda não foi confirmado. Tente novamente em alguns minutos.');
      }
    } catch (error) {
      console.error('Error checking payment:', error);
      toast.error('Erro ao verificar pagamento. Tente novamente.');
    } finally {
      setIsCheckingPayment(false);
    }
  };

  // Function to parse AI diet response into structured data
  const parseDietResponse = (aiResponse: string) => {
    try {
      // Try to extract structured meal data from the AI response
      const meals: {
        breakfast: Array<{ name: string; quantity: string; calories: number }>;
        morningSnack: Array<{ name: string; quantity: string; calories: number }>;
        lunch: Array<{ name: string; quantity: string; calories: number }>;
        afternoonSnack: Array<{ name: string; quantity: string; calories: number }>;
        dinner: Array<{ name: string; quantity: string; calories: number }>;
      } = {
        breakfast: [],
        morningSnack: [],
        lunch: [],
        afternoonSnack: [],
        dinner: []
      };
      
      // Simple parsing for common meal patterns
      const parseSection = (sectionName: string, aliasNames: string[] = []) => {
        const allNames = [sectionName, ...aliasNames];
        for (const name of allNames) {
          const regex = new RegExp(`${name}:?\\s*\\n([\\s\\S]*?)(?=\\n\\n|\\n[A-Z]|$)`, 'i');
          const match = aiResponse.match(regex);
          if (match) {
            const items = match[1].split('\n')
              .filter(line => line.trim())
              .map(line => {
                const item = line.trim().replace(/^[-•*]\s*/, '');
                return {
                  name: item,
                  quantity: "Conforme orientação",
                  calories: 0
                };
              });
            return items;
          }
        }
        return [];
      };

      meals.breakfast = parseSection("Café da Manhã", ["Café da manhã", "Breakfast"]);
      meals.morningSnack = parseSection("Lanche da Manhã", ["Lanche da manhã", "Morning Snack"]);
      meals.lunch = parseSection("Almoço", ["Lunch"]);
      meals.afternoonSnack = parseSection("Lanche da Tarde", ["Lanche da tarde", "Afternoon Snack"]);
      meals.dinner = parseSection("Jantar", ["Dinner"]);

      // Calculate total calories from the response if available
      const caloriesMatch = aiResponse.match(/(\d+)\s*(?:kcal|cal|calorias)/i);
      const totalCalories = caloriesMatch ? parseInt(caloriesMatch[1]) : 0;

      // If no structured data found, use the full response as notes
      const hasStructuredData = Object.values(meals).some(meal => meal.length > 0);
      
      if (!hasStructuredData) {
        // Fallback: show the full AI response as notes
        return {
          breakfast: [
            { name: "Plano nutricional personalizado", quantity: "Veja detalhes abaixo", calories: 0 }
          ],
          lunch: [],
          dinner: [],
          totalCalories: totalCalories,
          notes: aiResponse,
          fullResponse: aiResponse
        };
      }

      return {
        breakfast: meals.breakfast,
        morningSnack: meals.morningSnack,
        lunch: meals.lunch,
        afternoonSnack: meals.afternoonSnack,
        dinner: meals.dinner,
        totalCalories: totalCalories,
        notes: aiResponse,
        fullResponse: aiResponse
      };
    } catch (error) {
      console.error('Error parsing diet response:', error);
      // Fallback to displaying the full response
      return {
        breakfast: [
          { name: "Plano nutricional personalizado", quantity: "Veja detalhes abaixo", calories: 0 }
        ],
        lunch: [],
        dinner: [],
        totalCalories: 0,
        notes: aiResponse,
        fullResponse: aiResponse
      };
    }
  };

  const LoadingStep = ({ icon: Icon, title, description, isActive, isCompleted }: {
    icon: React.ElementType;
    title: string;
    description: string;
    isActive: boolean;
    isCompleted: boolean;
  }) => (
    <div className={`flex items-center p-4 rounded-lg transition-all duration-500 ${isActive ? 'bg-green-50 border-2 border-green-200' :
        isCompleted ? 'bg-green-100 border-2 border-green-300' : 'bg-gray-50 border-2 border-gray-200'
      }`}>
      <div className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 transition-all duration-500 ${isCompleted ? 'bg-green-500' : isActive ? 'bg-green-200' : 'bg-gray-300'
        }`}>
        {isCompleted ? (
          <Check className="w-6 h-6 text-white" />
        ) : (
          <Icon className={`w-6 h-6 ${isActive ? 'text-green-600' : 'text-gray-600'} ${isActive ? 'animate-pulse' : ''}`} />
        )}
      </div>
      <div className="flex-1">
        <h3 className={`font-semibold ${isCompleted ? 'text-green-800' : isActive ? 'text-green-700' : 'text-gray-700'}`}>
          {title}
        </h3>
        <p className={`text-sm ${isCompleted ? 'text-green-600' : isActive ? 'text-green-600' : 'text-gray-500'}`}>
          {description}
        </p>
      </div>
    </div>
  );

  const MealPreviewCard = ({ title, items, showMore = false, isBlurred = false }: {
    title: string;
    items: { name: string; quantity: string; calories: number }[];
    showMore?: boolean;
    isBlurred?: boolean;
  }) => (
    <div className={`bg-gray-50 p-4 rounded-lg relative ${isBlurred ? 'overflow-hidden' : ''}`}>
      <div className={isBlurred ? 'filter blur-sm' : ''}>
        <h4 className="font-semibold text-green-700 mb-2">{title}</h4>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800 text-sm">{items[0]?.name}</p>
              <p className="text-xs text-gray-600">{items[0]?.quantity}</p>
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              {items[0]?.calories} cal
            </span>
          </div>
          {showMore && (
            <p className="text-xs text-gray-500 italic">+{items.length - 1} opções adicionais</p>
          )}
        </div>
      </div>
      {isBlurred && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg">
          <Lock className="w-6 h-6 text-gray-400" />
        </div>
      )}
    </div>
  );

  // Get the diet data to display (either real data or fallback)
  const displayDietData = dietData || {
    breakfast: [
      { name: "Tapioca com Frango", quantity: "1 unidade média", calories: 250 },
      { name: "Café com Leite", quantity: "200ml", calories: 80 },
      { name: "Banana", quantity: "1 unidade", calories: 90 }
    ],
    lunch: [
      { name: "Frango Grelhado", quantity: "150g", calories: 330 },
      { name: "Arroz Integral", quantity: "4 colheres", calories: 160 },
      { name: "Feijão", quantity: "2 colheres", calories: 140 }
    ],
    dinner: [
      { name: "Salmão Grelhado", quantity: "120g", calories: 280 },
      { name: "Batata Doce", quantity: "1 unidade média", calories: 130 },
      { name: "Brócolis", quantity: "1 xícara", calories: 40 }
    ],
    totalCalories: 1980,
    notes: "Sua dieta personalizada estará disponível após o pagamento. Esta é apenas uma prévia dos tipos de alimentos que incluiremos baseados nas suas preferências."
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="p-8">
        {/* Form Step */}
        {currentStep === 'form' && (
          <>
            <div className="flex items-center">
              <div className="bg-green-100 rounded-lg flex items-center justify-center mr-3 p-2">
                <Pencil className="text-green-600 w-5 h-5" />
              </div>
              <h1 className="text-xl font-black">Dieta personalizada</h1>
            </div>
            <p className="text-md mt-2 mb-4">Sua dieta será montada com base nas suas preferências alimentares e necessidades nutricionais.</p>
            <Badge className="bg-green-100 text-green-600 mb-4">
              <CheckCircle className="inline-block w-4 h-4 mr-1" />
              Por um preço acessível de R$10
            </Badge>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-1 mr-3">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-gray-700">Dieta totalmente personalizada</span>
              </div>
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-1 mr-3">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-gray-700">Baseado nas suas preferências</span>
              </div>
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-1 mr-3">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-gray-700">Quantidades de alimentos corretas</span>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={onClick}
                disabled={isSubmitting}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-7 px-8 rounded-lg transition-colors duration-200 w-full mb-2 text-xl"
              >
                {isSubmitting ? "Processando..." : "Montar minha dieta"}
                <ArrowRight className="inline-block w-12 h-12 text-white" />
              </Button>
              <p className="text-sm text-gray-500 mt-4 mb-2">
                Pagamento único e seguro
                <Lock className="inline-block ml-1 w-4 h-4 text-gray-500" />
              </p>
            </div>
          </>
        )}

        {/* Loading Step */}
        {currentStep === 'loading' && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Pencil className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Criando sua Dieta</h1>
              <p className="text-gray-600">
                {showAuthModal
                  ? "Crie sua conta para continuar com sua dieta personalizada"
                  : "Aguarde enquanto personalizamos sua alimentação"
                }
              </p>
            </div>

            {!showAuthModal && (
              <>
                <div className="space-y-4 mb-6">
                  {loadingSteps.map((step, index) => (
                    <LoadingStep
                      key={index}
                      icon={step.icon}
                      title={step.title}
                      description={step.description}
                      isActive={index === loadingStep}
                      isCompleted={completedSteps.includes(index)}
                    />
                  ))}
                </div>

                <div className="mt-6">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {Math.round(((loadingStep + 1) / loadingSteps.length) * 100)}% concluído
                  </p>
                </div>
              </>
            )}

            {/* Backup button when auth is required */}
            {(showAuthModal || shouldContinueAfterAuth) && (
              <div className="text-center mt-6">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg mb-4">
                  <div className="flex items-center justify-center mb-3">
                    <User className="w-8 h-8 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Conta Necessária</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Para continuar com sua dieta personalizada, é necessário criar uma conta gratuita.
                  </p>
                  <Button
                    onClick={handleOpenAuthModal}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg"
                  >
                    Criar Conta e Continuar
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Seus dados serão preservados e você continuará exatamente onde parou
                </p>
              </div>
            )}
          </>
        )}

        {/* Preview Step */}
        {currentStep === 'preview' && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Sua Dieta Está Pronta!</h1>
              <p className="text-gray-600">Veja um preview do que preparamos para você</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Plano Nutricional Personalizado</h3>
                <Badge className="bg-green-100 text-green-800">
                  {displayDietData.totalCalories} cal/dia
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <MealPreviewCard
                  title="Café da Manhã"
                  items={displayDietData.breakfast}
                  showMore={true}
                  isBlurred={!isPaymentConfirmed}
                />
                <MealPreviewCard
                  title="Almoço"
                  items={displayDietData.lunch}
                  showMore={true}
                  isBlurred={!isPaymentConfirmed}
                />
                <MealPreviewCard
                  title="Jantar"
                  items={displayDietData.dinner}
                  showMore={true}
                  isBlurred={!isPaymentConfirmed}
                />
              </div>

              {!isPaymentConfirmed && (
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="flex items-center text-gray-600">
                    <Lock className="w-4 h-4 mr-2" />
                    <span className="text-sm">Desbloquear para ver dieta completa com horários e quantidades detalhadas</span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              {!isPaymentConfirmed ? (
                <Button
                  onClick={async () => {
                    console.log('Desbloquear button clicked');
                    console.log('Current dietData:', dietData);
                    console.log('Current user:', user);
                    console.log('Current currentStep:', currentStep);

                    // Check if user is authenticated before proceeding
                    const token = localStorage.getItem('token');
                    if (!token || !user) {
                      console.log('User not authenticated, showing auth modal');
                      setShouldContinueAfterAuth(true);
                      setShowAuthModal(true);
                      return;
                    }

                    // Call checkout directly - backend will handle creating diet if needed
                    console.log('Creating checkout...');
                    const checkoutResult = await createCheckout(dietData?.dietId);
                    if (checkoutResult) {
                      console.log('Checkout created successfully:', checkoutResult);
                      setShowPaymentModal(true);
                    } else {
                      console.error('Checkout creation failed');
                    }
                  }}
                  disabled={isCreatingCheckout}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-green-400 disabled:to-emerald-400 disabled:cursor-not-allowed text-white font-bold py-8 px-8 rounded-lg text-md md:text-lg w-full mb-2"
                >
                  {isCreatingCheckout ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                      Carregando...
                    </div>
                  ) : (
                    <>
                      {user ? 'Desbloquear por R$9,90' : 'Criar Conta e Desbloquear'}
                      <span>
                        <ArrowRight className="inline-block w-8 h-8 ml-2 -mt-2" />
                      </span>
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  {/* Full Diet Display */}
                  <div ref={targetRef} className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">Sua Dieta Personalizada</h2>
                      <p className="text-gray-600">Total: {displayDietData.totalCalories} calorias por dia</p>
                    </div>

                    {/* Complete Meal Sections */}
                    <div className="space-y-6">
                      {displayDietData.breakfast && (
                        <div>
                          <h3 className="text-lg font-semibold text-green-700 mb-3">Café da Manhã</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {displayDietData.breakfast.map((item: any, index: number) => (
                              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-600">{item.quantity}</p>
                                  </div>
                                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {item.calories} cal
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {displayDietData.morningSnack && displayDietData.morningSnack.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-green-700 mb-3">Lanche da Manhã</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {displayDietData.morningSnack.map((item: any, index: number) => (
                              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-600">{item.quantity}</p>
                                  </div>
                                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {item.calories} cal
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {displayDietData.lunch && (
                        <div>
                          <h3 className="text-lg font-semibold text-green-700 mb-3">Almoço</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {displayDietData.lunch.map((item: any, index: number) => (
                              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-600">{item.quantity}</p>
                                  </div>
                                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {item.calories} cal
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {displayDietData.afternoonSnack && displayDietData.afternoonSnack.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-green-700 mb-3">Lanche da Tarde</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {displayDietData.afternoonSnack.map((item: any, index: number) => (
                              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-600">{item.quantity}</p>
                                  </div>
                                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {item.calories} cal
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {displayDietData.dinner && (
                        <div>
                          <h3 className="text-lg font-semibold text-green-700 mb-3">Jantar</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {displayDietData.dinner.map((item: any, index: number) => (
                              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-600">{item.quantity}</p>
                                  </div>
                                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {item.calories} cal
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {displayDietData.notes && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-blue-700 mb-2">Plano Nutricional Completo</h3>
                          <div className="text-gray-700 whitespace-pre-wrap">{displayDietData.notes}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Export PDF Button */}
                  <Button
                    onClick={() => toPDF()}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg w-full"
                  >
                    <Download className="inline-block w-5 h-5 mr-2" />
                    Exportar Dieta em PDF
                  </Button>
                </div>
              )}

              {!isPaymentConfirmed && (
                <p className="text-sm text-gray-500 mt-4">
                  {user ? (
                    <>
                      Pagamento único e seguro <Lock className="inline w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Crie sua conta gratuita para continuar <Lock className="inline w-4 h-4 ml-1" />
                    </>
                  )}
                </p>
              )}
            </div>
          </>
        )}

        {/* Auth Modal */}
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={handleAuthModalClose}
            onSuccess={handleAuthSuccess}
            selectedPlan="basic"
            planName="Acesso à Dieta"
            initialMode="signup"
          />
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="w-8 h-8 text-blue-600 rotate-45" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Pagamento PIX</h2>
                <p className="text-gray-600">Escaneie o QR Code para pagar</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="bg-white border-2 border-gray-200 rounded-lg mx-auto flex items-center justify-center mb-4 overflow-hidden">
                  {orderData?.qrCodeUrl ? (
                    <iframe
                      src={orderData.qrCodeUrl}
                      className="w-[250px] h-[250px] overflow-hidden"
                      title="QR Code PIX"
                    />
                  ) : (
                    <div className="text-center">
                      <ArrowRight className="w-24 h-24 text-gray-400 mx-auto mb-2 rotate-45" />
                      <p className="text-sm text-gray-500">Carregando QR Code...</p>
                    </div>
                  )}
                </div>
                <div className="text-center mb-4">
                  <p className="font-bold text-lg text-gray-800">R$ {orderData?.amount ? (orderData.amount / 100).toFixed(2) : '9,90'}</p>
                  <p className="text-sm text-gray-600">Dieta Personalizada</p>
                  {/* {orderData?.expiresAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Expira em: {new Date(orderData.expiresAt).toLocaleDateString('pt-BR')}
                    </p>
                  )} */}
                </div>

                {/* PIX Copy Button - only show if we have order data */}
                {orderData?.qrCodeUrl && (
                  <button
                    onClick={() => {
                      // In a real implementation, you'd get the PIX code from the backend
                      const pixCode = "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913NUTRI DIETA6009SAO PAULO62140510DIETA123456304B2A2";
                      navigator.clipboard.writeText(pixCode);
                      toast.success("Código PIX copiado!");
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar PIX Copia e Cola
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handlePaymentConfirm}
                  disabled={isCheckingPayment}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3"
                >
                  {isCheckingPayment ? 'Verificando pagamento...' : 'Já realizei o pagamento'}
                </Button>
                <Button
                  onClick={() => setShowPaymentModal(false)}
                  variant="outline"
                  className="w-full"
                  disabled={isCheckingPayment}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mealValidationErrors, setMealValidationErrors] = useState<Record<string, string>>({});
  const [dietStep, setDietStep] = useState<'form' | 'loading' | 'preview'>('form');
  const [activeMealSection, setActiveMealSection] = useState<string | null>(null);
  const [submittedFormData, setSubmittedFormData] = useState<FormData | null>(null);
  const { user } = useAuth();

  // Restore form state from localStorage on mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('dietabox-form-data');
    const savedDietStep = localStorage.getItem('dietabox-diet-step');

    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setSubmittedFormData(parsedData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }

    if (savedDietStep && ['form', 'loading', 'preview'].includes(savedDietStep)) {
      setDietStep(savedDietStep as 'form' | 'loading' | 'preview');
    }
  }, []);

  // Save form data to localStorage when it changes
  useEffect(() => {
    if (submittedFormData) {
      localStorage.setItem('dietabox-form-data', JSON.stringify(submittedFormData));
    }
  }, [submittedFormData]);

  // Save diet step to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('dietabox-diet-step', dietStep);
  }, [dietStep]);

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      weight: '',
      height: '',
      age: '',
      objective: '',
      // calories: '',
      // schedule: '',
      includeCafeManha: true,
      includeLancheManha: false,
      includeAlmoco: true,
      includeLancheTarde: false,
      includeJantar: true,
      breakfastItems: [],
      morningSnackItems: [],
      lunchItems: [],
      afternoonSnackItems: [],
      dinnerItems: [],
    }
  });

  const handleMealSectionFocus = (sectionName: string) => {
    setActiveMealSection(sectionName);
  };

  const handleMealSectionExpand = (sectionName: string) => {
    setActiveMealSection(sectionName);
  };

  const shouldMinimize = (sectionName: string) => {
    return activeMealSection !== null && activeMealSection !== sectionName;
  };

  const onSubmit = async (data: FormData) => {
    // Clear previous validation errors
    setMealValidationErrors({});

    // Custom validation for meal selections - required meals are always validated
    const newValidationErrors: Record<string, string> = {};

    // Required meals are always validated
    if (data.breakfastItems.length < 3) {
      newValidationErrors.breakfast = 'Selecione pelo menos 3 alimentos para o café da manhã';
    }
    if (data.lunchItems.length < 3) {
      newValidationErrors.lunch = 'Selecione pelo menos 3 alimentos para o almoço';
    }
    if (data.dinnerItems.length < 3) {
      newValidationErrors.dinner = 'Selecione pelo menos 3 alimentos para o jantar';
    }

    // Optional meals - only validate if they are included
    if (data.includeLancheManha && data.morningSnackItems.length < 3) {
      newValidationErrors.morningSnack = 'Selecione pelo menos 3 alimentos para o lanche da manhã';
    }
    if (data.includeLancheTarde && data.afternoonSnackItems.length < 3) {
      newValidationErrors.afternoonSnack = 'Selecione pelo menos 3 alimentos para o lanche da tarde';
    }

    if (Object.keys(newValidationErrors).length > 0) {
      setMealValidationErrors(newValidationErrors);
      // Scroll to top to show validation errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    console.log('Form data:', data);

    // Store form data for API call
    setSubmittedFormData(data);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    // Go to loading step to show diet creation process
    setDietStep('loading');
  };

  const onInvalidSubmit = () => {
    // Scroll to top when form validation fails
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnlock = () => {
    // Start the loading/generation process when user clicks unlock
    setDietStep('loading');
  };

  const handleLoadingComplete = () => {
    // When loading completes, go to preview step
    setDietStep('preview');
  };

  const handlePaymentSuccess = () => {
    toast.success('Pagamento realizado com sucesso! Sua dieta completa foi liberada.');
    // Clear saved form data since process is complete
    localStorage.removeItem('dietabox-form-data');
    localStorage.removeItem('dietabox-diet-step');
    // Reset to form for demo purposes
    setDietStep('form');
  };

  return (
    <main className="bg-[#F9FAFB]">
      <Header />
      <div className="h-[70px]"></div>

      <div className="py-8 px-4 space-y-8">
        <MedidasCorporais control={control} errors={errors} />

        <FoodSelector
          title="Café da manhã"
          isIncluded={true}
          foods={foodData.breakfast}
          selectedItems={watch("breakfastItems") || []}
          onChange={(items) => {
            setValue("breakfastItems", items);
            if (items.length > 0) handleMealSectionFocus("breakfast");
          }}
          error={mealValidationErrors.breakfast}
          isMinimized={shouldMinimize("breakfast")}
          onExpand={() => handleMealSectionExpand("breakfast")}
          isRequired={true}
        />

        <FoodSelector
          title="Lanche da manhã"
          isIncluded={watch("includeLancheManha") || false}
          onToggleInclude={(included) => {
            setValue("includeLancheManha", included);
            if (included) handleMealSectionFocus("morningSnack");
          }}
          foods={foodData.morningSnack}
          selectedItems={watch("morningSnackItems") || []}
          onChange={(items) => {
            setValue("morningSnackItems", items);
            if (items.length > 0) handleMealSectionFocus("morningSnack");
          }}
          error={mealValidationErrors.morningSnack}
          isMinimized={shouldMinimize("morningSnack")}
          onExpand={() => handleMealSectionExpand("morningSnack")}
        />

        <FoodSelector
          title="Almoço"
          isIncluded={true}
          foods={foodData.lunch}
          selectedItems={watch("lunchItems") || []}
          onChange={(items) => {
            setValue("lunchItems", items);
            if (items.length > 0) handleMealSectionFocus("lunch");
          }}
          error={mealValidationErrors.lunch}
          isMinimized={shouldMinimize("lunch")}
          onExpand={() => handleMealSectionExpand("lunch")}
          isRequired={true}
        />

        <FoodSelector
          title="Lanche da tarde"
          isIncluded={watch("includeLancheTarde") || false}
          onToggleInclude={(included) => {
            setValue("includeLancheTarde", included);
            if (included) handleMealSectionFocus("afternoonSnack");
          }}
          foods={foodData.afternoonSnack}
          selectedItems={watch("afternoonSnackItems") || []}
          onChange={(items) => {
            setValue("afternoonSnackItems", items);
            if (items.length > 0) handleMealSectionFocus("afternoonSnack");
          }}
          error={mealValidationErrors.afternoonSnack}
          isMinimized={shouldMinimize("afternoonSnack")}
          onExpand={() => handleMealSectionExpand("afternoonSnack")}
        />

        <FoodSelector
          title="Jantar"
          isIncluded={true}
          foods={foodData.dinner}
          selectedItems={watch("dinnerItems") || []}
          onChange={(items) => {
            setValue("dinnerItems", items);
            if (items.length > 0) handleMealSectionFocus("dinner");
          }}
          error={mealValidationErrors.dinner}
          isMinimized={shouldMinimize("dinner")}
          onExpand={() => handleMealSectionExpand("dinner")}
          isRequired={true}
        />

        <DietaPersonalizada
          onClick={handleSubmit(onSubmit, onInvalidSubmit)}
          isSubmitting={isSubmitting}
          currentStep={dietStep}
          onUnlock={handleUnlock}
          onLoadingComplete={handleLoadingComplete}
          onPaymentSuccess={handlePaymentSuccess}
          formData={submittedFormData || undefined}
        />
      </div>
    </main>
  );
}

export default App;