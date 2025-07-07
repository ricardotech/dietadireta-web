"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Home, FileText, User, HelpCircle, LogOut, X, Check, Lock, ArrowRight, MenuIcon, AlertCircle, LineChart, CheckCircle, Pencil } from "lucide-react";
import { useState } from "react";
import { useForm, Controller, Control, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FoodSelector } from "@/components/FoodSelector";
import { PricingPage } from "@/components/PricingPage";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

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
  calories: z.string().min(1, "Por favor, selecione quantas calorias você deseja consumir por dia"),
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
    setShowAuthModal(false);
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
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">🥦</div>
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
    { value: "emagrecer", label: "Emagrecer" },
    { value: "emagrecer_massa", label: "Emagrecer + Massa" },
    { value: "definicao_ganho", label: "Definicao Muscular + Ganhar Massa" },
    { value: "ganhar_massa", label: "Ganhar Massa Muscular" },
  ];

  const calories = [
    { value: "0", label: "Não sei dizer" },
    { value: "1200", label: "1200 kcal" },
    { value: "1500", label: "1500 kcal" },
    { value: "1800", label: "1800 kcal" },
    { value: "2000", label: "2000 kcal" },
    { value: "2200", label: "2200 kcal" },
    { value: "2500", label: "2500 kcal" },
    { value: "3000", label: "3000 kcal" },
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
                  className={`py-8 px-4 text-xl ${errors.weight ? 'border-red-500 focus:border-red-500' : ''}`}
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
                  className={`py-8 px-4 text-xl ${errors.height ? 'border-red-500 focus:border-red-500' : ''}`}
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
                  className={`py-8 px-4 text-xl ${errors.age ? 'border-red-500 focus:border-red-500' : ''}`}
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
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger className={`w-full text-xl py-8 px-4 ${errors.objective ? 'border-red-500 focus:border-red-500' : ''}`}>
                    <SelectValue placeholder="Objetivo" />
                  </SelectTrigger>
                  <SelectContent className="my-1">
                    {objectives.map((o) => (
                      <SelectItem key={o.value} value={o.value} className="text-xl py-4 px-6">
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.objective && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.objective.message}
              </p>
            )}
          </div>

          <div>
            <Controller
              name="calories"
              control={control}
              render={({ field }) => (
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger className={`w-full text-xl py-8 px-4 ${errors.calories ? 'border-red-500 focus:border-red-500' : ''}`}>
                    <SelectValue placeholder="Calorias diárias 🔥" />
                  </SelectTrigger>
                  <SelectContent className="my-1">
                    {calories.map((o) => (
                      <SelectItem key={o.value} value={o.value} className="text-xl py-4 px-6">
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.calories && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.calories.message}
              </p>
            )}
          </div>

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

function DietaPersonalizada({ onClick, isSubmitting }: { onClick: () => void, isSubmitting: boolean }) {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="p-8">
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
      </div>
    </div>
  );
}

function App() {
  const [showPricing, setShowPricing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mealValidationErrors, setMealValidationErrors] = useState<Record<string, string>>({});

  const {
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      weight: '',
      height: '',
      age: '',
      objective: '',
      calories: '',
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

  const onSubmit = async (data: FormData) => {
    // Clear previous validation errors
    setMealValidationErrors({});

    // Custom validation for meal selections - only main meals are required
    const newValidationErrors: Record<string, string> = {};

    // Only validate meals that are included (toggled on)
    if (data.includeCafeManha && data.breakfastItems.length < 3) {
      newValidationErrors.breakfast = 'Selecione pelo menos 3 alimentos para o café da manhã';
    }
    if (data.includeAlmoco && data.lunchItems.length < 3) {
      newValidationErrors.lunch = 'Selecione pelo menos 3 alimentos para o almoço';
    }
    if (data.includeJantar && data.dinnerItems.length < 3) {
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
      return;
    }

    setIsSubmitting(true);
    console.log('Form data:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowPricing(true);
  };

  const handlePurchase = (planType: string) => {
    console.log("Purchase plan:", planType);
    // Implement purchase logic here
  };

  if (showPricing) {
    return (
      <PricingPage
        onBack={() => setShowPricing(false)}
        onPurchase={handlePurchase}
      />
    );
  }

  return (
    <main className="bg-[#F9FAFB]">
      <Header />
      <div className="h-[70px]"></div>

      <div className="py-8 px-4 space-y-8">
        <MedidasCorporais control={control} errors={errors} />

        <FoodSelector
          title="Café da manhã"
          isIncluded={watch("includeCafeManha") || false}
          onToggleInclude={(included) => setValue("includeCafeManha", included)}
          foods={foodData.breakfast}
          selectedItems={watch("breakfastItems") || []}
          onChange={(items) => setValue("breakfastItems", items)}
          error={mealValidationErrors.breakfast}
        />

        <FoodSelector
          title="Lanche da manhã"
          isIncluded={watch("includeLancheManha") || false}
          onToggleInclude={(included) => setValue("includeLancheManha", included)}
          foods={foodData.morningSnack}
          selectedItems={watch("morningSnackItems") || []}
          onChange={(items) => setValue("morningSnackItems", items)}
          error={mealValidationErrors.morningSnack}
        />

        <FoodSelector
          title="Almoço"
          isIncluded={watch("includeAlmoco") || false}
          onToggleInclude={(included) => setValue("includeAlmoco", included)}
          foods={foodData.lunch}
          selectedItems={watch("lunchItems") || []}
          onChange={(items) => setValue("lunchItems", items)}
          error={mealValidationErrors.lunch}
        />

        <FoodSelector
          title="Lanche da tarde"
          isIncluded={watch("includeLancheTarde") || false}
          onToggleInclude={(included) => setValue("includeLancheTarde", included)}
          foods={foodData.afternoonSnack}
          selectedItems={watch("afternoonSnackItems") || []}
          onChange={(items) => setValue("afternoonSnackItems", items)}
          error={mealValidationErrors.afternoonSnack}
        />

        <FoodSelector
          title="Jantar"
          isIncluded={watch("includeJantar") || false}
          onToggleInclude={(included) => setValue("includeJantar", included)}
          foods={foodData.dinner}
          selectedItems={watch("dinnerItems") || []}
          onChange={(items) => setValue("dinnerItems", items)}
          error={mealValidationErrors.dinner}
        />

        <DietaPersonalizada
          onClick={() => {
            const data = watch();
            onSubmit(data);
          }}
          isSubmitting={isSubmitting}
        />
      </div>
    </main>
  );
}

export default App;