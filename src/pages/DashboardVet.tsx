
import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, ListCheck, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { agendamentosMock, petsMock, veterinariosMock } from "@/data/mockData";
import { Link } from "react-router-dom";

const DashboardVet = () => {
  const { user } = useAuth();
  
  // Filtrar dados de acordo com o veterinário logado
  const veterinario = user ? veterinariosMock.find(v => v.id === user.id) : null;
  
  // Filtrar consultas do dia atual
  const hoje = new Date().toISOString().split('T')[0];
  
  const consultasHoje = agendamentosMock
    .filter(a => a.vetId === user?.id && a.data === hoje && (a.status === 'agendado' || a.status === 'confirmado'))
    .sort((a, b) => a.horario.localeCompare(b.horario));
  
  // Próximas consultas (não incluindo hoje)
  const proximasConsultas = agendamentosMock
    .filter(a => 
      a.vetId === user?.id && 
      a.data > hoje && 
      (a.status === 'agendado' || a.status === 'confirmado')
    )
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(0, 5); // Limita a 5 próximas consultas
    
  // Consultas realizadas
  const consultasRealizadas = agendamentosMock
    .filter(a => a.vetId === user?.id && a.status === 'concluido')
    .length;

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getPetNome = (petId: string) => {
    const pet = petsMock.find(p => p.id === petId);
    return pet ? pet.nome : 'Pet não encontrado';
  };

  const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  
  // Formata a string de data para mostrar o dia da semana
  const formatarDiaSemana = (dataString: string) => {
    const data = new Date(dataString);
    return diasDaSemana[data.getDay()];
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-3xl font-bold mb-1">Olá, {user?.nome.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu dashboard profissional.
          </p>
        </div>
        
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
              <ListCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{consultasHoje.length}</div>
              <p className="text-xs text-muted-foreground">
                Atendimentos agendados para hoje
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Próxima Consulta</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {proximasConsultas.length > 0 ? (
                <>
                  <div className="text-xl font-bold">
                    {formatarData(proximasConsultas[0].data)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {proximasConsultas[0].horario} - {getPetNome(proximasConsultas[0].petId)}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-xl font-bold">Nenhuma</div>
                  <p className="text-xs text-muted-foreground">
                    Sem consultas agendadas
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Consultas Realizadas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{consultasRealizadas}</div>
              <p className="text-xs text-muted-foreground">
                Atendimentos concluídos
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Consultas de Hoje */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Consultas de Hoje</CardTitle>
              <CardDescription>
                {consultasHoje.length > 0
                  ? `Você tem ${consultasHoje.length} consulta(s) agendada(s) para hoje`
                  : "Não há consultas agendadas para hoje"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {consultasHoje.length > 0 ? (
                <div className="space-y-4">
                  {consultasHoje.map((consulta) => (
                    <div 
                      key={consulta.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="mb-3 sm:mb-0">
                        <div className="flex items-center mb-1">
                          <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="font-medium">
                            {consulta.horario}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">
                            {getPetNome(consulta.petId)}
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            consulta.status === 'agendado'
                              ? 'bg-vetblue-100 text-vetblue-600'
                              : 'bg-vetcare-100 text-vetcare-600'
                          }`}>
                            {consulta.status === 'agendado' ? 'Agendado' : 'Confirmado'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Detalhes
                        </Button>
                        <Button size="sm">
                          Iniciar Consulta
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">
                    Você não tem consultas agendadas para hoje
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Próximas Consultas */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Próximas Consultas</CardTitle>
              <CardDescription>
                Veja suas próximas consultas agendadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {proximasConsultas.length > 0 ? (
                <div className="space-y-4">
                  {proximasConsultas.map((consulta) => (
                    <div 
                      key={consulta.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="mb-3 sm:mb-0">
                        <div className="flex items-center mb-1">
                          <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="font-medium">
                            {formatarData(consulta.data)}
                          </span>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <span>{consulta.horario}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">
                            {getPetNome(consulta.petId)}
                          </span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {formatarDiaSemana(consulta.data)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">
                    Você não tem consultas agendadas para os próximos dias
                  </p>
                </div>
              )}
              
              <div className="mt-6 text-center">
                <Button asChild variant="outline">
                  <Link to="/agenda">
                    Ver Agenda Completa
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardVet;
