
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, FileText } from "lucide-react";
import ProntuarioInfo from "@/components/prontuario/ProntuarioInfo";
import ProntuarioForm from "@/components/prontuario/ProntuarioForm";
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
          console.log("Buscando informações da consulta:", consultaId);
          // Buscar consulta do banco de dados
          const { data: consulta, error: consultaError } = await supabase
            .from('consultas')
            .select(`
              *,
              profiles:vet_id (nome, telefone)
            `)
            .eq('id', consultaId)
            .single();
          
          if (consultaError) {
            console.error("Erro ao buscar consulta:", consultaError);
            throw consultaError;
          }
          
          console.log("Consulta encontrada:", consulta);
          setConsultaInfo(consulta);
        }
        
        if (petId) {
          console.log("Buscando informações do pet:", petId);
          // Buscar pet do banco de dados
          const { data: pet, error: petError } = await supabase
            .from('pets')
            .select('*')
            .eq('id', petId)
            .single();
          
          if (petError) {
            console.error("Erro ao buscar pet:", petError);
            throw petError;
          }
          
          console.log("Pet encontrado:", pet);
          setPetInfo(pet);
        }
        
        // Verificar se já existe um prontuário para esta consulta
        if (consultaId) {
          console.log("Verificando se existe prontuário para a consulta:", consultaId);
          const { data: existingPront, error: prontError } = await supabase
            .from('prontuarios')
            .select('*')
            .eq('consulta_id', consultaId)
            .maybeSingle();
          
          if (prontError && prontError.code !== 'PGRST116') {
            console.error("Erro ao verificar prontuário:", prontError);
            throw prontError;
          }
          
          console.log("Prontuário encontrado:", existingPront);
          
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
      console.log("Salvando prontuário...");
      
      // Dados a serem salvos no banco
      const prontuarioData = {
        anamnese: prontuario.anamnese,
        diagnostico: prontuario.diagnostico,
        prescricao: prontuario.prescricao,
        observacoes: prontuario.observacoes,
        vet_id: user.tipo === 'vet' ? user.id : prontuario.vetId,
        consulta_id: consultaId,
        pet_id: petId
      };
      
      console.log("Dados do prontuário para salvar:", prontuarioData);
      
      if (existingProntuario) {
        console.log("Atualizando prontuário existente:", existingProntuario.id);
        // Atualizar prontuário existente
        const { error } = await supabase
          .from('prontuarios')
          .update({
            anamnese: prontuario.anamnese,
            diagnostico: prontuario.diagnostico,
            prescricao: prontuario.prescricao,
            observacoes: prontuario.observacoes
          })
          .eq('id', existingProntuario.id);
        
        if (error) throw error;
        
        // Também atualizar a consulta com diagnóstico e prescrição
        const { error: consultaError } = await supabase
          .from('consultas')
          .update({
            diagnostico: prontuario.diagnostico,
            prescricao: prontuario.prescricao,
            status: 'concluido'
          })
          .eq('id', consultaId);
        
        if (consultaError) throw consultaError;
      } else {
        console.log("Criando novo prontuário");
        // Criar novo prontuário
        const { error } = await supabase
          .from('prontuarios')
          .insert(prontuarioData);
        
        if (error) throw error;
        
        // Também atualizar a consulta com diagnóstico e prescrição
        const { error: consultaError } = await supabase
          .from('consultas')
          .update({
            diagnostico: prontuario.diagnostico,
            prescricao: prontuario.prescricao,
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

  // Determine if the user is a vet and can edit
  const canEdit = user?.tipo === 'vet' || user?.tipo === 'admin';
  const isReadOnly = !canEdit;

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
          isReadOnly={isReadOnly}
        />
      </div>
    </DashboardLayout>
  );
};

export default ProntuarioPage;
