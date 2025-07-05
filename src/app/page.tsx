"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ChartLine, LineChart, Menu, Home, FileText, User, HelpCircle, LogOut, X, Check } from "lucide-react";
import { useState } from "react";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: FileText, label: "Dietas", href: "/dietas" },
    { icon: User, label: "Perfil", href: "/perfil" },
    { icon: HelpCircle, label: "Suporte", href: "/suporte" },
  ];

  return (
    <header className="p-4 flex border-b border-[#F0F0F0] bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
        <div className="flex items-center">
          <h1 className="text-4xl font-bold">🥦</h1>
          <div className="ml-4">
            <h1 className="text-xl font-bold">Nutri Inteligente</h1>
            <p className="text-sm -mt-1 text-gray-600">O maior site de dietas do Brasil</p>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="text-sm px-4 py-2 flex items-center hover:bg-gray-100"
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
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
                      <h1 className="text-lg font-bold text-gray-900">Nutri Inteligente</h1>
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
                        className={`w-full justify-start px-6 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-none relative group ${
                          index === 0 ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {/* Green accent line for active/hover */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-green-500 transition-opacity ${
                          index === 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`} />
                        <item.icon className="w-5 h-5 mr-4 text-gray-600" />
                        {item.label}
                      </Button>
                    </div>
                  ))}
                </div>

                {/* User Profile Section */}
                <div className="border-t border-gray-100 p-6 space-y-4">
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
                      <span>lucaslu@gmail.com</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">💰</span>
                      <span>Saldo: #0</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-0 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sair
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function MedidasCorporais() {

  const [value, setValue] = useState<string | null>(null);

  const objectives = [
    { value: "emagrecer", label: "Emagrecer" },
    { value: "emagrecer_massa", label: "Emagrecer + Massa" },
    { value: "definicao_ganho", label: "Definicao Muscular + Ganhar Massa" },
    { value: "ganhar_massa", label: "Ganhar Massa Muscular" },
  ];

  function ObjectiveSelect({
    defaultValue,
    onChange,
  }: {
    defaultValue?: string;
    onChange?: (value: string) => void;
  }) {
    const [value, setValue] = useState(defaultValue ?? "");

    return (
      <Select
        value={value}
        onValueChange={(v) => {
          setValue(v);
          onChange?.(v);
        }}

      >
        <SelectTrigger className="w-full text-xl py-8 px-4">
          <SelectValue placeholder="Objetivo" />
        </SelectTrigger>

        <SelectContent className="mt-1">
          {objectives.map((o) => (
            <SelectItem key={o.value} value={o.value} className="text-xl py-4 px-6">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

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

  function CaloriesSelect({
    defaultValue,
    onChange,
  }: {
    defaultValue?: string;
    onChange?: (value: string) => void;
  }) {
    const [value, setValue] = useState(defaultValue ?? "");

    return (
      <Select
        value={value}
        onValueChange={(v) => {
          setValue(v);
          onChange?.(v);
        }}

      >
        <SelectTrigger className="w-full text-xl py-8 px-4">
          <SelectValue placeholder="Calorias diárias 🔥" />
        </SelectTrigger>

        <SelectContent className="mt-1">
          {calories.map((o) => (
            <SelectItem key={o.value} value={o.value} className="text-xl py-4 px-6">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  const schedules = [
    { value: "custom", label: "Tenho meu próprio horário" },
    { value: "05:30-08:30-12:00-15:00-19:00", label: "05:30, 08:30, 12:00, 15:00, 19:00" },
    { value: "06:00-09:00-12:00-15:00-19:00", label: "06:00, 09:00, 12:00, 15:00, 19:00" },
    { value: "06:30-09:30-13:00-16:00-20:00", label: "06:30, 09:30, 13:00, 16:00, 20:00" },
    { value: "07:00-10:00-12:30-15:30-19:30", label: "07:00, 10:00, 12:30, 15:30, 19:30" },
    { value: "07:30-10:30-12:00-15:00-19:00", label: "07:30, 10:30, 12:00, 15:00, 19:00" },
    { value: "08:00-11:00-13:30-16:30-20:30", label: "08:00, 11:00, 13:30, 16:30, 20:30" },
    { value: "09:00-11:00-13:00-16:00-21:00", label: "09:00, 11:00, 13:00, 16:00, 21:00" },
  ];

  function MealScheduleSelect({
    defaultValue,
    onChange,
  }: {
    defaultValue?: string;
    onChange?: (value: string) => void;
  }) {
    const [value, setValue] = useState(defaultValue ?? "");

    return (
      <Select
        value={value}
        onValueChange={(v) => {
          setValue(v);
          onChange?.(v);
        }}
      >
        <SelectTrigger className="w-full text-xl py-8 px-4">
          <SelectValue placeholder="Horários para Refeição ⏱️" />
        </SelectTrigger>

        <SelectContent>
          {schedules.map((s) => (
            <SelectItem key={s.value} value={s.value} className="text-xl py-4 px-6">
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }


  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl">
      <div className="shadow rounded-t-xl">
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
          <Input placeholder="Peso (kg)" className="py-8 px-4 text-xl" />
          <Input placeholder="Altura (cm)" className="py-8 px-4 text-xl" />
          <Input placeholder="Idade" className="py-8 px-4 text-xl" />
          <ObjectiveSelect />
          <CaloriesSelect />
          <MealScheduleSelect />
        </div>
      </div>
    </div>
  )
}

function PreferenciasAlimentares() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const maxItems = 5;

  const foodPreferences = [
    { value: "tapioca_frango", label: "🍗 Tapioca + Frango" },
    { value: "crepioca_queijo", label: "🧀 Crepioca + Queijo" },
    { value: "fruta", label: "🍎 Fruta" },
    { value: "iogurte", label: "🥛 Iogurte" },
    { value: "cafe", label: "☕ Café" },
    { value: "pao_queijo", label: "🧀 Pão de Queijo" },
    { value: "pao_ovo", label: "🥚 Pão + Ovo" },
    { value: "cafe_leite", label: "☕ Café + Leite" },
    { value: "cuscuz", label: "⚪ Cuscuz" },
    { value: "pao_queijo_simples", label: "🍞 Pão + Queijo" },
    { value: "pao_presunto", label: "🥪 Pão + Presunto" },
  ];

  const handleItemToggle = (value: string) => {
    setSelectedItems(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else if (prev.length < maxItems) {
        return [...prev, value];
      }
      return prev;
    });
  };

  const getProgressPercentage = () => {
    const count = selectedItems.length;
    if (count === 0) return 0;
    if (count <= 2) return count === 1 ? 33 : 66;
    return 100;
  };

  const getProgressColor = () => {
    const count = selectedItems.length;
    if (count <= 2) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl">
      <div className="shadow rounded-t-xl">
        <div className="border-b border-[#F0F0F0] p-4">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg flex items-center justify-center mr-3 p-2">
              <ChartLine className="text-green-600 w-5 h-5" />
            </div>
            <h1 className="text-xl font-black">Café da manhã</h1>
          </div>
          <p className="text-md mt-2">Selecione os alimentos que você costuma consumir</p>
          
          {/* Progress Bar and Counter */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {selectedItems.length} de {maxItems} selecionados
              </span>
              <span className="text-sm text-gray-500">
                {selectedItems.length >= 3 ? 'Ótimo!' : selectedItems.length > 0 ? 'Continue selecionando' : 'Selecione suas preferências'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-3 gap-3">
            {foodPreferences.map((preference) => {
              const isSelected = selectedItems.includes(preference.value);
              const isDisabled = !isSelected && selectedItems.length >= maxItems;
              
              return (
                <button
                  key={preference.value}
                  onClick={() => handleItemToggle(preference.value)}
                  disabled={isDisabled}
                  className={`
                    text-sm py-3 px-2 border rounded-lg flex flex-col items-center justify-center transition-all duration-200 min-h-[80px] relative
                    ${isSelected 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : isDisabled 
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50'
                    }
                  `}
                >
                  <span className="font-medium text-center leading-tight">{preference.label}</span>
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <main className="bg-[#F9FAFB]">
      <Header />
      {/* Content Scroll */}
      <div className="py-8 px-4 space-y-8">
        <MedidasCorporais />
        <PreferenciasAlimentares />
      </div>
    </main>
  );
}



export default App;