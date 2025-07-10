"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  phoneNumber: string;
  cpf: string;
};

type AuthResponse = {
  user: User;
  token: string;
  userToken: string;
};

type SignUpData = {
  email: string;
  phoneNumber: string;
  cpf: string;
  password: string;
};

type SignInData = {
  email: string;
  password: string;
};

type AuthContextData = {
  user: User | null;
  token: string;
  loading: boolean;
  login: (credentials: SignInData) => Promise<{
    error: boolean;
    message: string;
    user?: User;
    token?: string;
  }>;
  register: (data: SignUpData) => Promise<{
    error: boolean;
    message: string;
    user?: User;
    token?: string;
  }>;
  forgotPassword: (email: string) => Promise<{
    error: boolean;
    message: string;
  }>;
  resetPassword: (token: string, password: string) => Promise<{
    error: boolean;
    message: string;
  }>;
  signOut: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  whoami: () => Promise<User | null>;
};

type AuthProviderProps = {
  children: ReactNode;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100";

export function logout() {
  // Remove auth tokens
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  
  // Clear all diet related data and state
  localStorage.removeItem("dietabox-diet-data");
  localStorage.removeItem("dietabox-diet-step");
  localStorage.removeItem("dietabox-form-data");
  localStorage.removeItem("dietabox-order-data");
}

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Verify token is still valid
          const currentUser = await whoami();
          if (!currentUser) {
            await signOut();
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        await signOut();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const whoami = async (): Promise<User | null> => {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) return null;

      const response = await fetch(`${API_BASE_URL}/api/auth/whoami`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        return userData;
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const login = async ({ email, password }: SignInData) => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const authData = data as AuthResponse;
        setUser(authData.user);
        setToken(authData.token);
        localStorage.setItem("token", authData.token);
        localStorage.setItem("user", JSON.stringify(authData.user));

        return {
          error: false,
          message: "Login realizado com sucesso",
          user: authData.user,
          token: authData.token,
        };
      } else {
        return {
          error: true,
          message: data.error || "Erro ao fazer login",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        error: true,
        message: "Erro de conexão. Tente novamente.",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: SignUpData) => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        const authData = responseData as AuthResponse;
        setUser(authData.user);
        setToken(authData.token);
        localStorage.setItem("token", authData.token);
        localStorage.setItem("user", JSON.stringify(authData.user));

        return {
          error: false,
          message: "Cadastro realizado com sucesso",
          user: authData.user,
          token: authData.token,
        };
      } else {
        return {
          error: true,
          message: responseData.error || "Erro ao criar conta",
        };
      }
    } catch (error) {
      console.error("Register error:", error);
      return {
        error: true,
        message: "Erro de conexão. Tente novamente.",
      };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          error: false,
          message: data.message || "E-mail de recuperação enviado com sucesso",
        };
      } else {
        return {
          error: true,
          message: data.error || "Erro ao enviar e-mail de recuperação",
        };
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      return {
        error: true,
        message: "Erro de conexão. Tente novamente.",
      };
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          error: false,
          message: data.message || "Senha redefinida com sucesso",
        };
      } else {
        return {
          error: true,
          message: data.error || "Erro ao redefinir senha",
        };
      }
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        error: true,
        message: "Erro de conexão. Tente novamente.",
      };
    }
  };

  const signOut = async () => {
    try {
      logout();
      setUser(null);
      setToken("");
      router.push("/");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        forgotPassword,
        resetPassword,
        signOut,
        setLoading,
        setUser,
        whoami,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };

export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function AuthWrapped(props: T) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/signin");
      }
    }, [user, loading, router]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      );
    }

    if (!user) {
      return null;
    }

    return <Component {...props} />;
  };
}