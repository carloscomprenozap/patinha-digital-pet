import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Pet } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";

// Helper para validar e converter a espécie
const validateEspecie = (especie: string): 'cachorro' | 'gato' | 'ave' | 'roedor' | 'réptil' | 'outro' => {
  const validEspecies = ['cachorro', 'gato', 'ave', 'roedor', 'réptil', 'outro'] as const;
  if (validEspecies.includes(especie as any)) {
    return especie as 'cachorro' | 'gato' | 'ave' | 'roedor' | 'réptil' | 'outro';
  }
  return 'outro';
};

const MeusPets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<Pet>({
    defaultValues: {
      nome: "",
      especie: "cachorro",
      raca: "",
      idade: 0,
      peso: 0,
      observacoes: ""
    }
  });

  useEffect(() => {
    if (user) {
      fetchPets();
    }
  }, [user]);

  const fetchPets = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("client_id", user.id);
      
      if (error) {
        throw error;
      }

      // Map do banco para o formato da aplicação
      const formattedPets = data.map(pet => ({
        ...pet,
        clientId: pet.client_id,
        especie: validateEspecie(pet.especie)
      }));
      
      setPets(formattedPets as Pet[]);
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus pets.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (pet?: Pet) => {
    if (pet) {
      form.reset({
        ...pet,
        especie: validateEspecie(pet.especie)
      });
      setEditingPet(pet);
    } else {
      form.reset({
        nome: "",
        especie: "cachorro",
        raca: "",
        idade: 0,
        peso: 0,
        observacoes: ""
      });
      setEditingPet(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.reset();
  };

  const onSubmit = async (data: Pet) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const petData = {
        nome: data.nome,
        especie: validateEspecie(data.especie),
        raca: data.raca,
        idade: data.idade,
        peso: data.peso,
        observacoes: data.observacoes || "",
        client_id: user.id
      };

      let result;
      if (editingPet) {
        // Atualizar pet existente
        result = await supabase
          .from("pets")
          .update(petData)
          .eq("id", editingPet.id);
      } else {
        // Criar novo pet
        result = await supabase
          .from("pets")
          .insert([petData]);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: editingPet ? "Pet atualizado" : "Pet cadastrado",
        description: editingPet
          ? "Informações do pet atualizadas com sucesso."
          : "Pet cadastrado com sucesso.",
      });

      closeModal();
      fetchPets();
    } catch (error) {
      console.error("Erro ao salvar pet:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as informações do pet.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (petId: string) => {
    if (!confirm("Tem certeza que deseja excluir este pet?")) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", petId);
      
      if (error) {
        throw error;
      }

      setPets(pets.filter(pet => pet.id !== petId));
      
      toast({
        title: "Pet removido",
        description: "O pet foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir pet:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o pet.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Meus Pets</h1>
          <Button onClick={() => openModal()}>Adicionar Pet</Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium">Nenhum pet cadastrado</h3>
            <p className="text-muted-foreground mt-2">Adicione um pet para começar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>{pet.nome}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Espécie:</span>
                      <span>{pet.especie}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Raça:</span>
                      <span>{pet.raca}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Idade:</span>
                      <span>{pet.idade} anos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Peso:</span>
                      <span>{pet.peso} kg</span>
                    </div>
                    {pet.observacoes && (
                      <div className="mt-2">
                        <span className="font-semibold">Observações:</span>
                        <p className="text-sm text-muted-foreground">{pet.observacoes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <div className="flex justify-between p-4">
                  <Button size="sm" onClick={() => openModal(pet)}>
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(pet.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal para adicionar/editar pet */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <Card className="max-w-md w-full p-6">
              <CardHeader className="pb-2">
                <CardTitle>{editingPet ? "Editar Pet" : "Adicionar Pet"}</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do pet" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="especie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Espécie</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a espécie" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cachorro">Cachorro</SelectItem>
                              <SelectItem value="gato">Gato</SelectItem>
                              <SelectItem value="ave">Ave</SelectItem>
                              <SelectItem value="roedor">Roedor</SelectItem>
                              <SelectItem value="réptil">Réptil</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="raca"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Raça</FormLabel>
                          <FormControl>
                            <Input placeholder="Raça do pet" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="idade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Idade</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Idade"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="peso"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Peso (kg)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Peso"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="observacoes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Observações adicionais"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={closeModal}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Salvando..." : "Salvar"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MeusPets;
