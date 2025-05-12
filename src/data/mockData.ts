
import { Address, Agendamento, Client, Consulta, Pet, Veterinarian } from "@/types";

// Endereços mockados
export const enderecosMock: Address[] = [
  {
    cep: "01001-000",
    estado: "SP",
    cidade: "São Paulo",
    bairro: "Centro",
    logradouro: "Praça da Sé",
    numero: "1",
    complemento: "Lado ímpar"
  },
  {
    cep: "01310-200",
    estado: "SP",
    cidade: "São Paulo",
    bairro: "Bela Vista",
    logradouro: "Avenida Paulista",
    numero: "1500",
    complemento: "Apto 504"
  },
  {
    cep: "22250-040",
    estado: "RJ",
    cidade: "Rio de Janeiro",
    bairro: "Botafogo",
    logradouro: "Rua Voluntários da Pátria",
    numero: "340",
    complemento: ""
  }
];

// Clientes mockados
export const clientesMock: Client[] = [
  {
    id: "client-1",
    nome: "Ana Silva",
    email: "ana.silva@email.com",
    telefone: "(11) 98765-4321",
    tipo: "client",
    endereco: enderecosMock[0],
    createdAt: "2023-01-15T10:30:00Z",
    pets: [] // Será preenchido depois
  },
  {
    id: "client-2",
    nome: "Carlos Oliveira",
    email: "carlos.oliveira@email.com",
    telefone: "(11) 91234-5678",
    tipo: "client",
    endereco: enderecosMock[1],
    createdAt: "2023-02-20T14:45:00Z",
    pets: [] // Será preenchido depois
  }
];

// Pets mockados
export const petsMock: Pet[] = [
  {
    id: "pet-1",
    nome: "Rex",
    especie: "cachorro",
    raca: "Golden Retriever",
    idade: 3,
    peso: 28.5,
    observacoes: "Alérgico a alguns grãos",
    clientId: "client-1"
  },
  {
    id: "pet-2",
    nome: "Luna",
    especie: "gato",
    raca: "Siamês",
    idade: 2,
    peso: 4.2,
    observacoes: "Timida com estranhos",
    clientId: "client-1"
  },
  {
    id: "pet-3",
    nome: "Bob",
    especie: "cachorro",
    raca: "Beagle",
    idade: 5,
    peso: 12.7,
    clientId: "client-2"
  }
];

// Atualização dos pets nos clientes
clientesMock[0].pets = [petsMock[0], petsMock[1]];
clientesMock[1].pets = [petsMock[2]];

// Veterinários mockados
export const veterinariosMock: Veterinarian[] = [
  {
    id: "vet-1",
    nome: "Dra. Marina Santos",
    email: "marina.santos@vetcasa.com",
    telefone: "(11) 97777-8888",
    tipo: "vet",
    endereco: {
      cep: "04545-001",
      estado: "SP",
      cidade: "São Paulo",
      bairro: "Itaim Bibi",
      logradouro: "Rua João Cachoeira",
      numero: "500",
      complemento: "Conjunto 12"
    },
    createdAt: "2022-10-05T09:15:00Z",
    especialidades: ["Clínica Geral", "Dermatologia"],
    crmv: "12345-SP",
    disponibilidade: [
      { diaSemana: 1, horaInicio: "09:00", horaFim: "18:00" },
      { diaSemana: 3, horaInicio: "09:00", horaFim: "18:00" },
      { diaSemana: 5, horaInicio: "09:00", horaFim: "16:00" }
    ],
    precoConsulta: 250
  },
  {
    id: "vet-2",
    nome: "Dr. Rafael Costa",
    email: "rafael.costa@vetcasa.com",
    telefone: "(11) 96666-5555",
    tipo: "vet",
    endereco: {
      cep: "05424-150",
      estado: "SP",
      cidade: "São Paulo",
      bairro: "Pinheiros",
      logradouro: "Rua dos Pinheiros",
      numero: "700",
      complemento: ""
    },
    createdAt: "2022-11-15T11:30:00Z",
    especialidades: ["Clínica Geral", "Ortopedia"],
    crmv: "54321-SP",
    disponibilidade: [
      { diaSemana: 2, horaInicio: "08:00", horaFim: "17:00" },
      { diaSemana: 4, horaInicio: "08:00", horaFim: "17:00" },
      { diaSemana: 6, horaInicio: "09:00", horaFim: "15:00" }
    ],
    precoConsulta: 280
  },
  {
    id: "vet-3",
    nome: "Dr. Thiago Mendes",
    email: "thiago.mendes@vetcasa.com",
    telefone: "(21) 99999-8888",
    tipo: "vet",
    endereco: enderecosMock[2],
    createdAt: "2022-09-10T10:00:00Z",
    especialidades: ["Clínica Geral", "Cardiologia"],
    crmv: "11111-RJ",
    disponibilidade: [
      { diaSemana: 1, horaInicio: "10:00", horaFim: "19:00" },
      { diaSemana: 2, horaInicio: "10:00", horaFim: "19:00" },
      { diaSemana: 4, horaInicio: "10:00", horaFim: "19:00" }
    ],
    precoConsulta: 300
  }
];

// Agendamentos mockados
export const agendamentosMock: Agendamento[] = [
  {
    id: "agenda-1",
    clientId: "client-1",
    vetId: "vet-1",
    petId: "pet-1",
    data: "2023-06-15",
    horario: "14:30",
    status: "concluido",
    observacoes: "Consulta de rotina",
    createdAt: "2023-06-01T10:15:00Z"
  },
  {
    id: "agenda-2",
    clientId: "client-1",
    vetId: "vet-2",
    petId: "pet-2",
    data: "2023-06-22",
    horario: "10:00",
    status: "concluido",
    observacoes: "Verificar comportamento",
    createdAt: "2023-06-05T08:30:00Z"
  },
  {
    id: "agenda-3",
    clientId: "client-2",
    vetId: "vet-3",
    petId: "pet-3",
    data: "2023-07-05",
    horario: "16:15",
    status: "concluido",
    observacoes: "Renovação de receita",
    createdAt: "2023-06-20T15:45:00Z"
  },
  {
    id: "agenda-4",
    clientId: "client-1",
    vetId: "vet-1",
    petId: "pet-1",
    data: "2025-05-15",
    horario: "13:00",
    status: "agendado",
    createdAt: "2025-05-01T09:20:00Z"
  },
  {
    id: "agenda-5",
    clientId: "client-2",
    vetId: "vet-2",
    petId: "pet-3",
    data: "2025-05-18",
    horario: "11:30",
    status: "confirmado",
    createdAt: "2025-05-02T14:10:00Z"
  }
];

// Consultas mockadas (agendamentos concluídos com informações adicionais)
export const consultasMock: Consulta[] = [
  {
    ...agendamentosMock[0],
    diagnostico: "Animal saudável, sem sintomas de doença",
    prescricao: "Manter alimentação e exercícios regulares",
    recomendacoes: "Retornar em 6 meses para nova avaliação"
  },
  {
    ...agendamentosMock[1],
    diagnostico: "Estresse leve",
    prescricao: "Feliway difusor para ambiente",
    recomendacoes: "Criar rotina mais consistente e espaços tranquilos para o animal"
  },
  {
    ...agendamentosMock[2],
    diagnostico: "Artrite leve",
    prescricao: "Renovação da medicação anti-inflamatória",
    recomendacoes: "Manter exercícios leves e dieta controlada"
  }
];

// Função para gerar horários disponíveis para os próximos 14 dias
export const gerarHorariosDisponiveis = (vetId: string) => {
  const veterinario = veterinariosMock.find(vet => vet.id === vetId);
  if (!veterinario) return [];
  
  const hoje = new Date();
  const horarios = [];
  
  for (let i = 0; i < 14; i++) {
    const data = new Date();
    data.setDate(hoje.getDate() + i);
    
    const diaSemana = data.getDay();
    const disponibilidadeDia = veterinario.disponibilidade.find(d => d.diaSemana === diaSemana);
    
    if (disponibilidadeDia) {
      const horariosDisp = [];
      const [horaInicio, minInicio] = disponibilidadeDia.horaInicio.split(':').map(Number);
      const [horaFim, minFim] = disponibilidadeDia.horaFim.split(':').map(Number);
      
      let hora = horaInicio;
      let min = minInicio;
      
      while (hora < horaFim || (hora === horaFim && min < minFim)) {
        horariosDisp.push(`${hora.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
        min += 30;
        if (min >= 60) {
          hora += 1;
          min = 0;
        }
      }
      
      horarios.push({
        data: data.toISOString().split('T')[0],
        horarios: horariosDisp
      });
    }
  }
  
  return horarios;
};

// Função para verificar credenciais de login (mock)
export type LoginCredentials = {
  email: string;
  senha: string;
};

export const verificarLogin = (credentials: LoginCredentials): User | null => {
  // Mock - normalmente verificaria contra uma base de dados real
  if (credentials.email === "ana.silva@email.com" && credentials.senha === "senha123") {
    return clientesMock[0];
  } else if (credentials.email === "marina.santos@vetcasa.com" && credentials.senha === "senha123") {
    return veterinariosMock[0];
  }
  return null;
};
