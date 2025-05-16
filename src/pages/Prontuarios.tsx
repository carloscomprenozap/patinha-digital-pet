
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Search, FileText } from "lucide-react";
import ProntuarioCard from "@/components/prontuarios/ProntuarioCard";

interface ProntuarioData {
  id: string;
  petId: string;
  vetId: string;
  consultaId: string;
  diagnostico: string;
  data?: string;
}

interface Pet {
  id: string;
  nome: string;
}

const Prontuarios = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const petId = searchParams.get('petId');
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [prontuarios, setProntuarios] = useState<ProntuarioData[]>([]);
  const [pets, setPets] = useState<{ [key: string]: string }>({});
  const [veterinarios, setVeterinarios] = useState<{ [key: string]: string }>({});
  const [selectedPet, setSelectedPet] = useState<string | null>(petId);
  const [userPets, setUserPets] = useState<Pet[]>([]);
  
  useEffect(() => {
    if (user) {
      carregarProntuarios();
      
      // Se for um cliente, carregar seus pets
      if (user.tipo === 'client') {
        carregarPetsUsuario();
      }
    }
  }, [user, selectedPet]);
  
  const carregarPetsUsuario = async () => {
    if (!user || user.tipo !== 'client') return;
    
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('id, nome')
        .eq('client_id', user.id);
        
      if (error) throw error;
      
      setUserPets(data || []);
    } catch (error) {
      console.error("Erro ao carregar pets do usuário:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus pets",
        variant: "destructive",
      });
    }
  };
  
  const carregarProntuarios = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log("Carregando prontuários...");
      
      let query = supabase
        .from('prontuarios')
        .select(`
          id, pet_id, vet_id, consulta_id, diagnostico,
          consultas:consulta_id (data)
        `);
      
      // Filtrar por tipo de usuário
      if (user.tipo === 'client') {
        // Para clientes, mostrar apenas prontuários dos seus pets
        const { data: petIds, error: petError } = await supabase
          .from('pets')
          .select('id')
          .eq('client_id', user.id);
          
        if (petError) throw petError;
        
        if (petIds && petIds.length > 0) {
          const ids = petIds.map(pet => pet.id);
          query = query.in('pet_id', ids);
        } else {
          // Cliente sem pets cadastrados
          setProntuarios([]);
          setIsLoading(false);
          return;
        }
        
        // Se tiver um pet selecionado, filtrar por ele
        if (selectedPet) {
          query = query.eq('pet_id', selectedPet);
        }
      } else if (user.tipo === 'vet') {
        // Para veterinários, mostrar apenas prontuários criados por eles
        query = query.eq('vet_id', user.id);
      }
      // Admin pode ver todos
      
      // Ordenar por data mais recente
      query = query.order('id', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      console.log("Prontuários encontrados:", data);
      
      // Mapear prontuários
      const prontuariosFormatados = data?.map(item => ({
        id: item.id,
        petId: item.pet_id,
        vetId: item.vet_id,
        consultaId: item.consulta_id,
        diagnostico: item.diagnostico || 'Sem diagnóstico registrado',
        data: item.consultas?.data
      })) || [];
      
      setProntuarios(prontuariosFormatados);
      
      // Buscar informações de pets e veterinários
      await carregarInfoPets(prontuariosFormatados);
      await carregarInfoVeterinarios(prontuariosFormatados);
      
    } catch (error) {
      console.error("Erro ao carregar prontuários:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os prontuários",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const carregarInfoPets = async (prontuarios: ProntuarioData[]) => {
    // Extrair IDs únicos de pets
    const petIds = [...new Set(prontuarios.map(p => p.petId))];
    
    if (petIds.length === 0) return;
    
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('id, nome')
        .in('id', petIds);
        
      if (error) throw error;
      
      // Criar mapa de pet_id -> nome
      const petsMap: { [key: string]: string } = {};
      data?.forEach(pet => {
        petsMap[pet.id] = pet.nome;
      });
      
      setPets(petsMap);
    } catch (error) {
      console.error("Erro ao carregar informações de pets:", error);
    }
  };
  
  const carregarInfoVeterinarios = async (prontuarios: ProntuarioData[]) => {
    // Extrair IDs únicos de veterinários
    const vetIds = [...new Set(prontuarios.map(p => p.vetId))];
    
    if (vetIds.length === 0) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome')
        .in('id', vetIds);
        
      if (error) throw error;
      
      // Criar mapa de vet_id -> nome
      const vetsMap: { [key: string]: string } = {};
      data?.forEach(vet => {
        vetsMap[vet.id] = vet.nome;
      });
      
      setVeterinarios(vetsMap);
    } catch (error) {
      console.error("Erro ao carregar informações de veterinários:", error);
    }
  };
  
  const getPetNome = (petId: string) => {
    return pets[petId] || 'Pet não encontrado';
  };
  
  const getVeterinarioNome = (vetId: string) => {
    return veterinarios[vetId] || 'Veterinário não encontrado';
  };
  
  const formatarData = (data?: string) => {
    if (!data) return 'Data não disponível';
    return new Date(data).toLocaleDateString('pt-BR');
  };
  
  const handleVerProntuario = (id: string, petId: string, consultaId: string) => {
    navigate(`/prontuario?petId=${petId}&consultaId=${consultaId}`);
  };
  
  const filteredProntuarios = prontuarios.filter(prontuario => {
    if (!searchTerm) return true;
    
    const petNome = getPetNome(prontuario.petId).toLowerCase();
    const vetNome = getVeterinarioNome(prontuario.vetId).toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    
    return petNome.includes(searchTermLower) || 
           vetNome.includes(searchTermLower) ||
           prontuario.diagnostico.toLowerCase().includes(searchTermLower);
  });
  
  const handlePetChange = (petId: string | null) => {
    setSelectedPet(petId);
    // Atualizar a URL
    if (petId) {
      navigate(`/prontuarios?petId=${petId}`);
    } else {
      navigate('/prontuarios');
    }
  };
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          {selectedPet && (
            <Button 
              variant="outline" 
              size="icon" 
              className="mr-4"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-3xl font-bold">
            {selectedPet 
              ? `Prontuários de ${pets[selectedPet] || 'Pet'}`
              : 'Prontuários'}
          </h1>
        </div>
        
        {user?.tipo === 'client' && userPets.length > 0 && !selectedPet && (
          <div className="mb-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userPets.map(pet => (
                <Card 
                  key={pet.id}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => handlePetChange(pet.id)}
                >
                  <CardContent className="p-4 flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-primary" />
                    <span>{pet.nome}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* Campo de pesquisa */}
        {(selectedPet || user?.tipo !== 'client') && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Pesquisar prontuários..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : filteredProntuarios.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              {selectedPet 
                ? "Este pet ainda não possui prontuários registrados" 
                : "Nenhum prontuário encontrado"}
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchTerm("")}
              >
                Limpar pesquisa
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProntuarios.map(prontuario => (
              <ProntuarioCard
                key={prontuario.id}
                prontuario={prontuario}
                getPetNome={getPetNome}
                getVeterinarioNome={getVeterinarioNome}
                formatarData={formatarData}
                handleVerProntuario={handleVerProntuario}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Prontuarios;
