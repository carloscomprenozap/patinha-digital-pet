
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { agendamentosMock, petsMock } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import ProntuarioInfo from "@/components/prontuario/ProntuarioInfo";
import ProntuarioForm from "@/components/prontuario/ProntuarioForm";

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
        
        <ProntuarioInfo 
          petInfo={petInfo} 
          consultaInfo={consultaInfo} 
          formatarData={formatarData} 
        />
        
        <ProntuarioForm
          prontuario={prontuario}
          handleInputChange={handleInputChange}
          handleSalvar={handleSalvar}
        />
      </div>
    </DashboardLayout>
  );
};

export default ProntuarioPage;
