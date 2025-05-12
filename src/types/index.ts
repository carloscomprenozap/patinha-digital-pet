
export type UserType = 'client' | 'vet';

export interface Address {
  cep: string;
  estado: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento?: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: UserType;
  endereco: Address;
  createdAt: string;
}

export interface Client extends User {
  tipo: 'client';
  pets: Pet[];
}

export interface Veterinarian extends User {
  tipo: 'vet';
  especialidades: string[];
  crmv: string;
  disponibilidade: Disponibilidade[];
  precoConsulta: number;
}

export interface Pet {
  id: string;
  nome: string;
  especie: 'cachorro' | 'gato' | 'ave' | 'roedor' | 'réptil' | 'outro';
  raca: string;
  idade: number;
  peso: number;
  observacoes?: string;
  clientId: string;
}

export interface Agendamento {
  id: string;
  clientId: string;
  vetId: string;
  petId: string;
  data: string; // ISO string
  horario: string; // formato HH:MM
  status: 'agendado' | 'confirmado' | 'concluido' | 'cancelado';
  observacoes?: string;
  createdAt: string;
}

export interface Consulta extends Agendamento {
  diagnostico?: string;
  prescricao?: string;
  recomendacoes?: string;
}

export interface Disponibilidade {
  diaSemana: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo, 6 = sábado
  horaInicio: string; // formato HH:MM
  horaFim: string; // formato HH:MM
}

export interface HorarioDisponivel {
  data: string; // ISO string
  horarios: string[]; // array de horários disponíveis no formato HH:MM
}
