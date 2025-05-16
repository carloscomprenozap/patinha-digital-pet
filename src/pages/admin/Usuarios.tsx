
import { useState, useEffect } from "react";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, PlusCircle, UserPlus, User, Calendar, Mail, Phone } from "lucide-react";

interface UserData {
  id: string;
  nome: string;
  email?: string; // Making email optional
  telefone: string;
  tipo: string;
  created_at: string;
}

const Usuarios = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usuarios, setUsuarios] = useState<UserData[]>([]);
  const [currentTab, setCurrentTab] = useState("all");
  
  useEffect(() => {
    carregarUsuarios();
  }, []);
  
  const carregarUsuarios = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      // Transformar os dados para corresponder à interface UserData
      const usuariosFormatados = data?.map(user => ({
        id: user.id,
        nome: user.nome,
        email: "", // Placeholder já que não temos email no resultado da consulta
        telefone: user.telefone || "",
        tipo: user.tipo,
        created_at: user.created_at
      })) || [];
      
      setUsuarios(usuariosFormatados);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de usuários",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredUsers = usuarios
    .filter(user => 
      (currentTab === 'all' || user.tipo === currentTab) &&
      (user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'client':
        return { label: 'Cliente', variant: 'default' };
      case 'vet':
        return { label: 'Veterinário', variant: 'secondary' };
      case 'admin':
        return { label: 'Administrador', variant: 'destructive' };
      default:
        return { label: tipo, variant: 'outline' };
    }
  };
  
  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
            <p className="text-muted-foreground mt-1">
              Visualize e administre todos os usuários da plataforma
            </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Buscar por nome ou email..." 
                className="pl-9 h-10 md:w-60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="h-10">
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="client">Clientes</TabsTrigger>
            <TabsTrigger value="vet">Veterinários</TabsTrigger>
            <TabsTrigger value="admin">Administradores</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle>Lista de Usuários</CardTitle>
            <CardDescription>
              {filteredUsers.length} usuários encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <Table>
                <TableCaption>Lista de usuários cadastrados na plataforma</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((usuario) => {
                      const tipoInfo = getTipoLabel(usuario.tipo);
                      return (
                        <TableRow key={usuario.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <User className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{usuario.nome}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                              {usuario.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                              {usuario.telefone || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={tipoInfo.variant as any}>
                              {tipoInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              {formatDate(usuario.created_at)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">Detalhes</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        <p className="text-muted-foreground">
                          Nenhum usuário encontrado com os filtros aplicados
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
};

export default Usuarios;
