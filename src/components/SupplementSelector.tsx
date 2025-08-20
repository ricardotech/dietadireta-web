import { AlertCircle, Check, Pill } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SupplementSelectorProps {
  usesSupplements: boolean;
  onToggleSupplements: (uses: boolean) => void;
  selectedSupplements: string[];
  onSupplementsChange: (supplements: string[]) => void;
  error?: string;
}

const availableSupplements = [
  { value: 'whey', label: 'Whey Protein', icon: '🥛' },
  { value: 'creatina', label: 'Creatina', icon: '💪' },
  { value: 'hipercalorico', label: 'Hipercalórico', icon: '🥤' },
  { value: 'bcaa', label: 'BCAA', icon: '⚡' },
  { value: 'glutamina', label: 'Glutamina', icon: '🔬' },
  { value: 'multivitaminico', label: 'Multivitamínico', icon: '💊' },
  { value: 'omega3', label: 'Ômega 3', icon: '🐟' },
  { value: 'vitamina_d', label: 'Vitamina D', icon: '☀️' },
  { value: 'colageno', label: 'Colágeno', icon: '🦴' },
  { value: 'termogenico', label: 'Termogênico', icon: '🔥' },
];

export function SupplementSelector({
  usesSupplements,
  onToggleSupplements,
  selectedSupplements,
  onSupplementsChange,
  error,
}: SupplementSelectorProps) {
  const handleSupplementToggle = (value: string) => {
    if (selectedSupplements.includes(value)) {
      onSupplementsChange(selectedSupplements.filter(item => item !== value));
    } else {
      onSupplementsChange([...selectedSupplements, value]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl">
      <div className="shadow rounded-xl">
        {/* Error banner */}
        {error && usesSupplements && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="border-b border-[#F0F0F0] p-4">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg flex items-center justify-center mr-3 p-2">
              <Pill className="text-purple-600 w-5 h-5" />
            </div>
            <h1 className="text-xl font-black">Suplementação</h1>
          </div>
          <p className="text-md mt-2">Você utiliza algum suplemento alimentar?</p>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-lg font-medium text-gray-700">
                {usesSupplements ? 'Uso suplementos' : 'Não uso suplementos'}
              </span>
              {usesSupplements && (
                <div className="bg-purple-100 rounded-full p-1">
                  <Check className="w-4 h-4 text-purple-600" />
                </div>
              )}
            </div>
            <Switch
              checked={usesSupplements}
              onCheckedChange={onToggleSupplements}
              className="data-[state=checked]:bg-purple-500"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {usesSupplements 
              ? 'Selecione os suplementos que você utiliza regularmente' 
              : 'Ative para incluir suplementos na sua dieta'}
          </p>
        </div>

        {/* Supplement Selection Grid */}
        {usesSupplements && (
          <div className="border-t border-[#F0F0F0] p-4">
            <div className="mb-4">
              <h3 className="text-md font-semibold text-gray-700 mb-2">
                Quais suplementos você usa?
              </h3>
              <p className="text-sm text-gray-500">
                Marque todos que se aplicam - isso ajudará a ajustar sua dieta
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableSupplements.map((supplement) => {
                const isSelected = selectedSupplements.includes(supplement.value);

                return (
                  <div
                    key={supplement.value}
                    className={`
                      border rounded-lg p-3 cursor-pointer transition-all duration-200
                      ${isSelected
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                      }
                    `}
                    onClick={() => handleSupplementToggle(supplement.value)}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={isSelected}
                        className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                      />
                      <span className="text-xl">{supplement.icon}</span>
                      <Label className="text-sm font-medium cursor-pointer">
                        {supplement.label}
                      </Label>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedSupplements.length > 0 && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-700">
                  <strong>{selectedSupplements.length} suplemento(s) selecionado(s).</strong> 
                  {' '}A dieta será ajustada considerando o uso destes suplementos.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}