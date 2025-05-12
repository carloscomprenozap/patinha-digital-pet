
import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { agendamentosMock, clientesMock, petsMock, veterinariosMock } from "@/data/mockData";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  
  // Filtrar dados de acordo com o cliente logado
  const cliente = user ? clientesMock.find(c => c.id === user.id) : null;
  const pets = cliente ? petsMock.filter(p => p.clientId === cliente.id) : [];
  
  // Filtrar agendamentos futuros do cliente
  const agendamentosFuturos = agendamentosMock
    .filter(a => a.clientId === user?.id && (a.status === 'agendado' || a.status === 'confirmado'))
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  
  // Filtrar histórico de consultas passadas
  const consultasPassadas = agendamentosMock
    .filter(a => a.clientId === user?.id && a.status === 'concluido')
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getVeterinarioNome = (vetId: string) => {
    const vet = veterinariosMock.find(v => v.id === vetId);
    return vet ? vet.nome : 'Veterinário não encontrado';
  };

  const getPetNome = (petId: string) => {
    const pet = petsMock.find(p => p.id === petId);
    return pet ? pet.nome : 'Pet não encontrado';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-3xl font-bold mb-1">Olá, {user?.nome.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu dashboard pessoal.
          </p>
        </div>
        
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Pets Cadastrados</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pets.length}</div>
              <p className="text-xs text-muted-foreground">
                {pets.length === 1 ? 'Pet registrado' : 'Pets registrados'} na plataforma
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Próxima Consulta</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {agendamentosFuturos.length > 0
                  ? formatarData(agendamentosFuturos[0].data)
                  : "Nenhuma"}
              </div>
              <p className="text-xs text-muted-foreground">
                {agendamentosFuturos.length > 0
                  ? `${agendamentosFuturos[0].horario} - ${getPetNome(agendamentosFuturos[0].petId)}`
                  : "Agende sua próxima consulta"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Consultas Realizadas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{consultasPassadas.length}</div>
              <p className="text-xs text-muted-foreground">
                Atendimentos veterinários concluídos
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Próximas Consultas */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Consultas Agendadas</CardTitle>
              <CardDescription>
                Veja suas próximas consultas veterinárias
              </CardDescription>
            </CardHeader>
            <CardContent>
              {agendamentosFuturos.length > 0 ? (
                <div className="space-y-4">
                  {agendamentosFuturos.map((agendamento) => (
                    <div 
                      key={agendamento.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="mb-3 sm:mb-0">
                        <div className="flex items-center mb-1">
                          <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="font-medium">
                            {formatarData(agendamento.data)}
                          </span>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <span>{agendamento.horario}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {getPetNome(agendamento.petId)}
                          </span>
                          <span className="mx-2 text-muted-foreground">com</span>
                          <span>{getVeterinarioNome(agendamento.vetId)}</span>
                        </div>
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            agendamento.status === 'agendado'
                              ? 'bg-vetblue-100 text-vetblue-600'
                              : 'bg-vetcare-100 text-vetcare-600'
                          }`}>
                            {agendamento.status === 'agendado' ? 'Agendado' : 'Confirmado'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Detalhes
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">
                    Você não tem consultas agendadas
                  </p>
                  <Button asChild>
                    <Link to="/agendar">Agendar Consulta</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
