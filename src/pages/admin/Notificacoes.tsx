
import { useState, useEffect } from "react";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Bell, 
  Users, 
  User, 
  Calendar, 
  Search, 
  Megaphone,
  Send,
  Trash2
} from "lucide-react";
import { format } from "date-fns";

interface Notification {
  id: string;
  title: string;
  message: string;
  tipo: "system" | "alert" | "info";
  target_type: "all" | "client" | "vet" | "admin" | "user";
  target_id: string | null;
  created_at: string;
  read_count: number;
  total_recipients: number;
}

const Notificacoes = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Form state for new notification
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    tipo: "info",
    target_type: "all",
    target_id: ""
  });

  useEffect(() => {
    // Mock data for now
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "Manutenção Programada",
        message: "O sistema entrará em manutenção dia 15/06 às 23h",
        tipo: "system",
        target_type: "all",
        target_id: null,
        created_at: new Date().toISOString(),
        read_count: 145,
        total_recipients: 250
      },
      {
        id: "2",
        title: "Nova funcionalidade disponível",
        message: "Agora é possível agendar consultas diretamente pelo aplicativo",
        tipo: "info",
        target_type: "client",
        target_id: null,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        read_count: 87,
        total_recipients: 120
      },
      {
        id: "3",
        title: "Alerta de segurança",
        message: "Detectamos acessos suspeitos em algumas contas",
        tipo: "alert",
        target_type: "all",
        target_id: null,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        read_count: 230,
        total_recipients: 250
      }
    ];
    
    setNotifications(mockNotifications);
    setFilteredNotifications(mockNotifications);
    setIsLoading(false);
  }, []);

  // Filtrar notificações quando a busca ou a aba mudar
  useEffect(() => {
    const filtered = notifications.filter(notification => {
      const matchesSearch = !searchTerm || 
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesTab = currentTab === "all" || 
        (currentTab === "system" && notification.tipo === "system") ||
        (currentTab === "alert" && notification.tipo === "alert") ||
        (currentTab === "info" && notification.tipo === "info");
        
      return matchesSearch && matchesTab;
    });
    
    setFilteredNotifications(filtered);
  }, [searchTerm, currentTab, notifications]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch {
      return "-";
    }
  };
  
  const handleCreateNotification = () => {
    // Validação básica
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e mensagem são obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    // Criar nova notificação (mock)
    const newId = `${notifications.length + 1}`;
    const createdNotification: Notification = {
      id: newId,
      title: newNotification.title,
      message: newNotification.message,
      tipo: newNotification.tipo as any,
      target_type: newNotification.target_type as any,
      target_id: newNotification.target_id || null,
      created_at: new Date().toISOString(),
      read_count: 0,
      total_recipients: newNotification.target_type === "all" ? 250 : 120
    };
    
    setNotifications([createdNotification, ...notifications]);
    
    // Limpar form e fechar dialog
    setNewNotification({
      title: "",
      message: "",
      tipo: "info",
      target_type: "all",
      target_id: ""
    });
    
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Notificação enviada",
      description: "A notificação foi enviada com sucesso"
    });
  };
  
  const getNotificationBadge = (tipo: string) => {
    switch (tipo) {
      case "system":
        return <Badge variant="outline">Sistema</Badge>;
      case "alert":
        return <Badge variant="destructive">Alerta</Badge>;
      case "info":
        return <Badge variant="secondary">Informativo</Badge>;
      default:
        return <Badge>{tipo}</Badge>;
    }
  };
  
  const getTargetBadge = (target_type: string) => {
    switch (target_type) {
      case "all":
        return <Badge variant="default">Todos</Badge>;
      case "client":
        return <Badge variant="secondary">Clientes</Badge>;
      case "vet":
        return <Badge variant="outline">Veterinários</Badge>;
      case "admin":
        return <Badge variant="destructive">Administradores</Badge>;
      case "user":
        return <Badge>Usuário Específico</Badge>;
      default:
        return <Badge>{target_type}</Badge>;
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notificações</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie e envie notificações aos usuários da plataforma
            </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar notificação..."
                className="pl-9 h-10 md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              className="h-10"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Megaphone className="h-4 w-4 mr-2" />
              Nova Notificação
            </Button>
          </div>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full mb-6">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
            <TabsTrigger value="alert">Alertas</TabsTrigger>
            <TabsTrigger value="info">Informativos</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Card>
          <CardHeader className="py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <CardTitle>Histórico de Notificações</CardTitle>
                <CardDescription>
                  {filteredNotifications.length} {filteredNotifications.length === 1 ? "notificação encontrada" : "notificações encontradas"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Destinatário</TableHead>
                      <TableHead>Enviada em</TableHead>
                      <TableHead>Visualizações</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((notification) => (
                        <TableRow key={notification.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{notification.title}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {notification.message}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getNotificationBadge(notification.tipo)}</TableCell>
                          <TableCell>{getTargetBadge(notification.target_type)}</TableCell>
                          <TableCell>{formatDate(notification.created_at)}</TableCell>
                          <TableCell>
                            <span className="font-medium">{notification.read_count}</span>
                            <span className="text-muted-foreground"> / {notification.total_recipients}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Nenhuma notificação encontrada.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Dialog para criar nova notificação */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nova Notificação</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Título
                </label>
                <Input
                  id="title"
                  placeholder="Digite o título da notificação"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Mensagem
                </label>
                <Textarea
                  id="message"
                  placeholder="Digite o conteúdo da notificação"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="tipo" className="text-sm font-medium">
                    Tipo
                  </label>
                  <Select
                    value={newNotification.tipo}
                    onValueChange={(value) => setNewNotification({ ...newNotification, tipo: value })}
                  >
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Informativo</SelectItem>
                      <SelectItem value="alert">Alerta</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="target" className="text-sm font-medium">
                    Destinatários
                  </label>
                  <Select
                    value={newNotification.target_type}
                    onValueChange={(value) => setNewNotification({ ...newNotification, target_type: value })}
                  >
                    <SelectTrigger id="target">
                      <SelectValue placeholder="Selecione os destinatários" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os usuários</SelectItem>
                      <SelectItem value="client">Apenas clientes</SelectItem>
                      <SelectItem value="vet">Apenas veterinários</SelectItem>
                      <SelectItem value="admin">Apenas administradores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateNotification}>
                <Send className="h-4 w-4 mr-2" />
                Enviar Notificação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminDashboardLayout>
  );
};

export default Notificacoes;
