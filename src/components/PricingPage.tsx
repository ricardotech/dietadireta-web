import { Button } from "@/components/ui/button";
import { CheckCircle, Star, Zap, Shield, Clock, ArrowRight, Lock } from "lucide-react";

interface PricingPageProps {
  onBack: () => void;
  onPurchase: (planType: string) => void;
}

export function PricingPage({ onBack, onPurchase }: PricingPageProps) {
  const plans = [
    {
      id: "diet-only",
      name: "Dieta Emagrecimento",
      price: "R$ 9,99",
      originalPrice: "R$ 19,99",
      badge: "Dieta focada em Emagrecimento",
      badgeColor: "bg-blue-100 text-blue-800",
      features: [
        "Dieta Totalmente Personalizada",
        "Baseada em seus alimentos",
        "Calorias ajustadas",
        "Quantidade de cada alimentos",
        "Horário de cada Refeição",
        "Ebook Personalizado"
      ],
      buttonText: "Comprar Agora",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      id: "diet-training",
      name: "Dieta + Treino",
      price: "R$ 11,99",
      originalPrice: "R$ 24,99",
      badge: "Mais Vendido",
      badgeColor: "bg-green-100 text-green-800",
      border: "border-green-500",
      shadow: "shadow-green-100",
      features: [
        "Dieta Personalizada",
        "Resumo sobre sua situação",
        "Opções para casa ou academia",
        "Ebook Personalizado",
        "Com base suas preferências",
        "Treinos Personalizados",
        "Calorias e intensidade ajustadas"
      ],
      buttonText: "Comprar Agora",
      buttonColor: "bg-green-600 hover:bg-green-700"
    },
    {
      id: "complete",
      name: "Acompanhamento com a Nutricionista",
      price: "R$ 19,99",
      originalPrice: "R$ 49,99",
      badge: "O mais completo",
      badgeColor: "bg-purple-100 text-purple-800",
      features: [
        "Dieta Modificada pela Nutri",
        "Direito para ajustar sua dieta",
        "Variedade de opções",
        "Ebook Personalizado + (Bônus acompanhamento com a nutricionista)",
        "Consulta feita pelo Whatsapp",
        "Resultados mais rápidos",
        "Dicas da Nutricionista"
      ],
      buttonText: "Comprar Agora",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      extra: "Como Funciona"
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      result: "Perdeu 8kg em 2 meses",
      text: "A dieta personalizada mudou minha vida! Consegui perder peso de forma saudável e sustentável.",
      rating: 5
    },
    {
      name: "João Santos",
      result: "Ganhou 5kg de massa magra",
      text: "O combo dieta + treino foi perfeito. Consegui os resultados que sempre quis!",
      rating: 5
    },
    {
      name: "Ana Costa",
      result: "Melhorou disposição",
      text: "Com o acompanhamento da nutricionista, aprendi a comer melhor e me sinto muito mais disposta.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Escolha o Plano Ideal
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Preços que cabem no seu bolso!
        </p>
        <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
          <Shield className="w-5 h-5" />
          <span>Pagamento único e seguro</span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl p-8 ${plan.border || 'border border-gray-200'
                } ${plan.shadow || 'shadow-lg'} transition-all duration-300 hover:shadow-xl`}
            >
              {/* Badge */}
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${plan.badgeColor}`}>
                {plan.badge}
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-lg text-gray-500 line-through">{plan.originalPrice}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <Button
                onClick={() => onPurchase(plan.id)}
                className={`w-full py-4 text-lg font-semibold ${plan.buttonColor} text-white rounded-xl transition-all duration-300 hover:scale-105`}
              >
                {plan.buttonText}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {/* Extra link */}
              {plan.extra && (
                <div className="text-center mt-4">
                  <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center justify-center gap-1">
                    <span>Como Funciona</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Veja o que nossos clientes dizem
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-green-600 font-medium">{testimonial.result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guarantee */}
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-200">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-green-600" />
            <h3 className="text-2xl font-bold text-gray-900">Garantia de 7 dias</h3>
          </div>
          <p className="text-gray-600 text-lg mb-6">
            Se não ficar satisfeito com sua dieta personalizada, devolvemos 100% do seu dinheiro.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Lock className="w-4 h-4" />
              <span>Pagamento Seguro</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Entrega Imediata</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>Resultados Garantidos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="max-w-6xl mx-auto px-4 mt-8 text-center">
        <Button
          onClick={onBack}
          variant="outline"
          className="px-8 py-3 text-lg"
        >
          Voltar para o formulário
        </Button>
      </div>
    </div>
  );
}
