
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, User } from "lucide-react";
import { Address, VeterinarioProfile } from "@/types";

interface VeterinariosListProps {
  veterinarios: VeterinarioProfile[];
  veterinarioSelecionado: VeterinarioProfile | null;
  onSelectVeterinario: (veterinario: VeterinarioProfile) => void;
  isLoading?: boolean;
}

const VeterinariosList: React.FC<VeterinariosListProps> = ({
  veterinarios,
  veterinarioSelecionado,
  onSelectVeterinario,
  isLoading = false
}) => {
  // Helper function to format address
  const formatEndereco = (endereco?: Address) => {
    if (!endereco) return 'Endereço não disponível';
    return `${endereco.logradouro}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade}-${endereco.estado}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (veterinarios.length === 0) {
    return (
      <div className="text-center py-6 border border-dashed rounded-lg">
        <p className="text-muted-foreground mb-2">Nenhum veterinário encontrado.</p>
        <p className="text-sm text-muted-foreground">Tente ajustar os filtros da busca.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {veterinarios.map((veterinario) => (
        <Card 
          key={veterinario.id} 
          className={`transition-all ${veterinarioSelecionado?.id === veterinario.id ? 'ring-2 ring-primary' : ''}`}
        >
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">{veterinario.nome}</h3>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <p className="text-sm text-muted-foreground">
                    {formatEndereco(veterinario.endereco)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">CRMV: {veterinario.crmv}</Badge>
                  <Badge className="bg-primary/10 text-primary">
                    R$ {veterinario.preco_consulta?.toFixed(2)}
                  </Badge>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => onSelectVeterinario(veterinario)}
                  variant={veterinarioSelecionado?.id === veterinario.id ? "default" : "outline"}
                >
                  {veterinarioSelecionado?.id === veterinario.id ? 'Selecionado' : 'Selecionar'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VeterinariosList;
