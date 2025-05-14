
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface Prontuario {
  id: string;
  consultaId: string;
  petId: string;
  anamnese: string;
  diagnostico: string;
  prescricao: string;
  observacoes: string;
}

interface ProntuarioFormProps {
  prontuario: Prontuario;
  handleInputChange: (field: keyof Omit<Prontuario, 'id' | 'consultaId' | 'petId'>, value: string) => void;
  handleSalvar: () => void;
}

const ProntuarioForm = ({ prontuario, handleInputChange, handleSalvar }: ProntuarioFormProps) => {
  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Anamnese</CardTitle>
          <CardDescription>
            Histórico e queixas do paciente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={prontuario.anamnese}
            onChange={(e) => handleInputChange('anamnese', e.target.value)}
            placeholder="Descreva os sintomas relatados pelo tutor e o histórico do paciente..."
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Diagnóstico</CardTitle>
          <CardDescription>
            Avaliação clínica e diagnóstico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={prontuario.diagnostico}
            onChange={(e) => handleInputChange('diagnostico', e.target.value)}
            placeholder="Descreva o diagnóstico realizado após exame clínico..."
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Prescrição</CardTitle>
          <CardDescription>
            Medicação e tratamento prescrito
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={prontuario.prescricao}
            onChange={(e) => handleInputChange('prescricao', e.target.value)}
            placeholder="Descreva a medicação e o tratamento prescrito..."
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Observações</CardTitle>
          <CardDescription>
            Notas adicionais e recomendações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={prontuario.observacoes}
            onChange={(e) => handleInputChange('observacoes', e.target.value)}
            placeholder="Registre observações adicionais e recomendações para o tutor..."
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleSalvar} className="min-w-[150px]">
          <Save className="mr-2 h-4 w-4" />
          Salvar Prontuário
        </Button>
      </div>
    </>
  );
};

export default ProntuarioForm;
