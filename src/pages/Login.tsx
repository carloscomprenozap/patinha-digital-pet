
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layouts/MainLayout";
import { LoginCredentials } from "@/data/mockData";
import Logo from "@/components/Logo";

const Login = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: "", senha: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!credentials.email) {
      newErrors.email = "O e-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = "E-mail inválido";
    }
    
    if (!credentials.senha) {
      newErrors.senha = "A senha é obrigatória";
    } else if (credentials.senha.length < 6) {
      newErrors.senha = "A senha deve ter pelo menos 6 caracteres";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    const success = await login(credentials);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-md mx-auto px-4 py-8 md:py-16">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Entre na sua conta para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="senha">Senha</Label>
                  <Link 
                    to="/esqueci-senha" 
                    className="text-xs text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="senha"
                  type="password"
                  placeholder="••••••••"
                  value={credentials.senha}
                  onChange={(e) => setCredentials({ ...credentials, senha: e.target.value })}
                  aria-invalid={!!errors.senha}
                />
                {errors.senha && (
                  <p className="text-sm text-destructive">{errors.senha}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-center w-full text-sm">
              <p>
                Não tem uma conta?{" "}
                <Link to="/cadastro" className="text-primary hover:underline">
                  Cadastre-se
                </Link>
              </p>
              <p className="mt-2">
                É um veterinário?{" "}
                <Link to="/cadastro-veterinario" className="text-primary hover:underline">
                  Cadastre-se como profissional
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Login;
