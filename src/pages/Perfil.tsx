
import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, EyeOff, Save, Trash2, User } from "lucide-react";

const Perfil = () => {
  const { user, profile, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Estado para dados do perfil
  const [dadosPerfil, setDadosPerfil] = useState({
    nome: profile?.nome || "",
    email: user?.email || "",
    telefone: profile?.telefone || "",
    senha: "",
    confirmarSenha: ""
  });
  
  // Estado para dados de endereço
  const [dadosEndereco, setDadosEndereco] = useState({
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: ""
  });

  const handleSalvarPerfil = () => {
    // Validação simples
    if (!dadosPerfil.nome.trim()) {
      toast({
        title: "Erro ao salvar",
        description: "O nome é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    if (dadosPerfil.senha && dadosPerfil.senha !== dadosPerfil.confirmarSenha) {
      toast({
        title: "Erro ao salvar",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }
    
    // Simular atualização
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso"
    });
    
    setEditMode(false);
  };
  
  const handleSalvarEndereco = () => {
    toast({
      title: "Endereço atualizado",
      description: "Seu endereço foi atualizado com sucesso"
    });
  };
  
  const handleExcluirConta = () => {
    const confirmar = window.confirm(
      "Você tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
    );
    
    if (confirmar) {
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso"
      });
      
      // Simular logout e redirecionamento
      logout();
      navigate("/");
    }
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
        <p className="text-muted-foreground mb-6">
          Visualize e edite suas informações pessoais
        </p>
        
        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="grid grid-cols-2 w-[400px] mb-8">
            <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="endereco">Endereço</TabsTrigger>
          </TabsList>
          
          {/* Tab de Dados Pessoais */}
          <TabsContent value="dados" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>
                      Seus dados cadastrais
                    </CardDescription>
                  </div>
                  <Button 
                    variant={editMode ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setEditMode(!editMode)}
                  >
                    {editMode ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <label className="text-sm font-medium">Nome Completo</label>
                      <Input
                        value={dadosPerfil.nome}
                        onChange={(e) => setDadosPerfil({...dadosPerfil, nome: e.target.value})}
                        disabled={!editMode}
                      />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <label className="text-sm font-medium">E-mail</label>
                      <Input
                        type="email"
                        value={dadosPerfil.email}
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Telefone</label>
                    <Input
                      value={dadosPerfil.telefone}
                      onChange={(e) => setDadosPerfil({...dadosPerfil, telefone: e.target.value})}
                      disabled={!editMode}
                    />
                  </div>
                  
                  {profile?.tipo === 'vet' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CRMV</label>
                      <Input
                        value="12345-SP" // Exemplo, em produção viria do banco de dados
                        disabled
                      />
                    </div>
                  )}
                  
                  {editMode && (
                    <>
                      <div className="pt-4">
                        <h3 className="font-medium mb-2">Alterar Senha</h3>
                        <div className="space-y-4">
                          <div className="relative">
                            <label className="text-sm font-medium">Nova Senha</label>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                value={dadosPerfil.senha}
                                onChange={(e) => setDadosPerfil({...dadosPerfil, senha: e.target.value})}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  {showPassword ? "Hide password" : "Show password"}
                                </span>
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Confirmar Senha</label>
                            <Input
                              type="password"
                              value={dadosPerfil.confirmarSenha}
                              onChange={(e) => setDadosPerfil({...dadosPerfil, confirmarSenha: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <Button onClick={handleSalvarPerfil}>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Alterações
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Excluir Conta</CardTitle>
                <CardDescription>
                  Esta ação não pode ser desfeita
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Ao excluir sua conta, todos os seus dados serão permanentemente removidos do sistema.
                  Esta ação não pode ser desfeita.
                </p>
                <Button variant="destructive" onClick={handleExcluirConta}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Conta
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab de Endereço */}
          <TabsContent value="endereco" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meu Endereço</CardTitle>
                <CardDescription>
                  Endereço cadastrado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CEP</label>
                      <Input
                        value={dadosEndereco.cep}
                        onChange={(e) => setDadosEndereco({...dadosEndereco, cep: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Estado</label>
                      <Input
                        value={dadosEndereco.estado}
                        onChange={(e) => setDadosEndereco({...dadosEndereco, estado: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cidade</label>
                    <Input
                      value={dadosEndereco.cidade}
                      onChange={(e) => setDadosEndereco({...dadosEndereco, cidade: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bairro</label>
                    <Input
                      value={dadosEndereco.bairro}
                      onChange={(e) => setDadosEndereco({...dadosEndereco, bairro: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Logradouro</label>
                    <Input
                      value={dadosEndereco.logradouro}
                      onChange={(e) => setDadosEndereco({...dadosEndereco, logradouro: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Número</label>
                      <Input
                        value={dadosEndereco.numero}
                        onChange={(e) => setDadosEndereco({...dadosEndereco, numero: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Complemento</label>
                      <Input
                        value={dadosEndereco.complemento}
                        onChange={(e) => setDadosEndereco({...dadosEndereco, complemento: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSalvarEndereco}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Endereço
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Perfil;
