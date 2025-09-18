import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useAuth, UserRole } from "./AuthContext";
import { useTranslations } from "./translations";
import { User, Mail, Lock, UserPlus } from "lucide-react";

interface LoginFormProps {
  onClose?: () => void;
}

export function LoginForm({ onClose }: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register, language } = useAuth();
  const t = useTranslations(language);
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "cliente" as UserRole
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const success = await login(loginData.email, loginData.password);
      if (success) {
        if (onClose) onClose();
      } else {
        setError("Credenciales inválidas");
      }
    } catch (err) {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (registerData.password !== registerData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }
    
    try {
      const success = await register(registerData);
      if (success) {
        if (onClose) onClose();
      } else {
        setError("El email ya está registrado");
      }
    } catch (err) {
      setError("Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isLogin ? <User className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          {isLogin ? t.loginToAccount : t.createAccount}
        </CardTitle>
      </CardHeader>
      <CardContent>
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  {t.password}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              
              {error && <p className="text-sm text-red-500">{error}</p>}
              
              <div className="flex gap-2">
                {onClose && (
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    {t.cancel}
                  </Button>
                )}
                <Button type="submit" disabled={loading} className={onClose ? "flex-1" : "w-full"}>
                  {loading ? "..." : t.login}
                </Button>
              </div>
              
              <p className="text-sm text-center">
                {t.dontHaveAccount}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-primary underline"
                >
                  {t.register}
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t.firstName}</Label>
                  <Input
                    id="firstName"
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t.lastName}</Label>
                  <Input
                    id="lastName"
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="regEmail">{t.email}</Label>
                <Input
                  id="regEmail"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="regPhone">{t.phone}</Label>
                <Input
                  id="regPhone"
                  type="tel"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">{t.role}</Label>
                <Select 
                  value={registerData.role} 
                  onValueChange={(value: UserRole) => setRegisterData(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cliente">{t.client}</SelectItem>
                    <SelectItem value="empleado">{t.employee}</SelectItem>
                    <SelectItem value="administrador">{t.administrator}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="regPassword">{t.password}</Label>
                <Input
                  id="regPassword"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
              </div>
              
              {error && <p className="text-sm text-red-500">{error}</p>}
              
              <div className="flex gap-2">
                {onClose && (
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    {t.cancel}
                  </Button>
                )}
                <Button type="submit" disabled={loading} className={onClose ? "flex-1" : "w-full"}>
                  {loading ? "..." : t.register}
                </Button>
              </div>
              
              <p className="text-sm text-center">
                {t.alreadyHaveAccount}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-primary underline"
                >
                  {t.login}
                </button>
              </p>
            </form>
          )}
          
          {/* Demo credentials */}
          <div className="mt-4 p-3 bg-muted rounded text-xs">
            <p className="font-semibold mb-1">Demo Credentials:</p>
            <p>Admin: admin@hotel.com / admin123</p>
            <p>Employee: empleado@hotel.com / emp123</p>
            <p>Client: cliente@email.com / cliente123</p>
          </div>
        </CardContent>
    </Card>
  );
}