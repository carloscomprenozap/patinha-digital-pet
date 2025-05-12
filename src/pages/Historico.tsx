
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock, MessageSquare, FileText } from "lucide-react";
import { petsMock, agendamentosMock, veterinariosMock } from "@/data/mockData";

const Historico = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtro, setFiltro] = useState("todos");
  
  // Mock data for user and agendamentos
  const userId = "u1"; // Mock user ID
  const userAgendamentos = agendamentosMock.filter(a => a.clientId === userId);
  
  const statusMapping: Record<string, string> = {
    agendado: "Agendado",
    confirmado: "Confirmado",
    concluido: "Concluído",
    cancelado: "Cancelado"
  };
  
  const statusColors: Record<string, string> = {
    agendado: "bg-vetblue-100 text-vetblue-600",
    confirmado: "bg-vetcare-100 text-vetcare-600",
    concluido: "bg-green-100 text-green-600",
    cancelado: "bg-red-100 text-red-600"
  };
  
  const filteredAgendamentos = userAgendamentos.filter(agendamento => {
    const matchesSearch = searchTerm 
      ? getPetNome(agendamento.petId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getVeterinarioNome(agendamento.vetId).toLowerCase().includes(searchTerm.toLowerCase())
      : true;
      
    const matchesFilter = filtro === "todos" ? true : agendamento.status === filtro;
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  
  const getPetNome = (petId: string) => {
    const pet = petsMock.find(p => p.id === petId);
    return pet ? pet.nome : 'Pet não encontrado';
  };
  
  const getVeterinarioNome = (vetId: string) => {
    const vet = veterinariosMock.find(v => v.id === vetId);
    return vet ? vet.nome : 'Veterinário não encontrado';
  };
  
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };
  
  const handleVerProntuario = (petId: string, consultaId: string) => {
    navigate(`/prontuario?petId=${petId}&consultaId=${consultaId}`);
  };
  
  const handleIniciarChat = (vetId: string) => {
    navigate(`/mensagens?userId=${vetId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Histórico</h1>
          <p className="text-muted-foreground">
            Histórico completo de consultas dos seus pets
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Buscar por pet ou veterinário..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-48">
            <Select value={filtro} onValueChange={setFiltro}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredAgendamentos.length > 0 ? (
          <div className="space-y-4">
            {filteredAgendamentos.map((agendamento) => (
              <Card key={agendamento.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span>{getPetNome(agendamento.petId)}</span>
                        <Badge 
                          className={`${statusColors[agendamento.status]} ml-2`}
                        >
                          {statusMapping[agendamento.status]}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatarData(agendamento.data)}</span>
                        <span className="mx-1">•</span>
                        <Clock className="h-3 w-3" />
                        <span>{agendamento.horario}</span>
                      </CardDescription>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <CardDescription>
                        Dr. {getVeterinarioNome(agendamento.vetId)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:justify-end gap-2">
                    {agendamento.status === 'concluido' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleVerProntuario(agendamento.petId, agendamento.id)}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Prontuário
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleIniciarChat(agendamento.vetId)}
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">
              {searchTerm || filtro !== "todos" 
                ? "Nenhuma consulta encontrada com os filtros aplicados" 
                : "Você ainda não tem consultas registradas"}
            </p>
            {(searchTerm || filtro !== "todos") && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setFiltro("todos");
                }}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Historico;
