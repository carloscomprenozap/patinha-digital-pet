
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface ProntuarioCardProps {
  prontuario: any;
  getPetNome: (petId: string) => string;
  getVeterinarioNome: (vetId: string) => string;
  formatarData: (dataString: string) => string;
  handleVerProntuario: (prontuarioId: string) => void;
}

const ProntuarioCard = ({
  prontuario,
  getPetNome,
  getVeterinarioNome,
  formatarData,
  handleVerProntuario
}: ProntuarioCardProps) => {
  return (
    <Card key={prontuario.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>{getPetNome(prontuario.petId)}</span>
              <Badge variant="outline" className="ml-2">
                {formatarData(prontuario.data)}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1">
              Dr. {getVeterinarioNome(prontuario.vetId)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <div className="font-semibold mb-1">Diagnóstico</div>
          <p className="text-muted-foreground">{prontuario.diagnostico}</p>
        </div>
        
        <Button 
          className="w-full flex items-center justify-center gap-2"
          onClick={() => handleVerProntuario(prontuario.id)}
        >
          <FileText className="h-4 w-4" />
          Ver Prontuário Completo
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProntuarioCard;
