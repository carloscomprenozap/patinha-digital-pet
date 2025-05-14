
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

interface AgendamentosListProps {
  selectedDate: Date | undefined;
  agendamentosOrdenados: any[];
  getPetNome: (petId: string) => string;
  getStatusClass: (status: string) => string;
  handleAbrirProntuario: (consultaId: string, petId: string) => void;
  handleAbrirChat: (clientId: string) => void;
}

const AgendamentosList = ({ 
  selectedDate, 
  agendamentosOrdenados, 
  getPetNome, 
  getStatusClass,
  handleAbrirProntuario,
  handleAbrirChat
}: AgendamentosListProps) => {
  return (
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
  );
};

export default AgendamentosList;
