
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, ListCheck, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { agendamentosMock, petsMock, veterinariosMock } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardVet = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  // Filtrar dados de acordo com o veterinário logado
  const veterinario = user ? veterinariosMock.find(v => v.id === user.id) : null;
  
  // Filtrar consultas do dia atual
  const hoje = new Date().toISOString().split('T')[0];
  
  // Consultas de hoje
  const consultasHoje = agendamentosMock
    .filter(a => a.vetId === user?.id && a.data === hoje && (a.status === 'agendado' || a.status === 'confirmado'))
    .sort((a, b) => a.horario.localeCompare(b.horario));
  
  // Consultas confirmadas para hoje (prontas para atendimento)
  const consultasConfirmadas = agendamentosMock
    .filter(a => a.vetId === user?.id && a.data === hoje && a.status === 'confirmado')
    .sort((a, b) => a.horario.localeCompare(b.horario));
  
  // Consultas já realizadas
  const consultasFinalizadas = agendamentosMock
    .filter(a => a.vetId === user?.id && a.status === 'concluido')
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()); // Ordenação mais recentes primeiro
  
  // Estatísticas
  const totalConsultasHoje = consultasHoje.length;
  const totalPacientesAtendidos = new Set(consultasFinalizadas.map(c => c.petId)).size;
  const totalConsultasConcluidas = consultasFinalizadas.length;
  const totalConsultasCanceladas = agendamentosMock
    .filter(a => a.vetId === user?.id && a.status === 'cancelado')
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
  
  const formatarDiaSemana = (dataString: string) => {
    const data = new Date(dataString);
    return diasDaSemana[data.getDay()];
  };

  // Handlers para ações nas consultas
  const handleCancelarConsulta = (consultaId: string) => {
    console.log("Cancelar consulta:", consultaId);
    // Implementação futura para conectar com a API
  };

  const handleReagendarConsulta = (consultaId: string) => {
    console.log("Reagendar consulta:", consultaId);
    // Implementação futura para conectar com a API
  };

  const handleConfirmarConsulta = (consultaId: string) => {
    console.log("Confirmar consulta:", consultaId);
    // Implementação futura para conectar com a API
  };

  const handleAbrirChat = (clientId: string) => {
    console.log("Abrir chat com:", clientId);
    navigate(`/mensagens?userId=${clientId}`);
  };

  const handleAbrirMapa = (endereco: any) => {
    if (!endereco) return;
    
    const enderecoFormatado = `${endereco.logradouro}, ${endereco.numero}, ${endereco.cidade}, ${endereco.estado}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoFormatado)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleAbrirProntuario = (consultaId: string, petId: string) => {
    console.log("Abrir prontuário:", consultaId, petId);
    navigate(`/prontuario?consultaId=${consultaId}&petId=${petId}`);
  };

  const handleFinalizarAtendimento = (consultaId: string) => {
    console.log("Finalizar atendimento:", consultaId);
    navigate(`/finalizar-atendimento?consultaId=${consultaId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-3xl font-bold mb-1">Olá, {profile?.nome?.split(' ')[0] || 'Doutor(a)'}!</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu consultório veterinário.
          </p>
        </div>
        
        <Tabs defaultValue="consultorio" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="consultorio">Consultório</TabsTrigger>
            <TabsTrigger value="consulta">Consulta</TabsTrigger>
            <TabsTrigger value="finalizados">Finalizados</TabsTrigger>
          </TabsList>
          
          {/* Aba do Consultório */}
          <TabsContent value="consultorio" className="space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
                  <ListCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalConsultasHoje}</div>
                  <p className="text-xs text-muted-foreground">
                    Atendimentos agendados para hoje
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Pacientes Atendidos</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPacientesAtendidos}</div>
                  <p className="text-xs text-muted-foreground">
                    Total de pacientes já atendidos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Consultas Concluídas</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalConsultasConcluidas}</div>
                  <p className="text-xs text-muted-foreground">
                    Atendimentos realizados com sucesso
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Consultas Canceladas</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalConsultasCanceladas}</div>
                  <p className="text-xs text-muted-foreground">
                    Atendimentos cancelados
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Consultas de Hoje */}
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
                        className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="mb-4 lg:mb-0">
                          <div className="flex items-center mb-1">
                            <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                            <span className="font-medium">{consulta.horario}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">{getPetNome(consulta.petId)}</span>
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
                        <div className="grid grid-cols-2 lg:flex lg:space-x-2 gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleAbrirChat(consulta.clientId)}
                          >
                            Chat
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleAbrirMapa(veterinariosMock.find(v => v.id === consulta.vetId)?.endereco)}
                          >
                            Mapa
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCancelarConsulta(consulta.id)}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            Cancelar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReagendarConsulta(consulta.id)}
                          >
                            Reagendar
                          </Button>
                          {consulta.status === 'agendado' ? (
                            <Button 
                              size="sm" 
                              className="col-span-2 lg:col-span-1"
                              onClick={() => handleConfirmarConsulta(consulta.id)}
                            >
                              Confirmar
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              className="col-span-2 lg:col-span-1"
                              onClick={() => handleAbrirProntuario(consulta.id, consulta.petId)}
                            >
                              Prontuário
                            </Button>
                          )}
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
          </TabsContent>
          
          {/* Aba de Consulta */}
          <TabsContent value="consulta" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Consultas Confirmadas</CardTitle>
                <CardDescription>
                  {consultasConfirmadas.length > 0
                    ? `Você tem ${consultasConfirmadas.length} consulta(s) confirmada(s) para hoje`
                    : "Não há consultas confirmadas para hoje"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {consultasConfirmadas.length > 0 ? (
                  <div className="space-y-4">
                    {consultasConfirmadas.map((consulta) => (
                      <div 
                        key={consulta.id}
                        className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="mb-4 lg:mb-0">
                          <div className="flex items-center mb-1">
                            <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                            <span className="font-medium">{consulta.horario}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">{getPetNome(consulta.petId)}</span>
                          </div>
                          <div className="mt-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-vetcare-100 text-vetcare-600">
                              Confirmado
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => handleAbrirProntuario(consulta.id, consulta.petId)}
                          >
                            Prontuário
                          </Button>
                          <Button 
                            onClick={() => handleFinalizarAtendimento(consulta.id)}
                          >
                            Finalizar Atendimento
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">
                      Não há consultas confirmadas para hoje
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Aba de Finalizados */}
          <TabsContent value="finalizados" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Consultas Finalizadas</CardTitle>
                <CardDescription>
                  Histórico de atendimentos concluídos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {consultasFinalizadas.length > 0 ? (
                  <div className="space-y-4">
                    {consultasFinalizadas.map((consulta) => (
                      <div 
                        key={consulta.id}
                        className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="mb-4 lg:mb-0">
                          <div className="flex items-center mb-1">
                            <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                            <span className="font-medium">
                              {formatarData(consulta.data)} - {consulta.horario}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">{getPetNome(consulta.petId)}</span>
                          </div>
                          <div className="mt-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                              Concluído
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAbrirProntuario(consulta.id, consulta.petId)}
                          >
                            Prontuário
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAbrirChat(consulta.clientId)}
                          >
                            Chat
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">
                      Não há consultas finalizadas no seu histórico
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DashboardVet;
