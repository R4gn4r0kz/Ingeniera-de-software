import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export type UserRole = "cliente" | "empleado" | "administrador";
export type Language = "es" | "en";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  registeredAt: string;
}

interface AuthContextType {
  user: User | null;
  language: Language;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  setLanguage: (lang: Language) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  rut?: string;
  address?: string;
  country?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create Supabase client
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>("es");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        // Check for demo user first
        const demoUser = localStorage.getItem("demoUser");
        if (demoUser) {
          setUser(JSON.parse(demoUser));
          setLoading(false);
          return;
        }
        
        // Check Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || "",
            firstName: session.user.user_metadata?.first_name || "",
            lastName: session.user.user_metadata?.last_name || "",
            role: session.user.user_metadata?.role || "cliente",
            registeredAt: session.user.created_at?.split('T')[0] || ""
          };
          setUser(userData);
        }
        
        // Check saved language
        const savedLanguage = localStorage.getItem("preferredLanguage");
        if (savedLanguage) {
          setLanguage(savedLanguage as Language);
        }
        
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes (only for Supabase users)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Don't override demo users
      const demoUser = localStorage.getItem("demoUser");
      if (demoUser) return;
      
      if (event === 'SIGNED_IN' && session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || "",
          firstName: session.user.user_metadata?.first_name || "",
          lastName: session.user.user_metadata?.last_name || "",
          role: session.user.user_metadata?.role || "cliente",
          registeredAt: session.user.created_at?.split('T')[0] || ""
        };
        setUser(userData);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Check demo credentials first for better UX
      const demoCredentials = {
        'admin@hotel.com': { password: 'admin123', role: 'administrador', name: 'Admin Hotel' },
        'empleado@hotel.com': { password: 'emp123', role: 'empleado', name: 'Juan Pérez' },
        'cliente@email.com': { password: 'cliente123', role: 'cliente', name: 'María González' }
      };
      
      const demo = demoCredentials[email as keyof typeof demoCredentials];
      if (demo && demo.password === password) {
        const userData: User = {
          id: `demo-${demo.role}`,
          email,
          firstName: demo.name.split(' ')[0],
          lastName: demo.name.split(' ')[1] || '',
          role: demo.role as UserRole,
          registeredAt: "2024-01-01"
        };
        setUser(userData);
        localStorage.setItem("demoUser", JSON.stringify(userData));
        return true;
      }
      
      // Try Supabase Auth for real users
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (!error && data.user) {
          const userData: User = {
            id: data.user.id,
            email: data.user.email || "",
            firstName: data.user.user_metadata?.first_name || "",
            lastName: data.user.user_metadata?.last_name || "",
            role: data.user.user_metadata?.role || "cliente",
            registeredAt: data.user.created_at?.split('T')[0] || ""
          };
          setUser(userData);
          return true;
        }
      } catch (supabaseError) {
        console.log("Supabase auth not available, using demo mode only");
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c8bcc102/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          role: userData.role,
          rut_pasaporte: userData.rut,
          direccion: userData.address,
          pais: userData.country
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.user) {
        // Auto login after successful registration
        const loginSuccess = await login(userData.email, userData.password);
        return loginSuccess;
      }
      
      return false;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Check if it's a demo user
      const demoUser = localStorage.getItem("demoUser");
      if (demoUser) {
        localStorage.removeItem("demoUser");
        setUser(null);
        return;
      }
      
      // Logout from Supabase
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("preferredLanguage", lang);
  };

  return (
    <AuthContext.Provider value={{
      user,
      language,
      login,
      register,
      logout,
      setLanguage: handleSetLanguage,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}