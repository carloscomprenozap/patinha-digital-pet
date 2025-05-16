
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Stethoscope, Calendar, Mail, Phone, MapPin, Check, X } from "lucide-react";

interface VeterinarioData {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  crmv: string;
  preco_consulta: number;
  created_at: string;
  endereco?: {
    cidade: string;
    estado: string;
  };
}

const Veterinarios = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [veterinarios, setVeterinarios] = useState<VeterinarioData[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedVeterinario, setSelectedVeterinario] = useState<VeterinarioData | null>(null);
  
  useEffect(() => {
    carregarVeterinarios();
  }, []);
  
  const carregarVeterinarios = async () => {
    setIsLoading(true);
    try {
      // Buscar veterinários e seus perfis
      const { data: veterinariosData, error } = await supabase
        .from('veterinarios')
        .select(`
          *,
          profiles:id(id, nome, email, telefone, created_at)
        `);
      
      if (error) throw error;
      
      // Buscar endereços dos veterinários
      const vetIds = veterinariosData?.map(vet => vet.id) || [];
      
      const { data: enderecosData, error: enderecosError } = await supabase
        .from('enderecos')
        .select('*')
        .in('user_id', vetIds);
        
      if (enderecosError) throw enderecosError;
      
      // Preparar dados formatados
      const veterinariosFormatados = veterinariosData?.map(vet => ({
        id: vet.id,
        nome: vet.profiles?.nome || 'Nome não disponível',
        email: vet.profiles?.email || 'Email não disponível',
        telefone: vet.profiles?.telefone || 'Telefone não disponível',
        crmv: vet.crmv,
        preco_consulta: vet.preco_consulta,
        created_at: vet.profiles?.created_at || '',
        endereco: enderecosData?.find(end => end.user_id === vet.id)
      })) || [];
      
      setVeterinarios(veterinariosFormatados);
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
  
  const filteredVeterinarios = veterinarios
    .filter(vet => 
      vet.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.crmv.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const showVeterinarioDetails = (veterinario: VeterinarioData) => {
    setSelectedVeterinario(veterinario);
    setShowDetails(true);
  };
  
  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Veterinários</h1>
            <p className="text-muted-foreground mt-1">
              Gerenciamento de veterinários cadastrados na plataforma
            </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Buscar por nome, email ou CRMV..." 
                className="pl-9 h-10 md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="h-10">
              <Stethoscope className="h-4 w-4 mr-2" />
              Novo Veterinário
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle>Lista de Veterinários</CardTitle>
            <CardDescription>
              {filteredVeterinarios.length} veterinários encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <Table>
                <TableCaption>Lista de veterinários cadastrados na plataforma</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CRMV</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Preço Consulta</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVeterinarios.length > 0 ? (
                    filteredVeterinarios.map((veterinario) => (
                      <TableRow key={veterinario.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Stethoscope className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{veterinario.nome}</span>
                          </div>
                        </TableCell>
                        <TableCell>{veterinario.crmv}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                            {veterinario.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                            {veterinario.telefone}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            R$ {veterinario.preco_consulta.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {formatDate(veterinario.created_at)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => showVeterinarioDetails(veterinario)}
                          >
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        <p className="text-muted-foreground">
                          Nenhum veterinário encontrado com os filtros aplicados
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        {selectedVeterinario && (
          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Detalhes do Veterinário</DialogTitle>
                <DialogDescription>
                  Informações completas sobre o veterinário
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Nome</Label>
                  <p className="font-medium">{selectedVeterinario.nome}</p>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-muted-foreground">CRMV</Label>
                  <p className="font-medium">{selectedVeterinario.crmv}</p>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-muted-foreground">E-mail</Label>
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <p>{selectedVeterinario.email}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Telefone</Label>
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <p>{selectedVeterinario.telefone}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Localização</Label>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <p>
                      {selectedVeterinario.endereco 
                        ? `${selectedVeterinario.endereco.cidade} - ${selectedVeterinario.endereco.estado}`
                        : "Endereço não cadastrado"}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Preço da Consulta</Label>
                  <p className="font-medium text-primary">
                    R$ {selectedVeterinario.preco_consulta.toFixed(2)}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Data de Cadastro</Label>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <p>{formatDate(selectedVeterinario.created_at)}</p>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Fechar
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    Editar
                  </Button>
                  <Button variant="destructive">
                    Desativar
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default Veterinarios;
