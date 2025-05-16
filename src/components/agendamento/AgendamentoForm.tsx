
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Pet, VeterinarioProfile } from '@/types';
import HorariosDisponiveis from './HorariosDisponiveis';
import VeterinariosList from './VeterinariossList';

const AgendamentoForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPetId = searchParams.get('petId');

  // States
  const [step, setStep] = useState(1);
  const [petSelecionado, setPetSelecionado] = useState<string>(preselectedPetId || '');
  const [pets, setPets] = useState<Pet[]>([]);
  const [veterinarios, setVeterinarios] = useState<VeterinarioProfile[]>([]);
  const [veterinarioSelecionado, setVeterinarioSelecionado] = useState<VeterinarioProfile | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<Date | undefined>(undefined);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [datasDisponiveis, setDatasDisponiveis] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingHorarios, setIsLoadingHorarios] = useState<boolean>(false);
  
  // Fetch user's pets
  useEffect(() => {
    if (user) {
      fetchPets();
      fetchVeterinarios();
    }
  }, [user]);
  
  // Fetch available dates when veterinarian is selected
  useEffect(() => {
    if (veterinarioSelecionado) {
      fetchAvailableDates(veterinarioSelecionado.id);
    } else {
      setDatasDisponiveis([]);
      setDataSelecionada(undefined);
    }
  }, [veterinarioSelecionado]);
  
  // Fetch available times when date is selected
  useEffect(() => {
    if (veterinarioSelecionado && dataSelecionada) {
      fetchAvailableTimes(veterinarioSelecionado.id, dataSelecionada);
    } else {
      setHorariosDisponiveis([]);
      setHorarioSelecionado('');
    }
  }, [veterinarioSelecionado, dataSelecionada]);
  
  const fetchPets = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('client_id', user.id);
        
      if (error) throw error;
      
      // Format pets data and validate especie field
      const formattedPets = data.map(pet => {
        // Validate and sanitize the especie field
        let validEspecie: 'cachorro' | 'gato' | 'ave' | 'roedor' | 'réptil' | 'outro' = 'outro';
        
        // Check if the especie is one of the allowed values
        if (['cachorro', 'gato', 'ave', 'roedor', 'réptil', 'outro'].includes(pet.especie.toLowerCase())) {
          validEspecie = pet.especie.toLowerCase() as 'cachorro' | 'gato' | 'ave' | 'roedor' | 'réptil' | 'outro';
        }
        
        return {
          id: pet.id,
          nome: pet.nome,
          especie: validEspecie,
          raca: pet.raca,
          idade: pet.idade,
          peso: pet.peso,
          observacoes: pet.observacoes,
          clientId: pet.client_id,
          client_id: pet.client_id,
          created_at: pet.created_at,
          updated_at: pet.updated_at
        } as Pet;
      });
      
      setPets(formattedPets);
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus pets",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchVeterinarios = async () => {
    setIsLoading(true);
    try {
      // Step 1: Get vet IDs from veterinarios table
      const { data: vetsData, error: vetsError } = await supabase
        .from('veterinarios')
        .select('id, crmv, preco_consulta');
      
      if (vetsError) throw vetsError;
      
      if (!vetsData || vetsData.length === 0) {
        setVeterinarios([]);
        return;
      }
      
      const vetIds = vetsData.map(v => v.id);
      
      // Step 2: Get vet profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, nome, telefone')
        .in('id', vetIds)
        .eq('tipo', 'vet');
      
      if (profilesError) throw profilesError;
      
      // Step 3: Get addresses
      const { data: addressesData, error: addressesError } = await supabase
        .from('enderecos')
        .select('*')
        .in('user_id', vetIds);
      
      if (addressesError) throw addressesError;
      
      // Create lookup maps
      const vetsMap = new Map(vetsData.map(v => [v.id, v]));
      const addressesMap = new Map(addressesData?.map(a => [a.user_id, a]) || []);
      
      // Combine data
      const formattedVeterinarios = profilesData?.map(profile => {
        const vetData = vetsMap.get(profile.id);
        const addressData = addressesMap.get(profile.id);
        
        return {
          id: profile.id,
          nome: profile.nome,
          email: '',
          telefone: profile.telefone || '',
          tipo: 'vet' as const,
          crmv: vetData?.crmv || '',
          preco_consulta: vetData?.preco_consulta || 0,
          endereco: addressData ? {
            cep: addressData.cep,
            estado: addressData.estado,
            cidade: addressData.cidade,
            bairro: addressData.bairro,
            logradouro: addressData.logradouro,
            numero: addressData.numero,
            complemento: addressData.complemento
          } : undefined
        };
      }) || [];
      
      setVeterinarios(formattedVeterinarios);
    } catch (error) {
      console.error("Erro ao buscar veterinários:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de veterinários",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchAvailableDates = async (vetId: string) => {
    setIsLoading(true);
    try {
      // Fetch vet availability
      const { data: disponibilidades, error } = await supabase
        .from('disponibilidades')
        .select('*')
        .eq('vet_id', vetId);
        
      if (error) throw error;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const availableDates: Date[] = [];
      
      // If no disponibilidades, use default (workdays 8-18)
      if (!disponibilidades || disponibilidades.length === 0) {
        // Default: workdays (1-5 = Monday to Friday)
        const workdays = [1, 2, 3, 4, 5];
        
        // Check next 30 days
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(today.getDate() + i);
          
          // Check if weekday is in workdays
          if (workdays.includes(date.getDay())) {
            availableDates.push(new Date(date));
          }
        }
      } else {
        // Use disponibilidades from database
        const disponibilidadeDias = disponibilidades.map(d => d.dia_semana);
        
        // Check next 30 days
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(today.getDate() + i);
          
          // Check if weekday is in disponibilidades
          if (disponibilidadeDias.includes(date.getDay())) {
            availableDates.push(new Date(date));
          }
        }
      }
      
      setDatasDisponiveis(availableDates);
    } catch (error) {
      console.error("Erro ao buscar datas disponíveis:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as datas disponíveis",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchAvailableTimes = async (vetId: string, date: Date) => {
    setIsLoadingHorarios(true);
    try {
      const diaSemana = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dataFormatada = format(date, 'yyyy-MM-dd');
      
      // Get vet disponibilidades for this weekday
      const { data: disponibilidades, error: dispError } = await supabase
        .from('disponibilidades')
        .select('*')
        .eq('vet_id', vetId)
        .eq('dia_semana', diaSemana);
        
      if (dispError) throw dispError;
      
      // Generate available time slots
      let horariosDisp: string[] = [];
      
      if (!disponibilidades || disponibilidades.length === 0) {
        // Default time slots: 8:00 to 18:00, every 30 minutes
        for (let hora = 8; hora < 18; hora++) {
          horariosDisp.push(`${hora.toString().padStart(2, '0')}:00`);
          horariosDisp.push(`${hora.toString().padStart(2, '0')}:30`);
        }
      } else {
        // Use disponibilidades from database
        disponibilidades.forEach(disp => {
          const [horaInicio, minutoInicio] = disp.hora_inicio.split(':').map(Number);
          const [horaFim, minutoFim] = disp.hora_fim.split(':').map(Number);
          
          // Convert to minutes since midnight
          const inicioMinutos = horaInicio * 60 + minutoInicio;
          const fimMinutos = horaFim * 60 + minutoFim;
          
          // Generate time slots every 30 minutes
          for (let minutos = inicioMinutos; minutos < fimMinutos; minutos += 30) {
            const hora = Math.floor(minutos / 60);
            const minuto = minutos % 60;
            horariosDisp.push(`${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`);
          }
        });
      }
      
      // Get already booked appointments for this date
      const { data: consultasAgendadas, error: consError } = await supabase
        .from('consultas')
        .select('horario')
        .eq('vet_id', vetId)
        .eq('data', dataFormatada)
        .in('status', ['agendado', 'confirmado']);
        
      if (consError) throw consError;
      
      // Filter out booked slots
      if (consultasAgendadas && consultasAgendadas.length > 0) {
        const horariosAgendados = new Set(consultasAgendadas.map(c => c.horario));
        horariosDisp = horariosDisp.filter(h => !horariosAgendados.has(h));
      }
      
      // Sort times
      horariosDisp.sort();
      
      setHorariosDisponiveis(horariosDisp);
    } catch (error) {
      console.error("Erro ao buscar horários disponíveis:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os horários disponíveis",
        variant: "destructive",
      });
    } finally {
      setIsLoadingHorarios(false);
    }
  };
  
  const handleSubmit = async () => {
    if (!user || !petSelecionado || !veterinarioSelecionado || !dataSelecionada || !horarioSelecionado) {
      toast({
        title: "Preencha todos os campos",
        description: "Todos os campos são obrigatórios para agendar uma consulta",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const dataFormatada = format(dataSelecionada, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('consultas')
        .insert({
          client_id: user.id,
          pet_id: petSelecionado,
          vet_id: veterinarioSelecionado.id,
          data: dataFormatada,
          horario: horarioSelecionado,
          status: 'agendado',
          observacoes: observacoes.trim() || null
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Consulta agendada com sucesso",
        description: `Sua consulta foi agendada para ${format(dataSelecionada, 'dd/MM/yyyy')} às ${horarioSelecionado}`,
      });
      
      navigate('/minhas-consultas');
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
      toast({
        title: "Erro",
        description: "Não foi possível agendar a consulta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const stepContent = () => {
    switch (step) {
      case 1: // Select pet and veterinarian
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Selecione o pet</h3>
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <Select 
                  value={petSelecionado} 
                  onValueChange={setPetSelecionado}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.nome} ({pet.especie})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Selecione o veterinário</h3>
              <VeterinariosList 
                veterinarios={veterinarios}
                veterinarioSelecionado={veterinarioSelecionado}
                onSelectVeterinario={setVeterinarioSelecionado}
                isLoading={isLoading}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                onClick={() => navigate('/meus-pets')}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button 
                onClick={() => setStep(2)}
                disabled={!petSelecionado || !veterinarioSelecionado}
              >
                Continuar
              </Button>
            </div>
          </div>
        );
        
      case 2: // Select date and time
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Selecione uma data</h3>
                <Card>
                  <CardContent className="p-2">
                    <Calendar
                      mode="single"
                      selected={dataSelecionada}
                      onSelect={setDataSelecionada}
                      disabled={(date) => {
                        // Disable dates that aren't in datasDisponiveis
                        return !datasDisponiveis.some(d => 
                          d.getDate() === date.getDate() && 
                          d.getMonth() === date.getMonth() && 
                          d.getFullYear() === date.getFullYear()
                        );
                      }}
                      locale={ptBR}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Selecione um horário</h3>
                <Card>
                  <CardContent className="p-4">
                    {dataSelecionada ? (
                      <HorariosDisponiveis 
                        horarios={horariosDisponiveis}
                        horarioSelecionado={horarioSelecionado}
                        onSelectHorario={setHorarioSelecionado}
                        isLoading={isLoadingHorarios}
                      />
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">
                          Selecione uma data para ver os horários disponíveis
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Observações (opcional)</h3>
              <Textarea
                placeholder="Descreva brevemente o motivo da consulta ou sintomas observados"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex justify-between">
              <Button 
                onClick={() => setStep(1)}
                variant="outline"
              >
                Voltar
              </Button>
              <Button 
                onClick={() => setStep(3)}
                disabled={!dataSelecionada || !horarioSelecionado}
              >
                Continuar
              </Button>
            </div>
          </div>
        );
        
      case 3: // Confirmation
        const selectedPet = pets.find(p => p.id === petSelecionado);
        return (
          <div className="space-y-6">
            <div className="rounded-lg border p-4 bg-muted/30">
              <h3 className="text-lg font-medium mb-4">Confirme sua consulta</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Pet</p>
                    <p className="font-medium">{selectedPet?.nome}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Veterinário</p>
                    <p className="font-medium">{veterinarioSelecionado?.nome}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">
                      {dataSelecionada && format(dataSelecionada, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Horário</p>
                    <p className="font-medium">{horarioSelecionado}</p>
                  </div>
                </div>
                
                {observacoes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Observações</p>
                    <p className="text-sm">{observacoes}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-muted-foreground">Valor da consulta</p>
                  <p className="text-lg font-medium text-primary">
                    R$ {veterinarioSelecionado?.preco_consulta?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                onClick={() => setStep(2)}
                variant="outline"
              >
                Voltar
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Agendando...' : 'Confirmar Agendamento'}
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agendamento de Consulta</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Steps indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center w-full max-w-md mx-auto">
            <div className={`flex items-center justify-center rounded-full w-10 h-10 ${
              step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 ${
              step > 1 ? 'bg-primary' : 'bg-muted'
            }`}></div>
            <div className={`flex items-center justify-center rounded-full w-10 h-10 ${
              step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              2
            </div>
            <div className={`flex-1 h-1 ${
              step > 2 ? 'bg-primary' : 'bg-muted'
            }`}></div>
            <div className={`flex items-center justify-center rounded-full w-10 h-10 ${
              step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              3
            </div>
          </div>
        </div>
        
        {stepContent()}
      </CardContent>
    </Card>
  );
};

export default AgendamentoForm;
