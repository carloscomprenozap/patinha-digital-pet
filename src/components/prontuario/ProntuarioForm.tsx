
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProntuarioFormProps {
  prontuario: {
    anamnese: string;
    diagnostico: string;
    prescricao: string;
    observacoes: string;
  };
  handleInputChange: (field: string, value: string) => void;
  handleSalvar: () => void;
  isLoading?: boolean;
}

const ProntuarioForm = ({ prontuario, handleInputChange, handleSalvar, isLoading = false }: ProntuarioFormProps) => {
  return (
    <Card className="p-6 mt-6">
      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold">Anamnese</Label>
          <Textarea 
            className="mt-2"
            placeholder="Histórico médico e descrição dos sintomas"
            value={prontuario.anamnese}
            onChange={(e) => handleInputChange('anamnese', e.target.value)}
            rows={4}
          />
        </div>
        
        <div>
          <Label className="text-base font-semibold">Diagnóstico</Label>
          <Textarea 
            className="mt-2"
            placeholder="Diagnóstico do paciente"
            value={prontuario.diagnostico}
            onChange={(e) => handleInputChange('diagnostico', e.target.value)}
            rows={3}
          />
        </div>
        
        <div>
          <Label className="text-base font-semibold">Prescrição</Label>
          <Textarea 
            className="mt-2"
            placeholder="Medicamentos prescritos"
            value={prontuario.prescricao}
            onChange={(e) => handleInputChange('prescricao', e.target.value)}
            rows={3}
          />
        </div>
        
        <div>
          <Label className="text-base font-semibold">Observações</Label>
          <Textarea 
            className="mt-2"
            placeholder="Observações adicionais"
            value={prontuario.observacoes}
            onChange={(e) => handleInputChange('observacoes', e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSalvar}
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar Prontuário"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProntuarioForm;
