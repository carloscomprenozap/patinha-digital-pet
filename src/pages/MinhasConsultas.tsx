
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Edit, Trash2, Search, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ConsultaProps {
  id: string;
  data: string;
  horario: string;
  vet_id: string;
  vet_nome?: string;
  pet_id: string;
  pet_nome?: string;
  status: 'agendado' | 'confirmado' | 'concluido' | 'cancelado';
  observacoes?: string;
}

// Helper para garantir que o status esteja no formato correto
const validateConsultaStatus = (status: string): 'agendado' | 'confirmado' | 'concluido' | 'cancelado' => {
  if (status === 'agendado' || status === 'confirmado' || status === 'concluido' || status === 'cancelado') {
    return status;
  }
  return 'agendado'; // Valor padrão se o status for inválido
};

const MinhasConsultas = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [consultas, setConsultas] = useState<ConsultaProps[]>([]);
  const [filteredConsultas, setFilteredConsultas] = useState<ConsultaProps[]>([]);
  const [currentConsulta, setCurrentConsulta] = useState<ConsultaProps | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pets, setPets] = useState<{id: string, nome: string}[]>([]);

  useEffect(() => {
    if (!user) return;
    
    const fetchPets = async () => {
      try {
        const { data, error } = await supabase
          .from('pets')
          .select('id, nome')
          .eq('client_id', user.id);
        
        if (error) throw error;
        
        setPets(data || []);
      } catch (error) {
        console.error("Erro ao buscar pets:", error);
        toast({
          variant: "destructive",
          description: "Erro ao carregar seus pets. Tente novamente mais tarde.",
        });
      }
    };

    fetchPets();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    
    const fetchConsultas = async () => {
      try {
        setLoading(true);
        
        // Buscar consultas do cliente
        const { data: consultasData, error: consultasError } = await supabase
          .from('consultas')
          .select(`
            id, 
            data, 
            horario, 
            status, 
            observacoes, 
            vet_id,
            pet_id
          `)
          .eq('client_id', user.id)
          .order('data', { ascending: false });
        
        if (consultasError) throw consultasError;
        
        if (consultasData && consultasData.length > 0) {
          // Buscar informações dos veterinários
          const vetIds = [...new Set(consultasData.map(c => c.vet_id))];
          const { data: vetsData, error: vetsError } = await supabase
            .from('profiles')
            .select('id, nome')
            .in('id', vetIds);
          
          if (vetsError) throw vetsError;
          
          // Buscar informações dos pets
          const petIds = [...new Set(consultasData.map(c => c.pet_id))];
          const { data: petsData, error: petsError } = await supabase
            .from('pets')
            .select('id, nome')
            .in('id', petIds);
          
          if (petsError) throw petsError;
          
          // Mesclar dados
          const consultasCompletas: ConsultaProps[] = consultasData.map(consulta => {
            const vet = vetsData?.find(v => v.id === consulta.vet_id);
            const pet = petsData?.find(p => p.id === consulta.pet_id);
            
            return {
              id: consulta.id,
              data: consulta.data,
              horario: consulta.horario,
              status: validateConsultaStatus(consulta.status),
              observacoes: consulta.observacoes || undefined,
              vet_id: consulta.vet_id,
              pet_id: consulta.pet_id,
              vet_nome: vet?.nome || 'Veterinário não encontrado',
              pet_nome: pet?.nome || 'Pet não encontrado'
            };
          });
          
          setConsultas(consultasCompletas);
          setFilteredConsultas(consultasCompletas);
        } else {
          setConsultas([]);
          setFilteredConsultas([]);
        }
      } catch (error) {
        console.error("Erro ao buscar consultas:", error);
        toast({
          variant: "destructive",
          description: "Erro ao carregar suas consultas. Tente novamente mais tarde.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchConsultas();
  }, [user]);
  
  useEffect(() => {
    // Filtrar consultas baseado no termo de busca
    if (!searchTerm) {
      setFilteredConsultas(consultas);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = consultas.filter(consulta => 
      consulta.pet_nome?.toLowerCase().includes(searchTermLower) ||
      consulta.vet_nome?.toLowerCase().includes(searchTermLower) ||
      format(new Date(consulta.data), 'dd/MM/yyyy').includes(searchTerm) ||
      consulta.status.toLowerCase().includes(searchTermLower)
    );
    
    setFilteredConsultas(filtered);
  }, [searchTerm, consultas]);

  const handleUpdateConsulta = async () => {
    if (!currentConsulta) return;
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('consultas')
        .update({
          pet_id: currentConsulta.pet_id,
          observacoes: currentConsulta.observacoes
        })
        .eq('id', currentConsulta.id);
      
      if (error) throw error;
      
      setConsultas(prev => prev.map(c => 
        c.id === currentConsulta.id 
          ? { 
              ...c, 
              pet_id: currentConsulta.pet_id,
              pet_nome: pets.find(p => p.id === currentConsulta.pet_id)?.nome || c.pet_nome,
              observacoes: currentConsulta.observacoes 
            } 
          : c
      ));
      
      setFilteredConsultas(prev => prev.map(c => 
        c.id === currentConsulta.id 
          ? { 
              ...c, 
              pet_id: currentConsulta.pet_id,
              pet_nome: pets.find(p => p.id === currentConsulta.pet_id)?.nome || c.pet_nome,
              observacoes: currentConsulta.observacoes 
            } 
          : c
      ));
      
      setIsEditing(false);
      
      toast({
        description: "Consulta atualizada com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao atualizar consulta:", error);
      toast({
        variant: "destructive",
        description: "Erro ao atualizar consulta. Tente novamente.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConsulta = async () => {
    if (!currentConsulta) return;
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('consultas')
        .delete()
        .eq('id', currentConsulta.id);
      
      if (error) throw error;
      
      setConsultas(prev => prev.filter(c => c.id !== currentConsulta.id));
      setFilteredConsultas(prev => prev.filter(c => c.id !== currentConsulta.id));
      setIsDeleting(false);
      
      toast({
        description: "Consulta cancelada com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao cancelar consulta:", error);
      toast({
        variant: "destructive",
        description: "Erro ao cancelar consulta. Tente novamente.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'agendado':
        return "bg-blue-100 text-blue-800";
      case 'confirmado':
        return "bg-green-100 text-green-800";
      case 'concluido':
        return "bg-purple-100 text-purple-800";
      case 'cancelado':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatarData = (dataString: string) => {
    try {
      return format(new Date(dataString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return dataString;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Minhas Consultas</h1>
          <p className="text-muted-foreground">
            Gerencie seus agendamentos de consultas veterinárias
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Buscar por pet, veterinário, data ou status..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Carregando suas consultas...</p>
          </div>
        ) : filteredConsultas.length > 0 ? (
          <div className="space-y-4">
            {filteredConsultas.map((consulta) => (
              <Card key={consulta.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle>{consulta.pet_nome}</CardTitle>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadgeClass(consulta.status)}`}>
                          {consulta.status.charAt(0).toUpperCase() + consulta.status.slice(1)}
                        </span>
                      </div>
                      <CardDescription className="mt-1">
                        Dr(a). {consulta.vet_nome}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {(consulta.status === 'agendado' || consulta.status === 'confirmado') && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setCurrentConsulta(consulta);
                              setIsEditing(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setCurrentConsulta(consulta);
                              setIsDeleting(true);
                            }}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Cancelar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatarData(consulta.data)}</span>
                      <span className="mx-1">•</span>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{consulta.horario}</span>
                    </div>
                    {consulta.observacoes && (
                      <>
                        <Separator className="my-2" />
                        <div className="text-sm">
                          <p className="text-muted-foreground mb-1">Observações:</p>
                          <p>{consulta.observacoes}</p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Nenhuma consulta encontrada" : "Você não tem consultas agendadas"}
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm("")}
              >
                Limpar busca
              </Button>
            )}
            {!searchTerm && (
              <Button 
                onClick={() => window.location.href = "/agendar"}
              >
                Agendar Consulta
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Editar Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Consulta</DialogTitle>
            <DialogDescription>
              Atualize as informações da consulta agendada
            </DialogDescription>
          </DialogHeader>
          {currentConsulta && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data</Label>
                  <Input 
                    value={formatarData(currentConsulta.data)} 
                    disabled 
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label>Horário</Label>
                  <Input 
                    value={currentConsulta.horario} 
                    disabled 
                    className="bg-muted" 
                  />
                </div>
              </div>
              <div>
                <Label>Veterinário</Label>
                <Input 
                  value={currentConsulta.vet_nome} 
                  disabled 
                  className="bg-muted"
                />
              </div>
              <div>
                <Label htmlFor="pet">Pet</Label>
                <Select 
                  value={currentConsulta.pet_id} 
                  onValueChange={value => setCurrentConsulta({...currentConsulta, pet_id: value})}
                >
                  <SelectTrigger id="pet">
                    <SelectValue placeholder="Selecione um pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map(pet => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea 
                  id="observacoes" 
                  placeholder="Informações importantes sobre o pet para o veterinário"
                  value={currentConsulta.observacoes || ""}
                  onChange={e => setCurrentConsulta({...currentConsulta, observacoes: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
            <Button onClick={handleUpdateConsulta} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancelar Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Consulta</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <p className="text-sm text-amber-700">
              O cancelamento com menos de 24 horas de antecedência pode estar sujeito a taxas.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>Voltar</Button>
            <Button variant="destructive" onClick={handleDeleteConsulta} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelando...
                </>
              ) : 'Cancelar Consulta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MinhasConsultas;
