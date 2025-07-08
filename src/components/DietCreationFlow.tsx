"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, Clock, CheckCircle, Sparkles, Lock, Unlock, QrCode, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Image from 'next/image';

interface DietCreationFlowProps {
  onBack: () => void;
  formData: any;
}

interface DietData {
  breakfast: { name: string; quantity: string; calories: number }[];
  morningSnack: { name: string; quantity: string; calories: number }[];
  lunch: { name: string; quantity: string; calories: number }[];
  afternoonSnack: { name: string; quantity: string; calories: number }[];
  dinner: { name: string; quantity: string; calories: number }[];
  totalCalories: number;
  notes: string;
}

// Mock diet data for demonstration
const mockDietData: DietData = {
  breakfast: [
    { name: "Tapioca + Frango", quantity: "1 unidade média", calories: 250 },
    { name: "Café com Leite", quantity: "200ml", calories: 80 },
    { name: "Banana", quantity: "1 unidade", calories: 90 }
  ],
  morningSnack: [
    { name: "Whey Protein", quantity: "1 scoop", calories: 120 },
    { name: "Maçã", quantity: "1 unidade", calories: 80 }
  ],
  lunch: [
    { name: "Frango Grelhado", quantity: "150g", calories: 330 },
    { name: "Arroz Integral", quantity: "4 colheres", calories: 160 },
    { name: "Feijão", quantity: "2 colheres", calories: 140 },
    { name: "Salada Verde", quantity: "1 prato", calories: 50 }
  ],
  afternoonSnack: [
    { name: "Iogurte Natural", quantity: "1 pote", calories: 120 },
    { name: "Granola", quantity: "2 colheres", calories: 110 }
  ],
  dinner: [
    { name: "Salmão Grelhado", quantity: "120g", calories: 280 },
    { name: "Batata Doce", quantity: "1 unidade média", calories: 130 },
    { name: "Brócolis", quantity: "1 xícara", calories: 40 }
  ],
  totalCalories: 1980,
  notes: "Lembre-se de beber pelo menos 2 litros de água por dia e fazer as refeições nos horários indicados."
};

const LoadingStep = ({ icon: Icon, title, description, isActive, isCompleted }: {
  icon: React.ElementType;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
}) => (
  <div className={`flex items-center p-4 rounded-lg transition-all duration-500 ${
    isActive ? 'bg-green-50 border-2 border-green-200' : 
    isCompleted ? 'bg-green-100 border-2 border-green-300' : 'bg-gray-50 border-2 border-gray-200'
  }`}>
    <div className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 transition-all duration-500 ${
      isCompleted ? 'bg-green-500' : isActive ? 'bg-green-200' : 'bg-gray-300'
    }`}>
      {isCompleted ? (
        <CheckCircle className="w-6 h-6 text-white" />
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

const DietCreationLoading = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    { icon: Utensils, title: "Analisando Preferências", description: "Processando seus alimentos favoritos" },
    { icon: Clock, title: "Calculando Calorias", description: "Ajustando para seu objetivo" },
    { icon: Sparkles, title: "Personalizando Dieta", description: "Criando sua dieta ideal" },
    { icon: CheckCircle, title: "Finalizando", description: "Sua dieta está pronta!" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const nextStep = prev + 1;
        if (nextStep < steps.length) {
          setCompletedSteps((completed) => [...completed, prev]);
          return nextStep;
        } else {
          setCompletedSteps((completed) => [...completed, prev]);
          setTimeout(() => onComplete(), 1000);
          return prev;
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [onComplete, steps.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-white/90 backdrop-blur-sm shadow-xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Utensils className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Criando sua Dieta</h1>
          <p className="text-gray-600">Aguarde enquanto personalizamos sua alimentação</p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <LoadingStep
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              isActive={index === currentStep}
              isCompleted={completedSteps.includes(index)}
            />
          ))}
        </div>

        <div className="mt-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% concluído
          </p>
        </div>
      </Card>
    </div>
  );
};

const MealCard = ({ title, items, isBlurred }: { 
  title: string; 
  items: { name: string; quantity: string; calories: number }[];
  isBlurred: boolean;
}) => (
  <Card className={`p-4 ${isBlurred ? 'relative' : ''}`}>
    <div className={isBlurred ? 'filter blur-sm' : ''}>
      <h3 className="font-semibold text-lg mb-3 text-green-700">{title}</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-600">{item.quantity}</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {item.calories} cal
            </Badge>
          </div>
        ))}
      </div>
    </div>
    {isBlurred && (
      <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg">
        <Lock className="w-8 h-8 text-gray-400" />
      </div>
    )}
  </Card>
);

const DietPreview = ({ dietData, onUnlock }: { dietData: DietData; onUnlock: () => void }) => {
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sua Dieta Está Pronta!</h1>
          <p className="text-gray-600">Veja um preview do que preparamos para você</p>
        </div>

        <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Plano Nutricional Personalizado</h2>
              <p className="text-gray-600">Baseado em suas preferências alimentares</p>
            </div>
            <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
              {dietData.totalCalories} cal/dia
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <MealCard title="Café da Manhã" items={dietData.breakfast.slice(0, 2)} isBlurred={false} />
            <MealCard title="Lanche da Manhã" items={dietData.morningSnack} isBlurred={true} />
            <MealCard title="Almoço" items={dietData.lunch.slice(0, 2)} isBlurred={false} />
            <MealCard title="Lanche da Tarde" items={dietData.afternoonSnack} isBlurred={true} />
            <MealCard title="Jantar" items={dietData.dinner.slice(0, 2)} isBlurred={false} />
            <Card className="p-4 bg-gradient-to-br from-green-100 to-emerald-100">
              <h3 className="font-semibold text-lg mb-2 text-green-700">Dicas Extras</h3>
              <p className="text-gray-700 text-sm">
                {showPreview ? dietData.notes.substring(0, 50) + "..." : dietData.notes}
              </p>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={onUnlock}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Unlock className="w-5 h-5 mr-2" />
              Desbloquear Dieta Completa - R$ 10,00
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Pagamento único e seguro <Lock className="inline w-4 h-4 ml-1" />
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

const PaymentModal = ({ isOpen, onClose, onBack }: { 
  isOpen: boolean; 
  onClose: () => void;
  onBack: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 bg-white shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pagamento PIX</h2>
          <p className="text-gray-600">Escaneie o QR Code para pagar</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg mx-auto flex items-center justify-center mb-4">
            <div className="text-center">
              <QrCode className="w-24 h-24 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">QR Code PIX</p>
            </div>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-gray-800">R$ 10,00</p>
            <p className="text-sm text-gray-600">Dieta Personalizada</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={onClose}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3"
          >
            Confirmar Pagamento
          </Button>
          <Button 
            onClick={onBack}
            variant="outline" 
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </Card>
    </div>
  );
};

export const DietCreationFlow: React.FC<DietCreationFlowProps> = ({ onBack, formData }) => {
  const [currentStep, setCurrentStep] = useState<'loading' | 'preview' | 'payment'>('loading');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleLoadingComplete = () => {
    setCurrentStep('preview');
  };

  const handleUnlock = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    // Here you would typically handle successful payment
    alert('Pagamento realizado com sucesso! Sua dieta completa foi liberada.');
  };

  const handlePaymentBack = () => {
    setShowPaymentModal(false);
  };

  return (
    <>
      {currentStep === 'loading' && (
        <DietCreationLoading onComplete={handleLoadingComplete} />
      )}
      
      {currentStep === 'preview' && (
        <DietPreview dietData={mockDietData} onUnlock={handleUnlock} />
      )}

      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={handlePaymentClose}
        onBack={handlePaymentBack}
      />

      {currentStep === 'preview' && (
        <div className="fixed top-4 left-4 z-10">
          <Button 
            onClick={onBack}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      )}
    </>
  );
};