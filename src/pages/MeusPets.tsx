
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Edit, Trash2, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Pet } from "@/types";

const MeusPets = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Estado para armazenar os pets do usuário
  const [pets, setPets] = useState<Pet[]>([]);
  
  // Formulário para o pet atual
  const [currentPet, setCurrentPet] = useState<{
    id?: string;
    nome: string;
    especie: "cachorro" | "gato" | "ave" | "roedor" | "réptil" | "outro";
    raca: string;
    idade: number;
    peso: number;
    observacoes?: string;
    client_id?: string;
  }>({
    nome: "",
    especie: "cachorro",
    raca: "",
    idade: 0,
    peso: 0,
    observacoes: "",
  });
  
  // Carregar pets do usuário
  useEffect(() => {
    const fetchPets = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("pets")
          .select("*")
          .eq("client_id", user.id);
        
        if (error) {
          throw error;
        }
        
        setPets(data || []);
      } catch (error) {
        console.error("Erro ao carregar pets:", error);
        toast({
          variant: "destructive",
          description: "Não foi possível carregar seus pets. Tente novamente mais tarde.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPets();
  }, [user]);
  
  const filteredPets = searchTerm 
    ? pets.filter(pet => 
        pet.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.especie.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.raca.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : pets;
  
  const handleAddPet = async () => {
    if (!user) return;
    
    try {
      setSubmitting(true);
      
      const newPet = {
        ...currentPet,
        client_id: user.id
      };
      
      const { data, error } = await supabase
        .from("pets")
        .insert(newPet)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setPets([...pets, data]);
      setIsAddDialogOpen(false);
      toast({
        description: "Pet adicionado com sucesso!",
      });
      
      // Reset form
      setCurrentPet({
        nome: "",
        especie: "cachorro",
        raca: "",
        idade: 0,
        peso: 0,
        observacoes: "",
      });
    } catch (error) {
      console.error("Erro ao adicionar pet:", error);
      toast({
        variant: "destructive",
        description: "Erro ao adicionar pet. Tente novamente.",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEditPet = async () => {
    if (!currentPet.id) return;
    
    try {
      setSubmitting(true);
      
      const { data, error } = await supabase
        .from("pets")
        .update({
          nome: currentPet.nome,
          especie: currentPet.especie,
          raca: currentPet.raca,
          idade: currentPet.idade,
          peso: currentPet.peso,
          observacoes: currentPet.observacoes
        })
        .eq("id", currentPet.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setPets(pets.map(pet => pet.id === currentPet.id ? data : pet));
      setIsEditDialogOpen(false);
      toast({
        description: "Pet atualizado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao atualizar pet:", error);
      toast({
        variant: "destructive",
        description: "Erro ao atualizar pet. Tente novamente.",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeletePet = async () => {
    if (!currentPet.id) return;
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", currentPet.id);
      
      if (error) {
        throw error;
      }
      
      setPets(pets.filter(pet => pet.id !== currentPet.id));
      setIsDeleteDialogOpen(false);
      toast({
        description: "Pet removido com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao remover pet:", error);
      toast({
        variant: "destructive",
        description: "Erro ao remover pet. Tente novamente.",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleOpenEditDialog = (pet: Pet) => {
    setCurrentPet({
      id: pet.id,
      nome: pet.nome,
      especie: pet.especie as "cachorro" | "gato" | "ave" | "roedor" | "réptil" | "outro",
      raca: pet.raca,
      idade: pet.idade,
      peso: pet.peso,
      observacoes: pet.observacoes || "",
      client_id: pet.clientId || pet.client_id
    });
    setIsEditDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (pet: Pet) => {
    setCurrentPet({
      id: pet.id,
      nome: pet.nome,
      especie: pet.especie as "cachorro" | "gato" | "ave" | "roedor" | "réptil" | "outro",
      raca: pet.raca,
      idade: pet.idade,
      peso: pet.peso,
      observacoes: pet.observacoes || "",
      client_id: pet.clientId || pet.client_id
    });
    setIsDeleteDialogOpen(true);
  };
  
  const handleVerProntuario = (petId: string) => {
    navigate(`/prontuario?petId=${petId}`);
  };
  
  const getEspecieLabel = (especie: string) => {
    const especies = {
      cachorro: "Cachorro",
      gato: "Gato",
      ave: "Ave",
      roedor: "Roedor",
      reptil: "Réptil",
      outro: "Outro"
    };
    return especies[especie as keyof typeof especies] || especie;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Meus Pets</h1>
            <p className="text-muted-foreground">
              Gerencie as informações dos seus pets
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Pet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Pet</DialogTitle>
                <DialogDescription>
                  Preencha as informações do seu pet
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input 
                    id="nome" 
                    value={currentPet.nome} 
                    onChange={e => setCurrentPet({...currentPet, nome: e.target.value})} 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="especie">Espécie</Label>
                    <Select 
                      value={currentPet.especie} 
                      onValueChange={value => setCurrentPet({...currentPet, especie: value as typeof currentPet.especie})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="cachorro">Cachorro</SelectItem>
                          <SelectItem value="gato">Gato</SelectItem>
                          <SelectItem value="ave">Ave</SelectItem>
                          <SelectItem value="roedor">Roedor</SelectItem>
                          <SelectItem value="réptil">Réptil</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="raca">Raça</Label>
                    <Input 
                      id="raca" 
                      value={currentPet.raca} 
                      onChange={e => setCurrentPet({...currentPet, raca: e.target.value})} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="idade">Idade (anos)</Label>
                    <Input 
                      id="idade" 
                      type="number" 
                      value={currentPet.idade} 
                      onChange={e => setCurrentPet({...currentPet, idade: parseInt(e.target.value) || 0})} 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="peso">Peso (kg)</Label>
                    <Input 
                      id="peso" 
                      type="number" 
                      step="0.1" 
                      value={currentPet.peso} 
                      onChange={e => setCurrentPet({...currentPet, peso: parseFloat(e.target.value) || 0})} 
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea 
                    id="observacoes" 
                    value={currentPet.observacoes || ""} 
                    onChange={e => setCurrentPet({...currentPet, observacoes: e.target.value})} 
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddPet} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : 'Salvar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Buscar pets por nome, espécie ou raça..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Carregando seus pets...</p>
          </div>
        ) : filteredPets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{pet.nome}</CardTitle>
                      <CardDescription className="mt-1">
                        {getEspecieLabel(pet.especie)} • {pet.raca}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Idade:</span>
                    <span>{pet.idade} {pet.idade === 1 ? 'ano' : 'anos'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Peso:</span>
                    <span>{pet.peso} kg</span>
                  </div>
                  {pet.observacoes && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Observações:</span>
                      <p className="mt-1">{pet.observacoes}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleOpenEditDialog(pet)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenDeleteDialog(pet)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleVerProntuario(pet.id)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Prontuário
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Nenhum pet encontrado com os termos da busca" : "Você ainda não cadastrou nenhum pet"}
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchTerm("")}
              >
                Limpar busca
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Pet</DialogTitle>
            <DialogDescription>
              Atualize as informações do seu pet
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome-edit">Nome</Label>
              <Input 
                id="nome-edit" 
                value={currentPet.nome} 
                onChange={e => setCurrentPet({...currentPet, nome: e.target.value})} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="especie-edit">Espécie</Label>
                <Select 
                  value={currentPet.especie} 
                  onValueChange={value => setCurrentPet({...currentPet, especie: value as typeof currentPet.especie})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="cachorro">Cachorro</SelectItem>
                      <SelectItem value="gato">Gato</SelectItem>
                      <SelectItem value="ave">Ave</SelectItem>
                      <SelectItem value="roedor">Roedor</SelectItem>
                      <SelectItem value="réptil">Réptil</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="raca-edit">Raça</Label>
                <Input 
                  id="raca-edit" 
                  value={currentPet.raca} 
                  onChange={e => setCurrentPet({...currentPet, raca: e.target.value})} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="idade-edit">Idade (anos)</Label>
                <Input 
                  id="idade-edit" 
                  type="number" 
                  value={currentPet.idade} 
                  onChange={e => setCurrentPet({...currentPet, idade: parseInt(e.target.value) || 0})} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="peso-edit">Peso (kg)</Label>
                <Input 
                  id="peso-edit" 
                  type="number" 
                  step="0.1" 
                  value={currentPet.peso} 
                  onChange={e => setCurrentPet({...currentPet, peso: parseFloat(e.target.value) || 0})} 
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="observacoes-edit">Observações</Label>
              <Textarea 
                id="observacoes-edit" 
                value={currentPet.observacoes || ""} 
                onChange={e => setCurrentPet({...currentPet, observacoes: e.target.value})} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleEditPet} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Pet</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover o pet "{currentPet.nome}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeletePet} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removendo...
                </>
              ) : 'Remover'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MeusPets;
