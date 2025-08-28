"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Home, FileText, User, HelpCircle, LogOut, X, Check, Lock, ArrowRight, MenuIcon, AlertCircle, LineChart, CheckCircle, Pencil, Copy, Download, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, Control, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FoodSelector } from "@/components/FoodSelector";
import { SupplementSelector } from "@/components/SupplementSelector";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { usePDF } from 'react-to-pdf';
import { toast } from "sonner";
import { DietPDFComponent } from "@/components/DietPDFComponent";
import type { 
  ParsedDietData, 
  OrderData, 
  Step,
  MealItem,
  MealSection
} from "@/types/types";

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
  gender: z.enum(['masculino', 'feminino', 'outro', 'prefiro_nao_dizer'], {
    required_error: "Por favor, selecione seu gênero",
  }),
  objective: z.string().min(1, "Por favor, selecione qual é o seu objetivo principal"),
  frequenciaTreino: z.string().min(1, "Por favor, selecione sua frequência de treino"),
  condicoesSaude: z.array(z.string()).optional(),
  restricoesAlimentares: z.array(z.string()).optional(),
  alergiasAlimentares: z.string().optional(),
  usesSupplements: z.boolean(),
  supplements: z.array(z.string()),
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
    { value: "aveia", emoji: "🥣", label: "Aveia" },
    { value: "granola_breakfast", emoji: "🥣", label: "Granola" },
    { value: "mingau", emoji: "🥣", label: "Mingau" },
    { value: "vitamina_breakfast", emoji: "🥤", label: "Vitamina" },
    { value: "presunto", emoji: "🥓", label: "Presunto" },
    { value: "peito_peru", emoji: "🦃", label: "Peito de Peru" },
    { value: "pao_integral", emoji: "🍞", label: "Pão Integral" },
    { value: "torrada", emoji: "🍞", label: "Torrada" },
    { value: "waffle", emoji: "🧇", label: "Waffle" },
    { value: "mamao", emoji: "🈴", label: "Mamão" },
    { value: "banana_breakfast", emoji: "🍌", label: "Banana" },
    { value: "maca_breakfast", emoji: "🍎", label: "Maçã" },
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
    { value: "amendoim", emoji: "🥜", label: "Amendoim" },
    { value: "nozes", emoji: "🥜", label: "Nozes" },
    { value: "amendoas", emoji: "🥜", label: "Amêndoas" },
    { value: "castanha_para", emoji: "🥜", label: "Castanha do Pará" },
    { value: "barra_proteina", emoji: "🍫", label: "Barra de Proteína" },
    { value: "shake", emoji: "🥤", label: "Shake" },
    { value: "pacoca", emoji: "🍬", label: "Paçoca" },
    { value: "pe_moleque", emoji: "🍬", label: "Pé de Moleque" },
    { value: "cuscuz_snack", emoji: "⚪", label: "Cuscuz" },
    { value: "fruta_snack", emoji: "🍊", label: "Fruta" },
    { value: "manga", emoji: "🥭", label: "Manga" },
    { value: "melancia", emoji: "🍉", label: "Melancia" },
  ],
  lunch: [
    { value: "frango", emoji: "🍗", label: "Frango" },
    { value: "patinho", emoji: "🥩", label: "Patinho" },
    { value: "alcatra", emoji: "🥩", label: "Alcatra" },
    { value: "carne_moida", emoji: "🥩", label: "Carne Moída" },
    { value: "carne_porco", emoji: "🥓", label: "Carne-Porco" },
    { value: "linguica", emoji: "🌭", label: "Linguiça" },
    { value: "costela", emoji: "🍖", label: "Costela" },
    { value: "picanha", emoji: "🥩", label: "Picanha" },
    { value: "file_mignon", emoji: "🥩", label: "Filé Mignon" },
    { value: "cupim", emoji: "🥩", label: "Cupim" },
    { value: "tilapia", emoji: "🐟", label: "Tilápia" },
    { value: "merluza", emoji: "🐟", label: "Merluza" },
    { value: "salmao", emoji: "🐟", label: "Salmão" },
    { value: "ovo", emoji: "🥚", label: "Ovo" },
    { value: "arroz", emoji: "🍚", label: "Arroz" },
    { value: "arroz_integral", emoji: "🍚", label: "Arroz Integral" },
    { value: "feijao", emoji: "🫘", label: "Feijão" },
    { value: "feijao_preto", emoji: "🫘", label: "Feijão Preto" },
    { value: "mandioca", emoji: "🍠", label: "Mandioca" },
    { value: "batata_doce", emoji: "🍠", label: "Batata-Doce" },
    { value: "batata", emoji: "🥔", label: "Batata" },
    { value: "inhame", emoji: "🍠", label: "Inhame" },
    { value: "macarrao", emoji: "🍝", label: "Macarrão" },
    { value: "quinoa", emoji: "🌾", label: "Quinoa" },
    { value: "cuscuz", emoji: "⚪", label: "Cuscuz" },
    { value: "milho", emoji: "🌽", label: "Milho" },
    { value: "salada", emoji: "🥗", label: "Salada" },
    { value: "brocolis", emoji: "🥦", label: "Brócolis" },
    { value: "couve_flor", emoji: "🥦", label: "Couve-flor" },
    { value: "cenoura", emoji: "🥕", label: "Cenoura" },
    { value: "beterraba", emoji: "🟣", label: "Beterraba" },
    { value: "abobrinha", emoji: "🥒", label: "Abobrinha" },
    { value: "couve", emoji: "🥬", label: "Couve" },
    { value: "espinafre", emoji: "🥬", label: "Espinafre" },
    { value: "tomate", emoji: "🍅", label: "Tomate" },
    { value: "cebola", emoji: "🧅", label: "Cebola" },
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
    { value: "amendoim_tarde", emoji: "🥜", label: "Amendoim" },
    { value: "nozes_tarde", emoji: "🥜", label: "Nozes" },
    { value: "barra_cereal", emoji: "🍫", label: "Barra de Cereal" },
    { value: "shake_tarde", emoji: "🥤", label: "Shake" },
    { value: "pacoca_tarde", emoji: "🍬", label: "Paçoca" },
    { value: "cocada", emoji: "🥥", label: "Cocada" },
    { value: "rapadura", emoji: "🍬", label: "Rapadura" },
    { value: "pao_de_queijo_tarde", emoji: "🧀", label: "Pão de Queijo" },
    { value: "biscoito_polvilho", emoji: "🍘", label: "Biscoito de Polvilho" },
    { value: "queijo_branco", emoji: "🧀", label: "Queijo Branco" },
    { value: "agua_coco", emoji: "🥥", label: "Água de Coco" },
    { value: "suco_natural", emoji: "🧃", label: "Suco Natural" },
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
    { value: "carne_moida_janta", emoji: "🥩", label: "Carne Moída" },
    { value: "strogonoff", emoji: "🍛", label: "Strogonoff" },
    { value: "escondidinho", emoji: "🍲", label: "Escondidinho" },
    { value: "macarronada", emoji: "🍝", label: "Macarronada" },
    { value: "lasanha", emoji: "🍝", label: "Lasanha" },
    { value: "canja", emoji: "🍵", label: "Canja" },
    { value: "risotto", emoji: "🍚", label: "Risotto" },
    { value: "pure_batata", emoji: "🥔", label: "Purê de Batata" },
    { value: "arroz_carreteiro", emoji: "🍚", label: "Arroz Carreteiro" },
    { value: "sanduiche_natural", emoji: "🥪", label: "Sanduíche Natural" },
    { value: "torrada_integral", emoji: "🍞", label: "Torrada Integral" },
    { value: "wrap", emoji: "🌯", label: "Wrap" },
  ],
};

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

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
                  onClick={() => router.push('/perfil')}
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
                  <div className="flex items-center space-x-3">

                    <div>
                      <img
                        src="/logo.png"
                        alt="Logo"
                        className="w-[70%]"
                      />
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
                  {!loading && user ? (
                    // Authenticated user navigation
                    <>
                      {navigationItems.map((item, index) => (
                        <div key={item.label} className="relative">
                          <Button
                            variant="ghost"
                            className={`w-full justify-start px-6 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-none relative group ${index === 0 ? 'bg-gray-50' : ''
                              }`}
                            onClick={() => {
                              router.push(item.href);
                              setIsOpen(false);
                            }}
                          >
                            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-green-500 transition-opacity ${index === 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                              }`} />
                            <item.icon className="w-5 h-5 mr-4 text-gray-600" />
                            {item.label}
                          </Button>
                        </div>
                      ))}
                    </>
                  ) : (
                    // Non-authenticated user - empty navigation or welcome message
                    <div className="px-6 py-8 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="mt-4 text-lg font-semibold text-gray-900 mb-2">
                          Bem-vindo!
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Entre na sua conta para acessar dietas personalizadas e muito mais.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Section */}
                <div className="border-t border-gray-100 p-6 space-y-4">
                  {!loading && (
                    user ? (
                      <>
                        {/* User Profile Info */}
                        <div 
                          className="flex items-center space-x-3 mb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                          onClick={() => {
                            router.push('/perfil');
                            setIsOpen(false);
                          }}
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-base font-semibold text-gray-900">Perfil</p>
                            <p className="text-sm text-gray-500">Gerencie sua conta</p>
                          </div>
                        </div>

                        {/* User Details */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-3">📧</span>
                            <span className="truncate">{user.email}</span>
                          </div>
                          {user.phoneNumber && (
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-3">📱</span>
                              <span>{user.phoneNumber}</span>
                            </div>
                          )}
                        </div>

                        {/* Logout Button */}
                        <Button
                          variant="outline"
                          className="w-full justify-start px-0 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 hover:border-red-300 transition-colors"
                          onClick={handleSignOut}
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sair da conta
                        </Button>
                      </>
                    ) : (
                      <>
                        {/* Login CTA for non-authenticated users */}
                        <div className="text-center space-y-4">

                          <Button
                            onClick={() => {
                              setAuthModalMode('signin');
                              setShowAuthModal(true);
                              setIsOpen(false);
                            }}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            Já possuo uma conta
                          </Button>
                        </div>
                      </>
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

  const trainingFrequencyOptions = [
    { 
      value: "1-3", 
      emoji: "🏃‍♂️", 
      label: "Iniciante",
      description: "1 a 3 dias por semana"
    },
    { 
      value: "3-5", 
      emoji: "💪", 
      label: "Intermediário",
      description: "3 a 5 dias por semana"
    },
    { 
      value: "5-7", 
      emoji: "🏋️‍♂️", 
      label: "Avançado",
      description: "5 a 7 dias por semana"
    },
  ];

  const healthConditions = [
    { value: 'diabetes', label: 'Diabetes', emoji: '🩺' },
    { value: 'hipertensao', label: 'Hipertensão', emoji: '❤️' },
    { value: 'colesterol_alto', label: 'Colesterol Alto', emoji: '🫀' },
    { value: 'intolerancia_lactose', label: 'Intolerância à Lactose', emoji: '🥛' },
    { value: 'doenca_celiaca', label: 'Doença Celíaca', emoji: '🌾' },
    { value: 'gastrite', label: 'Gastrite', emoji: '💊' },
    { value: 'refluxo', label: 'Refluxo', emoji: '🔥' },
  ];

  const dietaryRestrictions = [
    { value: 'vegetariano', label: 'Vegetariano', emoji: '🥗' },
    { value: 'vegano', label: 'Vegano', emoji: '🌱' },
    { value: 'sem_gluten', label: 'Sem Glúten', emoji: '🌾' },
    { value: 'sem_lactose', label: 'Sem Lactose', emoji: '🥛' },
    { value: 'low_carb', label: 'Low Carb', emoji: '🥩' },
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
              name="gender"
              control={control}
              render={({ field }) => (
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-gray-800">Gênero</label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => field.onChange('masculino')}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${field.value === 'masculino'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                    >
                      <div className="text-2xl mb-2">👨</div>
                      <div className="font-medium text-sm">Masculino</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange('feminino')}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${field.value === 'feminino'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                    >
                      <div className="text-2xl mb-2">👩</div>
                      <div className="font-medium text-sm">Feminino</div>
                    </button>
                  </div>
                </div>
              )}
            />
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.gender.message}
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

          <div>
            <Controller
              name="frequenciaTreino"
              control={control}
              render={({ field }) => (
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-gray-800">Frequência de Treino</label>
                  <div className="space-y-3 mt-2">
                    {trainingFrequencyOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => field.onChange(option.value)}
                        className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${field.value === option.value
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                      >
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">{option.emoji}</div>
                          <div className="flex-1">
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-gray-600">{option.description}</div>
                          </div>
                          {field.value === option.value && (
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            />
            {errors.frequenciaTreino && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.frequenciaTreino.message}
              </p>
            )}
          </div>

          <div>
            <Controller
              name="condicoesSaude"
              control={control}
              render={({ field }) => (
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-gray-800">Condições de Saúde (opcional)</label>
                  <p className="text-sm text-gray-600">Selecione se você possui alguma condição de saúde</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {healthConditions.map((condition) => (
                      <button
                        key={condition.value}
                        type="button"
                        onClick={() => {
                          const currentValues = field.value || [];
                          if (currentValues.includes(condition.value)) {
                            field.onChange(currentValues.filter((v: string) => v !== condition.value));
                          } else {
                            field.onChange([...currentValues, condition.value]);
                          }
                        }}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-left text-sm ${
                          field.value?.includes(condition.value)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">{condition.emoji}</span>
                          <span>{condition.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            />
          </div>

          <div>
            <Controller
              name="restricoesAlimentares"
              control={control}
              render={({ field }) => (
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-gray-800">Restrições Alimentares (opcional)</label>
                  <p className="text-sm text-gray-600">Selecione suas preferências alimentares</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {dietaryRestrictions.map((restriction) => (
                      <button
                        key={restriction.value}
                        type="button"
                        onClick={() => {
                          const currentValues = field.value || [];
                          if (currentValues.includes(restriction.value)) {
                            field.onChange(currentValues.filter((v: string) => v !== restriction.value));
                          } else {
                            field.onChange([...currentValues, restriction.value]);
                          }
                        }}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-left text-sm ${
                          field.value?.includes(restriction.value)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">{restriction.emoji}</span>
                          <span>{restriction.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            />
          </div>

          <div>
            <Controller
              name="alergiasAlimentares"
              control={control}
              render={({ field }) => (
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-gray-800">Alergias Alimentares (opcional)</label>
                  <Input
                    {...field}
                    placeholder="Ex: amendoim, frutos do mar, ovo..."
                    className="py-3 px-4"
                  />
                </div>
              )}
            />
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
  onLoadingComplete,
  formData,
  dietData,
  setDietData,
  isPaymentConfirmed,
  setIsPaymentConfirmed,
  showRegenerateInput,
  setShowRegenerateInput,
  regenerateFeedback,
  setRegenerateFeedback,
  isRegenerating,
  hasRegenerated,
  handleRegenerateDiet,
  parseDietResponse,
  setHasRegenerated
}: {
  onClick: () => void,
  isSubmitting: boolean,
  currentStep: Step,
  onLoadingComplete: () => void,
  formData?: FormData,
  dietData: ParsedDietData | null,
  setDietData: (data: ParsedDietData | null) => void,
  isPaymentConfirmed: boolean,
  setIsPaymentConfirmed: (confirmed: boolean) => void,
  showRegenerateInput: boolean,
  setShowRegenerateInput: (show: boolean) => void,
  regenerateFeedback: string,
  setRegenerateFeedback: (feedback: string) => void,
  isRegenerating: boolean,
  hasRegenerated: boolean,
  handleRegenerateDiet: () => Promise<void>,
  parseDietResponse: (response: string) => ParsedDietData | null,
  setHasRegenerated: (value: boolean) => void
}) {
  const [loadingStep, setLoadingStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [shouldContinueAfterAuth, setShouldContinueAfterAuth] = useState(false);
  const { user } = useAuth();
  const { toPDF, targetRef } = usePDF({ 
    filename: 'minha-dieta-personalizada.pdf',
    page: {
      margin: 10,
      format: 'a4',
      orientation: 'portrait',
    },
    canvas: {
      mimeType: 'image/jpeg',
      qualityRatio: 1
    }
  });

  // Check if we should skip to diet view for logged in users with paid diet
  const shouldShowDietDirectly = () => {
    return user && isPaymentConfirmed && dietData && dietData.breakfast && dietData.breakfast.main && dietData.breakfast.main.length > 0;
  };

  // Skip form and preview steps if user has a paid diet
  const getEffectiveStep = () => {
    if (shouldShowDietDirectly()) {
      return 'preview'; // Always show as preview but with payment confirmed
    }
    return currentStep;
  };

  const effectiveStep = getEffectiveStep();

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
          gender: formData?.gender || 'masculino',
          schedule: 'padrao', // Fixed: use valid schedule value
          activityLevel: 'moderado', // Fixed: use valid activity level enum
          workoutPlan: 'nenhum', // Fixed: use valid workout plan enum
          breakfast: formData?.breakfastItems?.join(', ') || 'ovos, aveia, frutas',
          morningSnack: formData?.includeLancheManha ? (formData?.morningSnackItems?.join(', ') || 'frutas, castanhas') : '',
          lunch: formData?.lunchItems?.join(', ') || 'frango, arroz, verduras',
          afternoonSnack: formData?.includeLancheTarde ? (formData?.afternoonSnackItems?.join(', ') || 'iogurte, frutas') : '',
          dinner: formData?.dinnerItems?.join(', ') || 'peixe, batata, salada',
          usesSupplements: formData?.usesSupplements || false,
          supplements: formData?.supplements?.join(', ') || '',
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
          breakfast: {
            main: [
              { name: "Tapioca + Frango", quantity: "1 unidade média", calories: 250 },
              { name: "Café com Leite", quantity: "200ml", calories: 80 },
              { name: "Banana", quantity: "1 unidade", calories: 90 }
            ],
            alternatives: [
              { name: "Pão Integral + Ovo", quantity: "2 fatias + 1 ovo", calories: 240 },
              { name: "Iogurte Natural", quantity: "200ml", calories: 85 },
              { name: "Maçã", quantity: "1 unidade", calories: 95 }
            ]
          },
          lunch: {
            main: [
              { name: "Frango Grelhado", quantity: "150g", calories: 330 },
              { name: "Arroz Integral", quantity: "4 colheres", calories: 160 },
              { name: "Brócolis", quantity: "1 xícara", calories: 55 }
            ],
            alternatives: [
              { name: "Peixe Assado", quantity: "150g", calories: 320 },
              { name: "Batata Doce", quantity: "1 unidade média", calories: 165 },
              { name: "Couve Refogada", quantity: "1 porção", calories: 50 }
            ]
          },
          dinner: {
            main: [
              { name: "Salmão Grelhado", quantity: "120g", calories: 280 },
              { name: "Batata Doce", quantity: "1 unidade pequena", calories: 120 },
              { name: "Salada Verde", quantity: "1 prato", calories: 50 }
            ],
            alternatives: [
              { name: "Peito de Peru", quantity: "120g", calories: 275 },
              { name: "Quinoa", quantity: "3 colheres", calories: 125 },
              { name: "Espinafre Refogado", quantity: "1 porção", calories: 45 }
            ]
          },
          morningSnack: null,
          afternoonSnack: null,
          totalCalories: 1425,
          notes: "Dieta personalizada em processamento..."
        });
        console.log('dietData set successfully');
        return data;
      }

      console.error('Invalid API response - missing success or dietId:', data);
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Error generating diet:', error);
      // Fallback to mock data if API fails
      const mockData = generateFallbackDietData(
        'fallback-diet-id',
        "Lembre-se de beber pelo menos 2 litros de água por dia e fazer as refeições nos horários indicados."
      );
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

      // Prepare request body
      const requestBody: Record<string, any> = {};

      // Check if dietId is a valid UUID format
      const isValidUUID = (uuid: string) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
      };

      if (dietId && isValidUUID(dietId)) {
        // If we have a valid UUID, use it
        requestBody.dietId = dietId;
      } else {
        // If no valid dietId, we need to create a diet first or send userData
        // Include user information for payment processing
        if (user) {
          requestBody.userInfo = {
            email: user.email,
            phoneNumber: user.phoneNumber,
            cpf: user.cpf,
          };
        }

        // Include userData for diet creation
        if (formData) {
          // Map frontend values to backend enum values
          const goalMapping: Record<string, string> = {
            'emagrecer': 'emagrecer',
            'emagrecer_massa': 'emagrecer+massa',
            'ganhar_massa': 'ganhar massa muscular',
            'definicao_ganho': 'definicao muscular + ganhar massa'
          };

          // Map activity level values to backend enum values
          const activityLevelMapping: Record<string, string> = {
            'sedentario': 'sedentario',
            'leve': 'leve',
            'moderado': 'moderado',
            'intenso': 'intenso',
            'muito_intenso': 'muito_intenso'
          };

          // Map workout plan values to backend enum values
          const workoutPlanMapping: Record<string, string> = {
            'academia': 'academia',
            'casa': 'casa',
            'nenhum': 'nenhum'
          };

          requestBody.userData = {
            weight: formData.weight,
            height: formData.height,
            age: formData.age,
            goal: goalMapping[formData.objective] || formData.objective,
            calories: "2000", // Default value since it's not in the form
            gender: formData.gender || "masculino",
            schedule: "07:00-10:00-12:30-15:30-19:30", // Default value since it's not in the form
            activityLevel: "moderado", // Default value since it's not in the form
            workoutPlan: "academia", // Default value since it's not in the form
            breakfast: formData.breakfastItems?.join(', ') || "pao, cafe",
            morningSnack: formData.includeLancheManha ? (formData.morningSnackItems?.join(', ') || "fruta") : "",
            lunch: formData.lunchItems?.join(', ') || "arroz, feijao, carne",
            afternoonSnack: formData.includeLancheTarde ? (formData.afternoonSnackItems?.join(', ') || "iogurte") : "",
            dinner: formData.dinnerItems?.join(', ') || "salada, proteina",
            usesSupplements: formData.usesSupplements || false,
            supplements: formData.supplements?.join(', ') || ''
          };
        } else {
          // If no formData available, provide minimal default userData
          console.warn('No formData available, using default userData for checkout');
          requestBody.userData = {
            weight: "70",
            height: "175",
            age: "30",
            goal: "emagrecer",
            calories: "2000",
            gender: "masculino",
            schedule: "07:00-10:00-12:30-15:30-19:30",
            activityLevel: "moderado",
            workoutPlan: "academia",
            breakfast: "pao, cafe",
            morningSnack: "fruta",
            lunch: "arroz, feijao, carne",
            afternoonSnack: "iogurte",
            dinner: "salada, proteina"
          };
        }
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

      const data = await response.json();
      console.log('Checkout API Response:', data);

      if (!response.ok) {
        const errorMessage = data.error || 'Failed to create checkout';
        throw new Error(errorMessage);
      }

      if (data.success) {
        setOrderData(data.data);
        return data;
      }

      throw new Error(data.error || 'Invalid checkout response');
    } catch (error) {
      console.error('Error creating checkout:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar pedido. Tente novamente.';
      toast.error(errorMessage);
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
      
      // Check if payment is confirmed using the 'paid' field from backend
      if (data && !data.paid) {
        // Payment not confirmed yet - don't show error toast here, let handlePaymentConfirm handle it
        return { ...data, success: false };
      }
      
      return data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      toast.error("Erro ao verificar o pagamento. Por favor, tente novamente.");
      throw error;
    }
  };

  // Reset loading state when entering loading step
  useEffect(() => {
    if (effectiveStep === 'loading') {
      setLoadingStep(0);
      setCompletedSteps([]);
    }
  }, [effectiveStep]);

  // Handle loading progress with increased time
  useEffect(() => {
    if (effectiveStep === 'loading') {
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
  }, [effectiveStep, user, generateDiet, onLoadingComplete]);


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
    if (effectiveStep === 'loading' && user && !shouldContinueAfterAuth && !showAuthModal) {
      const token = localStorage.getItem('token');
      if (token && effectiveStep === 'loading') {
        // User is authenticated, skip auth modal and proceed with diet generation
        // This will be handled by the main loading useEffect above
      }
    }
  }, [effectiveStep, user, shouldContinueAfterAuth, showAuthModal]);

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
      
      console.log('Payment status response:', paymentStatus);

      // Check if payment is confirmed using the 'paid' field from backend
      if (paymentStatus.success && paymentStatus.paid) {
        // Payment confirmed successfully
        setIsPaymentConfirmed(true);
        setShowPaymentModal(false);
        
        // Save order data to local storage for future reference
        localStorage.setItem('dietabox-order-data', JSON.stringify(orderData));
        
        // If diet is ready, parse and set the diet data
        if (paymentStatus.data?.aiResponse) {
          console.log('Processing AI response:', paymentStatus.data.aiResponse);
          const parsedDiet = parseDietResponse(paymentStatus.data.aiResponse);
          console.log('Parsed diet data:', parsedDiet);
          
          // Save the diet data to localStorage
          localStorage.setItem('dietabox-diet-data', JSON.stringify(parsedDiet));
          
          // Update the state
          setDietData(parsedDiet);
          toast.success('Pagamento confirmado! Sua dieta personalizada está pronta.');
        } else if (paymentStatus.processing) {
          toast.success('Pagamento confirmado! Sua dieta está sendo gerada...');
          // Keep existing diet data or set fallback if none exists
          if (!dietData || !dietData.breakfast) {
            const fallbackData = generateFallbackDietData(
              undefined,
              "Sua dieta está sendo gerada. Esta é uma prévia que será substituída pela sua dieta personalizada em breve."
            );
            
            setDietData(fallbackData);
            localStorage.setItem('dietabox-diet-data', JSON.stringify(fallbackData));
          }
        } else {
          // Fallback - payment confirmed but no AI response yet
          toast.success('Pagamento confirmado! Sua dieta estará disponível em breve.');
          // Keep existing diet data or set fallback if none exists
          if (!dietData || !dietData.breakfast) {
            const fallbackData = generateFallbackDietData(
              undefined,
              "Sua dieta personalizada foi liberada! Acompanhe as refeições sugeridas e lembre-se de beber bastante água."
            );
            
            setDietData(fallbackData);
            localStorage.setItem('dietabox-diet-data', JSON.stringify(fallbackData));
          }
        }
      } else {
        // Payment not confirmed yet - show specific message based on status
        const status = paymentStatus.status || 'unknown';
        const message = paymentStatus.message || 'Status desconhecido';
        
        console.log('Payment not confirmed. Status:', status, 'Message:', message);
        
        // Show appropriate toast message based on status
        switch (status) {
          case 'pending':
            toast.warning('Aguardando confirmação do pagamento PIX. Tente novamente em alguns minutos.');
            break;
          case 'waiting_payment':
            toast.warning('Aguardando confirmação do pagamento PIX. Tente novamente em alguns minutos.');
            break;
          case 'failed':
            toast.error('Pagamento falhou. Tente gerar um novo PIX.');
            break;
          case 'canceled':
            toast.error('Pagamento foi cancelado. Tente gerar um novo PIX.');
            break;
          case 'processing':
            toast.info('Pagamento está sendo processado. Por favor, aguarde alguns instantes.');
            break;
          default:
            toast.warning(message || 'Pagamento ainda não foi confirmado. Tente novamente em alguns minutos.');
        }
      }
    } catch (error) {
      console.error('Error checking payment:', error);
      toast.error('Erro ao verificar pagamento. Tente novamente.');
    } finally {
      setIsCheckingPayment(false);
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

  const MealPreviewCard = ({ title, mealData, showMore = false, isBlurred = false }: {
    title: string;
    mealData: { main: { name: string; quantity: string; calories: number }[]; alternatives: { name: string; quantity: string; calories: number }[] } | null;
    showMore?: boolean;
    isBlurred?: boolean;
  }) => {
    if (!mealData) return null;
    
    const mainItems = mealData.main || [];
    const totalAlternatives = (mealData.alternatives || []).length;
    
    return (
      <div className={`bg-gray-50 p-4 rounded-lg relative ${isBlurred ? 'overflow-hidden' : ''}`}>
        <div className={isBlurred ? 'filter blur-sm' : ''}>
          <h4 className="font-semibold text-green-700 mb-2">{title}</h4>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800 text-sm">{mainItems[0]?.name}</p>
                <p className="text-xs text-gray-600">{mainItems[0]?.quantity}</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {mainItems[0]?.calories} cal
              </span>
            </div>
            {showMore && (
              <div className="space-y-1">
                <p className="text-xs text-gray-500 italic">+{mainItems.length - 1} itens principais</p>
                {totalAlternatives > 0 && (
                  <p className="text-xs text-blue-500 italic">+{totalAlternatives} alternativas</p>
                )}
              </div>
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
  };

  // Helper function to calculate total calories from meal data
  const calculateTotalCalories = (dietData: any) => {
    let total = 0;
    
    // Add breakfast calories
    if (dietData.breakfast?.main) {
      total += dietData.breakfast.main.reduce((sum: number, item: any) => sum + (item.calories || 0), 0);
    }
    
    // Add morning snack calories
    if (dietData.morningSnack?.main) {
      total += dietData.morningSnack.main.reduce((sum: number, item: any) => sum + (item.calories || 0), 0);
    }
    
    // Add lunch calories
    if (dietData.lunch?.main) {
      total += dietData.lunch.main.reduce((sum: number, item: any) => sum + (item.calories || 0), 0);
    }
    
    // Add afternoon snack calories
    if (dietData.afternoonSnack?.main) {
      total += dietData.afternoonSnack.main.reduce((sum: number, item: any) => sum + (item.calories || 0), 0);
    }
    
    // Add dinner calories
    if (dietData.dinner?.main) {
      total += dietData.dinner.main.reduce((sum: number, item: any) => sum + (item.calories || 0), 0);
    }
    
    return total;
  };

  // Helper function to generate fallback diet data
  const generateFallbackDietData = (dietId?: string, notes?: string): ParsedDietData => {
    const data: ParsedDietData = {
      ...(dietId && { dietId }),
      breakfast: {
        main: [
          { name: "Tapioca com Frango", quantity: "1 unidade média", calories: 250, protein: 25, carbs: 30, fat: 5, grams: 150 },
          { name: "Café com Leite", quantity: "200ml", calories: 80, protein: 4, carbs: 8, fat: 3, grams: 200 },
          { name: "Banana", quantity: "1 unidade", calories: 90, protein: 1, carbs: 23, fat: 0.3, grams: 120 }
        ],
        alternatives: [
          { name: "Pão Integral + Ovo", quantity: "2 fatias + 1 ovo", calories: 240, protein: 15, carbs: 25, fat: 8, grams: 100 },
          { name: "Iogurte Natural", quantity: "200ml", calories: 85, protein: 5, carbs: 10, fat: 2, grams: 200 },
          { name: "Maçã", quantity: "1 unidade", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, grams: 150 }
        ],
        totalCalories: 420,
        totalProtein: 30,
        totalCarbs: 61,
        totalFat: 8.3
      },
      lunch: {
        main: [
          { name: "Frango Grelhado", quantity: "150g", calories: 330, protein: 40, carbs: 0, fat: 18, grams: 150 },
          { name: "Arroz Integral", quantity: "4 colheres", calories: 160, protein: 3, carbs: 35, fat: 1, grams: 100 },
          { name: "Feijão", quantity: "2 colheres", calories: 140, protein: 8, carbs: 25, fat: 0.5, grams: 80 }
        ],
        alternatives: [
          { name: "Peixe Assado", quantity: "150g", calories: 320, protein: 35, carbs: 0, fat: 20, grams: 150 },
          { name: "Batata Doce", quantity: "1 unidade média", calories: 165, protein: 2, carbs: 40, fat: 0.2, grams: 150 },
          { name: "Couve Refogada", quantity: "1 porção", calories: 135, protein: 3, carbs: 5, fat: 10, grams: 100 }
        ],
        totalCalories: 630,
        totalProtein: 51,
        totalCarbs: 60,
        totalFat: 19.5
      },
      dinner: {
        main: [
          { name: "Salmão Grelhado", quantity: "120g", calories: 280, protein: 35, carbs: 0, fat: 15, grams: 120 },
          { name: "Batata Doce", quantity: "1 unidade média", calories: 130, protein: 2, carbs: 30, fat: 0.2, grams: 130 },
          { name: "Brócolis", quantity: "1 xícara", calories: 40, protein: 3, carbs: 7, fat: 0.5, grams: 150 }
        ],
        alternatives: [
          { name: "Peito de Peru", quantity: "120g", calories: 275, protein: 35, carbs: 0, fat: 14, grams: 120 },
          { name: "Quinoa", quantity: "3 colheres", calories: 125, protein: 4.5, carbs: 22, fat: 2, grams: 60 },
          { name: "Espinafre Refogado", quantity: "1 porção", calories: 45, protein: 2, carbs: 3, fat: 3, grams: 100 }
        ],
        totalCalories: 450,
        totalProtein: 40,
        totalCarbs: 37,
        totalFat: 15.7
      },
      morningSnack: null,
      afternoonSnack: null,
      totalCalories: 1500, // Calculated total
      notes: notes || "Sua dieta personalizada estará disponível após o pagamento. Esta é apenas uma prévia dos tipos de alimentos que incluiremos baseados nas suas preferências."
    };
    
    return data;
  };

  // Fallback diet data
  const fallbackDietData = generateFallbackDietData();
  
  // Get the diet data to display (either real data or fallback)
  const displayDietData = dietData || fallbackDietData;

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="p-8">
        {/* Form Step */}
        {effectiveStep === 'form' && (
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
        {effectiveStep === 'loading' && (
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
        {effectiveStep === 'preview' && (
          <>
            {shouldShowDietDirectly() && (
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Sua Dieta Personalizada</h1>
                <p className="text-gray-600">Bem-vindo de volta! Aqui está sua dieta paga</p>
              </div>
            )}

            {!shouldShowDietDirectly() && (
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
                      mealData={displayDietData.breakfast}
                      showMore={true}
                      isBlurred={!isPaymentConfirmed}
                    />
                    <MealPreviewCard
                      title="Almoço"
                      mealData={displayDietData.lunch}
                      showMore={true}
                      isBlurred={!isPaymentConfirmed}
                    />
                    <MealPreviewCard
                      title="Jantar"
                      mealData={displayDietData.dinner}
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
              </>
            )}

            <div className="text-center">{!isPaymentConfirmed ? (
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
                      {user ? 'Desbloquear por R$19,90' : 'Criar Conta e Desbloquear'}
                      <span>
                        <ArrowRight className="inline-block w-8 h-8 ml-2 -mt-2" />
                      </span>
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  {/* Full Diet Display */}
                  <div className="bg-white px-6 py-4 rounded-lg">
                    {/* Hidden PDF component for export */}
                    <div style={{ display: 'none' }}>
                      <div ref={targetRef}>
                        <DietPDFComponent dietData={displayDietData} />
                      </div>
                    </div>
                   

                    {/* Regenerate Diet Button - Only show if paid and not already regenerated */}
                    {/* {isPaymentConfirmed && !hasRegenerated && !showRegenerateInput && (
                      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg text-left font-semibold text-yellow-800">Não gostou de algo?</h3>
                            <p className="text-sm text-yellow-700">Você pode gerar uma nova dieta uma única vez</p>
                          </div>
                          <Button
                            onClick={() => setShowRegenerateInput(true)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg"
                          >
                            Gerar outra dieta
                          </Button>
                        </div>
                      </div>
                    )} */}

                    {/* Create New Diet Button - Show for users who already have a paid diet */}
                    {/* {shouldShowDietDirectly() && (
                      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg text-left font-semibold text-blue-800">Quer uma nova dieta?</h3>
                            <p className="text-sm text-blue-700">Você pode criar uma nova dieta com novas preferências</p>
                          </div>
                          <Button
                            onClick={() => {
                              // Reset states to allow new diet creation
                              setIsPaymentConfirmed(false);
                              setDietData(null);
                              setHasRegenerated(false);
                              setShowRegenerateInput(false);
                              setRegenerateFeedback('');
                              // Clear localStorage
                              localStorage.removeItem('dietabox-diet-data');
                              localStorage.removeItem('dietabox-diet-step');
                              localStorage.removeItem('dietabox-form-data');
                              // Reload page to restart the flow
                              window.location.reload();
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
                          >
                            Criar nova dieta
                          </Button>
                        </div>
                      </div>
                    )} */}

                    {/* Regenerate Feedback Input */}
                    {showRegenerateInput && (
                      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-800 mb-3">O que você não gostou?</h3>
                        <textarea
                          value={regenerateFeedback}
                          onChange={(e) => setRegenerateFeedback(e.target.value)}
                          placeholder="Descreva o que você gostaria de mudar na sua dieta (ex: 'Não gosto de brócolis, prefiro couve-flor')"
                          className="w-full p-3 border border-blue-300 rounded-lg resize-none h-24"
                          maxLength={500}
                        />
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-sm text-blue-600">{regenerateFeedback.length}/500 caracteres</span>
                          <div className="space-x-2">
                            <Button
                              onClick={() => {
                                setShowRegenerateInput(false);
                                setRegenerateFeedback('');
                              }}
                              variant="outline"
                              className="text-gray-600 border-gray-300"
                            >
                              Cancelar
                            </Button>
                            <Button
                              onClick={handleRegenerateDiet}
                              disabled={isRegenerating || regenerateFeedback.trim().length < 10}
                              className="bg-blue-500 hover:bg-blue-600 text-white font-medium"
                            >
                              {isRegenerating ? (
                                <div className="flex items-center">
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Gerando...
                                </div>
                              ) : (
                                'Gerar nova dieta'
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {hasRegenerated && (
                      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <span className="text-green-800 font-medium">Nova dieta gerada com base no seu feedback!</span>
                        </div>
                      </div>
                    )}

                    {/* Complete Meal Sections */}
                    <div className="space-y-6">
                      {displayDietData.breakfast && (
                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200 shadow-sm">
                          <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                              Café da Manhã
                            </div>
                            {displayDietData.breakfast.totalCalories && (
                              <span className="text-sm font-normal text-gray-600">
                                Total: {displayDietData.breakfast.totalCalories} cal
                              </span>
                            )}
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-md font-medium text-gray-700 mb-2">Plano Principal</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {displayDietData.breakfast.main?.map((item, index) => (
                                  <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-600">{item.quantity}</p>
                                        {item.grams && (
                                          <p className="text-xs text-gray-500 mt-1">{item.grams}g</p>
                                        )}
                                      </div>
                                      <div className="text-right ml-3">
                                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded block">
                                          {item.calories} cal
                                        </span>
                                        {(item.protein || item.carbs || item.fat) && (
                                          <div className="text-xs text-gray-600 mt-1">
                                            {item.protein && <div>P: {item.protein}g</div>}
                                            {item.carbs && <div>C: {item.carbs}g</div>}
                                            {item.fat && <div>G: {item.fat}g</div>}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {displayDietData.breakfast.alternatives && displayDietData.breakfast.alternatives.length > 0 && (
                              <div>
                                <h4 className="text-md font-medium text-blue-700 mb-2">Alternativas</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {displayDietData.breakfast.alternatives.map((item, index) => (
                                    <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <p className="font-medium text-gray-800">{item.name}</p>
                                          <p className="text-sm text-gray-600">{item.quantity}</p>
                                          {item.grams && (
                                            <p className="text-xs text-gray-500 mt-1">{item.grams}g</p>
                                          )}
                                        </div>
                                        <div className="text-right ml-3">
                                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded block">
                                            {item.calories} cal
                                          </span>
                                          {(item.protein || item.carbs || item.fat) && (
                                            <div className="text-xs text-gray-600 mt-1">
                                              {item.protein && <div>P: {item.protein}g</div>}
                                              {item.carbs && <div>C: {item.carbs}g</div>}
                                              {item.fat && <div>G: {item.fat}g</div>}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {displayDietData.morningSnack && (
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-200 shadow-sm">
                          <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                              Lanche da Manhã
                            </div>
                            {displayDietData.morningSnack.totalCalories && (
                              <span className="text-sm font-normal text-gray-600">
                                Total: {displayDietData.morningSnack.totalCalories} cal
                              </span>
                            )}
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-md font-medium text-gray-700 mb-2">Plano Principal</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {displayDietData.morningSnack.main?.map((item, index) => (
                                  <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-600">{item.quantity}</p>
                                        {item.grams && (
                                          <p className="text-xs text-gray-500 mt-1">{item.grams}g</p>
                                        )}
                                      </div>
                                      <div className="text-right ml-3">
                                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded block">
                                          {item.calories} cal
                                        </span>
                                        {(item.protein || item.carbs || item.fat) && (
                                          <div className="text-xs text-gray-600 mt-1">
                                            {item.protein && <div>P: {item.protein}g</div>}
                                            {item.carbs && <div>C: {item.carbs}g</div>}
                                            {item.fat && <div>G: {item.fat}g</div>}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {displayDietData.morningSnack.alternatives && displayDietData.morningSnack.alternatives.length > 0 && (
                              <div>
                                <h4 className="text-md font-medium text-blue-700 mb-2">Alternativas</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {displayDietData.morningSnack.alternatives.map((item, index) => (
                                    <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <p className="font-medium text-gray-800">{item.name}</p>
                                          <p className="text-sm text-gray-600">{item.quantity}</p>
                                          {item.grams && (
                                            <p className="text-xs text-gray-500 mt-1">{item.grams}g</p>
                                          )}
                                        </div>
                                        <div className="text-right ml-3">
                                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded block">
                                            {item.calories} cal
                                          </span>
                                          {(item.protein || item.carbs || item.fat) && (
                                            <div className="text-xs text-gray-600 mt-1">
                                              {item.protein && <div>P: {item.protein}g</div>}
                                              {item.carbs && <div>C: {item.carbs}g</div>}
                                              {item.fat && <div>G: {item.fat}g</div>}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {displayDietData.lunch && (
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200 shadow-sm">
                          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">{displayDietData.morningSnack ? '3' : '2'}</span>
                              Almoço
                            </div>
                            {displayDietData.lunch.totalCalories && (
                              <span className="text-sm font-normal text-gray-600">
                                Total: {displayDietData.lunch.totalCalories} cal
                              </span>
                            )}
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-md font-medium text-gray-700 mb-2">Plano Principal</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {displayDietData.lunch.main?.map((item, index) => (
                                  <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-600">{item.quantity}</p>
                                        {item.grams && (
                                          <p className="text-xs text-gray-500 mt-1">{item.grams}g</p>
                                        )}
                                      </div>
                                      <div className="text-right ml-3">
                                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded block">
                                          {item.calories} cal
                                        </span>
                                        {(item.protein || item.carbs || item.fat) && (
                                          <div className="text-xs text-gray-600 mt-1">
                                            {item.protein && <div>P: {item.protein}g</div>}
                                            {item.carbs && <div>C: {item.carbs}g</div>}
                                            {item.fat && <div>G: {item.fat}g</div>}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {displayDietData.lunch.alternatives && displayDietData.lunch.alternatives.length > 0 && (
                              <div>
                                <h4 className="text-md font-medium text-blue-700 mb-2">Alternativas</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {displayDietData.lunch.alternatives.map((item, index) => (
                                    <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <p className="font-medium text-gray-800">{item.name}</p>
                                          <p className="text-sm text-gray-600">{item.quantity}</p>
                                          {item.grams && (
                                            <p className="text-xs text-gray-500 mt-1">{item.grams}g</p>
                                          )}
                                        </div>
                                        <div className="text-right ml-3">
                                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded block">
                                            {item.calories} cal
                                          </span>
                                          {(item.protein || item.carbs || item.fat) && (
                                            <div className="text-xs text-gray-600 mt-1">
                                              {item.protein && <div>P: {item.protein}g</div>}
                                              {item.carbs && <div>C: {item.carbs}g</div>}
                                              {item.fat && <div>G: {item.fat}g</div>}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {displayDietData.afternoonSnack && (
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200 shadow-sm">
                          <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">{(displayDietData.morningSnack ? 4 : 3)}</span>
                              Lanche da Tarde
                            </div>
                            {displayDietData.afternoonSnack.totalCalories && (
                              <span className="text-sm font-normal text-gray-600">
                                Total: {displayDietData.afternoonSnack.totalCalories} cal
                              </span>
                            )}
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-md font-medium text-gray-700 mb-2">Plano Principal</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {displayDietData.afternoonSnack.main?.map((item, index) => (
                                  <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-600">{item.quantity}</p>
                                        {item.grams && (
                                          <p className="text-xs text-gray-500 mt-1">{item.grams}g</p>
                                        )}
                                      </div>
                                      <div className="text-right ml-3">
                                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded block">
                                          {item.calories} cal
                                        </span>
                                        {(item.protein || item.carbs || item.fat) && (
                                          <div className="text-xs text-gray-600 mt-1">
                                            {item.protein && <div>P: {item.protein}g</div>}
                                            {item.carbs && <div>C: {item.carbs}g</div>}
                                            {item.fat && <div>G: {item.fat}g</div>}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {displayDietData.afternoonSnack.alternatives && displayDietData.afternoonSnack.alternatives.length > 0 && (
                              <div>
                                <h4 className="text-md font-medium text-blue-700 mb-2">Alternativas</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {displayDietData.afternoonSnack.alternatives.map((item, index) => (
                                    <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <p className="font-medium text-gray-800">{item.name}</p>
                                          <p className="text-sm text-gray-600">{item.quantity}</p>
                                          {item.grams && (
                                            <p className="text-xs text-gray-500 mt-1">{item.grams}g</p>
                                          )}
                                        </div>
                                        <div className="text-right ml-3">
                                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded block">
                                            {item.calories} cal
                                          </span>
                                          {(item.protein || item.carbs || item.fat) && (
                                            <div className="text-xs text-gray-600 mt-1">
                                              {item.protein && <div>P: {item.protein}g</div>}
                                              {item.carbs && <div>C: {item.carbs}g</div>}
                                              {item.fat && <div>G: {item.fat}g</div>}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {displayDietData.dinner && (
                        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl border-2 border-indigo-200 shadow-sm">
                          <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">{(displayDietData.morningSnack && displayDietData.afternoonSnack) ? '5' : (displayDietData.morningSnack || displayDietData.afternoonSnack) ? '4' : '3'}</span>
                              Jantar
                            </div>
                            {displayDietData.dinner.totalCalories && (
                              <span className="text-sm font-normal text-gray-600">
                                Total: {displayDietData.dinner.totalCalories} cal
                              </span>
                            )}
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-md font-medium text-gray-700 mb-2">Plano Principal</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {displayDietData.dinner.main?.map((item, index) => (
                                  <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-600">{item.quantity}</p>
                                        {item.grams && (
                                          <p className="text-xs text-gray-500 mt-1">{item.grams}g</p>
                                        )}
                                      </div>
                                      <div className="text-right ml-3">
                                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded block">
                                          {item.calories} cal
                                        </span>
                                        {(item.protein || item.carbs || item.fat) && (
                                          <div className="text-xs text-gray-600 mt-1">
                                            {item.protein && <div>P: {item.protein}g</div>}
                                            {item.carbs && <div>C: {item.carbs}g</div>}
                                            {item.fat && <div>G: {item.fat}g</div>}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {displayDietData.dinner.alternatives && displayDietData.dinner.alternatives.length > 0 && (
                              <div>
                                <h4 className="text-md font-medium text-blue-700 mb-2">Alternativas</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {displayDietData.dinner.alternatives.map((item, index) => (
                                    <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <p className="font-medium text-gray-800">{item.name}</p>
                                          <p className="text-sm text-gray-600">{item.quantity}</p>
                                          {item.grams && (
                                            <p className="text-xs text-gray-500 mt-1">{item.grams}g</p>
                                          )}
                                        </div>
                                        <div className="text-right ml-3">
                                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded block">
                                            {item.calories} cal
                                          </span>
                                          {(item.protein || item.carbs || item.fat) && (
                                            <div className="text-xs text-gray-600 mt-1">
                                              {item.protein && <div>P: {item.protein}g</div>}
                                              {item.carbs && <div>C: {item.carbs}g</div>}
                                              {item.fat && <div>G: {item.fat}g</div>}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {displayDietData.notes && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-blue-700 mb-2">Plano Nutricional Completo</h3>
                          <div className="text-gray-700 whitespace-pre-wrap">{displayDietData.notes}</div>
                        </div>
                      )}

                      {/* Resumo Nutricional Total */}
                      {(() => {
                        // Calcular totais gerais de todas as refeições
                        const calculateDailyTotals = () => {
                          let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
                          
                          const meals = [
                            displayDietData.breakfast,
                            displayDietData.morningSnack,
                            displayDietData.lunch,
                            displayDietData.afternoonSnack,
                            displayDietData.dinner
                          ];
                          
                          meals.forEach(meal => {
                            if (meal) {
                              totals.calories += meal.totalCalories || 0;
                              totals.protein += meal.totalProtein || 0;
                              totals.carbs += meal.totalCarbs || 0;
                              totals.fat += meal.totalFat || 0;
                            }
                          });
                          
                          return totals;
                        };
                        
                        const dailyTotals = calculateDailyTotals();
                        
                        return (dailyTotals.calories > 0 || dailyTotals.protein > 0 || dailyTotals.carbs > 0 || dailyTotals.fat > 0) ? (
                          <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-xl border-2 border-gray-300 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Resumo Nutricional Diário</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-white p-3 rounded-lg text-center">
                                <p className="text-sm text-gray-600">Calorias Totais</p>
                                <p className="text-2xl font-bold text-blue-600">{dailyTotals.calories}</p>
                                <p className="text-xs text-gray-500">kcal</p>
                              </div>
                              <div className="bg-white p-3 rounded-lg text-center">
                                <p className="text-sm text-gray-600">Proteínas</p>
                                <p className="text-2xl font-bold text-green-600">{dailyTotals.protein.toFixed(1)}</p>
                                <p className="text-xs text-gray-500">gramas</p>
                              </div>
                              <div className="bg-white p-3 rounded-lg text-center">
                                <p className="text-sm text-gray-600">Carboidratos</p>
                                <p className="text-2xl font-bold text-orange-600">{dailyTotals.carbs.toFixed(1)}</p>
                                <p className="text-xs text-gray-500">gramas</p>
                              </div>
                              <div className="bg-white p-3 rounded-lg text-center">
                                <p className="text-sm text-gray-600">Gorduras</p>
                                <p className="text-2xl font-bold text-purple-600">{dailyTotals.fat.toFixed(1)}</p>
                                <p className="text-xs text-gray-500">gramas</p>
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    {/* Export PDF Button */}
                    <Button
                      onClick={() => {
                        try {
                          toPDF();
                          toast.success("PDF exportado com sucesso!");
                        } catch (error) {
                          console.error('Erro ao exportar PDF:', error);
                          toast.error("Erro ao exportar PDF. Por favor, tente novamente.");
                        }
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg w-full flex items-center justify-center"
                    >
                      <Download className="inline-block w-5 h-5 mr-2" />
                      Exportar Dieta em PDF
                    </Button>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4">
                      <Button
                        onClick={() => window.location.reload()}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg flex-1"
                      >
                        <Home className="inline-block w-4 h-4 mr-2" />
                        Nova Dieta
                      </Button>
                      
                      {user && (
                        <Button
                          onClick={() => {
                            // Implementar navegação para perfil
                            toast.info("Função de perfil em desenvolvimento");
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex-1"
                        >
                          <User className="inline-block w-4 h-4 mr-2" />
                          Meu Perfil
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {!isPaymentConfirmed && !shouldShowDietDirectly() && (
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
                  {(orderData?.qrCodeUrl || orderData?.last_transaction?.qr_code_url) ? (
                    <iframe
                      src={orderData.qrCodeUrl || orderData.last_transaction?.qr_code_url}
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

                {/* PIX Copy Button - only show if we have PIX code */}
                {(orderData?.qrCode || orderData?.last_transaction?.qr_code) && (
                  <button
                    onClick={() => {
                      // Use qrCode (the actual PIX code) or fallback to last_transaction.qr_code
                      const pixCode = orderData.qrCode || orderData.last_transaction?.qr_code || '';
                      if (pixCode) {
                        navigator.clipboard.writeText(pixCode);
                        toast.success("Código PIX copiado!");
                      } else {
                        toast.error("Código PIX não disponível");
                      }
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
                  {isCheckingPayment ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verificando pagamento...
                    </div>
                  ) : (
                    'Já realizei o pagamento'
                  )}
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
  const [submittedFormData, setSubmittedFormData] = useState<FormData | null>(null);
  const [hasCheckedPaidDiet, setHasCheckedPaidDiet] = useState(false);
  const [showRegenerateInput, setShowRegenerateInput] = useState(false);
  const [regenerateFeedback, setRegenerateFeedback] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [hasRegenerated, setHasRegenerated] = useState(false);
  const [dietData, setDietData] = useState<ParsedDietData | null>(null);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const { user } = useAuth();

  // Function to parse AI diet response into structured data
  const parseDietResponse = (aiResponse: string): ParsedDietData | null => {
    try {
      console.log('Parsing AI response:', aiResponse);
      
      // First, try to parse as JSON (new format with JSON mode)
      try {
        // Clean the response - remove any markdown code blocks or extra text
        let cleanResponse = aiResponse.trim();
        
        // Remove markdown code blocks if present
        if (cleanResponse.startsWith('```json')) {
          cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanResponse.startsWith('```')) {
          cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        // Try direct JSON parse first (for JSON mode responses)
        let jsonData;
        try {
          jsonData = JSON.parse(cleanResponse);
        } catch {
          // If direct parse fails, try to find JSON in the response
          const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            jsonData = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No JSON found in response');
          }
        }
        
        // Validate that we have the expected structure with required fields
        if (jsonData && typeof jsonData === 'object' &&
            jsonData.breakfast?.main && Array.isArray(jsonData.breakfast.main) && 
            jsonData.lunch?.main && Array.isArray(jsonData.lunch.main) && 
            jsonData.dinner?.main && Array.isArray(jsonData.dinner.main)) {
          
          console.log('Successfully parsed JSON diet data with alternatives:', jsonData);
          
          // Ensure all meal arrays have exactly 3 items or fill with placeholders
          const ensureThreeItems = (mealArray: any[], mealName: string): MealItem[] => {
            if (!Array.isArray(mealArray)) return [];
            const items = mealArray.slice(0, 3).map((item: any) => ({
              name: item.name || '',
              quantity: item.quantity || '',
              calories: item.calories || 0,
              protein: item.protein,
              carbs: item.carbs,
              fat: item.fat,
              grams: item.grams
            })); // Take first 3 items and ensure MealItem type
            while (items.length < 3) {
              items.push({
                name: `Opção ${items.length + 1} de ${mealName}`,
                quantity: "Conforme orientação",
                calories: 0,
                protein: undefined,
                carbs: undefined,
                fat: undefined,
                grams: undefined
              });
            }
            return items;
          };

          // Process meals with main and alternative options
          const processMeal = (mealData: any, mealName: string): MealSection | null => {
            if (!mealData || mealData === null) return null;
            
            // Calculate totals for the meal
            const calculateTotals = (items: any[]) => {
              return items.reduce((totals, item) => {
                return {
                  calories: totals.calories + (item.calories || 0),
                  protein: totals.protein + (item.protein || 0),
                  carbs: totals.carbs + (item.carbs || 0),
                  fat: totals.fat + (item.fat || 0)
                };
              }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
            };
            
            const mainItems = ensureThreeItems(mealData.main || [], mealName);
            const mainTotals = calculateTotals(mainItems);
            
            return {
              main: mainItems,
              alternatives: ensureThreeItems(mealData.alternatives || [], `alternativas de ${mealName}`),
              totalCalories: mainTotals.calories || mealData.totalCalories,
              totalProtein: mainTotals.protein || mealData.totalProtein,
              totalCarbs: mainTotals.carbs || mealData.totalCarbs,
              totalFat: mainTotals.fat || mealData.totalFat
            };
          };
          
          const breakfast = processMeal(jsonData.breakfast, 'café da manhã');
          const lunch = processMeal(jsonData.lunch, 'almoço');
          const dinner = processMeal(jsonData.dinner, 'jantar');
          
          if (!breakfast || !lunch || !dinner) {
            return null;
          }
          
          return {
            breakfast,
            morningSnack: processMeal(jsonData.morningSnack, 'lanche da manhã'),
            lunch,
            afternoonSnack: processMeal(jsonData.afternoonSnack, 'lanche da tarde'),
            dinner,
            totalCalories: jsonData.totalCalories || 0,
            notes: jsonData.notes || 'Sua dieta personalizada foi criada com base nas suas preferências alimentares.',
            fullResponse: aiResponse
          };
        }
      } catch (jsonError) {
        console.log('JSON parsing failed, using fallback:', jsonError);
      }

      // Final fallback
      console.log('Using fallback diet structure');
      return null;
    } catch (error) {
      console.error('Error parsing diet response:', error);
      // Ultimate fallback
      return null;
    }
  };

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

  // Check for existing paid diet when user logs in
  useEffect(() => {
    const checkUserPaidDiet = async () => {
      if (user && !hasCheckedPaidDiet) {
        setHasCheckedPaidDiet(true);
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100'}/api/user-paid-diet`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.hasPaidDiet) {
              console.log('Found existing paid diet:', data.data);
              // Parse and set the existing diet data
              const parsedDiet = parseDietResponse(data.data.aiResponse);
              if (parsedDiet) {
                setDietData({...parsedDiet, dietId: data.data.dietId});
              }
              setDietStep('preview');
              setIsPaymentConfirmed(true);
              toast.success('Sua dieta já paga foi carregada!');
              return;
            }
          }
        } catch (error) {
          console.error('Error checking for paid diet:', error);
        }
      }
    };

    checkUserPaidDiet();
  }, [user, hasCheckedPaidDiet, parseDietResponse]);

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
      gender: 'masculino',
      objective: '',
      frequenciaTreino: '',
      condicoesSaude: [],
      restricoesAlimentares: [],
      alergiasAlimentares: '',
      // calories: '',
      // schedule: '',
      includeCafeManha: true,
      includeLancheManha: true,
      includeAlmoco: true,
      includeLancheTarde: true,
      includeJantar: true,
      breakfastItems: [],
      morningSnackItems: [],
      lunchItems: [],
      afternoonSnackItems: [],
      dinnerItems: [],
      usesSupplements: true,
      supplements: [],
    }
  });


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

  const handleLoadingComplete = () => {
    // When loading completes, go to preview step
    setDietStep('preview');
  };

  const handleRegenerateDiet = async () => {
    if (!regenerateFeedback.trim() || !dietData?.dietId) {
      toast.error('Por favor, descreva o que você não gostou na dieta.');
      return;
    }

    setIsRegenerating(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Erro de autenticação. Faça login novamente.');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100'}/api/regenerate-diet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          dietId: dietData.dietId,
          feedback: regenerateFeedback
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Parse and set the new diet data
          const parsedDiet = parseDietResponse(data.data.aiResponse);
          if (parsedDiet) {
            setDietData({...parsedDiet, dietId: data.data.dietId});
          }
          setHasRegenerated(true);
          setShowRegenerateInput(false);
          setRegenerateFeedback('');
          toast.success('Nova dieta gerada com sucesso!');
        } else {
          toast.error(data.error || 'Erro ao gerar nova dieta.');
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erro ao gerar nova dieta.');
      }
    } catch (error) {
      console.error('Error regenerating diet:', error);
      toast.error('Erro ao gerar nova dieta. Tente novamente.');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Determine if we should show the selection options or just the diet
  const shouldShowSelectionOptions = () => {
    // If user is not logged in, always show selection options
    if (!user) {
      return true;
    }
    
    // If user is logged in but we don't have a paid diet with generated data, show selection options
    if (!isPaymentConfirmed || !dietData || !dietData.breakfast || !dietData.breakfast.main || dietData.breakfast.main.length === 0) {
      return true;
    }
    
    // If user is logged in and has a paid diet with generated data, hide selection options
    return false;
  };

  return (
    <main className="bg-[#F9FAFB]">
      <Header />
      <div className="h-[70px]"></div>

      <div className="py-8 px-4 space-y-8">
        {shouldShowSelectionOptions() && (
          <>
            <MedidasCorporais control={control} errors={errors} />

            <FoodSelector
              title="Café da manhã"
              isIncluded={true}
              foods={foodData.breakfast}
              selectedItems={watch("breakfastItems") || []}
              onChange={(items) => {
                setValue("breakfastItems", items);
              }}
              error={mealValidationErrors.breakfast}
              isRequired={true}
            />

            <FoodSelector
              title="Lanche da manhã"
              isIncluded={watch("includeLancheManha") || false}
              onToggleInclude={(included) => {
                setValue("includeLancheManha", included);
              }}
              foods={foodData.morningSnack}
              selectedItems={watch("morningSnackItems") || []}
              onChange={(items) => {
                setValue("morningSnackItems", items);
              }}
              error={mealValidationErrors.morningSnack}
            />

            <FoodSelector
              title="Almoço"
              isIncluded={true}
              foods={foodData.lunch}
              selectedItems={watch("lunchItems") || []}
              onChange={(items) => {
                setValue("lunchItems", items);
              }}
              error={mealValidationErrors.lunch}
              isRequired={true}
            />

            <FoodSelector
              title="Lanche da tarde"
              isIncluded={watch("includeLancheTarde") || false}
              onToggleInclude={(included) => {
                setValue("includeLancheTarde", included);
              }}
              foods={foodData.afternoonSnack}
              selectedItems={watch("afternoonSnackItems") || []}
              onChange={(items) => {
                setValue("afternoonSnackItems", items);
              }}
              error={mealValidationErrors.afternoonSnack}
            />

            <FoodSelector
              title="Jantar"
              isIncluded={true}
              foods={foodData.dinner}
              selectedItems={watch("dinnerItems") || []}
              onChange={(items) => {
                setValue("dinnerItems", items);
              }}
              error={mealValidationErrors.dinner}
              isRequired={true}
            />

            <SupplementSelector
              usesSupplements={watch("usesSupplements") !== false}
              onToggleSupplements={(uses) => {
                setValue("usesSupplements", uses);
                if (!uses) {
                  setValue("supplements", []);
                }
              }}
              selectedSupplements={watch("supplements") || []}
              onSupplementsChange={(items) => {
                setValue("supplements", items);
              }}
            />
          </>
        )}

        <DietaPersonalizada
          onClick={handleSubmit(onSubmit, onInvalidSubmit)}
          isSubmitting={isSubmitting}
          currentStep={dietStep}
          onLoadingComplete={handleLoadingComplete}
          formData={submittedFormData || undefined}
          dietData={dietData}
          setDietData={setDietData}
          isPaymentConfirmed={isPaymentConfirmed}
          setIsPaymentConfirmed={setIsPaymentConfirmed}
          showRegenerateInput={showRegenerateInput}
          setShowRegenerateInput={setShowRegenerateInput}
          regenerateFeedback={regenerateFeedback}
          setRegenerateFeedback={setRegenerateFeedback}
          isRegenerating={isRegenerating}
          hasRegenerated={hasRegenerated}
          handleRegenerateDiet={handleRegenerateDiet}
          parseDietResponse={parseDietResponse}
          setHasRegenerated={setHasRegenerated}
        />
      </div>
    </main>
  );
}

export default App;