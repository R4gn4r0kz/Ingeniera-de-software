import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    email: "admin@hotel.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "Hotel",
    role: "administrador",
    phone: "+56912345678",
    registeredAt: "2024-01-01"
  },
  {
    id: "2",
    email: "empleado@hotel.com",
    password: "emp123",
    firstName: "Juan",
    lastName: "Pérez",
    role: "empleado",
    phone: "+56987654321",
    registeredAt: "2024-01-15"
  },
  {
    id: "3",
    email: "cliente@email.com",
    password: "cliente123",
    firstName: "María",
    lastName: "González",
    role: "cliente",
    phone: "+56911111111",
    registeredAt: "2024-02-01"
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>("es");

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("currentUser");
    const savedLanguage = localStorage.getItem("preferredLanguage");
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedLanguage) {
      setLanguage(savedLanguage as Language);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      return false;
    }
    
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      phone: userData.phone,
      registeredAt: new Date().toISOString().split('T')[0]
    };
    
    // Add to mock users
    mockUsers.push({ ...newUser, password: userData.password });
    
    setUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
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
      isAuthenticated: !!user
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