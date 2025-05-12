
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import MainLayout from "@/components/layouts/MainLayout";
import Logo from "@/components/Logo";

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  crmv: string;
  especialidades: string[];
  estado: string;
  cidade: string;
  senha: string;
  confirmarSenha: string;
}

const CadastroVeterinario = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    crmv: "",
    especialidades: [],
    estado: "",
    cidade: "",
    senha: "",
    confirmarSenha: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const especialidadesOptions = [
    "Clínica Geral",
    "Dermatologia",
    "Cardiologia",
    "Ortopedia",
    "Oftalmologia",
    "Neurologia",
    "Oncologia",
    "Odontologia",
    "Comportamento"
  ];

  const validateStep1 = () => {
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
    
    if (!formData.crmv) {
      newErrors.crmv = "O CRMV é obrigatório";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.especialidades.length === 0) {
      newErrors.especialidades = "Selecione pelo menos uma especialidade";
    }
    
    if (!formData.estado) {
      newErrors.estado = "O estado é obrigatório";
    }
    
    if (!formData.cidade) {
      newErrors.cidade = "A cidade é obrigatória";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    
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

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 3 && validateStep3()) {
      setIsLoading(true);
      
      // Simular registro
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Em breve analisaremos suas informações e entraremos em contato.",
        });
        navigate("/login");
      }, 1500);
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

  const handleEspecialidadesChange = (especialidade: string) => {
    if (formData.especialidades.includes(especialidade)) {
      setFormData({
        ...formData, 
        especialidades: formData.especialidades.filter(e => e !== especialidade)
      });
    } else {
      setFormData({
        ...formData,
        especialidades: [...formData.especialidades, especialidade]
      });
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
            <CardTitle className="text-2xl">Cadastro de Veterinário</CardTitle>
            <CardDescription>
              Junte-se à nossa plataforma de atendimento domiciliar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <div 
                  className={`w-1/3 h-1 rounded-full ${
                    currentStep >= 1 ? "bg-primary" : "bg-muted"
                  }`}
                ></div>
                <div 
                  className={`w-1/3 h-1 rounded-full mx-1 ${
                    currentStep >= 2 ? "bg-primary" : "bg-muted"
                  }`}
                ></div>
                <div 
                  className={`w-1/3 h-1 rounded-full ${
                    currentStep === 3 ? "bg-primary" : "bg-muted"
                  }`}
                ></div>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {currentStep === 1 && "Informações Pessoais"}
                {currentStep === 2 && "Especialização e Localização"}
                {currentStep === 3 && "Finalizar Cadastro"}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Passo 1: Informações Pessoais */}
              {currentStep === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      placeholder="Digite seu nome completo"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      aria-invalid={!!errors.nome}
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
                    />
                    {errors.telefone && (
                      <p className="text-sm text-destructive">{errors.telefone}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="crmv">CRMV (Registro profissional)</Label>
                    <Input
                      id="crmv"
                      placeholder="Ex: 12345-SP"
                      value={formData.crmv}
                      onChange={(e) => setFormData({ ...formData, crmv: e.target.value })}
                      aria-invalid={!!errors.crmv}
                    />
                    {errors.crmv && (
                      <p className="text-sm text-destructive">{errors.crmv}</p>
                    )}
                  </div>
                </>
              )}

              {/* Passo 2: Especialização e Localização */}
              {currentStep === 2 && (
                <>
                  <div className="space-y-2">
                    <Label>Especialidades</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {especialidadesOptions.map((especialidade) => (
                        <div key={especialidade} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`esp-${especialidade}`}
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            checked={formData.especialidades.includes(especialidade)}
                            onChange={() => handleEspecialidadesChange(especialidade)}
                          />
                          <label 
                            htmlFor={`esp-${especialidade}`} 
                            className="ml-2 text-sm"
                          >
                            {especialidade}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.especialidades && (
                      <p className="text-sm text-destructive">{errors.especialidades}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select
                      value={formData.estado}
                      onValueChange={(value) => setFormData({ ...formData, estado: value })}
                    >
                      <SelectTrigger id="estado" aria-invalid={!!errors.estado}>
                        <SelectValue placeholder="Selecione seu estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="SC">Santa Catarina</SelectItem>
                        {/* Adicionar mais estados conforme necessário */}
                      </SelectContent>
                    </Select>
                    {errors.estado && (
                      <p className="text-sm text-destructive">{errors.estado}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      placeholder="Digite sua cidade"
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                      aria-invalid={!!errors.cidade}
                    />
                    {errors.cidade && (
                      <p className="text-sm text-destructive">{errors.cidade}</p>
                    )}
                  </div>
                </>
              )}

              {/* Passo 3: Finalizar Cadastro */}
              {currentStep === 3 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha</Label>
                    <Input
                      id="senha"
                      type="password"
                      placeholder="••••••••"
                      value={formData.senha}
                      onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                      aria-invalid={!!errors.senha}
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
                    />
                    {errors.confirmarSenha && (
                      <p className="text-sm text-destructive">{errors.confirmarSenha}</p>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-4 border border-border rounded-md p-3 bg-muted/30">
                    <p>
                      Ao se cadastrar, você concorda com os nossos{" "}
                      <Link to="/termos" className="text-primary hover:underline">
                        Termos de Serviço
                      </Link>{" "}
                      e{" "}
                      <Link to="/politica-privacidade" className="text-primary hover:underline">
                        Política de Privacidade
                      </Link>
                    </p>
                  </div>
                </>
              )}
              
              <div className="flex justify-between mt-6">
                {currentStep > 1 ? (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={previousStep}
                    disabled={isLoading}
                  >
                    Voltar
                  </Button>
                ) : (
                  <div></div> // Espaçador
                )}
                
                {currentStep < 3 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Cadastrando..." : "Finalizar Cadastro"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-center w-full text-sm">
              <p>
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Faça login
                </Link>
              </p>
              <p className="mt-2">
                É um tutor de pets?{" "}
                <Link to="/cadastro" className="text-primary hover:underline">
                  Cadastre-se como cliente
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CadastroVeterinario;
