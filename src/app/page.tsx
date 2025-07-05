"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ChartLine, LineChart, Menu, Home, FileText, User, HelpCircle, LogOut, X, Check, Lock, ArrowRight, MenuIcon } from "lucide-react";
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
    <header className="p-4 flex border-b border-[#F0F0F0] bg-white fixed w-full z-50 h-[75px]">
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
              <Button className="bg-gray-100">
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
                        className={`w-full justify-start px-6 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-none relative group ${index === 0 ? 'bg-gray-50' : ''
                          }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {/* Green accent line for active/hover */}
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

        <SelectContent className="my-1">
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

        <SelectContent className="my-1">
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

        <SelectContent className="my-1">
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
    { value: "tapioca_frango", emoji: "🍗", label: "Tapioca + Frango" },
    { value: "crepioca_queijo", emoji: "🧀", label: "Crepioca + Queijo" },
    { value: "fruta", emoji: "🍎", label: "Fruta" },
    { value: "iogurte", emoji: "🥛", label: "Iogurte" },
    { value: "cafe", emoji: "☕", label: "Café" },
    { value: "pao_queijo", emoji: "🧀", label: "Pão de Queijo" },
    { value: "pao_ovo", emoji: "🥚", label: "Pão + Ovo" },
    { value: "cafe_leite", emoji: "☕", label: "Café + Leite" },
    { value: "cuscuz", emoji: "⚪", label: "Cuscuz" },
    { value: "pao_queijo_simples", emoji: "🍞", label: "Pão + Queijo" },
    { value: "pao_presunto", emoji: "🥪", label: "Pão + Presunto" },
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
                  <p className="text-xl mb-1">{preference.emoji}</p>
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

function LancheDaManha() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const maxItems = 5;

  const foodPreferences = [
    { value: "whey", emoji: "🥛", label: "Whey" },
    { value: "biscoito", emoji: "🍪", label: "Biscoito" },
    { value: "iogurte", emoji: "🥛", label: "Iogurte" },
    { value: "suco", emoji: "🧃", label: "Suco" },
    { value: "maca", emoji: "🍎", label: "Maçã" },
    { value: "banana", emoji: "🍌", label: "Banana" },
    { value: "laranja", emoji: "🍊", label: "Laranja" },
    { value: "morango", emoji: "🍓", label: "Morango" },
    { value: "uva", emoji: "🍇", label: "Uva" },
    { value: "abacaxi", emoji: "🍍", label: "Abacaxi" },
    { value: "pera", emoji: "🍐", label: "Pera" },
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
            <h1 className="text-xl font-black">Lanche da Manhã</h1>
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
                  <p className="text-xl mb-1">{preference.emoji}</p>
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

function Almoco() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const maxItems = 5;

  const foodPreferences = [
    { value: "frango", emoji: "🍗", label: "Frango" },
    { value: "patinho", emoji: "🥩", label: "Patinho" },
    { value: "alcatra", emoji: "🥩", label: "Alcatra" },
    { value: "carne_moida", emoji: "🥩", label: "Carne Moída" },
    { value: "mandioca", emoji: "🍠", label: "Mandioca" },
    { value: "carne_porco", emoji: "🐷", label: "Carne-Porco" },
    { value: "batata_doce", emoji: "🍠", label: "Batata-Doce" },
    { value: "tilapia", emoji: "🐟", label: "Tilápia" },
    { value: "merluza", emoji: "🐟", label: "Merluza" },
    { value: "legumes", emoji: "🥕", label: "Legumes" },
    { value: "arroz", emoji: "🍚", label: "Arroz" },
    { value: "feijao", emoji: "🫘", label: "Feijão" },
    { value: "salada", emoji: "🥗", label: "Salada" },
    { value: "macarrao", emoji: "🍝", label: "Macarrão" },
    { value: "ovo", emoji: "🥚", label: "Ovo" },
    { value: "inhame", emoji: "🍠", label: "Inhame" },
    { value: "cuscuz", emoji: "🍚", label: "Cuscuz" },
    { value: "batata", emoji: "🥔", label: "Batata" },
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
            <h1 className="text-xl font-black">Almoço</h1>
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
                  <p className="text-xl mb-1">{preference.emoji}</p>
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

function LancheDaTarde() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const maxItems = 5;

  const foodPreferences = [
    { value: "whey", emoji: "🥛", label: "Whey" },
    { value: "fruta", emoji: "🍌", label: "Fruta" },
    { value: "cuscuz", emoji: "⚪", label: "Cuscuz" },
    { value: "pao_ovo", emoji: "🥚", label: "Pão + Ovo" },
    { value: "tapioca_frango", emoji: "🍗", label: "Tapioca + Frango" },
    { value: "crepioca_queijo", emoji: "🧀", label: "Crepioca + Queijo" },
    { value: "leite", emoji: "🥛", label: "Leite" },
    { value: "rap10_frango", emoji: "🍗", label: "Rap10 + Frango" },
    { value: "sanduiche_frango", emoji: "🥪", label: "Sanduíche Frango" },
    { value: "sanduiche_peru", emoji: "🥪", label: "Sanduíche de Peru" },
    { value: "suco", emoji: "🧃", label: "Suco" },
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
            <h1 className="text-xl font-black">Lanche da Tarde</h1>
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
                  <p className="text-xl mb-1">{preference.emoji}</p>
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

function Janta() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const maxItems = 5;

  const foodPreferences = [
    { value: "frango", emoji: "🍗", label: "Frango" },
    { value: "patinho", emoji: "🥩", label: "Patinho" },
    { value: "alcatra", emoji: "🥩", label: "Alcatra" },
    { value: "carne_moida", emoji: "🥩", label: "Carne Moída" },
    { value: "mandioca", emoji: "🍠", label: "Mandioca" },
    { value: "carne_porco", emoji: "🐷", label: "Carne-Porco" },
    { value: "batata_doce", emoji: "🍠", label: "Batata-Doce" },
    { value: "tilapia", emoji: "🐟", label: "Tilápia" },
    { value: "merluza", emoji: "🐟", label: "Merluza" },
    { value: "legumes", emoji: "🥕", label: "Legumes" },
    { value: "arroz", emoji: "🍚", label: "Arroz" },
    { value: "feijao", emoji: "🫘", label: "Feijão" },
    { value: "salada", emoji: "🥗", label: "Salada" },
    { value: "macarrao", emoji: "🍝", label: "Macarrão" },
    { value: "ovo", emoji: "🥚", label: "Ovo" },
    { value: "inhame", emoji: "🍠", label: "Inhame" },
    { value: "cuscuz", emoji: "🍚", label: "Cuscuz" },
    { value: "batata", emoji: "🥔", label: "Batata" },
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
            <h1 className="text-xl font-black">Janta</h1>
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
                  <p className="text-xl mb-1">{preference.emoji}</p>
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

function TreinosEAtividades() {
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [selectedWorkout, setSelectedWorkout] = useState<string>('');

  const activityLevels = [
    { value: "sedentario", label: "Sedentário (pouca ou nenhuma atividade física)" },
    { value: "leve", label: "Leve (exercícios leves 1–3 dias por semana)" },
    { value: "moderado", label: "Moderado (exercícios moderados 3–5 dias por semana)" },
    { value: "intenso", label: "Intenso (exercícios intensos 6–7 dias por semana)" },
    { value: "muito_intenso", label: "Muito intenso (exercícios intensos diários ou atleta)" },
  ];

  const workoutOptions = [
    { value: "academia", label: "Sim, quero um plano de treino para Academia" },
    { value: "casa", label: "Sim, quero um plano de treino para Casa" },
    { value: "nao", label: "Não, apenas quero a dieta" },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl">
      <div className="shadow rounded-t-xl">
        <div className="border-b border-[#F0F0F0] p-4">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg flex items-center justify-center mr-3 p-2">
              <ChartLine className="text-green-600 w-5 h-5" />
            </div>
            <h1 className="text-xl font-black">Treinos e Atividades</h1>
          </div>
          <p className="text-md mt-2">Informe seu nível de atividade física</p>
        </div>

        <div className="p-4 space-y-6">
          {/* Activity Level Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Como é sua rotina?</h3>
            <p className="text-sm text-gray-600 mb-3">Quantidade de atividade realizada atualmente</p>
            <Select
              value={selectedActivity}
              onValueChange={setSelectedActivity}
            >
              <SelectTrigger className="w-full text-xl py-8 px-4">
                <SelectValue placeholder="Selecione seu nível de atividade" />
              </SelectTrigger>
              <SelectContent className="mt-1">
                {activityLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value} className="text-xl py-4 px-6">
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Workout Plan Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Deseja treino?</h3>
            <p className="text-sm text-gray-600 mb-3">Selecione uma opção</p>
            <Select
              value={selectedWorkout}
              onValueChange={setSelectedWorkout}
            >
              <SelectTrigger className="w-full text-xl py-8 px-4">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent className="mt-1">
                {workoutOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-xl py-4 px-6">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

function DietaPersonalizada() {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl">
      <div className="shadow rounded-t-xl">
        <div className="border-b border-[#F0F0F0] p-4">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg flex items-center justify-center mr-3 p-2">
              <ChartLine className="text-green-600 w-5 h-5" />
            </div>
            <h1 className="text-xl font-black">Dieta Personalizada</h1>
          </div>
          <p className="text-md mt-2">Nutrição acessível para você</p>
        </div>

        <div className="p-4">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-green-600 mb-2">
              Dieta personalizada por menos de R$ 10,00
            </h2>
          </div>

          <div className="mb-6 border shadow p-4 rounded-lg">
            <Badge className="bg-green-100 mb-2">
              <span className="text-green-600 font-semibold">Aproveite seu desconto de 90%</span>
            </Badge>

            <h3 className="text-lg font-semibold mb-3">Você receberá:</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-1 mr-3">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-gray-700">Plano alimentar completo</span>
              </div>
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-1 mr-3">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-gray-700">Treino Personalizado (opcional)</span>
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
          </div>

          <div className="text-center">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 w-full mb-2 text-xl font-bold">
              Montar minha dieta
              <span>
                <ArrowRight className="inline-block ml-2 w-6 h-6 -mt-1 text-white" />
              </span>
            </button>
            <p className="text-sm text-gray-500 mt-4 mb-2">Pagamento único e seguro
              <span>
                <Lock className="inline-block ml-1 w-4 h-4 text-gray-500" />
              </span>
            </p>
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
      <div className="h-[70px]"></div>
      {/* Content Scroll */}
      <div className="py-8 px-4 space-y-8">
        <MedidasCorporais />
        <PreferenciasAlimentares />
        <LancheDaManha />
        <Almoco />
        <LancheDaTarde />
        <Janta />
        <TreinosEAtividades />
        <DietaPersonalizada />
      </div>
    </main>
  );
}



export default App;