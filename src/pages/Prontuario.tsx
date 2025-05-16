
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import ProntuarioInfo from "@/components/prontuario/ProntuarioInfo";
import ProntuarioForm from "@/components/prontuario/ProntuarioForm";
import { createProntuario, updateProntuario } from "@/services/api";
import { supabase } from "@/integrations/supabase/client";

interface Prontuario {
  id: string;
  consultaId: string;
  petId: string;
  vetId: string;
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
    vetId: user?.id || '',
    anamnese: '',
    diagnostico: '',
    prescricao: '',
    observacoes: ''
  });
  
  const [consultaInfo, setConsultaInfo] = useState<any>(null);
  const [petInfo, setPetInfo] = useState<any>(null);
  const [existingProntuario, setExistingProntuario] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Buscar informações da consulta e do pet (do banco de dados)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (consultaId) {
          // Buscar consulta do banco de dados
          const { data: consulta, error: consultaError } = await supabase
            .from('consultas')
            .select('*, profiles!consultas_vet_id_fkey(nome)')
            .eq('id', consultaId)
            .single();
          
          if (consultaError) throw consultaError;
          setConsultaInfo(consulta);
        }
        
        if (petId) {
          // Buscar pet do banco de dados
          const { data: pet, error: petError } = await supabase
            .from('pets')
            .select('*')
            .eq('id', petId)
            .single();
          
          if (petError) throw petError;
          setPetInfo(pet);
        }
        
        // Verificar se já existe um prontuário para esta consulta
        if (consultaId) {
          const { data: existingPront, error: prontError } = await supabase
            .from('prontuarios')
            .select('*')
            .eq('consulta_id', consultaId)
            .maybeSingle();
          
          if (prontError && prontError.code !== 'PGRST116') throw prontError;
          
          if (existingPront) {
            setExistingProntuario(existingPront);
            setProntuario({
              id: existingPront.id,
              consultaId: existingPront.consulta_id,
              petId: existingPront.pet_id,
              vetId: existingPront.vet_id,
              anamnese: existingPront.anamnese || '',
              diagnostico: existingPront.diagnostico || '',
              prescricao: existingPront.prescricao || '',
              observacoes: existingPront.observacoes || ''
            });
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do prontuário",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [consultaId, petId]);

  const handleInputChange = (field: keyof Omit<Prontuario, 'id' | 'consultaId' | 'petId' | 'vetId'>, value: string) => {
    setProntuario(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSalvar = async () => {
    if (!user || !consultaId || !petId) {
      toast({
        title: "Erro",
        description: "Informações incompletas para salvar o prontuário",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Dados a serem salvos no banco
      const prontuarioData = {
        ...prontuario,
        vetId: user.id,
        consultaId,
        petId
      };
      
      if (existingProntuario) {
        // Atualizar prontuário existente
        await updateProntuario(existingProntuario.id, prontuarioData);
        
        // Também atualizar a consulta com diagnóstico e prescrição
        const { error: consultaError } = await supabase
          .from('consultas')
          .update({
            diagnostico: prontuarioData.diagnostico,
            prescricao: prontuarioData.prescricao,
            status: 'concluido'
          })
          .eq('id', consultaId);
        
        if (consultaError) throw consultaError;
      } else {
        // Criar novo prontuário
        await createProntuario(prontuarioData);
        
        // Também atualizar a consulta com diagnóstico e prescrição
        const { error: consultaError } = await supabase
          .from('consultas')
          .update({
            diagnostico: prontuarioData.diagnostico,
            prescricao: prontuarioData.prescricao,
            status: 'concluido'
          })
          .eq('id', consultaId);
        
        if (consultaError) throw consultaError;
      }
      
      toast({
        title: "Prontuário salvo",
        description: "As informações foram salvas com sucesso"
      });
      
      // Redirecionar para a listagem de consultas ou prontuários
      setTimeout(() => {
        navigate('/prontuarios');
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar prontuário:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o prontuário",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Carregando informações do prontuário...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!consultaInfo || !petInfo) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-destructive">Consulta ou pet não encontrado</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>
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
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default ProntuarioPage;
