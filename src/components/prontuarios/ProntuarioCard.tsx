
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Stethoscope, Calendar, FileText } from "lucide-react";

interface ProntuarioProps {
  prontuario: {
    id: string;
    petId: string;
    vetId: string;
    diagnostico: string;
    data?: string;
  };
  getPetNome: (petId: string) => string;
  getVeterinarioNome: (vetId: string) => string;
  formatarData: (data: string) => string;
  handleVerProntuario: (id: string) => void;
}

const ProntuarioCard = ({
  prontuario,
  getPetNome,
  getVeterinarioNome,
  formatarData,
  handleVerProntuario
}: ProntuarioProps) => {
  return (
    <Card>
      <CardHeader className="bg-secondary/10 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">
              {getPetNome(prontuario.petId)}
            </h3>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              {prontuario.data ? formatarData(prontuario.data) : "Data não disponível"}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end">
              <Stethoscope className="h-4 w-4 mr-1" />
              <span>{getVeterinarioNome(prontuario.vetId)}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div>
          <h4 className="text-sm font-semibold">Diagnóstico:</h4>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {prontuario.diagnostico || "Não informado"}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center"
          onClick={() => handleVerProntuario(prontuario.id)}
        >
          <FileText className="h-4 w-4 mr-1" />
          Ver prontuário
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProntuarioCard;
