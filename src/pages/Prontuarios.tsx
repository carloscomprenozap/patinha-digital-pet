
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, FileText } from "lucide-react";
import { petsMock, agendamentosMock, veterinariosMock } from "@/data/mockData";

interface Prontuario {
  id: string;
  petId: string;
  consultaId: string;
  vetId: string;
  data: string;
  diagnostico: string;
  prescricao: string;
  observacoes: string;
}

const Prontuarios = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data for user and pets
  const userId = "u1"; // Mock user ID
  const userPets = petsMock.filter(pet => pet.clientId === userId);
  
  // Create mock prontuarios based on past appointments
  const consultasConcluidas = agendamentosMock.filter(
    a => a.clientId === userId && a.status === 'concluido'
  );
  
  const prontuarios: Prontuario[] = consultasConcluidas.map(consulta => ({
    id: `pr-${consulta.id}`,
    petId: consulta.petId,
    consultaId: consulta.id,
    vetId: consulta.vetId,
    data: consulta.data,
    diagnostico: "Diagnóstico do paciente",
    prescricao: "Prescrição de medicamentos",
    observacoes: "Observações clínicas"
  }));
  
  const filteredProntuarios = searchTerm 
    ? prontuarios.filter(p => {
        const pet = petsMock.find(pet => pet.id === p.petId);
        const vet = veterinariosMock.find(vet => vet.id === p.vetId);
        
        return (
          pet?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vet?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.diagnostico.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : prontuarios;
  
  const getPetNome = (petId: string) => {
    const pet = petsMock.find(p => p.id === petId);
    return pet ? pet.nome : 'Pet não encontrado';
  };
  
  const getVeterinarioNome = (vetId: string) => {
    const vet = veterinariosMock.find(v => v.id === vetId);
    return vet ? vet.nome : 'Veterinário não encontrado';
  };
  
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };
  
  const handleVerProntuario = (prontuarioId: string) => {
    navigate(`/prontuario?id=${prontuarioId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Prontuários</h1>
          <p className="text-muted-foreground">
            Histórico médico dos seus pets
          </p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Buscar prontuários por pet, veterinário ou diagnóstico..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {filteredProntuarios.length > 0 ? (
          <div className="space-y-4">
            {filteredProntuarios.map((prontuario) => (
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
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">
              Nenhum prontuário encontrado
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSearchTerm("")}
            >
              Limpar busca
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Prontuarios;
