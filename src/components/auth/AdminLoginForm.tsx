
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormData {
  email: string;
  senha: string;
}

const AdminLoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    senha: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.email) {
      errors.email = "O e-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "E-mail inválido";
    }
    
    if (!formData.senha) {
      errors.senha = "A senha é obrigatória";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    const success = await login({
      email: formData.email,
      senha: formData.senha
    });
    
    if (success) {
      navigate("/dashboard-admin");
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardContent className="pt-6 p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@exemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              aria-invalid={!!formErrors.email}
              className="h-11 rounded-lg"
            />
            {formErrors.email && (
              <p className="text-sm text-destructive">{formErrors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="senha">Senha</Label>
              <Button variant="link" className="p-0 h-auto text-xs" asChild>
                <a href="#" className="text-primary">Esqueceu a senha?</a>
              </Button>
            </div>
            <Input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              aria-invalid={!!formErrors.senha}
              className="h-11 rounded-lg"
            />
            {formErrors.senha && (
              <p className="text-sm text-destructive">{formErrors.senha}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 text-base rounded-lg shadow-md"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar como Administrador"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminLoginForm;
