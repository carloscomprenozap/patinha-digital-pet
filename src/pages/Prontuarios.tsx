import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import ProntuarioSearchBar from "@/components/prontuarios/ProntuarioSearchBar";
import ProntuarioCard from "@/components/prontuarios/ProntuarioCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Prontuario } from "@/types";

interface ProntuarioWithNames extends Prontuario {
  petNome?: string;
  vetNome?: string;
}

const Prontuarios = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [prontuarios, setProntuarios] = useState<ProntuarioWithNames[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (user) {
      loadProntuarios();
    }
  }, [user]);
  
  const loadProntuarios = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      let query = supabase.from('prontuarios')
        .select(`
          *,
          pets:pet_id(nome),
          consultas:consulta_id(data, diagnostico),
          veterinarios:vet_id(profiles(nome))
        `);
      
      // Filtrar por tipo de usuário
      if (profile?.tipo === 'client') {
        // Para clientes, mostrar apenas prontuários dos seus pets
        const { data: clientPets } = await supabase
          .from('pets')
          .select('id')
          .eq('client_id', user.id);
        
        if (clientPets && clientPets.length > 0) {
          const petIds = clientPets.map(pet => pet.id);
          query = query.in('pet_id', petIds);
        } else {
          // Sem pets cadastrados
          setProntuarios([]);
          setIsLoading(false);
          return;
        }
      } else if (profile?.tipo === 'vet') {
        // Para veterinários, mostrar apenas seus prontuários
        query = query.eq('vet_id', user.id);
      }
      // Para admin, mostrar todos
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Formatar os dados
      const formattedProntuarios = data.map(item => ({
        id: item.id,
        petId: item.pet_id,
        consultaId: item.consulta_id,
        vetId: item.vet_id,
        anamnese: item.anamnese || "",
        data: item.consultas?.data,
        diagnostico: item.diagnostico || item.consultas?.diagnostico || "",
        prescricao: item.prescricao || "",
        observacoes: item.observacoes || "",
        petNome: item.pets?.nome,
        vetNome: item.veterinarios?.profiles?.nome
      }));
      
      setProntuarios(formattedProntuarios);
    } catch (error) {
      console.error("Erro ao carregar prontuários:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os prontuários",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredProntuarios = searchTerm 
    ? prontuarios.filter(p => {
        return (
          p.petNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.vetNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.diagnostico?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : prontuarios;
  
  const getPetNome = (petId: string) => {
    const prontuario = prontuarios.find(p => p.petId === petId);
    return prontuario?.petNome || 'Pet não encontrado';
  };
  
  const getVeterinarioNome = (vetId: string) => {
    const prontuario = prontuarios.find(p => p.vetId === vetId);
    return prontuario?.vetNome || 'Veterinário não encontrado';
  };
  
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };
  
  const handleVerProntuario = (prontuario: Prontuario) => {
    navigate(`/prontuario?consultaId=${prontuario.consultaId}&petId=${prontuario.petId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Prontuários</h1>
          <p className="text-muted-foreground">
            Histórico médico dos seus pets
          </p>
        </div>
        
        <ProntuarioSearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : filteredProntuarios.length > 0 ? (
          <div className="space-y-4">
            {filteredProntuarios.map((prontuario) => (
              <ProntuarioCard
                key={prontuario.id}
                prontuario={prontuario}
                getPetNome={getPetNome}
                getVeterinarioNome={getVeterinarioNome}
                formatarData={formatarData}
                handleVerProntuario={() => handleVerProntuario(prontuario)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">
              Nenhum prontuário encontrado
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSearchTerm("")}
            >
              Limpar busca
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Prontuarios;
