
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Stethoscope, Scale, Dog, Cat } from "lucide-react";

interface PetInfo {
  id: string;
  nome: string;
  especie: string;
  raca: string;
  idade: number;
  peso: number;
  observacoes?: string;
}

interface ConsultaInfo {
  id: string;
  data: string;
  horario: string;
  status: string;
  observacoes?: string;
  profiles: {
    nome: string;
    telefone?: string;
  }
}

interface ProntuarioInfoProps {
  petInfo: PetInfo;
  consultaInfo: ConsultaInfo;
  formatarData: (data: string) => string;
}

const ProntuarioInfo: React.FC<ProntuarioInfoProps> = ({
  petInfo,
  consultaInfo,
  formatarData
}) => {
  const getPetIcon = () => {
    switch (petInfo.especie.toLowerCase()) {
      case 'cachorro':
        return <Dog className="h-4 w-4 mr-2" />;
      case 'gato':
        return <Cat className="h-4 w-4 mr-2" />;
      default:
        return <Dog className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            {getPetIcon()}
            <span>Informações do Pet</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Nome:</span>
            <span>{petInfo.nome}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Espécie:</span>
            <span>{petInfo.especie}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Raça:</span>
            <span>{petInfo.raca}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Idade:</span>
            <span>{petInfo.idade} {petInfo.idade === 1 ? 'ano' : 'anos'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Peso:</span>
            <div className="flex items-center">
              <Scale className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{petInfo.peso} kg</span>
            </div>
          </div>
          
          {petInfo.observacoes && (
            <div>
              <span className="font-medium">Observações:</span>
              <p className="text-sm text-muted-foreground mt-1">{petInfo.observacoes}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Informações da Consulta</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Data:</span>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{formatarData(consultaInfo.data)}</span>
            </div>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Horário:</span>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{consultaInfo.horario}</span>
            </div>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <Badge variant={consultaInfo.status === 'concluido' ? "default" : "outline"}>
              {consultaInfo.status === 'concluido' ? 'Concluído' : 'Pendente'}
            </Badge>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Veterinário:</span>
            <div className="flex items-center">
              <Stethoscope className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{consultaInfo.profiles?.nome || 'Não informado'}</span>
            </div>
          </div>
          
          {consultaInfo.observacoes && (
            <div>
              <span className="font-medium">Observações:</span>
              <p className="text-sm text-muted-foreground mt-1">{consultaInfo.observacoes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProntuarioInfo;
