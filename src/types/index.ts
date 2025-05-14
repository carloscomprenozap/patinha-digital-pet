export type UserType = 'client' | 'vet' | 'admin';

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
  // Adicionando campos que correspondem ao banco de dados
  client_id?: string;
  created_at?: string;
  updated_at?: string;
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

// Interface para consultas vindo do banco de dados
export interface ConsultaDB {
  id: string;
  client_id: string;
  vet_id: string;
  pet_id: string;
  data: string;
  horario: string;
  status: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  diagnostico?: string;
  prescricao?: string;
  recomendacoes?: string;
  vet_nome?: string;
  pet_nome?: string;
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

export interface ConsultaProps {
  id: string;
  data: string;
  horario: string;
  status: 'agendado' | 'confirmado' | 'concluido' | 'cancelado';
  observacoes: string;
  vet_id: string;
  pet_id: string;
  vet_nome: string;
  pet_nome: string;
}

export interface UserProfile {
  id: string;
  nome: string;
  telefone?: string;
  tipo: 'client' | 'vet' | 'admin';
  created_at?: string;
  updated_at?: string;
}
