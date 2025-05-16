
import { useState } from "react";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Switch, 
} from "@/components/ui/switch";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  Mail,
  Smartphone,
  Palette,
  Shield,
  Database,
  Save,
  Settings,
  Users,
  Bell,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Configuracoes = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("general");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  
  // Estados para configurações
  const [emailConfig, setEmailConfig] = useState({
    smtpServer: "smtp.example.com",
    port: "587",
    username: "no-reply@example.com",
    password: "******",
    senderName: "PetCare System"
  });
  
  const [notificacoes, setNotificacoes] = useState({
    emailNovasContas: true,
    emailNovasConsultas: true,
    emailCancelamentos: true,
    pushNovasContas: false,
    pushNovasConsultas: true,
    pushCancelamentos: true
  });
  
  const [aparencia, setAparencia] = useState({
    tema: "system",
    corPrimaria: "#8257E5",
    modoEscuro: true,
    animacoes: true
  });
  
  const [seguranca, setSeguranca] = useState({
    verificacaoEmail: true,
    doisFatores: false,
    tentativasLogin: "5",
    tempoSessao: "30",
    politicaSenha: "medium"
  });
  
  const handleSaveConfig = (section: string) => {
    // Simulação de salvamento - aqui seria uma chamada à API
    toast({
      title: "Configurações salvas",
      description: `As configurações de ${section} foram atualizadas com sucesso.`,
    });
  };
  
  const handleResetSystem = () => {
    // Simulação de reset
    setIsResetDialogOpen(false);
    toast({
      title: "Sistema resetado",
      description: "Todas as configurações foram restauradas aos valores padrão.",
      variant: "destructive"
    });
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as configurações globais da plataforma
          </p>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="general">
              <Settings className="h-4 w-4 mr-2" />
              Gerais
            </TabsTrigger>
            <TabsTrigger value="notificacoes">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="aparencia">
              <Palette className="h-4 w-4 mr-2" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="seguranca">
              <Shield className="h-4 w-4 mr-2" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="sistema">
              <Database className="h-4 w-4 mr-2" />
              Sistema
            </TabsTrigger>
          </TabsList>
          
          {/* Configurações Gerais */}
          <TabsContent value="general" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Email</CardTitle>
                <CardDescription>
                  Configure as opções de envio de email do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpServer">Servidor SMTP</Label>
                    <Input 
                      id="smtpServer"
                      value={emailConfig.smtpServer}
                      onChange={(e) => setEmailConfig({...emailConfig, smtpServer: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="port">Porta</Label>
                    <Input 
                      id="port"
                      value={emailConfig.port}
                      onChange={(e) => setEmailConfig({...emailConfig, port: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Nome de Usuário</Label>
                    <Input 
                      id="username"
                      value={emailConfig.username}
                      onChange={(e) => setEmailConfig({...emailConfig, username: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input 
                      id="password"
                      type="password"
                      value={emailConfig.password}
                      onChange={(e) => setEmailConfig({...emailConfig, password: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senderName">Nome do Remetente</Label>
                  <Input 
                    id="senderName"
                    value={emailConfig.senderName}
                    onChange={(e) => setEmailConfig({...emailConfig, senderName: e.target.value})}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveConfig('email')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Contato</CardTitle>
                <CardDescription>
                  Configure as informações de contato exibidas para os usuários
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email de Contato</Label>
                    <div className="flex">
                      <Mail className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                      <Input id="contactEmail" defaultValue="contato@petcare.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Telefone de Contato</Label>
                    <div className="flex">
                      <Smartphone className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                      <Input id="contactPhone" defaultValue="(11) 99999-9999" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Email de Suporte</Label>
                  <div className="flex">
                    <Mail className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                    <Input id="supportEmail" defaultValue="suporte@petcare.com" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveConfig('contato')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Configurações de Notificações */}
          <TabsContent value="notificacoes" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notificações por Email</CardTitle>
                <CardDescription>
                  Configure quais eventos devem gerar notificações por email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cadastro de Novas Contas</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar email quando novos usuários se registrarem
                    </p>
                  </div>
                  <Switch
                    checked={notificacoes.emailNovasContas}
                    onCheckedChange={(checked) => setNotificacoes({...notificacoes, emailNovasContas: checked})}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Agendamento de Consultas</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar email quando novas consultas forem agendadas
                    </p>
                  </div>
                  <Switch
                    checked={notificacoes.emailNovasConsultas}
                    onCheckedChange={(checked) => setNotificacoes({...notificacoes, emailNovasConsultas: checked})}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cancelamento de Consultas</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar email quando consultas forem canceladas
                    </p>
                  </div>
                  <Switch
                    checked={notificacoes.emailCancelamentos}
                    onCheckedChange={(checked) => setNotificacoes({...notificacoes, emailCancelamentos: checked})}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveConfig('notificações por email')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notificações Push</CardTitle>
                <CardDescription>
                  Configure quais eventos devem gerar notificações push
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cadastro de Novas Contas</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar notificação quando novos usuários se registrarem
                    </p>
                  </div>
                  <Switch
                    checked={notificacoes.pushNovasContas}
                    onCheckedChange={(checked) => setNotificacoes({...notificacoes, pushNovasContas: checked})}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Agendamento de Consultas</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar notificação quando novas consultas forem agendadas
                    </p>
                  </div>
                  <Switch
                    checked={notificacoes.pushNovasConsultas}
                    onCheckedChange={(checked) => setNotificacoes({...notificacoes, pushNovasConsultas: checked})}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cancelamento de Consultas</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar notificação quando consultas forem canceladas
                    </p>
                  </div>
                  <Switch
                    checked={notificacoes.pushCancelamentos}
                    onCheckedChange={(checked) => setNotificacoes({...notificacoes, pushCancelamentos: checked})}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveConfig('notificações push')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Configurações de Aparência */}
          <TabsContent value="aparencia" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tema e Cores</CardTitle>
                <CardDescription>
                  Personalize a aparência do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tema">Tema padrão</Label>
                  <Select
                    value={aparencia.tema}
                    onValueChange={(value) => setAparencia({...aparencia, tema: value})}
                  >
                    <SelectTrigger id="tema">
                      <SelectValue placeholder="Selecione um tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema (Automático)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="corPrimaria">Cor Primária</Label>
                  <div className="flex space-x-3">
                    <Input
                      type="color"
                      id="corPrimaria"
                      value={aparencia.corPrimaria}
                      onChange={(e) => setAparencia({...aparencia, corPrimaria: e.target.value})}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={aparencia.corPrimaria}
                      onChange={(e) => setAparencia({...aparencia, corPrimaria: e.target.value})}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo Escuro</Label>
                    <p className="text-sm text-muted-foreground">
                      Habilitar modo escuro como opção
                    </p>
                  </div>
                  <Switch
                    checked={aparencia.modoEscuro}
                    onCheckedChange={(checked) => setAparencia({...aparencia, modoEscuro: checked})}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Animações</Label>
                    <p className="text-sm text-muted-foreground">
                      Habilitar animações na interface
                    </p>
                  </div>
                  <Switch
                    checked={aparencia.animacoes}
                    onCheckedChange={(checked) => setAparencia({...aparencia, animacoes: checked})}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveConfig('aparência')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Configurações de Segurança */}
          <TabsContent value="seguranca" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Autenticação e Segurança</CardTitle>
                <CardDescription>
                  Configure as opções de segurança da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Verificação de Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Exigir verificação de email para novas contas
                    </p>
                  </div>
                  <Switch
                    checked={seguranca.verificacaoEmail}
                    onCheckedChange={(checked) => setSeguranca({...seguranca, verificacaoEmail: checked})}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-muted-foreground">
                      Habilitar opção de 2FA para usuários
                    </p>
                  </div>
                  <Switch
                    checked={seguranca.doisFatores}
                    onCheckedChange={(checked) => setSeguranca({...seguranca, doisFatores: checked})}
                  />
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tentativasLogin">Tentativas de login</Label>
                    <Input 
                      id="tentativasLogin"
                      type="number"
                      min="1"
                      max="10"
                      value={seguranca.tentativasLogin}
                      onChange={(e) => setSeguranca({...seguranca, tentativasLogin: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Número máximo de tentativas de login antes de bloquear
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tempoSessao">Tempo de sessão (minutos)</Label>
                    <Input 
                      id="tempoSessao"
                      type="number"
                      min="5"
                      max="1440"
                      value={seguranca.tempoSessao}
                      onChange={(e) => setSeguranca({...seguranca, tempoSessao: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Tempo de inatividade antes de encerrar a sessão
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="politicaSenha">Política de Senha</Label>
                  <Select
                    value={seguranca.politicaSenha}
                    onValueChange={(value) => setSeguranca({...seguranca, politicaSenha: value})}
                  >
                    <SelectTrigger id="politicaSenha">
                      <SelectValue placeholder="Selecione uma política" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Básica (mínimo 6 caracteres)</SelectItem>
                      <SelectItem value="medium">Média (letras e números, mínimo 8 caracteres)</SelectItem>
                      <SelectItem value="high">Alta (letras, números e símbolos, mínimo 10 caracteres)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveConfig('segurança')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Configurações do Sistema */}
          <TabsContent value="sistema" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Backup e Restauração</CardTitle>
                <CardDescription>
                  Gerencie backups e restauração do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Fazer Backup Agora
                  </Button>
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Restaurar Backup
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backupSchedule">Programação de Backup</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger id="backupSchedule">
                      <SelectValue placeholder="Selecione uma frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">A cada hora</SelectItem>
                      <SelectItem value="daily">Diariamente</SelectItem>
                      <SelectItem value="weekly">Semanalmente</SelectItem>
                      <SelectItem value="monthly">Mensalmente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backupRetention">Retenção de Backup</Label>
                  <Select defaultValue="30">
                    <SelectTrigger id="backupRetention">
                      <SelectValue placeholder="Selecione um período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 dias</SelectItem>
                      <SelectItem value="30">30 dias</SelectItem>
                      <SelectItem value="90">90 dias</SelectItem>
                      <SelectItem value="365">365 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveConfig('backup')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Manutenção do Sistema</CardTitle>
                <CardDescription>
                  Opções avançadas de manutenção do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Limpar Cache
                  </Button>
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Otimizar Banco de Dados
                  </Button>
                </div>
                
                <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Resetar Sistema
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar Reset do Sistema</DialogTitle>
                      <DialogDescription>
                        Esta ação irá resetar todas as configurações do sistema para os valores padrão. Esta operação não pode ser desfeita.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-destructive font-semibold flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Atenção: Esta é uma operação irreversível!
                      </p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button variant="destructive" onClick={handleResetSystem}>
                        Confirmar Reset
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  );
};

export default Configuracoes;
