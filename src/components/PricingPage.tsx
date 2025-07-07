import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { CheckCircle, Star, Zap, Shield, Clock, ArrowRight, Lock, Home, FileText, User, HelpCircle, LogOut, X, MenuIcon, Quote } from "lucide-react";
import { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { AuthModal } from './AuthModal';

interface PricingPageProps {
    onBack: () => void;
    onPurchase: (planType: string) => void;
}

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
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-8 w-auto"
                        />
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
                                            <img
                                                src="/logo.png"
                                                alt="Logo"
                                                className="h-6 w-auto"
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

export function PricingPage({ onBack, onPurchase }: PricingPageProps) {
    const [authModal, setAuthModal] = useState<{ isOpen: boolean; planId: string; planName: string }>({
        isOpen: false,
        planId: '',
        planName: ''
    });
    
    const handlePlanSelect = (planId: string, planName: string) => {
        setAuthModal({ isOpen: true, planId, planName });
    };

    const handleAuthSuccess = (planId: string) => {
        setAuthModal({ isOpen: false, planId: '', planName: '' });
        onPurchase(planId);
    };

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
            buttonColor: "bg-green-500 hover:bg-green-600"
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
            buttonColor: "bg-green-500 hover:bg-green-600"
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
            buttonColor: "bg-green-500 hover:bg-green-600",
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
        <main className="bg-[#F9FAFB]">
            <Header />
            <div className="h-[70px]"></div>



            {/* Pricing Cards */}
            <div className="py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-green-100 rounded-lg flex items-center justify-center mr-3 p-3">
                                <Star className="text-green-600 w-8 h-8" />
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">Escolha sua dieta</h2>
                        </div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Preços que cabem no seu bolso com resultados garantidos
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div key={plan.id} className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col h-[600px]">
                                <div className="border-b border-[#F0F0F0] p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="bg-green-100 rounded-lg flex items-center justify-center mr-3 p-2">
                                                <Star className="text-green-600 w-5 h-5" />
                                            </div>
                                            <div>
                                                <h1 className="text-lg font-black">{plan.name}</h1>
                                                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${plan.badgeColor}`}>
                                                    {plan.badge}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-center">
                                        <div className="flex items-baseline justify-center gap-2">
                                            <span className="text-2xl lg:text-3xl font-bold text-gray-900">{plan.price}</span>
                                            <span className="text-sm lg:text-lg text-gray-500 line-through">{plan.originalPrice}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    {/* Features */}
                                    <ul className="space-y-2 mb-4 md:mb-6 flex-1">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-auto">
                                        {/* Button */}
                                        <Button
                                            onClick={() => handlePlanSelect(plan.id, plan.name)}
                                            className={`w-full py-7 px-8 text-xl font-bold ${plan.buttonColor} text-white rounded-lg transition-colors duration-200 mb-2`}
                                        >
                                            {plan.buttonText}
                                            <ArrowRight className="inline-block w-12 h-12 text-white ml-2" />
                                        </Button>

                                        {/* Extra link */}
                                        {plan.extra && (
                                            <div className="text-center mt-3">
                                                <button className="text-green-600 hover:text-green-700 font-medium flex items-center justify-center gap-1">
                                                    <span>Como Funciona</span>
                                                </button>
                                            </div>
                                        )}

                                        <p className="text-xs lg:text-sm text-gray-500 mt-3 mb-2 text-center">
                                            Pagamento único e seguro
                                            <Lock className="inline-block ml-1 w-3 h-3 lg:w-4 lg:h-4 text-gray-500" />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="py-8 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-green-100 rounded-lg flex items-center justify-center mr-3 p-3">
                                <Quote className="text-green-600 w-8 h-8" />
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">Veja o que nossos clientes dizem</h2>
                        </div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Milhares de pessoas já transformaram suas vidas com nossas dietas personalizadas
                        </p>
                    </div>
                    
                    <div className="relative">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={30}
                            slidesPerView={1}
                            navigation={{
                                prevEl: '.swiper-button-prev-custom',
                                nextEl: '.swiper-button-next-custom',
                            }}
                            pagination={{
                                clickable: true,
                                bulletClass: 'swiper-pagination-bullet-custom',
                                bulletActiveClass: 'swiper-pagination-bullet-active-custom',
                            }}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                768: {
                                    slidesPerView: 2,
                                },
                                1024: {
                                    slidesPerView: 3,
                                }
                            }}
                            className="testimonials-swiper"
                        >
                            {testimonials.map((testimonial, index) => (
                                <SwiperSlide key={index} className="h-auto pb-14">
                                    <div className="bg-white rounded-2xl p-8 border border-gray-100 h-[400px] flex flex-col relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-bl-full flex items-center justify-center">
                                            <Quote className="w-8 h-8 text-green-500 rotate-12" />
                                        </div>
                                        
                                        <div className="flex items-center gap-1 mb-6">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        
                                        <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 flex-1 italic">
                                            &ldquo;{testimonial.text}&rdquo;
                                        </blockquote>
                                        
                                        <div className="border-t border-gray-100 pt-6 mt-auto">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                                                    <p className="text-green-600 font-semibold text-sm">{testimonial.result}</p>
                                                </div>
                                                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                                    <CheckCircle className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        
                        {/* Custom Navigation Buttons */}
                        <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-green-50 transition-colors">
                            <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
                        </div>
                        <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-green-50 transition-colors">
                            <ArrowRight className="w-5 h-5 text-gray-600" />
                        </div>
                    </div>
                </div>
                
                {/* Custom Swiper Styles */}
                <style jsx>{`
                    .testimonials-swiper .swiper-pagination {
                        bottom: -50px !important;
                    }
                    
                    .swiper-pagination-bullet-custom {
                        width: 12px;
                        height: 12px;
                        background: #d1d5db;
                        border-radius: 50%;
                        margin: 0 6px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    
                    .swiper-pagination-bullet-active-custom {
                        background: #10b981 !important;
                        transform: scale(1.2);
                    }
                `}</style>
            </div>

            {/* Guarantee */}
            <div className="py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-green-100 rounded-lg flex items-center justify-center mr-3 p-3">
                                <Shield className="text-green-600 w-8 h-8" />
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">Garantia de 7 dias</h2>
                        </div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Se não ficar satisfeito com sua dieta personalizada, devolvemos 100% do seu dinheiro
                        </p>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <Lock className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Pagamento Seguro</h3>
                                <p className="text-gray-600">Seus dados estão protegidos com criptografia SSL</p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <Clock className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Entrega Imediata</h3>
                                <p className="text-gray-600">Receba sua dieta personalizada em poucos minutos</p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <Zap className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Resultados Garantidos</h3>
                                <p className="text-gray-600">Ou devolvemos 100% do seu investimento</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back button */}
            <div className="py-8 px-4 text-center">
                <Button
                    onClick={onBack}
                    variant="outline"
                    className="py-7 px-8 text-xl font-bold rounded-lg"
                >
                    Voltar para o formulário
                </Button>
            </div>

            {/* Auth Modal */}
            <AuthModal
                isOpen={authModal.isOpen}
                onClose={() => setAuthModal({ isOpen: false, planId: '', planName: '' })}
                onSuccess={handleAuthSuccess}
                selectedPlan={authModal.planId}
                planName={authModal.planName}
                initialMode="signup"
            />
        </main>
    );
}
