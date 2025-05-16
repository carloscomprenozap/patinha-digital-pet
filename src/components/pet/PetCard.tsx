
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dog, Cat, Bird, FileText, Pencil } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface PetCardProps {
  pet: {
    id: string;
    nome: string;
    especie: string;
    raca: string;
    idade: number;
    peso: number;
    observacoes?: string;
  };
  onEdit?: () => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onEdit }) => {
  const navigate = useNavigate();
  
  const getPetIcon = () => {
    switch (pet.especie.toLowerCase()) {
      case 'cachorro':
        return <Dog className="h-5 w-5" />;
      case 'gato':
        return <Cat className="h-5 w-5" />;
      case 'ave':
        return <Bird className="h-5 w-5" />;
      default:
        return <Dog className="h-5 w-5" />;
    }
  };
  
  const handleProntuarioClick = () => {
    navigate(`/prontuarios?petId=${pet.id}`);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <div className="bg-primary/10 p-2 rounded-full">
            {getPetIcon()}
          </div>
          <CardTitle className="text-xl">{pet.nome}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="grid grid-cols-2">
            <span className="text-sm font-medium">Espécie:</span>
            <span className="text-sm">{pet.especie}</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="text-sm font-medium">Raça:</span>
            <span className="text-sm">{pet.raca}</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="text-sm font-medium">Idade:</span>
            <span className="text-sm">{pet.idade} {pet.idade === 1 ? 'ano' : 'anos'}</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="text-sm font-medium">Peso:</span>
            <span className="text-sm">{pet.peso} kg</span>
          </div>
        </div>
        
        {pet.observacoes && (
          <div className="mt-3">
            <span className="text-sm font-medium">Observações:</span>
            <p className="text-sm text-muted-foreground mt-1">{pet.observacoes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex gap-2">
        {onEdit && (
          <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleProntuarioClick}
        >
          <FileText className="h-4 w-4 mr-2" />
          Prontuário
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PetCard;
