import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TrainingFrequencyStepProps {
  value: string;
  onChange: (value: '1-3' | '3-5' | '5-7') => void;
  onNext: () => void;
  onBack: () => void;
}

const TrainingFrequencyStep: React.FC<TrainingFrequencyStepProps> = ({
  value,
  onChange,
  onNext,
  onBack,
}) => {
  const options = [
    { 
      value: '1-3' as const, 
      label: 'Iniciante', 
      description: '1 a 3 dias por semana',
      icon: '🏃‍♂️',
      details: 'Ideal para quem está começando ou tem pouco tempo disponível'
    },
    { 
      value: '3-5' as const, 
      label: 'Intermediário', 
      description: '3 a 5 dias por semana',
      icon: '💪',
      details: 'Perfeito para manter boa forma e progressão constante'
    },
    { 
      value: '5-7' as const, 
      label: 'Avançado', 
      description: '5 a 7 dias por semana',
      icon: '🏋️‍♂️',
      details: 'Para atletas e praticantes experientes com alta dedicação'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-2">
          Frequência de Treino
        </h2>
        <p className="text-center text-gray-600">
          Com que frequência você treina ou pretende treinar?
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {options.map((option) => (
          <Card
            key={option.value}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              value === option.value
                ? 'ring-2 ring-primary border-primary'
                : 'hover:border-gray-400'
            }`}
            onClick={() => onChange(option.value)}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{option.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">
                    {option.label}
                  </h3>
                  <p className="text-sm font-medium text-primary mb-2">
                    {option.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    {option.details}
                  </p>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full border-2 ${
                      value === option.value
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                    }`}
                  >
                    {value === option.value && (
                      <svg
                        className="w-full h-full text-white p-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="px-8"
        >
          Voltar
        </Button>
        <Button
          onClick={onNext}
          disabled={!value}
          className="px-8"
        >
          Próximo
        </Button>
      </div>
    </div>
  );
};

export default TrainingFrequencyStep;