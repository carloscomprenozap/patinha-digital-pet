import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Veterinarian, Address, HorarioDisponivel, Pet, VeterinarioProfile } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon, MapPin, User, Clock, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const estadosBrasileiros = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const AgendarConsulta = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [filtros, setFiltros] = useState({
    estado: "",
    cidade: "",
    bairro: ""
  });
  const [veterinariosFiltrados, setVeterinariosFiltrados] = useState<VeterinarioProfile[]>([]);
  const [veterinarioSelecionado, setVeterinarioSelecionado] = useState<VeterinarioProfile | null>(null);
  const [petSelecionado, setPetSelecionado] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState<Date | undefined>(undefined);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [datasDisponiveis, setDatasDisponiveis] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [petsMeusTutores, setPetsMeusTutores] = useState<Pet[]>([]);

  // Carregar pets do usuário logado
  useEffect(() => {
    if (user) {
      carregarPets();
    }
  }, [user]);

  const carregarPets = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('client_id', user.id);
        
      if (error) throw error;
      
      // Mapeando os dados para o formato esperado pela interface Pet
      const petsFormatados = data?.map(pet => ({
        id: pet.id,
        nome: pet.nome,
        especie: pet.especie as 'cachorro' | 'gato' | 'ave' | 'roedor' | 'réptil' | 'outro',
        raca: pet.raca,
        idade: pet.idade,
        peso: pet.peso,
        observacoes: pet.observacoes || undefined,
        clientId: pet.client_id,
        client_id: pet.client_id,
        created_at: pet.created_at,
        updated_at: pet.updated_at
      })) || [];
      
      setPetsMeusTutores(petsFormatados);
    } catch (error) {
      console.error("Erro ao carregar pets:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus pets",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtra veterinários baseado nos filtros
  const filtrarVeterinarios = async () => {
    setIsLoading(true);
    
    try {
      // Buscar veterinários do banco
      let query = supabase
        .from('veterinarios')
        .select(`
          *,
          profiles:id(nome, telefone, tipo),
          enderecos:id(cep, estado, cidade, bairro, logradouro, numero, complemento)
        `);
        
      // Aplicar filtros
      const { data: veterinariosData, error } = await query;
      
      if (error) throw error;
      
      // Buscar endereços dos veterinários
      const vetIds = veterinariosData.map(vet => vet.id);
      
      const { data: enderecosData, error: enderecosError } = await supabase
        .from('enderecos')
        .select('*')
        .in('user_id', vetIds);
        
      if (enderecosError) throw enderecosError;
      
      // Mapear dados para o formato correto
      const veterinarios = veterinariosData.map(vet => {
        const endereco = enderecosData?.find(e => e.user_id === vet.id);
        
        return {
          id: vet.id,
          nome: vet.profiles?.nome || 'Sem nome',
          email: '',
          telefone: vet.profiles?.telefone || '',
          tipo: 'vet' as const,
          crmv: vet.crmv || '',
          preco_consulta: vet.preco_consulta || 0,
          endereco: endereco ? {
            cep: endereco.cep,
            estado: endereco.estado,
            cidade: endereco.cidade,
            bairro: endereco.bairro,
            logradouro: endereco.logradouro,
            numero: endereco.numero,
            complemento: endereco.complemento
          } : undefined
        };
      });
      
      // Aplicar filtros localmente
      const resultado = veterinarios.filter((vet) => {
        if (!vet.endereco) return false;
        
        const matchEstado = !filtros.estado || filtros.estado === "todos" || 
          vet.endereco.estado.toLowerCase() === filtros.estado.toLowerCase();
        const matchCidade = !filtros.cidade || 
          vet.endereco.cidade.toLowerCase().includes(filtros.cidade.toLowerCase());
        const matchBairro = !filtros.bairro || 
          vet.endereco.bairro.toLowerCase().includes(filtros.bairro.toLowerCase());
        
        return matchEstado && matchCidade && matchBairro;
      });
      
      setVeterinariosFiltrados(resultado);
    } catch (error) {
      console.error("Erro ao buscar veterinários:", error);
      toast({
        title: "Erro",
        description: "Não foi possível buscar os veterinários",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar horários disponíveis quando um veterinário é selecionado
  useEffect(() => {
    if (veterinarioSelecionado) {
      carregarDisponibilidade(veterinarioSelecionado.id);
    }
  }, [veterinarioSelecionado]);

  // Carregar disponibilidade do veterinário
  const carregarDisponibilidade = async (vetId: string) => {
    setIsLoading(true);
    
    try {
      // Buscar disponibilidades do veterinário
      const { data, error } = await supabase
        .from('disponibilidades')
        .select('*')
        .eq('vet_id', vetId);
        
      if (error) throw error;
      
      // Calcular datas disponíveis para os próximos 30 dias
      const hoje = new Date();
      const datasDisponiveis: Date[] = [];
      const disponibilidades = data || [];
      
      // Dias da semana disponíveis
      const diasDisponiveisSet = new Set(disponibilidades.map(d => d.dia_semana));
      
      // Próximos 30 dias
      for (let i = 0; i < 30; i++) {
        const data = new Date();
        data.setDate(hoje.getDate() + i);
        
        // Verificar se o dia da semana está disponível
        if (diasDisponiveisSet.has(data.getDay())) {
          datasDisponiveis.push(new Date(data));
        }
      }
      
      setDatasDisponiveis(datasDisponiveis);
      
      // Limpar seleção prévia
      setDataSelecionada(undefined);
      setHorarioSelecionado("");
      
    } catch (error) {
      console.error("Erro ao carregar disponibilidade:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a disponibilidade do veterinário",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gerar horários disponíveis para a data selecionada
  const gerarHorariosDisponiveis = async (data: Date) => {
    if (!veterinarioSelecionado) return;
    
    setIsLoading(true);
    
    try {
      // Buscar disponibilidade para o dia da semana
      const diaDaSemana = data.getDay(); // 0 = domingo, 6 = sábado
      
      const { data: disponibilidadeDia, error } = await supabase
        .from('disponibilidades')
        .select('*')
        .eq('vet_id', veterinarioSelecionado.id)
        .eq('dia_semana', diaDaSemana);
        
      if (error) throw error;
      
      if (!disponibilidadeDia || disponibilidadeDia.length === 0) {
        setHorariosDisponiveis([]);
        return;
      }
      
      // Gerar horários de 30 em 30 minutos dentro do intervalo disponível
      const horarios: string[] = [];
      
      disponibilidadeDia.forEach(disponibilidade => {
        const [horaInicio, minutoInicio] = disponibilidade.hora_inicio.split(':').map(Number);
        const [horaFim, minutoFim] = disponibilidade.hora_fim.split(':').map(Number);
        
        // Converter para minutos desde o início do dia
        const inicioMinutos = horaInicio * 60 + minutoInicio;
        const fimMinutos = horaFim * 60 + minutoFim;
        
        // Gerar horários a cada 30 minutos
        for (let minutos = inicioMinutos; minutos < fimMinutos; minutos += 30) {
          const hora = Math.floor(minutos / 60);
          const minuto = minutos % 60;
          const horarioFormatado = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
          horarios.push(horarioFormatado);
        }
      });
      
      // Verificar se há consultas já agendadas para esta data
      const dataFormatada = format(data, 'yyyy-MM-dd');
      
      const { data: consultasAgendadas, error: consultasError } = await supabase
        .from('consultas')
        .select('horario')
        .eq('vet_id', veterinarioSelecionado.id)
        .eq('data', dataFormatada)
        .in('status', ['agendado', 'confirmado']);
        
      if (consultasError) throw consultasError;
      
      // Filtrar horários já agendados
      const horariosAgendados = new Set(consultasAgendadas?.map(c => c.horario) || []);
      const horariosDisponiveis = horarios.filter(horario => !horariosAgendados.has(horario));
      
      setHorariosDisponiveis(horariosDisponiveis);
      
    } catch (error) {
      console.error("Erro ao gerar horários disponíveis:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar os horários disponíveis",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar horários disponíveis quando a data é selecionada
  useEffect(() => {
    if (dataSelecionada && veterinarioSelecionado) {
      gerarHorariosDisponiveis(dataSelecionada);
    }
  }, [dataSelecionada, veterinarioSelecionado]);

  const selecionarVeterinario = (vet: VeterinarioProfile) => {
    setVeterinarioSelecionado(vet);
    setStep(2);
  };

  const finalizarAgendamento = async () => {
    if (!user || !dataSelecionada || !horarioSelecionado || !petSelecionado || !veterinarioSelecionado) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Formatar data para o banco
      const dataFormatada = format(dataSelecionada, 'yyyy-MM-dd');
      
      // Criar agendamento no banco
      const { data, error } = await supabase
        .from('consultas')
        .insert({
          client_id: user.id,
          vet_id: veterinarioSelecionado.id,
          pet_id: petSelecionado,
          data: dataFormatada,
          horario: horarioSelecionado,
          status: 'agendado',
          observacoes: observacoes
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Consulta agendada com sucesso!",
        description: `Agendamento realizado para ${format(dataSelecionada, 'dd/MM/yyyy')} às ${horarioSelecionado}`,
      });
      
      // Resetar formulário e voltar para o passo 1
      setStep(1);
      setVeterinarioSelecionado(null);
      setPetSelecionado("");
      setDataSelecionada(undefined);
      setHorarioSelecionado("");
      setObservacoes("");
      setHorariosDisponiveis([]);
      setDatasDisponiveis([]);
      
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
      toast({
        title: "Erro",
        description: "Não foi possível agendar a consulta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const voltar = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Renderizar endereço formatado
  const renderizarEndereco = (endereco?: Address) => {
    if (!endereco) return "Endereço não cadastrado";
    return `${endereco.logradouro}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Agendar Consulta</h1>
          <p className="text-muted-foreground">
            {step === 1 ? 'Encontre um veterinário disponível na sua região' : 'Escolha data e horário para sua consulta'}
          </p>
        </div>

        {/* Passos do agendamento */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center w-full max-w-md">
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

        {/* Passo 1: Buscar Veterinário */}
        {step === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Buscar Veterinário</CardTitle>
                <CardDescription>
                  Encontre veterinários disponíveis para atender em sua região
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select
                      value={filtros.estado}
                      onValueChange={(value) => setFiltros({ ...filtros, estado: value })}
                    >
                      <SelectTrigger id="estado">
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os estados</SelectItem>
                        {estadosBrasileiros.map((estado) => (
                          <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      placeholder="Digite a cidade"
                      value={filtros.cidade}
                      onChange={(e) => setFiltros({ ...filtros, cidade: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      placeholder="Digite o bairro (opcional)"
                      value={filtros.bairro}
                      onChange={(e) => setFiltros({ ...filtros, bairro: e.target.value })}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={filtrarVeterinarios}
                  className="w-full"
                  disabled={isLoading}
                >
                  <Search className="mr-2 h-4 w-4" />
                  {isLoading ? 'Buscando...' : 'Buscar Veterinários'}
                </Button>
              </CardContent>
            </Card>
            
            {veterinariosFiltrados.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  Veterinários Encontrados ({veterinariosFiltrados.length})
                </h2>
                
                <div className="grid grid-cols-1 gap-4">
                  {veterinariosFiltrados.map((vet) => (
                    <Card key={vet.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="space-y-3">
                            <h3 className="text-xl font-semibold">{vet.nome}</h3>
                            
                            <div className="flex items-start space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span className="text-sm text-muted-foreground">
                                {renderizarEndereco(vet.endereco)}
                              </span>
                            </div>
                            
                            <div className="space-y-1">
                              <p className="text-sm font-medium">CRMV:</p>
                              <p className="text-sm">{vet.crmv}</p>
                            </div>
                            
                            <p className="text-sm">
                              <span className="font-medium">Valor da consulta: </span>
                              <span className="text-lg font-semibold text-primary">
                                R$ {vet.preco_consulta.toFixed(2)}
                              </span>
                            </p>
                          </div>
                          
                          <div className="mt-4 md:mt-0 flex md:flex-col justify-end">
                            <Button 
                              onClick={() => selecionarVeterinario(vet)}
                              className="w-full md:w-auto"
                            >
                              Selecionar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {veterinariosFiltrados.length === 0 && filtros.estado && (
              <div className="text-center p-8 border border-border rounded-lg bg-muted/30">
                <p className="text-muted-foreground mb-2">
                  Nenhum veterinário encontrado com os filtros selecionados.
                </p>
                <p className="text-sm">
                  Tente ampliar sua busca removendo alguns filtros.
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Passo 2: Selecionar Data e Horário */}
        {step === 2 && veterinarioSelecionado && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selecionar Data e Horário</CardTitle>
                <CardDescription>
                  Escolha uma data e horário disponíveis para sua consulta com {veterinarioSelecionado.nome}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Selecione uma data</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dataSelecionada && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dataSelecionada ? (
                            format(dataSelecionada, "dd 'de' MMMM 'de' yyyy", {
                              locale: ptBR,
                            })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dataSelecionada}
                          onSelect={setDataSelecionada}
                          disabled={(date) => {
                            // Desabilita datas passadas e datas sem disponibilidade
                            const currentDate = new Date();
                            currentDate.setHours(0, 0, 0, 0);
                            
                            if (date < currentDate) return true;
                            
                            // Verificar se a data está na lista de datas disponíveis
                            return !datasDisponiveis.some(d => 
                              d.getDate() === date.getDate() && 
                              d.getMonth() === date.getMonth() && 
                              d.getFullYear() === date.getFullYear()
                            );
                          }}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Selecione um horário</Label>
                    <Select
                      value={horarioSelecionado}
                      onValueChange={setHorarioSelecionado}
                      disabled={!dataSelecionada || horariosDisponiveis.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {horariosDisponiveis.map((horario) => (
                          <SelectItem key={horario} value={horario}>{horario}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {dataSelecionada && horariosDisponiveis.length === 0 && (
                      <p className="text-sm text-destructive">
                        Não há horários disponíveis para esta data.
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <Label htmlFor="pet">Selecione o pet para a consulta</Label>
                  <Select
                    value={petSelecionado}
                    onValueChange={setPetSelecionado}
                  >
                    <SelectTrigger id="pet">
                      <SelectValue placeholder="Selecione um pet" />
                    </SelectTrigger>
                    <SelectContent>
                      {petsMeusTutores.map((pet) => (
                        <SelectItem key={pet.id} value={pet.id}>
                          {pet.nome} ({pet.especie})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mt-6 space-y-2">
                  <Label htmlFor="observacoes">Observações (opcional)</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Descreva brevemente o motivo da consulta ou sintomas observados"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={voltar}>
                  Voltar
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  disabled={!dataSelecionada || !horarioSelecionado || !petSelecionado}
                >
                  Continuar
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        
        {/* Passo 3: Confirmação */}
        {step === 3 && veterinarioSelecionado && dataSelecionada && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Confirmar Agendamento</CardTitle>
                <CardDescription>
                  Verifique os detalhes do seu agendamento antes de confirmar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Veterinário</p>
                      <p className="font-medium">{veterinarioSelecionado.nome}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">CRMV</p>
                      <p className="font-medium">{veterinarioSelecionado.crmv}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Local da consulta</p>
                      <p className="text-sm">
                        {renderizarEndereco(veterinarioSelecionado.endereco)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Data e Hora</p>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="font-medium">
                          {format(dataSelecionada, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="font-medium">{horarioSelecionado}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Pet</p>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="font-medium">
                          {petSelecionado 
                            ? petsMeusTutores.find(p => p.id === petSelecionado)?.nome || 'Pet não encontrado'
                            : 'Nenhum pet selecionado'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Valor da consulta</p>
                      <p className="text-lg font-semibold text-primary">
                        R$ {veterinarioSelecionado.preco_consulta.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {observacoes && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-1">Observações</p>
                    <p className="text-sm">{observacoes}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={voltar}>
                  Voltar
                </Button>
                <Button 
                  onClick={finalizarAgendamento}
                  disabled={isLoading}
                >
                  {isLoading ? 'Agendando...' : 'Confirmar Agendamento'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AgendarConsulta;
