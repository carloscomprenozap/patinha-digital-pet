
import { useState, useEffect } from "react";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Veterinarian } from "@/types";
import { 
  Search, 
  Stethoscope, 
  MapPin, 
  MoreVertical, 
  PencilLine, 
  Trash2, 
  Eye,
  Calendar,
  UserPlus
} from "lucide-react";
import { format } from "date-fns";

interface VeterinarioExtended extends Veterinarian {
  created_at: string;
  endereco?: {
    cidade: string;
    estado: string;
  }
}

const Veterinarios = () => {
  const { toast } = useToast();
  const [veterinarios, setVeterinarios] = useState<VeterinarioExtended[]>([]);
  const [filteredVets, setFilteredVets] = useState<VeterinarioExtended[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    carregarVeterinarios();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = veterinarios.filter(vet => 
        vet.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vet.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vet.crmv.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vet.endereco?.cidade.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVets(filtered);
    } else {
      setFilteredVets(veterinarios);
    }
  }, [searchTerm, veterinarios]);

  const carregarVeterinarios = async () => {
    setIsLoading(true);
    try {
      // Buscar veterinários com dados do perfil
      const { data: veterinariosData, error } = await supabase
        .from('veterinarios')
        .select(`
          *,
          profiles:id(id, nome, telefone, tipo)
        `);
      
      if (error) throw error;
      
      // Buscar endereços dos veterinários
      const vetIds = veterinariosData?.map(vet => vet.id) || [];
      
      if (vetIds.length === 0) {
        setVeterinarios([]);
        setFilteredVets([]);
        setIsLoading(false);
        return;
      }
      
      const { data: enderecosData, error: enderecosError } = await supabase
        .from('enderecos')
        .select('user_id, cidade, estado')
        .in('user_id', vetIds);
        
      if (enderecosError) throw enderecosError;
      
      // Mapear para o formato desejado
      const enderecosMap = new Map();
      enderecosData?.forEach(endereco => {
        enderecosMap.set(endereco.user_id, endereco);
      });
      
      const vetsFormatted = veterinariosData?.map(vet => {
        const profileData = vet.profiles as any;
        const endereco = enderecosMap.get(vet.id);
        
        return {
          id: vet.id,
          nome: profileData?.nome || 'Sem nome',
          email: '',
          telefone: profileData?.telefone || '',
          tipo: 'vet' as const,
          especialidades: [],
          crmv: vet.crmv,
          disponibilidade: [],
          precoConsulta: vet.preco_consulta,
          endereco: endereco ? {
            cep: '',
            estado: endereco.estado,
            cidade: endereco.cidade,
            bairro: '',
            logradouro: '',
            numero: ''
          } : undefined,
          created_at: vet.created_at
        };
      }) || [];
      
      setVeterinarios(vetsFormatted);
      setFilteredVets(vetsFormatted);
    } catch (error) {
      console.error("Erro ao carregar veterinários:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de veterinários",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch {
      return "-";
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Veterinários</h1>
            <p className="text-muted-foreground mt-1">
              Visualize e gerencie todos os veterinários cadastrados na plataforma
            </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar veterinário..."
                className="pl-9 h-10 md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="h-10">
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Veterinário
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <CardTitle>Lista de Veterinários</CardTitle>
                <CardDescription>
                  {filteredVets.length} {filteredVets.length === 1 ? "veterinário encontrado" : "veterinários encontrados"}
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
                      <TableHead>Veterinário</TableHead>
                      <TableHead>CRMV</TableHead>
                      <TableHead>Localidade</TableHead>
                      <TableHead>Consulta</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVets.length > 0 ? (
                      filteredVets.map((vet) => (
                        <TableRow key={vet.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <Stethoscope className="mr-2 h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{vet.nome}</div>
                                <div className="text-sm text-muted-foreground">{vet.telefone || 'Sem telefone'}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{vet.crmv}</TableCell>
                          <TableCell>
                            {vet.endereco ? (
                              <div className="flex items-center">
                                <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                                <span>{vet.endereco.cidade}, {vet.endereco.estado}</span>
                              </div>
                            ) : (
                              "Não informado"
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              R$ {vet.precoConsulta.toFixed(2)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(vet.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <span className="sr-only">Abrir menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver Perfil
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <PencilLine className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Horários
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Nenhum veterinário encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
};

export default Veterinarios;
