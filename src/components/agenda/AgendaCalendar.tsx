
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";

interface AgendaCalendarProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  diasComAgendamento: Date[];
}

const AgendaCalendar = ({ selectedDate, setSelectedDate, diasComAgendamento }: AgendaCalendarProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendário</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={ptBR}
          className="border rounded-md"
          modifiers={{
            booked: diasComAgendamento,
          }}
          modifiersStyles={{
            booked: { 
              fontWeight: 'bold',
              borderBottom: '2px solid currentColor',
              color: 'var(--vetcare-600)'
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

export default AgendaCalendar;
