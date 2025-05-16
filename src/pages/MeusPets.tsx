
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Pet } from "@/types";
import PetCard from "@/components/pet/PetCard";
import { useNavigate } from "react-router-dom";

const MeusPets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPets();
    }
  }, [user]);

  const fetchPets = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Format pets data and validate especie field
      const formattedPets = data.map(pet => {
        // Validate and sanitize the especie field
        let validEspecie: 'cachorro' | 'gato' | 'ave' | 'roedor' | 'réptil' | 'outro' = 'outro';
        
        // Check if the especie is one of the allowed values
        if (['cachorro', 'gato', 'ave', 'roedor', 'réptil', 'outro'].includes(pet.especie.toLowerCase())) {
          validEspecie = pet.especie.toLowerCase() as 'cachorro' | 'gato' | 'ave' | 'roedor' | 'réptil' | 'outro';
        }
        
        return {
          id: pet.id,
          nome: pet.nome,
          especie: validEspecie,
          raca: pet.raca,
          idade: pet.idade,
          peso: pet.peso,
          observacoes: pet.observacoes,
          clientId: pet.client_id,
          client_id: pet.client_id,
          created_at: pet.created_at,
          updated_at: pet.updated_at
        } as Pet;
      });
      
      setPets(formattedPets);
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus pets",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNovoPet = () => {
    navigate('/cadastrar-pet');
  };

  const handleEditPet = (petId: string) => {
    navigate(`/editar-pet/${petId}`);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Meus Pets</h1>
          <Button onClick={handleNovoPet}>
            <Plus className="mr-2 h-4 w-4" />
            Cadastrar Novo Pet
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium">Você ainda não tem pets cadastrados</h3>
            <p className="text-muted-foreground mt-2">Cadastre seu primeiro pet para agendar consultas</p>
            <Button className="mt-4" onClick={handleNovoPet}>
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar Novo Pet
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard 
                key={pet.id} 
                pet={pet} 
                onEdit={() => handleEditPet(pet.id)} 
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MeusPets;
