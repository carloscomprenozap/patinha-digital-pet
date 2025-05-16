
import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";

interface HorariosDisponiveisProps {
  horarios: string[];
  horarioSelecionado: string;
  onSelectHorario: (horario: string) => void;
  isLoading?: boolean;
}

const HorariosDisponiveis: React.FC<HorariosDisponiveisProps> = ({
  horarios,
  horarioSelecionado,
  onSelectHorario,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (horarios.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Nenhum horário disponível nesta data.</p>
        <p className="text-sm text-muted-foreground">Por favor, selecione outra data.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="grid grid-cols-2 gap-2">
        {horarios.map((horario) => (
          <Button
            key={horario}
            variant={horarioSelecionado === horario ? "default" : "outline"}
            size="sm"
            className="justify-start"
            onClick={() => onSelectHorario(horario)}
          >
            <Clock className="mr-2 h-4 w-4" />
            {horario}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default HorariosDisponiveis;
