
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Search, MessageSquare, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Veterinarian, Address } from "@/types";

interface VeterinarioWithProfile {
  id: string;
  preco_consulta: number;
  crmv: string;
  profiles: {
    nome: string;
    telefone: string;
  };
  enderecos: Address[];
  especialidades: { nome: string }[];
}

const Clinicas = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clinicas, setClinicas] = useState<any[]>([]);

  // Fetch veterinarians from Supabase
  useEffect(() => {
    const fetchVeterinarios = async () => {
      setIsLoading(true);
      try {
        // Get veterinarians with their profiles, addresses, and specialties
        const { data: veterinariosData, error } = await supabase
          .from('veterinarios')
          .select(`
            id, 
            preco_consulta,
            crmv,
            profiles:id(nome, telefone),
            enderecos:user_id(*)
          `);

        if (error) {
          throw error;
        }

        // For each veterinarian, fetch their specialties
        const veterinariosWithEspecialidades = await Promise.all(
          veterinariosData.map(async (vet: any) => {
            const { data: especialidades, error: espError } = await supabase
              .from('especialidades')
              .select('nome')
              .eq('vet_id', vet.id);
            
            if (espError) {
              console.error("Error fetching especialidades:", espError);
              return {
                ...vet,
                especialidades: []
              };
            }

            // Check if this vet has 24h service (mocked for now)
            const horario24h = Math.random() > 0.7; // Just a placeholder, you might want to add this as a field in your database

            return {
              ...vet,
              especialidades,
              horario24h
            };
          })
        );

        setClinicas(veterinariosWithEspecialidades);
      } catch (error) {
        console.error("Error fetching veterinarians:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os veterinários.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVeterinarios();
  }, [toast]);

  // Filter clinics based on search term
  const filteredClinicas = clinicas.filter(clinica => {
    const nome = clinica.profiles?.nome || '';
    const especialidades = clinica.especialidades?.map((esp: any) => esp.nome) || [];
    
    return nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      especialidades.some((esp: string) => esp.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleAddFavorito = (id: string) => {
    if (favoritos.includes(id)) {
      setFavoritos(prev => prev.filter(favId => favId !== id));
      toast({
        description: "Clínica removida dos favoritos",
      });
    } else {
      setFavoritos(prev => [...prev, id]);
      toast({
        description: "Clínica adicionada aos favoritos",
      });
    }
  };

  const handleOpenMaps = (endereco: Address | undefined) => {
    if (!endereco) return;
    
    const enderecoFormatado = `${endereco.logradouro}, ${endereco.numero}, ${endereco.cidade}, ${endereco.estado}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoFormatado)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleOpenWhatsApp = (telefone: string | undefined) => {
    if (!telefone) return;
    
    const phoneNumber = telefone.replace(/\D/g, '');
    const message = encodeURIComponent("Olá, gostaria de algumas informações sobre a clínica.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Clínicas</h1>
          <p className="text-muted-foreground">
            Encontre clínicas veterinárias para o seu pet
          </p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Buscar clínicas por nome ou especialidade..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : filteredClinicas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClinicas.map((clinica) => {
              const nome = clinica.profiles?.nome || 'Veterinário';
              const endereco = clinica.enderecos?.[0];
              const telefone = clinica.profiles?.telefone || '';
              const especialidades = clinica.especialidades?.map((esp: any) => esp.nome) || [];
              
              return (
                <Card key={clinica.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{`Clínica Dr. ${nome.split(' ')[0]}`}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {endereco ? `${endereco.cidade}, ${endereco.estado}` : 'Endereço não disponível'}
                        </CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleAddFavorito(clinica.id)}
                        className={favoritos.includes(clinica.id) ? "text-red-500" : ""}
                      >
                        <Heart className="h-5 w-5" fill={favoritos.includes(clinica.id) ? "currentColor" : "none"} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {especialidades.map((esp: string, i: number) => (
                        <Badge key={i} variant="outline">{esp}</Badge>
                      ))}
                      {clinica.horario24h && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Atendimento 24h</Badge>
                      )}
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenMaps(endereco)}
                        className="flex items-center gap-2"
                        disabled={!endereco}
                      >
                        <MapPin className="h-4 w-4" />
                        Ver no mapa
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenWhatsApp(telefone)}
                        className="flex items-center gap-2"
                        disabled={!telefone}
                      >
                        <MessageSquare className="h-4 w-4" />
                        WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              Nenhuma clínica encontrada com os termos da busca
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

export default Clinicas;
