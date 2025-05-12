
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { agendamentosMock, petsMock } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Clock, Save, User } from "lucide-react";

interface Prontuario {
  id: string;
  consultaId: string;
  petId: string;
  anamnese: string;
  diagnostico: string;
  prescricao: string;
  observacoes: string;
}

const ProntuarioPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const consultaId = searchParams.get('consultaId');
  const petId = searchParams.get('petId');
  
  const [prontuario, setProntuario] = useState<Prontuario>({
    id: `prontuario-${Date.now()}`,
    consultaId: consultaId || '',
    petId: petId || '',
    anamnese: '',
    diagnostico: '',
    prescricao: '',
    observacoes: ''
  });
  
  const [consultaInfo, setConsultaInfo] = useState<any>(null);
  const [petInfo, setPetInfo] = useState<any>(null);
  
  // Buscar informações da consulta e do pet (mock)
  useEffect(() => {
    if (consultaId) {
      const consulta = agendamentosMock.find(c => c.id === consultaId);
      setConsultaInfo(consulta);
    }
    
    if (petId) {
      const pet = petsMock.find(p => p.id === petId);
      setPetInfo(pet);
    }
    
    // Em produção aqui teria uma chamada para a API para buscar o prontuário existente
  }, [consultaId, petId]);

  const handleInputChange = (field: keyof Omit<Prontuario, 'id' | 'consultaId' | 'petId'>, value: string) => {
    setProntuario(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSalvar = () => {
    // Em produção aqui teria uma chamada para a API
    console.log("Salvando prontuário:", prontuario);
    
    toast({
      title: "Prontuário salvo",
      description: "As informações foram salvas com sucesso"
    });
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (!consultaInfo || !petInfo) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Carregando informações do prontuário...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="icon" 
            className="mr-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Prontuário</h1>
            <p className="text-muted-foreground">
              {petInfo?.nome} - {formatarData(consultaInfo.data)}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <User className="mr-2 h-4 w-4" />
                Informações do Paciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Nome</dt>
                  <dd className="font-medium">{petInfo.nome}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Espécie</dt>
                  <dd>{petInfo.especie}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Raça</dt>
                  <dd>{petInfo.raca}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Idade</dt>
                  <dd>{petInfo.idade} anos</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Peso</dt>
                  <dd>{petInfo.peso} kg</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="mr-2 h-4 w-4" />
                Informações da Consulta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Data</dt>
                  <dd className="font-medium">{formatarData(consultaInfo.data)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Horário</dt>
                  <dd>{consultaInfo.horario}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Status</dt>
                  <dd>
                    <span 
                      className={`inline-block px-2 py-1 text-xs rounded-full
                      ${consultaInfo.status === 'agendado' ? 'bg-vetblue-100 text-vetblue-600' :
                        consultaInfo.status === 'confirmado' ? 'bg-vetcare-100 text-vetcare-600' :
                        consultaInfo.status === 'concluido' ? 'bg-green-100 text-green-600' :
                        'bg-red-100 text-red-600'
                      }`}
                    >
                      {consultaInfo.status.charAt(0).toUpperCase() + consultaInfo.status.slice(1)}
                    </span>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Clock className="mr-2 h-4 w-4" />
                Histórico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {petInfo.observacoes || 'Sem observações anteriores.'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Anamnese</CardTitle>
            <CardDescription>
              Histórico e queixas do paciente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={prontuario.anamnese}
              onChange={(e) => handleInputChange('anamnese', e.target.value)}
              placeholder="Descreva os sintomas relatados pelo tutor e o histórico do paciente..."
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Diagnóstico</CardTitle>
            <CardDescription>
              Avaliação clínica e diagnóstico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={prontuario.diagnostico}
              onChange={(e) => handleInputChange('diagnostico', e.target.value)}
              placeholder="Descreva o diagnóstico realizado após exame clínico..."
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Prescrição</CardTitle>
            <CardDescription>
              Medicação e tratamento prescrito
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={prontuario.prescricao}
              onChange={(e) => handleInputChange('prescricao', e.target.value)}
              placeholder="Descreva a medicação e o tratamento prescrito..."
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Observações</CardTitle>
            <CardDescription>
              Notas adicionais e recomendações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={prontuario.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              placeholder="Registre observações adicionais e recomendações para o tutor..."
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSalvar} className="min-w-[150px]">
            <Save className="mr-2 h-4 w-4" />
            Salvar Prontuário
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProntuarioPage;
