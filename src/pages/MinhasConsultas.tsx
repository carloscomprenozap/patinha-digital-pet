
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConsultaProps, ConsultaDB } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helper para validar e converter o status
const validateStatus = (status: string): 'agendado' | 'confirmado' | 'concluido' | 'cancelado' => {
  const validStatus = ['agendado', 'confirmado', 'concluido', 'cancelado'] as const;
  if (validStatus.includes(status as any)) {
    return status as 'agendado' | 'confirmado' | 'concluido' | 'cancelado';
  }
  return 'agendado';
};

// Fix: Ensure this function returns only valid badge variant types
const getBadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
  const statusMap: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
    agendado: "outline",
    confirmado: "secondary",
    concluido: "default",
    cancelado: "destructive"
  };
  
  return statusMap[status] || "outline";
};

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    agendado: "Agendado",
    confirmado: "Confirmado",
    concluido: "Concluído",
    cancelado: "Cancelado"
  };
  
  return statusMap[status] || status;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

interface ReagendarDialogProps {
  consulta: ConsultaProps;
  onReagendarSuccess: () => void;
}

const ReagendarDialog = ({ consulta, onReagendarSuccess }: ReagendarDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(consulta.data);
  const [selectedTime, setSelectedTime] = useState<string>(consulta.horario);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchAvailableDates();
    }
  }, [isOpen, consulta.vet_id]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimes();
    }
  }, [selectedDate]);

  const fetchAvailableDates = async () => {
    setIsLoading(true);
    try {
      // In a real app, fetch available dates from Supabase
      // For now, we'll generate some mock dates
      const today = new Date();
      const dates = [];
      
      for (let i = 0; i < 14; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        dates.push(format(date, "yyyy-MM-dd"));
      }
      
      setAvailableDates(dates);
    } catch (error) {
      console.error("Error fetching available dates:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar datas disponíveis.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableTimes = async () => {
    setIsLoading(true);
    try {
      // In a real app, fetch available times from Supabase based on the selected date
      // For now, we'll generate mock times
      const times = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
      setAvailableTimes(times);
    } catch (error) {
      console.error("Error fetching available times:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar horários disponíveis.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReagendar = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('consultas')
        .update({
          data: selectedDate,
          horario: selectedTime
        })
        .eq('id', consulta.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Consulta reagendada",
        description: `Consulta reagendada para ${formatDate(selectedDate)} às ${selectedTime}.`,
      });
      
      setIsOpen(false);
      onReagendarSuccess();
    } catch (error) {
      console.error("Erro ao reagendar consulta:", error);
      toast({
        title: "Erro",
        description: "Não foi possível reagendar a consulta.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">Reagendar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reagendar Consulta</DialogTitle>
          <DialogDescription>
            Selecione uma nova data e horário para sua consulta com {consulta.vet_nome}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="date" className="text-sm font-medium">
              Nova Data
            </label>
            <Select 
              value={selectedDate} 
              onValueChange={setSelectedDate} 
              disabled={isLoading}
            >
              <SelectTrigger id="date">
                <SelectValue placeholder="Selecione uma data" />
              </SelectTrigger>
              <SelectContent>
                {availableDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {formatDate(date)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="time" className="text-sm font-medium">
              Novo Horário
            </label>
            <Select 
              value={selectedTime} 
              onValueChange={setSelectedTime} 
              disabled={isLoading || !selectedDate}
            >
              <SelectTrigger id="time">
                <SelectValue placeholder="Selecione um horário" />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleReagendar} disabled={isLoading || !selectedDate || !selectedTime}>
            {isLoading ? "Reagendando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ConsultaDetailDialogProps {
  consulta: ConsultaProps;
}

const ConsultaDetailDialog = ({ consulta }: ConsultaDetailDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">Ver Detalhes</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Consulta</DialogTitle>
          <DialogDescription>
            Informações sobre a consulta agendada
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <h4 className="font-medium text-sm">Status</h4>
            <Badge variant={getBadgeVariant(consulta.status)} className="w-fit">
              {getStatusLabel(consulta.status)}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium text-sm">Data e Horário</h4>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(consulta.data)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{consulta.horario}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium text-sm">Veterinário</h4>
            <p>{consulta.vet_nome}</p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium text-sm">Pet</h4>
            <p>{consulta.pet_nome}</p>
          </div>
          
          {consulta.observacoes && (
            <div className="space-y-1">
              <h4 className="font-medium text-sm">Observações</h4>
              <p className="text-sm text-muted-foreground">{consulta.observacoes}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline">Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const MinhasConsultas = () => {
  const [consultas, setConsultas] = useState<ConsultaProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      fetchConsultas();
    }
  }, [user]);

  const fetchConsultas = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Buscar consultas com nomes dos pets e veterinários
      const { data, error } = await supabase
        .from('consultas')
        .select(`
          *,
          pets:pet_id (nome),
          veterinarios:vet_id (
            id,
            profiles:id (nome)
          )
        `)
        .eq('client_id', user.id)
        .order('data', { ascending: false });
      
      if (error) {
        throw error;
      }

      if (data) {
        const formattedConsultas = data.map((consulta: any) => ({
          id: consulta.id,
          data: consulta.data,
          horario: consulta.horario,
          status: validateStatus(consulta.status),
          observacoes: consulta.observacoes || '',
          vet_id: consulta.vet_id,
          pet_id: consulta.pet_id,
          pet_nome: consulta.pets?.nome || 'Pet não encontrado',
          vet_nome: consulta.veterinarios?.profiles?.nome || 'Veterinário não encontrado'
        }));
        
        setConsultas(formattedConsultas as ConsultaProps[]);
      }
    } catch (error) {
      console.error("Erro ao buscar consultas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas consultas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelarConsulta = async (id: string) => {
    if (!confirm("Tem certeza que deseja cancelar esta consulta?")) return;

    try {
      const { error } = await supabase
        .from('consultas')
        .update({ status: 'cancelado' })
        .eq('id', id);
      
      if (error) {
        throw error;
      }

      // Atualizar estado local
      setConsultas(consultas.map(consulta => 
        consulta.id === id ? { ...consulta, status: 'cancelado' as const } : consulta
      ));
      
      toast({
        title: "Consulta cancelada",
        description: "A consulta foi cancelada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao cancelar consulta:", error);
      toast({
        title: "Erro",
        description: "Não foi possível cancelar a consulta.",
        variant: "destructive",
      });
    }
  };

  // Filtra consultas por status
  const consultasAgendadas = consultas.filter(c => c.status === 'agendado' || c.status === 'confirmado');
  const consultasConcluidas = consultas.filter(c => c.status === 'concluido');
  const consultasCanceladas = consultas.filter(c => c.status === 'cancelado');

  const renderConsultaCard = (consulta: ConsultaProps) => (
    <Card key={consulta.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <Badge className="w-fit mb-2" variant={getBadgeVariant(consulta.status)}>
          {getStatusLabel(consulta.status)}
        </Badge>
        <CardTitle>{consulta.pet_nome}</CardTitle>
        <CardDescription>
          {formatDate(consulta.data)} às {consulta.horario}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold">Veterinário:</span>
            <span>{consulta.vet_nome}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Pet:</span>
            <span>{consulta.pet_nome}</span>
          </div>
          {consulta.observacoes && (
            <div className="mt-2">
              <span className="font-semibold">Observações:</span>
              <p className="text-sm text-muted-foreground">{consulta.observacoes}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex flex-col gap-2">
        <ConsultaDetailDialog consulta={consulta} />
        
        {consulta.status === 'agendado' && (
          <>
            <ReagendarDialog 
              consulta={consulta} 
              onReagendarSuccess={fetchConsultas} 
            />
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => cancelarConsulta(consulta.id)}
            >
              Cancelar Consulta
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Minhas Consultas</h1>
          <Button onClick={() => window.location.href = "/agendar"}>
            Agendar Nova Consulta
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : consultas.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium">Você não possui consultas agendadas</h3>
            <p className="text-muted-foreground mt-2">Que tal agendar uma nova consulta?</p>
          </div>
        ) : (
          <div className="space-y-8">
            {consultasAgendadas.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Consultas Agendadas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {consultasAgendadas.map(renderConsultaCard)}
                </div>
              </div>
            )}
            
            {consultasConcluidas.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Consultas Concluídas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {consultasConcluidas.map(renderConsultaCard)}
                </div>
              </div>
            )}
            
            {consultasCanceladas.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Consultas Canceladas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {consultasCanceladas.map(renderConsultaCard)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MinhasConsultas;
