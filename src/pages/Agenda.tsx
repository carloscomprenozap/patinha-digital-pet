
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar as CalendarIcon, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { agendamentosMock, petsMock } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Agenda = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Filtrar agendamentos do veterinário
  const agendamentosVet = agendamentosMock.filter(a => a.vetId === user?.id);
  
  // Agrupar agendamentos por data para highlight no calendário
  const agendamentosPorData: Record<string, typeof agendamentosMock> = {};
  agendamentosVet.forEach(agendamento => {
    if (!agendamentosPorData[agendamento.data]) {
      agendamentosPorData[agendamento.data] = [];
    }
    agendamentosPorData[agendamento.data].push(agendamento);
  });

  // Dias com agendamento
  const diasComAgendamento = Object.keys(agendamentosPorData).map(data => new Date(data));

  // Filtrar agendamentos pela data selecionada
  const agendamentosDoDia = selectedDate 
    ? agendamentosPorData[format(selectedDate, 'yyyy-MM-dd')] || [] 
    : [];

  // Organizar agendamentos por horário
  const agendamentosOrdenados = [...agendamentosDoDia].sort((a, b) => 
    a.horario.localeCompare(b.horario)
  );

  const getPetNome = (petId: string) => {
    const pet = petsMock.find(p => p.id === petId);
    return pet ? pet.nome : 'Pet não encontrado';
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'bg-vetblue-100 text-vetblue-600';
      case 'confirmado':
        return 'bg-vetcare-100 text-vetcare-600';
      case 'concluido':
        return 'bg-green-100 text-green-600';
      case 'cancelado':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleAbrirProntuario = (consultaId: string, petId: string) => {
    navigate(`/prontuario?consultaId=${consultaId}&petId=${petId}`);
  };

  const handleAbrirChat = (clientId: string) => {
    navigate(`/mensagens?userId=${clientId}`);
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Minha Agenda</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          {/* Calendário */}
          <Card>
            <CardHeader>
              <CardTitle>Calendário</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                className="border rounded-md"
                modifiers={{
                  booked: diasComAgendamento,
                }}
                modifiersStyles={{
                  booked: { 
                    fontWeight: 'bold',
                    borderBottom: '2px solid currentColor',
                    color: 'var(--vetcare-600)'
                  }
                }}
              />
            </CardContent>
          </Card>
          
          {/* Agendamentos do dia selecionado */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {selectedDate ? (
                  <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </div>
                ) : "Selecione uma data"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {agendamentosOrdenados.length > 0 ? (
                <div className="space-y-4">
                  {agendamentosOrdenados.map((agendamento) => (
                    <div 
                      key={agendamento.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="mb-4 sm:mb-0">
                        <div className="flex items-center mb-1">
                          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">{agendamento.horario}</span>
                        </div>
                        <div className="flex items-center mb-1">
                          <User className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>{getPetNome(agendamento.petId)}</span>
                        </div>
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(agendamento.status)}`}>
                            {agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {agendamento.status !== 'cancelado' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleAbrirChat(agendamento.clientId)}
                            >
                              Chat
                            </Button>
                            {agendamento.status === 'concluido' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleAbrirProntuario(agendamento.id, agendamento.petId)}
                              >
                                Prontuário
                              </Button>
                            )}
                            {(agendamento.status === 'agendado' || agendamento.status === 'confirmado') && (
                              <Button 
                                size="sm" 
                                onClick={() => handleAbrirProntuario(agendamento.id, agendamento.petId)}
                              >
                                Detalhes
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">
                    {selectedDate 
                      ? "Não há agendamentos para esta data" 
                      : "Selecione uma data para ver os agendamentos"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Agenda;
