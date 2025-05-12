
import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { agendamentosMock, petsMock } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Filter, Search, User } from "lucide-react";

const HistoricoAtendimentos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estado para filtros de pesquisa
  const [search, setSearch] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<string | undefined>(undefined);
  
  // Todos os agendamentos do veterinário
  const agendamentosVet = agendamentosMock.filter(a => a.vetId === user?.id);
  
  // Aplicar filtros
  const agendamentosFiltrados = agendamentosVet.filter(a => {
    // Filtrar por status se selecionado
    if (statusFiltro && a.status !== statusFiltro) return false;
    
    // Filtrar pela pesquisa (nome do pet)
    if (search) {
      const pet = petsMock.find(p => p.id === a.petId);
      if (!pet) return false;
      return pet.nome.toLowerCase().includes(search.toLowerCase());
    }
    
    return true;
  }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  
  const getPetNome = (petId: string) => {
    const pet = petsMock.find(p => p.id === petId);
    return pet ? pet.nome : 'Pet não encontrado';
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'Agendado';
      case 'confirmado':
        return 'Confirmado';
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const handleAbrirProntuario = (consultaId: string, petId: string) => {
    navigate(`/prontuario?consultaId=${consultaId}&petId=${petId}`);
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-2">Histórico de Atendimentos</h1>
        <p className="text-muted-foreground mb-6">
          Consulte o histórico de todos os seus atendimentos
        </p>
        
        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Buscar por nome do pet</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Digite para pesquisar..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Status</label>
                <Select
                  value={statusFiltro}
                  onValueChange={setStatusFiltro}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined}>Todos</SelectItem>
                    <SelectItem value="agendado">Agendado</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearch("");
                    setStatusFiltro(undefined);
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Resultados */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Consultas</CardTitle>
            <CardDescription>
              {agendamentosFiltrados.length} consulta(s) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {agendamentosFiltrados.length > 0 ? (
              <div className="space-y-4">
                {agendamentosFiltrados.map((agendamento) => (
                  <div 
                    key={agendamento.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="mb-4 sm:mb-0">
                      <div className="flex items-center mb-1">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">{formatarData(agendamento.data)}</span>
                        <span className="mx-1">•</span>
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{agendamento.horario}</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{getPetNome(agendamento.petId)}</span>
                      </div>
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(agendamento.status)}`}>
                          {getStatusLabel(agendamento.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {agendamento.status === 'concluido' && (
                        <Button 
                          variant="outline" 
                          onClick={() => handleAbrirProntuario(agendamento.id, agendamento.petId)}
                        >
                          Prontuário
                        </Button>
                      )}
                      {(agendamento.status === 'agendado' || agendamento.status === 'confirmado') && (
                        <Button 
                          onClick={() => handleAbrirProntuario(agendamento.id, agendamento.petId)}
                        >
                          Detalhes
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  Nenhuma consulta encontrada com os filtros selecionados.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HistoricoAtendimentos;
