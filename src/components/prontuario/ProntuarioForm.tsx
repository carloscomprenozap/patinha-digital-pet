
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Prontuario {
  id: string;
  consultaId: string;
  petId: string;
  vetId: string;
  anamnese: string;
  diagnostico: string;
  prescricao: string;
  observacoes: string;
}

interface ProntuarioFormProps {
  prontuario: Prontuario;
  handleInputChange: (field: string, value: string) => void;
  handleSalvar: () => void;
  isLoading: boolean;
  isReadOnly?: boolean;
}

const ProntuarioForm: React.FC<ProntuarioFormProps> = ({ 
  prontuario, 
  handleInputChange, 
  handleSalvar, 
  isLoading,
  isReadOnly = false
}) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Informações do Prontuário</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="anamnese">Anamnese</Label>
          <Textarea
            id="anamnese"
            rows={4}
            placeholder="Histórico do paciente e queixa principal"
            value={prontuario.anamnese}
            onChange={(e) => handleInputChange('anamnese', e.target.value)}
            readOnly={isReadOnly}
            className={isReadOnly ? 'bg-muted cursor-not-allowed' : ''}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="diagnostico">Diagnóstico</Label>
          <Textarea
            id="diagnostico"
            rows={3}
            placeholder="Diagnóstico após avaliação"
            value={prontuario.diagnostico}
            onChange={(e) => handleInputChange('diagnostico', e.target.value)}
            readOnly={isReadOnly}
            className={isReadOnly ? 'bg-muted cursor-not-allowed' : ''}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="prescricao">Prescrição</Label>
          <Textarea
            id="prescricao"
            rows={4}
            placeholder="Medicamentos, dosagens e recomendações"
            value={prontuario.prescricao}
            onChange={(e) => handleInputChange('prescricao', e.target.value)}
            readOnly={isReadOnly}
            className={isReadOnly ? 'bg-muted cursor-not-allowed' : ''}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            rows={3}
            placeholder="Observações adicionais"
            value={prontuario.observacoes}
            onChange={(e) => handleInputChange('observacoes', e.target.value)}
            readOnly={isReadOnly}
            className={isReadOnly ? 'bg-muted cursor-not-allowed' : ''}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {!isReadOnly && (
          <Button 
            onClick={handleSalvar}
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar Prontuário"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProntuarioForm;
