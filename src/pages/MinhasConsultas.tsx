import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ConsultaProps, ConsultaDB } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";

// Helper para validar e converter o status
const validateStatus = (status: string): 'agendado' | 'confirmado' | 'concluido' | 'cancelado' => {
  const validStatus = ['agendado', 'confirmado', 'concluido', 'cancelado'] as const;
  if (validStatus.includes(status as any)) {
    return status as 'agendado' | 'confirmado' | 'concluido' | 'cancelado';
  }
  return 'agendado';
};

const getBadgeVariant = (status: string) => {
  const statusMap: Record<string, string> = {
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
        consulta.id === id ? { ...consulta, status: 'cancelado' } : consulta
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

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Minhas Consultas</h1>
          <Button onClick={() => { /* navigate("/agendar") */ }}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultas.map((consulta) => (
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
                <CardFooter className="pt-2">
                  {consulta.status === 'agendado' && (
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => cancelarConsulta(consulta.id)}
                    >
                      Cancelar Consulta
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MinhasConsultas;
