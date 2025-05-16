
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Clock, Edit, Plus, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DisponibilidadeDB } from "@/types";

const MeusHorarios = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [disponibilidades, setDisponibilidades] = useState<DisponibilidadeDB[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDisponibilidade, setCurrentDisponibilidade] = useState<Partial<DisponibilidadeDB>>({
    dia_semana: 1, // Segunda-feira por padrão
    hora_inicio: "08:00",
    hora_fim: "18:00"
  });
  
  const diasSemana = [
    { value: 0, label: "Domingo" },
    { value: 1, label: "Segunda-feira" },
    { value: 2, label: "Terça-feira" },
    { value: 3, label: "Quarta-feira" },
    { value: 4, label: "Quinta-feira" },
    { value: 5, label: "Sexta-feira" },
    { value: 6, label: "Sábado" },
  ];
  
  // Carregar disponibilidades do veterinário
  useEffect(() => {
    if (user) {
      carregarDisponibilidades();
    }
  }, [user]);
  
  const carregarDisponibilidades = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
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
        description: "Não foi possível carregar suas disponibilidades",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSalvar = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Verificar se há sobreposição de horários
      const sobreposicao = disponibilidades.some(item => 
        !isEditing && // Ignorar verificação se estiver editando o mesmo item
        item.dia_semana === Number(currentDisponibilidade.dia_semana) &&
        ((currentDisponibilidade.hora_inicio >= item.hora_inicio && currentDisponibilidade.hora_inicio < item.hora_fim) ||
        (currentDisponibilidade.hora_fim > item.hora_inicio && currentDisponibilidade.hora_fim <= item.hora_fim) ||
        (currentDisponibilidade.hora_inicio <= item.hora_inicio && currentDisponibilidade.hora_fim >= item.hora_fim))
      );
      
      if (sobreposicao) {
        toast({
          title: "Atenção",
          description: "Existe sobreposição com horários já cadastrados para este dia",
          variant: "destructive",
        });
        return;
      }
      
      if (isEditing && currentDisponibilidade.id) {
        // Atualizar disponibilidade existente
        const { error } = await supabase
          .from('disponibilidades')
          .update({
            dia_semana: Number(currentDisponibilidade.dia_semana),
            hora_inicio: currentDisponibilidade.hora_inicio,
            hora_fim: currentDisponibilidade.hora_fim
          })
          .eq('id', currentDisponibilidade.id);
          
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Disponibilidade atualizada com sucesso",
        });
      } else {
        // Criar nova disponibilidade
        const { error } = await supabase
          .from('disponibilidades')
          .insert({
            vet_id: user.id,
            dia_semana: Number(currentDisponibilidade.dia_semana),
            hora_inicio: currentDisponibilidade.hora_inicio,
            hora_fim: currentDisponibilidade.hora_fim
          });
          
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Disponibilidade cadastrada com sucesso",
        });
      }
      
      // Recarregar disponibilidades
      await carregarDisponibilidades();
      
      // Resetar formulário
      setCurrentDisponibilidade({
        dia_semana: 1,
        hora_inicio: "08:00",
        hora_fim: "18:00"
      });
      setIsEditing(false);
      
    } catch (error) {
      console.error("Erro ao salvar disponibilidade:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a disponibilidade",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditar = (disponibilidade: DisponibilidadeDB) => {
    setCurrentDisponibilidade(disponibilidade);
    setIsEditing(true);
  };
  
  const handleExcluir = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta disponibilidade?")) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('disponibilidades')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Disponibilidade excluída com sucesso",
      });
      
      // Recarregar disponibilidades
      await carregarDisponibilidades();
    } catch (error) {
      console.error("Erro ao excluir disponibilidade:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a disponibilidade",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getNomeDiaSemana = (diaSemana: number) => {
    return diasSemana.find(dia => dia.value === diaSemana)?.label || "Desconhecido";
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Meus Horários</h1>
            <p className="text-muted-foreground">
              Gerencie seus horários de disponibilidade para consultas
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Novo Horário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditing ? "Editar Horário" : "Novo Horário"}</DialogTitle>
                <DialogDescription>
                  {isEditing ? "Altere os detalhes do horário de disponibilidade" : "Cadastre um novo horário de disponibilidade"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="dia">Dia da Semana</Label>
                  <Select
                    value={String(currentDisponibilidade.dia_semana)}
                    onValueChange={(value) => setCurrentDisponibilidade({
                      ...currentDisponibilidade,
                      dia_semana: Number(value)
                    })}
                  >
                    <SelectTrigger id="dia">
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {diasSemana.map((dia) => (
                        <SelectItem key={dia.value} value={String(dia.value)}>{dia.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hora-inicio">Hora Início</Label>
                    <Input
                      id="hora-inicio"
                      type="time"
                      value={currentDisponibilidade.hora_inicio}
                      onChange={(e) => setCurrentDisponibilidade({
                        ...currentDisponibilidade,
                        hora_inicio: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hora-fim">Hora Fim</Label>
                    <Input
                      id="hora-fim"
                      type="time"
                      value={currentDisponibilidade.hora_fim}
                      onChange={(e) => setCurrentDisponibilidade({
                        ...currentDisponibilidade,
                        hora_fim: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button onClick={handleSalvar} disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Horários Cadastrados</CardTitle>
            <CardDescription>
              Seus horários de atendimento para cada dia da semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : disponibilidades.length > 0 ? (
              <Table>
                <TableCaption>Lista de horários disponíveis para atendimento</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dia da Semana</TableHead>
                    <TableHead>Horário de Início</TableHead>
                    <TableHead>Horário de Término</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disponibilidades.map((disponibilidade) => (
                    <TableRow key={disponibilidade.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {getNomeDiaSemana(disponibilidade.dia_semana)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          {disponibilidade.hora_inicio}
                        </div>
                      </TableCell>
                      <TableCell>{disponibilidade.hora_fim}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="mr-2"
                              onClick={() => handleEditar(disponibilidade)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Horário</DialogTitle>
                              <DialogDescription>
                                Altere os detalhes do horário de disponibilidade
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="dia-edit">Dia da Semana</Label>
                                <Select
                                  value={String(currentDisponibilidade.dia_semana)}
                                  onValueChange={(value) => setCurrentDisponibilidade({
                                    ...currentDisponibilidade,
                                    dia_semana: Number(value)
                                  })}
                                >
                                  <SelectTrigger id="dia-edit">
                                    <SelectValue placeholder="Selecione o dia" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {diasSemana.map((dia) => (
                                      <SelectItem key={dia.value} value={String(dia.value)}>{dia.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="hora-inicio-edit">Hora Início</Label>
                                  <Input
                                    id="hora-inicio-edit"
                                    type="time"
                                    value={currentDisponibilidade.hora_inicio}
                                    onChange={(e) => setCurrentDisponibilidade({
                                      ...currentDisponibilidade,
                                      hora_inicio: e.target.value
                                    })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="hora-fim-edit">Hora Fim</Label>
                                  <Input
                                    id="hora-fim-edit"
                                    type="time"
                                    value={currentDisponibilidade.hora_fim}
                                    onChange={(e) => setCurrentDisponibilidade({
                                      ...currentDisponibilidade,
                                      hora_fim: e.target.value
                                    })}
                                  />
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline" type="button">
                                  Cancelar
                                </Button>
                              </DialogClose>
                              <Button onClick={handleSalvar} disabled={isLoading}>
                                {isLoading ? "Salvando..." : "Salvar"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleExcluir(disponibilidade.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">
                  Nenhum horário cadastrado
                </p>
                <p className="text-sm text-muted-foreground">
                  Clique no botão "Novo Horário" para cadastrar sua disponibilidade
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MeusHorarios;
