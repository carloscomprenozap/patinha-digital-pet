
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, Clock } from "lucide-react";

interface ProntuarioInfoProps {
  petInfo: any;
  consultaInfo: any;
  formatarData: (dataString: string) => string;
}

const ProntuarioInfo = ({ petInfo, consultaInfo, formatarData }: ProntuarioInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <User className="mr-2 h-4 w-4" />
            Informações do Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-muted-foreground">Nome</dt>
              <dd className="font-medium">{petInfo.nome}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Espécie</dt>
              <dd>{petInfo.especie}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Raça</dt>
              <dd>{petInfo.raca}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Idade</dt>
              <dd>{petInfo.idade} anos</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Peso</dt>
              <dd>{petInfo.peso} kg</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <Calendar className="mr-2 h-4 w-4" />
            Informações da Consulta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-muted-foreground">Data</dt>
              <dd className="font-medium">{formatarData(consultaInfo.data)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Horário</dt>
              <dd>{consultaInfo.horario}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd>
                <span 
                  className={`inline-block px-2 py-1 text-xs rounded-full
                  ${consultaInfo.status === 'agendado' ? 'bg-vetblue-100 text-vetblue-600' :
                    consultaInfo.status === 'confirmado' ? 'bg-vetcare-100 text-vetcare-600' :
                    consultaInfo.status === 'concluido' ? 'bg-green-100 text-green-600' :
                    'bg-red-100 text-red-600'
                  }`}
                >
                  {consultaInfo.status.charAt(0).toUpperCase() + consultaInfo.status.slice(1)}
                </span>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <Clock className="mr-2 h-4 w-4" />
            Histórico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {petInfo.observacoes || 'Sem observações anteriores.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProntuarioInfo;
