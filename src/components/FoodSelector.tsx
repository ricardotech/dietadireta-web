import { AlertCircle, Check, ChartLine } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface FoodSelectorProps {
  title: string;
  isIncluded?: boolean;
  onToggleInclude?: (included: boolean) => void;
  foods: Array<{ value: string; emoji: string; label: string }>;
  selectedItems: string[];
  onChange: (items: string[]) => void;
  error?: string;
  maxItems?: number;
  isMinimized?: boolean;
  onMinimize?: () => void;
  onExpand?: () => void;
}

export function FoodSelector({
  title,
  isIncluded = false,
  onToggleInclude,
  foods,
  selectedItems,
  onChange,
  error,
  maxItems = 5,
  isMinimized = false,
  onMinimize,
  onExpand,
}: FoodSelectorProps) {
  const handleItemToggle = (value: string) => {
    if (selectedItems.includes(value)) {
      onChange(selectedItems.filter(item => item !== value));
    } else if (selectedItems.length < maxItems) {
      onChange([...selectedItems, value]);
    }
  };

  const handleExpand = () => {
    if (onExpand) onExpand();
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
      <div className="shadow rounded-xl">
        {/* Error banner */}
        {error && isIncluded && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">
                  Atenção! Selecione mais alimentos:
                </p>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  <li>{title}: selecione pelo menos 3 alimentos (atual: {selectedItems.length})</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="border-b border-[#F0F0F0] p-4">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg flex items-center justify-center mr-3 p-2">
              <ChartLine className="text-green-600 w-5 h-5" />
            </div>
            <h1 className="text-xl font-black">{title}</h1>
          </div>
          <p className="text-md mt-2">Selecione se deseja incluir &ldquo;{title.toLowerCase()}&rdquo; na sua dieta</p>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-lg font-medium text-gray-700">
                {isIncluded ? 'Incluir' : 'Não incluir'} {title.toLowerCase()}
              </span>
              {isIncluded && (
                <div className="bg-green-100 rounded-full p-1">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
              )}
            </div>
            <Switch
              checked={isIncluded}
              onCheckedChange={onToggleInclude}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {isIncluded ? 'Esta refeição será incluída na sua dieta personalizada' : 'Esta refeição não será incluída na sua dieta'}
          </p>
        </div>

        {/* Food Selection Grid - Only show when toggle is active */}
        {isIncluded && (
          <div className="border-t border-[#F0F0F0] p-4">
            <div className="mb-4">
              <p className="text-md font-medium mb-2">Selecione os alimentos que você costuma consumir</p>
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

            {/* Show minimized view if section is minimized and has selections */}
            {isMinimized && selectedItems.length > 0 ? (
              <div className="space-y-3">
                {/* Show all selected items as individual green cards */}
                {selectedItems.map((itemValue, index) => {
                  const food = foods.find(f => f.value === itemValue);
                  const isFirst = index === 0;
                  return (
                    <div key={index} className="border-2 border-green-500 bg-green-50 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{food?.emoji}</span>
                        <div>
                          <p className="font-medium text-green-700">{food?.label}</p>
                          <p className="text-sm text-green-600">
                            {isFirst ? "Primeira opção selecionada" : `${index === 1 ? "Segunda" : index === 2 ? "Terceira" : index === 3 ? "Quarta" : "Quinta"} opção selecionada`}
                          </p>
                        </div>
                      </div>
                      <div className="bg-green-500 rounded-full p-2">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  );
                })}

                {/* Button to expand selections */}
                <button
                  onClick={handleExpand}
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Modificar seleções ({selectedItems.length}/{maxItems})
                </button>
              </div>
            ) : (
              /* Show full selection grid */
              <div className="grid grid-cols-3 gap-3">
                {foods.map((food) => {
                  const isSelected = selectedItems.includes(food.value);
                  const isDisabled = !isSelected && selectedItems.length >= maxItems;

                  return (
                    <button
                      key={food.value}
                      onClick={() => handleItemToggle(food.value)}
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
                      <p className="text-xl mb-1">{food.emoji}</p>
                      <span className="font-medium text-center leading-tight">{food.label}</span>
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
