
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DisponibilidadeDB } from "@/types";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle, Calendar, Clock, Trash2, Edit, Loader2 } from "lucide-react";

const diasSemana = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" }
];

const MeusHorarios = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [disponibilidades, setDisponibilidades] = useState<DisponibilidadeDB[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDisponibilidade, setSelectedDisponibilidade] = useState<DisponibilidadeDB | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filteredTab, setFilteredTab] = useState<string>("all");
  
  // Estado para nova disponibilidade
  const [novaDisponibilidade, setNovaDisponibilidade] = useState({
    diaSemana: "",
    horaInicio: "08:00",
    horaFim: "18:00"
  });
  
  useEffect(() => {
    if (user) {
      carregarDisponibilidades();
    }
  }, [user]);
  
  const carregarDisponibilidades = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('disponibilidades')
        .select('*')
        .eq('vet_id', user.id)
        .order('dia_semana', { ascending: true });
        
      if (error) throw error;
      
      setDisponibilidades(data || []);
    } catch (error) {
      console.error("Erro ao carregar disponibilidades:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus horários de disponibilidade",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getHorariosByDiaSemana = (dia: number) => {
    return disponibilidades.filter(d => d.dia_semana === dia);
  };
  
  const handleSalvarDisponibilidade = async () => {
    if (!user) return;
    
    if (!novaDisponibilidade.diaSemana || !novaDisponibilidade.horaInicio || !novaDisponibilidade.horaFim) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para continuar",
        variant: "destructive"
      });
      return;
    }
    
    // Validar que hora de início é anterior à hora fim
    if (novaDisponibilidade.horaInicio >= novaDisponibilidade.horaFim) {
      toast({
        title: "Horário inválido",
        description: "A hora de início deve ser anterior à hora de término",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (isEditing && selectedDisponibilidade) {
        // Atualizando disponibilidade existente
        const { error } = await supabase
          .from('disponibilidades')
          .update({
            dia_semana: parseInt(novaDisponibilidade.diaSemana),
            hora_inicio: novaDisponibilidade.horaInicio,
            hora_fim: novaDisponibilidade.horaFim
          })
          .eq('id', selectedDisponibilidade.id);
          
        if (error) throw error;
        
        toast({
          title: "Horário atualizado",
          description: "Sua disponibilidade foi atualizada com sucesso"
        });
      } else {
        // Criando nova disponibilidade
        const { error } = await supabase
          .from('disponibilidades')
          .insert({
            vet_id: user.id,
            dia_semana: parseInt(novaDisponibilidade.diaSemana),
            hora_inicio: novaDisponibilidade.horaInicio,
            hora_fim: novaDisponibilidade.horaFim
          });
          
        if (error) throw error;
        
        toast({
          title: "Horário adicionado",
          description: "Sua disponibilidade foi adicionada com sucesso"
        });
      }
      
      // Recarregar disponibilidades e fechar o diálogo
      await carregarDisponibilidades();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar disponibilidade:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a disponibilidade",
        variant: "destructive"
      });
    }
  };
  
  const handleExcluirDisponibilidade = async () => {
    if (!selectedDisponibilidade) return;
    
    try {
      const { error } = await supabase
        .from('disponibilidades')
        .delete()
        .eq('id', selectedDisponibilidade.id);
        
      if (error) throw error;
      
      toast({
        title: "Horário excluído",
        description: "Sua disponibilidade foi excluída com sucesso"
      });
      
      // Recarregar disponibilidades e fechar o diálogo
      await carregarDisponibilidades();
      setIsDeleteDialogOpen(false);
      setSelectedDisponibilidade(null);
    } catch (error) {
      console.error("Erro ao excluir disponibilidade:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a disponibilidade",
        variant: "destructive"
      });
    }
  };
  
  const editarDisponibilidade = (disponibilidade: DisponibilidadeDB) => {
    setIsEditing(true);
    setSelectedDisponibilidade(disponibilidade);
    setNovaDisponibilidade({
      diaSemana: disponibilidade.dia_semana.toString(),
      horaInicio: disponibilidade.hora_inicio,
      horaFim: disponibilidade.hora_fim
    });
    setIsDialogOpen(true);
  };
  
  const confirmarExclusao = (disponibilidade: DisponibilidadeDB) => {
    setSelectedDisponibilidade(disponibilidade);
    setIsDeleteDialogOpen(true);
  };
  
  const resetForm = () => {
    setIsEditing(false);
    setSelectedDisponibilidade(null);
    setNovaDisponibilidade({
      diaSemana: "",
      horaInicio: "08:00",
      horaFim: "18:00"
    });
  };
  
  const getNomeDiaSemana = (dia: number) => {
    const diaObj = diasSemana.find(d => d.value === dia);
    return diaObj ? diaObj.label : "Desconhecido";
  };
  
  const getDisplayHorarios = () => {
    if (filteredTab === "all") return disponibilidades;
    
    const diaFilter = parseInt(filteredTab);
    return disponibilidades.filter(d => d.dia_semana === diaFilter);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meus Horários</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie sua disponibilidade para atendimento
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar Horário
            </Button>
          </div>
        </div>
        
        <Tabs value={filteredTab} onValueChange={setFilteredTab} className="w-full">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            {diasSemana.map((dia) => (
              <TabsTrigger 
                key={dia.value} 
                value={dia.value.toString()}
                className="hidden md:flex" // Ocultar em dispositivos móveis para não sobrecarregar
              >
                {dia.label.substring(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={filteredTab} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {filteredTab === "all" 
                    ? "Todos os Horários Disponíveis" 
                    : `Horários de ${getNomeDiaSemana(parseInt(filteredTab))}`}
                </CardTitle>
                <CardDescription>
                  {filteredTab === "all"
                    ? "Visualize e gerencie todos os seus horários de disponibilidade"
                    : `Visualize e gerencie seus horários disponíveis para ${getNomeDiaSemana(parseInt(filteredTab))}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : getDisplayHorarios().length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dia da Semana</TableHead>
                        <TableHead>Hora de Início</TableHead>
                        <TableHead>Hora de Término</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getDisplayHorarios().map((horario) => (
                        <TableRow key={horario.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              {getNomeDiaSemana(horario.dia_semana)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              {horario.hora_inicio}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              {horario.hora_fim}
                            </div>
                          </TableCell>
                          <TableCell className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => editarDisponibilidade(horario)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => confirmarExclusao(horario)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {filteredTab === "all"
                        ? "Você ainda não cadastrou horários de disponibilidade"
                        : `Você não tem horários cadastrados para ${getNomeDiaSemana(parseInt(filteredTab))}`}
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        resetForm();
                        if (filteredTab !== "all") {
                          setNovaDisponibilidade({
                            ...novaDisponibilidade,
                            diaSemana: filteredTab
                          });
                        }
                        setIsDialogOpen(true);
                      }}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      {filteredTab === "all"
                        ? "Adicionar Horário"
                        : `Adicionar Horário para ${getNomeDiaSemana(parseInt(filteredTab))}`}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Dialog para adicionar/editar horário */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Editar Horário" : "Adicionar Novo Horário"}
              </DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? "Modifique os detalhes do horário de disponibilidade"
                  : "Cadastre um novo horário de disponibilidade para atendimento"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="diaSemana">Dia da Semana</Label>
                <Select
                  value={novaDisponibilidade.diaSemana}
                  onValueChange={(value) => setNovaDisponibilidade({
                    ...novaDisponibilidade,
                    diaSemana: value
                  })}
                  disabled={isEditing}
                >
                  <SelectTrigger id="diaSemana">
                    <SelectValue placeholder="Selecione um dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {diasSemana.map((dia) => (
                      <SelectItem key={dia.value} value={dia.value.toString()}>
                        {dia.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="horaInicio">Hora de Início</Label>
                  <Input 
                    id="horaInicio"
                    type="time"
                    value={novaDisponibilidade.horaInicio}
                    onChange={(e) => setNovaDisponibilidade({
                      ...novaDisponibilidade,
                      horaInicio: e.target.value
                    })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="horaFim">Hora de Término</Label>
                  <Input 
                    id="horaFim"
                    type="time"
                    value={novaDisponibilidade.horaFim}
                    onChange={(e) => setNovaDisponibilidade({
                      ...novaDisponibilidade,
                      horaFim: e.target.value
                    })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}>
                Cancelar
              </Button>
              <Button onClick={handleSalvarDisponibilidade}>
                {isEditing ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Dialog para confirmação de exclusão */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este horário de disponibilidade? 
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedDisponibilidade && (
                <div className="bg-accent p-4 rounded-md">
                  <p><strong>Dia:</strong> {getNomeDiaSemana(selectedDisponibilidade.dia_semana)}</p>
                  <p><strong>Horário:</strong> {selectedDisponibilidade.hora_inicio} até {selectedDisponibilidade.hora_fim}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleExcluirDisponibilidade}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default MeusHorarios;
