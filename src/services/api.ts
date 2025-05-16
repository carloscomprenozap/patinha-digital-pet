
import { supabase } from "@/integrations/supabase/client";
import { Pet, Agendamento, Prontuario, Veterinarian, Client } from "@/types";
import { ConsultaDB } from "@/types";

// User related operations
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

// Pet operations
export const fetchPets = async (clientId: string) => {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('client_id', clientId);
  
  if (error) throw error;
  return data;
};

export const createPet = async (petData: Omit<Pet, 'id'>) => {
  const { data, error } = await supabase
    .from('pets')
    .insert([{
      nome: petData.nome,
      especie: petData.especie,
      raca: petData.raca,
      idade: petData.idade,
      peso: petData.peso,
      observacoes: petData.observacoes || '',
      client_id: petData.clientId
    }])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updatePet = async (id: string, petData: Partial<Pet>) => {
  const { data, error } = await supabase
    .from('pets')
    .update({
      nome: petData.nome,
      especie: petData.especie,
      raca: petData.raca,
      idade: petData.idade,
      peso: petData.peso,
      observacoes: petData.observacoes
    })
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deletePet = async (id: string) => {
  const { error } = await supabase
    .from('pets')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Agendamento operations
export const fetchAgendamentos = async (userId: string, userType: string) => {
  let query = supabase
    .from('consultas')
    .select(`
      *,
      profiles!consultas_vet_id_fkey(nome as vet_nome),
      pets!consultas_pet_id_fkey(nome as pet_nome)
    `);
  
  // Filtrar consultas de acordo com o tipo de usuário
  if (userType === 'client') {
    query = query.eq('client_id', userId);
  } else if (userType === 'vet') {
    query = query.eq('vet_id', userId);
  }
  // Admin pode ver todas as consultas

  const { data, error } = await query;
  
  if (error) throw error;
  return data as ConsultaDB[];
};

export const createAgendamento = async (agendamentoData: Omit<Agendamento, 'id' | 'createdAt'>) => {
  const { data, error } = await supabase
    .from('consultas')
    .insert([{
      client_id: agendamentoData.clientId,
      vet_id: agendamentoData.vetId,
      pet_id: agendamentoData.petId,
      data: agendamentoData.data,
      horario: agendamentoData.horario,
      status: agendamentoData.status,
      observacoes: agendamentoData.observacoes || ''
    }])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateAgendamento = async (id: string, agendamentoData: Partial<Agendamento>) => {
  const { data, error } = await supabase
    .from('consultas')
    .update({
      status: agendamentoData.status,
      observacoes: agendamentoData.observacoes,
      diagnostico: agendamentoData.diagnostico,
      prescricao: agendamentoData.prescricao
    })
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteAgendamento = async (id: string) => {
  const { error } = await supabase
    .from('consultas')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Prontuario operations
export const fetchProntuarios = async (userId: string, userType: string) => {
  let query = supabase
    .from('prontuarios')
    .select(`
      *,
      pets!prontuarios_pet_id_fkey(nome),
      consultas!prontuarios_consulta_id_fkey(data, veterinarios(*))
    `);
  
  if (userType === 'client') {
    // Select prontuarios where the pet belongs to this client
    query = query.eq('pets.client_id', userId);
  } else if (userType === 'vet') {
    query = query.eq('vet_id', userId);
  }
  // Admin pode ver todos os prontuários

  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

export const createProntuario = async (prontuarioData: Omit<Prontuario, 'id'>) => {
  const { data, error } = await supabase
    .from('prontuarios')
    .insert([{
      consulta_id: prontuarioData.consultaId,
      pet_id: prontuarioData.petId,
      vet_id: prontuarioData.vetId,
      anamnese: prontuarioData.anamnese || '',
      diagnostico: prontuarioData.diagnostico || '',
      prescricao: prontuarioData.prescricao || '',
      observacoes: prontuarioData.observacoes || ''
    }])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateProntuario = async (id: string, prontuarioData: Partial<Prontuario>) => {
  const { data, error } = await supabase
    .from('prontuarios')
    .update({
      anamnese: prontuarioData.anamnese,
      diagnostico: prontuarioData.diagnostico,
      prescricao: prontuarioData.prescricao,
      observacoes: prontuarioData.observacoes
    })
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

// Veterinário operations
export const fetchVeterinarios = async () => {
  const { data, error } = await supabase
    .from('veterinarios')
    .select(`
      *,
      profiles!veterinarios_id_fkey(*)
    `);
  
  if (error) throw error;
  return data;
};

export const fetchVeterinarioById = async (id: string) => {
  const { data, error } = await supabase
    .from('veterinarios')
    .select(`
      *,
      profiles!veterinarios_id_fkey(*)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateVeterinarioProfile = async (id: string, vetData: Partial<Veterinarian>) => {
  // Atualizar informações do veterinário
  const { error: vetError } = await supabase
    .from('veterinarios')
    .update({
      preco_consulta: vetData.precoConsulta,
      crmv: vetData.crmv
    })
    .eq('id', id);
  
  if (vetError) throw vetError;
  
  // Atualizar informações de perfil
  if (vetData.nome || vetData.telefone) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        nome: vetData.nome,
        telefone: vetData.telefone
      })
      .eq('id', id);
    
    if (profileError) throw profileError;
  }
  
  return true;
};

// Cliente operations
export const fetchClientes = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('tipo', 'client');
  
  if (error) throw error;
  return data;
};

export const fetchClienteById = async (id: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('tipo', 'client')
    .single();
  
  if (error) throw error;
  return data;
};

export const updateClienteProfile = async (id: string, clienteData: Partial<Client>) => {
  const { error } = await supabase
    .from('profiles')
    .update({
      nome: clienteData.nome,
      telefone: clienteData.telefone
    })
    .eq('id', id);
  
  if (error) throw error;
  return true;
};
