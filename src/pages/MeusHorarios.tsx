
import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const diasDaSemana = [
  { value: "0", label: "Domingo" },
  { value: "1", label: "Segunda-feira" },
  { value: "2", label: "Terça-feira" },
  { value: "3", label: "Quarta-feira" },
  { value: "4", label: "Quinta-feira" },
  { value: "5", label: "Sexta-feira" },
  { value: "6", label: "Sábado" }
];

const horariosDisponiveis = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", 
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

interface DisponibilidadeItem {
  id: string;
  diaSemana: string;
  horaInicio: string;
  horaFim: string;
}

const MeusHorarios = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Exemplo de disponibilidades - em produção viriam do banco de dados
  const [disponibilidades, setDisponibilidades] = useState<DisponibilidadeItem[]>([
    { id: "1", diaSemana: "1", horaInicio: "08:00", horaFim: "12:00" },
    { id: "2", diaSemana: "1", horaInicio: "14:00", horaFim: "18:00" },
    { id: "3", diaSemana: "3", horaInicio: "08:00", horaFim: "12:00" },
    { id: "4", diaSemana: "5", horaInicio: "13:00", horaFim: "17:00" },
  ]);
  
  const [novaDisponibilidade, setNovaDisponibilidade] = useState({
    diaSemana: "",
    horaInicio: "",
    horaFim: ""
  });

  // Agrupando disponibilidades por dia da semana
  const disponibilidadesPorDia = disponibilidades.reduce<Record<string, DisponibilidadeItem[]>>(
    (acc, disponibilidade) => {
      if (!acc[disponibilidade.diaSemana]) {
        acc[disponibilidade.diaSemana] = [];
      }
      acc[disponibilidade.diaSemana].push(disponibilidade);
      return acc;
    }, 
    {}
  );

  const handleAddDisponibilidade = () => {
    const { diaSemana, horaInicio, horaFim } = novaDisponibilidade;
    
    if (!diaSemana || !horaInicio || !horaFim) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para adicionar disponibilidade",
        variant: "destructive"
      });
      return;
    }
    
    if (horaInicio >= horaFim) {
      toast({
        title: "Horário inválido",
        description: "O horário de início deve ser anterior ao horário de fim",
        variant: "destructive"
      });
      return;
    }
    
    // Simula adição ao banco de dados
    const novoId = `temp-${Date.now()}`;
    setDisponibilidades([
      ...disponibilidades, 
      { id: novoId, ...novaDisponibilidade }
    ]);
    
    // Limpa o formulário
    setNovaDisponibilidade({
      diaSemana: "",
      horaInicio: "",
      horaFim: ""
    });
    
    toast({
      title: "Disponibilidade adicionada",
      description: "Sua disponibilidade foi adicionada com sucesso"
    });
  };

  const handleRemoveDisponibilidade = (id: string) => {
    setDisponibilidades(disponibilidades.filter(d => d.id !== id));
    
    toast({
      title: "Disponibilidade removida",
      description: "Sua disponibilidade foi removida com sucesso"
    });
  };

  const getDiaSemana = (valor: string) => {
    return diasDaSemana.find(d => d.value === valor)?.label || "Dia não especificado";
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Meus Horários</h1>
        
        <Tabs defaultValue="horarios" className="w-full">
          <TabsList className="grid grid-cols-2 mb-8 w-[400px]">
            <TabsTrigger value="horarios">Meus Horários</TabsTrigger>
            <TabsTrigger value="adicionar">Adicionar Horário</TabsTrigger>
          </TabsList>
          
          {/* Lista de Horários */}
          <TabsContent value="horarios" className="space-y-6">
            {Object.keys(disponibilidadesPorDia).length > 0 ? (
              diasDaSemana.map((dia) => {
                const horariosDoDia = disponibilidadesPorDia[dia.value] || [];
                if (horariosDoDia.length === 0) return null;
                
                return (
                  <Card key={dia.value}>
                    <CardHeader>
                      <CardTitle>{dia.label}</CardTitle>
                      <CardDescription>
                        {horariosDoDia.length} períodos disponíveis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Horário de Início</TableHead>
                            <TableHead>Horário de Término</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {horariosDoDia.map((horario) => (
                            <TableRow key={horario.id}>
                              <TableCell className="font-medium">{horario.horaInicio}</TableCell>
                              <TableCell>{horario.horaFim}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleRemoveDisponibilidade(horario.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="pt-6 flex flex-col items-center justify-center h-60">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground mb-2">Sem horários disponíveis</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Adicione seus horários de atendimento na aba "Adicionar Horário".
                  </p>
                  <Button onClick={() => document.querySelector('[value="adicionar"]')?.dispatchEvent(new MouseEvent('click'))} variant="outline">
                    Adicionar Horário
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Adicionar Horário */}
          <TabsContent value="adicionar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Disponibilidade</CardTitle>
                <CardDescription>
                  Configure seus dias e horários de atendimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dia da Semana</label>
                    <Select
                      value={novaDisponibilidade.diaSemana}
                      onValueChange={(value) => setNovaDisponibilidade({...novaDisponibilidade, diaSemana: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o dia" />
                      </SelectTrigger>
                      <SelectContent>
                        {diasDaSemana.map((dia) => (
                          <SelectItem key={dia.value} value={dia.value}>{dia.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Horário Inicial</label>
                    <Select
                      value={novaDisponibilidade.horaInicio}
                      onValueChange={(value) => setNovaDisponibilidade({...novaDisponibilidade, horaInicio: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Horário inicial" />
                      </SelectTrigger>
                      <SelectContent>
                        {horariosDisponiveis.map((horario) => (
                          <SelectItem key={`inicio-${horario}`} value={horario}>{horario}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Horário Final</label>
                    <Select
                      value={novaDisponibilidade.horaFim}
                      onValueChange={(value) => setNovaDisponibilidade({...novaDisponibilidade, horaFim: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Horário final" />
                      </SelectTrigger>
                      <SelectContent>
                        {horariosDisponiveis.map((horario) => (
                          <SelectItem key={`fim-${horario}`} value={horario}>{horario}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={handleAddDisponibilidade}
                    className="flex items-center"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MeusHorarios;
