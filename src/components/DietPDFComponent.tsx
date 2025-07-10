import React from 'react';

interface MealData {
  main: { name: string; quantity: string; calories: number }[];
  alternatives: { name: string; quantity: string; calories: number }[];
}

interface DietPDFProps {
  dietData: {
    breakfast: MealData;
    morningSnack: MealData | null;
    lunch: MealData;
    afternoonSnack: MealData | null;
    dinner: MealData;
    totalCalories: number;
    notes?: string;
  };
}

export const DietPDFComponent: React.FC<DietPDFProps> = ({ dietData }) => {
  const MealSection = ({ 
    title, 
    mealData, 
    color,
    number 
  }: { 
    title: string; 
    mealData: MealData | null; 
    color: string;
    number: number;
  }) => {
    if (!mealData) return null;

    return (
      <div style={{ 
        marginBottom: '32px', 
        border: `2px solid ${color}`, 
        borderRadius: '12px', 
        padding: '20px',
        backgroundColor: `${color}10`
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '16px' 
        }}>
          <div style={{ 
            backgroundColor: color, 
            color: 'white', 
            borderRadius: '50%', 
            width: '32px', 
            height: '32px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 'bold', 
            marginRight: '12px',
            fontSize: '14px'
          }}>
            {number}
          </div>
          <h2 style={{ 
            color: color, 
            fontWeight: 'bold', 
            fontSize: '20px', 
            margin: 0 
          }}>
            {title}
          </h2>
        </div>

        {/* Main Plan */}
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ 
            color: '#374151', 
            fontWeight: '600', 
            fontSize: '16px', 
            marginBottom: '12px' 
          }}>
            Plano Principal
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '12px' 
          }}>
            {mealData.main.map((item, index) => (
              <div 
                key={index} 
                style={{ 
                  backgroundColor: '#f9fafb', 
                  padding: '12px', 
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <div>
                    <p style={{ 
                      fontWeight: '500', 
                      color: '#1f2937', 
                      margin: '0 0 4px 0',
                      fontSize: '14px'
                    }}>
                      {item.name}
                    </p>
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#6b7280', 
                      margin: 0 
                    }}>
                      {item.quantity}
                    </p>
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    backgroundColor: color + '20', 
                    color: color, 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    fontWeight: '500'
                  }}>
                    {item.calories} cal
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alternatives */}
        {mealData.alternatives && mealData.alternatives.length > 0 && (
          <div>
            <h3 style={{ 
              color: '#1e40af', 
              fontWeight: '600', 
              fontSize: '16px', 
              marginBottom: '12px' 
            }}>
              Alternativas
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '12px' 
            }}>
              {mealData.alternatives.map((item, index) => (
                <div 
                  key={index} 
                  style={{ 
                    backgroundColor: '#eff6ff', 
                    padding: '12px', 
                    borderRadius: '8px',
                    border: '1px solid #dbeafe'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}>
                    <div>
                      <p style={{ 
                        fontWeight: '500', 
                        color: '#1f2937', 
                        margin: '0 0 4px 0',
                        fontSize: '14px'
                      }}>
                        {item.name}
                      </p>
                      <p style={{ 
                        fontSize: '12px', 
                        color: '#6b7280', 
                        margin: 0 
                      }}>
                        {item.quantity}
                      </p>
                    </div>
                    <span style={{ 
                      fontSize: '12px', 
                      backgroundColor: '#dbeafe', 
                      color: '#1e40af', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontWeight: '500'
                    }}>
                      {item.calories} cal
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  let mealNumber = 1;

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      lineHeight: '1.6', 
      color: '#333',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '32px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '20px'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          margin: '0 0 8px 0' 
        }}>
          Sua Dieta Personalizada
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280', 
          margin: 0 
        }}>
          Total: {dietData.totalCalories} calorias por dia
        </p>
        <p style={{ 
          fontSize: '14px', 
          color: '#9ca3af', 
          margin: '8px 0 0 0' 
        }}>
          Gerada em: {new Date().toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
          })}
        </p>
      </div>

      {/* Meals */}
      <MealSection 
        title="Café da Manhã" 
        mealData={dietData.breakfast} 
        color="#10b981"
        number={mealNumber++}
      />

      {dietData.morningSnack && (
        <MealSection 
          title="Lanche da Manhã" 
          mealData={dietData.morningSnack} 
          color="#f59e0b"
          number={mealNumber++}
        />
      )}

      <MealSection 
        title="Almoço" 
        mealData={dietData.lunch} 
        color="#3b82f6"
        number={mealNumber++}
      />

      {dietData.afternoonSnack && (
        <MealSection 
          title="Lanche da Tarde" 
          mealData={dietData.afternoonSnack} 
          color="#8b5cf6"
          number={mealNumber++}
        />
      )}

      <MealSection 
        title="Jantar" 
        mealData={dietData.dinner} 
        color="#6366f1"
        number={mealNumber++}
      />

      {/* Notes */}
      {dietData.notes && (
        <div style={{ 
          backgroundColor: '#f0f9ff', 
          padding: '20px', 
          borderRadius: '12px',
          border: '2px solid #0ea5e9',
          marginTop: '32px'
        }}>
          <h3 style={{ 
            color: '#0369a1', 
            fontWeight: 'bold', 
            fontSize: '18px', 
            marginBottom: '12px' 
          }}>
            Dicas Nutricionais
          </h3>
          <div style={{ 
            color: '#374151', 
            fontSize: '14px',
            whiteSpace: 'pre-wrap'
          }}>
            {dietData.notes}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ 
        marginTop: '40px', 
        textAlign: 'center',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '20px'
      }}>
        <p style={{ 
          fontSize: '12px', 
          color: '#9ca3af', 
          margin: 0 
        }}>
          🤖 Gerado com Inteligência Artificial • NutriBox
        </p>
        <p style={{ 
          fontSize: '11px', 
          color: '#d1d5db', 
          margin: '4px 0 0 0' 
        }}>
          Consulte sempre um nutricionista antes de fazer mudanças significativas na sua dieta.
        </p>
      </div>
    </div>
  );
};