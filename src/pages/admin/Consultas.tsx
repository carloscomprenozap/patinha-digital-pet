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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Calendar, Clock, Stethoscope, User, FileText } from "lucide-react";
import { ConsultaDB } from "@/types";

const Consultas = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [consultas, setConsultas] = useState<ConsultaDB[]>([]);
  const [currentTab, setCurrentTab] = useState("all");
  
  useEffect(() => {
    carregarConsultas();
  }, []);
  
  const carregarConsultas = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('consultas')
        .select(`
          *,
          profiles_vet:vet_id(nome),
          profiles_client:client_id(nome),
          pets:pet_id(nome)
        `);
      
      if (error) throw error;
      
      // Mapear os dados para o formato correto com as relações
      const consultasFormatadas = data?.map(consulta => {
        return {
          ...consulta,
          profiles_client: { 
            nome: consulta.profiles_client?.nome || "-" 
          },
          profiles_vet: { 
            nome: consulta.profiles_vet?.nome || "-" 
          },
          pets: { 
            nome: consulta.pets?.nome || "-" 
          }
        };
      }) || [];
      
      setConsultas(consultasFormatadas);
    } catch (error) {
      console.error("Erro ao carregar consultas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de consultas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredConsultas = consultas
    .filter(consulta => 
      (currentTab === 'all' || consulta.status === currentTab) &&
      (consulta.profiles_client?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       consulta.profiles_vet?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       consulta.pets?.nome?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      // Ordenar pela data de consulta (mais recente primeiro)
      const dateA = new Date(`${a.data}T${a.horario}`).getTime();
      const dateB = new Date(`${b.data}T${b.horario}`).getTime();
      return dateB - dateA;
    });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'agendado':
        return { label: 'Agendado', variant: 'default' };
      case 'confirmado':
        return { label: 'Confirmado', variant: 'secondary' };
      case 'concluido':
        return { label: 'Concluído', variant: 'success' };
      case 'cancelado':
        return { label: 'Cancelado', variant: 'destructive' };
      default:
        return { label: status, variant: 'outline' };
    }
  };
  
  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Consultas</h1>
            <p className="text-muted-foreground mt-1">
              Visualize e administre todas as consultas da plataforma
            </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Buscar por cliente, veterinário ou pet..." 
                className="pl-9 h-10 md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="h-10">
              <FileText className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="agendado">Agendadas</TabsTrigger>
            <TabsTrigger value="confirmado">Confirmadas</TabsTrigger>
            <TabsTrigger value="concluido">Concluídas</TabsTrigger>
            <TabsTrigger value="cancelado">Canceladas</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle>Lista de Consultas</CardTitle>
            <CardDescription>
              {filteredConsultas.length} consultas encontradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <Table>
                <TableCaption>Lista de consultas registradas na plataforma</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Pet</TableHead>
                    <TableHead>Veterinário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsultas.length > 0 ? (
                    filteredConsultas.map((consulta) => {
                      const statusInfo = getStatusLabel(consulta.status);
                      return (
                        <TableRow key={consulta.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              {formatDate(consulta.data)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              {consulta.horario}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <User className="mr-2 h-4 w-4 text-muted-foreground" />
                              {consulta.profiles_client?.nome || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            {consulta.pets?.nome || "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Stethoscope className="mr-2 h-4 w-4 text-muted-foreground" />
                              {consulta.profiles_vet?.nome || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusInfo.variant as any}>
                              {statusInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">Detalhes</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        <p className="text-muted-foreground">
                          Nenhuma consulta encontrada com os filtros aplicados
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

export default Consultas;
