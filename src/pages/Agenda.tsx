
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { agendamentosMock, petsMock } from "@/data/mockData";
import AgendaCalendar from "@/components/agenda/AgendaCalendar";
import AgendamentosList from "@/components/agenda/AgendamentosList";

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
          <AgendaCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            diasComAgendamento={diasComAgendamento}
          />
          
          {/* Agendamentos do dia selecionado */}
          <AgendamentosList 
            selectedDate={selectedDate}
            agendamentosOrdenados={agendamentosOrdenados}
            getPetNome={getPetNome}
            getStatusClass={getStatusClass}
            handleAbrirProntuario={handleAbrirProntuario}
            handleAbrirChat={handleAbrirChat}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Agenda;
