// Authentication Types
export interface User {
  id: string;
  email: string;
  phoneNumber?: string;
  cpf: string;
  name?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  userToken: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  phoneNumber: string;
  cpf: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

// Diet Types
export interface MealItem {
  name: string;
  quantity: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  grams?: number;
}

export interface MealSection {
  main: MealItem[];
  alternatives: MealItem[];
  totalCalories?: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFat?: number;
}

export interface DietPlan {
  breakfast: MealSection;
  morningSnack: MealSection;
  lunch: MealSection;
  afternoonSnack: MealSection;
  dinner: MealSection;
  totalCalories: number;
  notes: string;
}

export interface GeneratePromptRequest {
  weight: string;
  height: string;
  age: string;
  goal: string;
  calories: string;
  gender: string;
  schedule: string;
  activityLevel: string;
  workoutPlan: string;
  breakfast: string;
  morningSnack: string;
  lunch: string;
  afternoonSnack: string;
  dinner: string;
  usesSupplements?: boolean;
  supplements?: string;
}

export interface GeneratePromptResponse {
  success: boolean;
  data: {
    dietId: string;
    message: string;
  };
}

// Checkout Types
export interface CheckoutRequest {
  dietId: string;
}

export interface Transaction {
  id: string;
  transaction_type: string;
  gateway_id: string;
  amount: number;
  status: string;
  success: boolean;
  gateway_response: {
    code: string;
    errors?: Array<{
      message: string;
    }>;
  };
  antifraud_response: Record<string, any>;
  metadata: Record<string, any>;
  qr_code?: string;
  qr_code_url?: string;
  pix_provider_tid?: string;
  expires_at?: string;
}

export interface CheckoutResponse {
  success: boolean;
  data: {
    dietId: string;
    orderId: string;
    status: string;
    amount: number;
    message: string;
    qrCode?: string;
    qrCodeUrl?: string;
    last_transaction?: Transaction;
  };
}

// Payment Status Types
export interface PaymentStatusResponse {
  success: boolean;
  paid: boolean;
  message: string;
  data?: {
    dietId: string;
    aiResponse: string;
    orderStatus: string;
    createdAt: string;
  };
}

// User Paid Diet Types
export interface UserPaidDietResponse {
  success: boolean;
  hasPaidDiet: boolean;
  data?: {
    dietId: string;
    aiResponse: string;
    createdAt: string;
    isRegenerated: boolean;
    originalDietId: string | null;
    regenerationCount: number;
  };
}

// Regenerate Diet Types
export interface RegenerateDietRequest {
  dietId: string;
  feedback: string;
}

export interface RegenerateDietResponse {
  success: boolean;
  data: {
    dietId: string;
    aiResponse: string;
    message: string;
    regenerationCount: number;
  };
}

// Order Data (for payment modal)
export interface OrderData {
  dietId: string;
  orderId: string;
  status: string;
  amount: number;
  message: string;
  last_transaction?: Transaction;
  qrCode?: string;
  qrCodeUrl?: string;
}

// Form Data Types
export interface FormData {
  weight: string;
  height: string;
  age: string;
  objective: string;
  calories: string;
  gender: string;
  schedule: string;
  activityLevel: string;
  workoutPlan: string;
  breakfast: string;
  morningSnack: string;
  lunch: string;
  afternoonSnack: string;
  dinner: string;
  usesSupplements?: boolean;
  supplements?: string;
}

// API Error Response
export interface ApiError {
  success: false;
  error: string;
  details?: string | any;
  statusCode?: number;
  code?: string;
  message?: string;
}

// Generic API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Parsed Diet Data (after processing AI response)
export interface ParsedDietData {
  dietId?: string;
  breakfast: MealSection;
  morningSnack: MealSection | null;
  lunch: MealSection;
  afternoonSnack: MealSection | null;
  dinner: MealSection;
  totalCalories: number;
  notes: string;
  createdAt?: string;
  isRegenerated?: boolean;
  originalDietId?: string | null;
  regenerationCount?: number;
  fullResponse?: string;
}

// UI State Types
export type Step = 'form' | 'loading' | 'preview';

export interface LoadingStep {
  icon: any; // React component
  title: string;
  description: string;
}

// Auth Context Types
export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpRequest) => Promise<void>;
  signOut: () => void;
  updateUserToken: (token: string) => void;
}

// Enums (matching backend)
export enum Gender {
  MASCULINO = 'masculino',
  FEMININO = 'feminino',
  OUTRO = 'outro',
  PREFIRO_NAO_DIZER = 'prefiro_nao_dizer'
}

export enum Goal {
  EMAGRECER = 'emagrecer',
  GANHAR_MASSA = 'ganhar_massa',
  MANTER = 'manter'
}

export enum ActivityLevel {
  SEDENTARIO = 'sedentario',
  LEVE = 'leve',
  MODERADO = 'moderado',
  ATIVO = 'ativo',
  MUITO_ATIVO = 'muito_ativo'
}

export enum WorkoutPlan {
  ACADEMIA = 'academia',
  CASA = 'casa',
  NENHUM = 'nenhum'
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum MealSchedule {
  PADRAO = 'padrao',
  PERSONALIZADO = 'personalizado',
  SCHEDULE_1 = '05:30-08:30-12:00-15:00-19:00',
  SCHEDULE_2 = '06:00-09:00-12:00-15:00-19:00',
  SCHEDULE_3 = '06:30-09:30-13:00-16:00-20:00',
  SCHEDULE_4 = '07:00-10:00-12:30-15:30-19:30',
  SCHEDULE_5 = '07:30-10:30-12:00-15:00-19:00',
  SCHEDULE_6 = '08:00-11:00-13:30-16:30-20:30',
  SCHEDULE_7 = '09:00-11:00-13:00-16:00-21:00'
}