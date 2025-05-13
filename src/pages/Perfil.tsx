
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Loader2, Save, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ProfileForm {
  nome: string;
  telefone: string;
  email: string;
}

interface EnderecoForm {
  cep: string;
  estado: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;
}

interface SenhaForm {
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
}

const Perfil = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    nome: "",
    telefone: "",
    email: "",
  });
  
  const [enderecoForm, setEnderecoForm] = useState<EnderecoForm>({
    cep: "",
    estado: "",
    cidade: "",
    bairro: "",
    logradouro: "",
    numero: "",
    complemento: "",
  });
  
  const [senhaForm, setSenhaForm] = useState<SenhaForm>({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });
  
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [submittingEndereco, setSubmittingEndereco] = useState(false);
  const [submittingSenha, setSubmittingSenha] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [submittingDelete, setSubmittingDelete] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Carregar dados do perfil
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (profileError) throw profileError;
        
        // Carregar dados do endereço
        const { data: enderecoData, error: enderecoError } = await supabase
          .from("enderecos")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        
        // Não lançar erro se o endereço não existir
        
        // Atualizar formulários com dados carregados
        if (profileData) {
          setProfileForm({
            nome: profileData.nome || "",
            telefone: profileData.telefone || "",
            email: user.email || "",
          });
        }
        
        if (enderecoData) {
          setEnderecoForm({
            cep: enderecoData.cep || "",
            estado: enderecoData.estado || "",
            cidade: enderecoData.cidade || "",
            bairro: enderecoData.bairro || "",
            logradouro: enderecoData.logradouro || "",
            numero: enderecoData.numero || "",
            complemento: enderecoData.complemento || "",
          });
        }
        
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        toast({
          variant: "destructive",
          description: "Não foi possível carregar seus dados. Tente novamente mais tarde.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setSubmittingProfile(true);
      
      // Atualizar perfil no supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          nome: profileForm.nome,
          telefone: profileForm.telefone,
        })
        .eq("id", user.id);
      
      if (error) throw error;
      
      // Atualizar email só se foi alterado
      if (user.email !== profileForm.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: profileForm.email,
        });
        
        if (emailError) throw emailError;
        
        toast({
          description: "Um email de confirmação foi enviado para seu novo endereço de email.",
        });
      }
      
      toast({
        description: "Dados pessoais atualizados com sucesso!",
      });
      
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        variant: "destructive",
        description: "Erro ao atualizar seus dados pessoais. Tente novamente.",
      });
    } finally {
      setSubmittingProfile(false);
    }
  };

  const handleEnderecoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setSubmittingEndereco(true);
      
      // Verificar se já existe um endereço para este usuário
      const { data: existingAddress, error: checkError } = await supabase
        .from("enderecos")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingAddress) {
        // Atualizar endereço existente
        const { error } = await supabase
          .from("enderecos")
          .update({
            cep: enderecoForm.cep,
            estado: enderecoForm.estado,
            cidade: enderecoForm.cidade,
            bairro: enderecoForm.bairro,
            logradouro: enderecoForm.logradouro,
            numero: enderecoForm.numero,
            complemento: enderecoForm.complemento,
          })
          .eq("id", existingAddress.id);
        
        if (error) throw error;
      } else {
        // Criar novo endereço
        const { error } = await supabase
          .from("enderecos")
          .insert({
            user_id: user.id,
            cep: enderecoForm.cep,
            estado: enderecoForm.estado,
            cidade: enderecoForm.cidade,
            bairro: enderecoForm.bairro,
            logradouro: enderecoForm.logradouro,
            numero: enderecoForm.numero,
            complemento: enderecoForm.complemento,
          });
        
        if (error) throw error;
      }
      
      toast({
        description: "Endereço atualizado com sucesso!",
      });
      
    } catch (error) {
      console.error("Erro ao atualizar endereço:", error);
      toast({
        variant: "destructive",
        description: "Erro ao atualizar seu endereço. Tente novamente.",
      });
    } finally {
      setSubmittingEndereco(false);
    }
  };

  const handleSenhaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (senhaForm.novaSenha !== senhaForm.confirmarSenha) {
      toast({
        variant: "destructive",
        description: "As senhas não coincidem!",
      });
      return;
    }
    
    if (senhaForm.novaSenha.length < 6) {
      toast({
        variant: "destructive",
        description: "A senha deve ter pelo menos 6 caracteres!",
      });
      return;
    }
    
    try {
      setSubmittingSenha(true);
      
      const { error } = await supabase.auth.updateUser({
        password: senhaForm.novaSenha
      });
      
      if (error) throw error;
      
      toast({
        description: "Senha atualizada com sucesso!",
      });
      
      // Limpar formulário de senha
      setSenhaForm({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
      });
      
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      toast({
        variant: "destructive",
        description: "Erro ao atualizar sua senha. Tente novamente.",
      });
    } finally {
      setSubmittingSenha(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (deleteConfirmText !== "EXCLUIR") return;
    
    try {
      setSubmittingDelete(true);
      
      // Excluir conta no Supabase
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;
      
      // Fazer logout
      await logout();
      
      toast({
        description: "Sua conta foi excluída com sucesso.",
      });
      
      navigate("/");
      
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      toast({
        variant: "destructive",
        description: "Não foi possível excluir sua conta. Tente novamente ou entre em contato com o suporte.",
      });
    } finally {
      setSubmittingDelete(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const buscarCep = async (cep: string) => {
    if (cep.length !== 8) return;
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast({
          variant: "destructive",
          description: "CEP não encontrado!",
        });
        return;
      }
      
      setEnderecoForm(prev => ({
        ...prev,
        bairro: data.bairro || prev.bairro,
        cidade: data.localidade || prev.cidade,
        estado: data.uf || prev.estado,
        logradouro: data.logradouro || prev.logradouro,
      }));
      
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast({
        variant: "destructive",
        description: "Erro ao buscar CEP. Tente novamente.",
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e configurações de conta
          </p>
        </div>

        <Tabs defaultValue="perfil" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="perfil">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="endereco">Endereço</TabsTrigger>
            <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          </TabsList>
          
          {/* Aba de Dados Pessoais */}
          <TabsContent value="perfil">
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais de contato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome completo</Label>
                      <Input
                        id="nome"
                        placeholder="Digite seu nome completo"
                        value={profileForm.nome}
                        onChange={e => setProfileForm({...profileForm, nome: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={profileForm.email}
                        onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        placeholder="(00) 00000-0000"
                        value={profileForm.telefone}
                        onChange={e => {
                          let value = e.target.value.replace(/\D/g, "");
                          
                          if (value.length <= 11) {
                            // Formatar como (XX) XXXXX-XXXX
                            if (value.length > 2) {
                              value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
                            }
                            if (value.length > 10) {
                              value = `${value.substring(0, 10)}-${value.substring(10)}`;
                            }
                            
                            setProfileForm({...profileForm, telefone: value});
                          }
                        }}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={submittingProfile}
                    className="w-full sm:w-auto"
                  >
                    {submittingProfile ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Aba de Endereço */}
          <TabsContent value="endereco">
            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
                <CardDescription>
                  Atualize seu endereço de atendimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEnderecoSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        placeholder="00000-000"
                        value={enderecoForm.cep}
                        onChange={e => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 8) {
                            setEnderecoForm({...enderecoForm, cep: value});
                            if (value.length === 8) {
                              buscarCep(value);
                            }
                          }
                        }}
                        required
                      />
                      {enderecoForm.cep.length === 8 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="mt-1 h-8 text-xs"
                          onClick={() => buscarCep(enderecoForm.cep)}
                        >
                          Buscar CEP
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Input
                        id="estado"
                        placeholder="UF"
                        value={enderecoForm.estado}
                        onChange={e => setEnderecoForm({...enderecoForm, estado: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        placeholder="Sua cidade"
                        value={enderecoForm.cidade}
                        onChange={e => setEnderecoForm({...enderecoForm, cidade: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bairro">Bairro</Label>
                      <Input
                        id="bairro"
                        placeholder="Seu bairro"
                        value={enderecoForm.bairro}
                        onChange={e => setEnderecoForm({...enderecoForm, bairro: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logradouro">Logradouro</Label>
                    <Input
                      id="logradouro"
                      placeholder="Rua, Avenida, etc."
                      value={enderecoForm.logradouro}
                      onChange={e => setEnderecoForm({...enderecoForm, logradouro: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numero">Número</Label>
                      <Input
                        id="numero"
                        placeholder="Número"
                        value={enderecoForm.numero}
                        onChange={e => setEnderecoForm({...enderecoForm, numero: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="complemento">Complemento</Label>
                      <Input
                        id="complemento"
                        placeholder="Apto, Bloco, etc."
                        value={enderecoForm.complemento}
                        onChange={e => setEnderecoForm({...enderecoForm, complemento: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={submittingEndereco}
                    className="w-full sm:w-auto"
                  >
                    {submittingEndereco ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Aba de Segurança */}
          <TabsContent value="seguranca">
            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>
                  Atualize sua senha e gerencie configurações de segurança
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Alterar senha</h3>
                  <form onSubmit={handleSenhaSubmit} className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="senha-atual">Senha atual</Label>
                      <Input
                        id="senha-atual"
                        type="password"
                        placeholder="••••••••"
                        value={senhaForm.senhaAtual}
                        onChange={e => setSenhaForm({...senhaForm, senhaAtual: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nova-senha">Nova senha</Label>
                      <Input
                        id="nova-senha"
                        type="password"
                        placeholder="••••••••"
                        value={senhaForm.novaSenha}
                        onChange={e => setSenhaForm({...senhaForm, novaSenha: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmar-senha">Confirmar nova senha</Label>
                      <Input
                        id="confirmar-senha"
                        type="password"
                        placeholder="••••••••"
                        value={senhaForm.confirmarSenha}
                        onChange={e => setSenhaForm({...senhaForm, confirmarSenha: e.target.value})}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={submittingSenha}
                    >
                      {submittingSenha ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Atualizando...
                        </>
                      ) : 'Atualizar senha'}
                    </Button>
                  </form>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium text-destructive">Zona de perigo</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Excluir sua conta removerá permanentemente todos os seus dados. Esta ação não pode ser desfeita.
                  </p>
                  <Button 
                    variant="destructive" 
                    className="mt-4"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    Excluir conta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialog de confirmação para exclusão de conta */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Excluir conta</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão perdidos permanentemente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/30 rounded-md">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">
              Esta ação não pode ser desfeita. Todos os seus dados, consultas, pets e configurações serão excluídos permanentemente.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-delete">Para confirmar, digite "EXCLUIR":</Label>
            <Input
              id="confirm-delete"
              value={deleteConfirmText}
              onChange={e => setDeleteConfirmText(e.target.value)}
              placeholder="EXCLUIR"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== "EXCLUIR" || submittingDelete}
            >
              {submittingDelete ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : 'Excluir permanentemente'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Perfil;
