
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  confirmarSenha: string;
}

const CadastroAdminForm = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome) {
      newErrors.nome = "O nome é obrigatório";
    }
    
    if (!formData.email) {
      newErrors.email = "O e-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }
    
    if (!formData.telefone) {
      newErrors.telefone = "O telefone é obrigatório";
    } else if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(formData.telefone)) {
      newErrors.telefone = "Telefone inválido. Use o formato (00) 00000-0000";
    }
    
    if (!formData.senha) {
      newErrors.senha = "A senha é obrigatória";
    } else if (formData.senha.length < 6) {
      newErrors.senha = "A senha deve ter pelo menos 6 caracteres";
    }
    
    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = "Confirme sua senha";
    } else if (formData.confirmarSenha !== formData.senha) {
      newErrors.confirmarSenha = "As senhas não coincidem";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    const success = await signup({
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      senha: formData.senha,
      tipo: 'admin'
    });
    
    if (success) {
      navigate("/login-admin");
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    
    if (value.length <= 11) {
      // Formatar como (XX) XXXXX-XXXX
      if (value.length > 2) {
        value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
      }
      if (value.length > 10) {
        value = `${value.substring(0, 10)}-${value.substring(10)}`;
      }
      
      setFormData({ ...formData, telefone: value });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome Completo</Label>
        <Input
          id="nome"
          placeholder="Digite seu nome completo"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          aria-invalid={!!errors.nome}
          className="h-11 rounded-lg"
        />
        {errors.nome && (
          <p className="text-sm text-destructive">{errors.nome}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          aria-invalid={!!errors.email}
          className="h-11 rounded-lg"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="telefone">Telefone</Label>
        <Input
          id="telefone"
          placeholder="(00) 00000-0000"
          value={formData.telefone}
          onChange={handlePhoneChange}
          aria-invalid={!!errors.telefone}
          className="h-11 rounded-lg"
        />
        {errors.telefone && (
          <p className="text-sm text-destructive">{errors.telefone}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="senha">Senha</Label>
        <Input
          id="senha"
          type="password"
          placeholder="••••••••"
          value={formData.senha}
          onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
          aria-invalid={!!errors.senha}
          className="h-11 rounded-lg"
        />
        {errors.senha && (
          <p className="text-sm text-destructive">{errors.senha}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
        <Input
          id="confirmarSenha"
          type="password"
          placeholder="••••••••"
          value={formData.confirmarSenha}
          onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
          aria-invalid={!!errors.confirmarSenha}
          className="h-11 rounded-lg"
        />
        {errors.confirmarSenha && (
          <p className="text-sm text-destructive">{errors.confirmarSenha}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 text-base rounded-lg shadow-md"
        disabled={loading}
      >
        {loading ? "Cadastrando..." : "Cadastrar Administrador"}
      </Button>
    </form>
  );
};

export default CadastroAdminForm;
