
import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, MessageSquare, X, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { veterinariosMock } from "@/data/mockData";

const Favoritos = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data for favorites - make sure we have valid IDs that exist in veterinariosMock
  // First check if veterinariosMock is defined and not empty
  const validVetIds = Array.isArray(veterinariosMock) && veterinariosMock.length > 0
    ? veterinariosMock.map(vet => vet.id)
    : [];

  const [favoritosClinicas, setFavoritosClinicas] = useState(
    validVetIds.length >= 2 ? [validVetIds[0], validVetIds[1]] : []
  );
  
  const [favoritosVets, setFavoritosVets] = useState(
    validVetIds.length >= 4 ? [validVetIds[2], validVetIds[3]] : []
  );

  // Generate clinic and vet data - with safety checks
  const clinicas = Array.isArray(veterinariosMock)
    ? veterinariosMock
      .filter(vet => vet && vet.id && favoritosClinicas.includes(vet.id))
      .map(vet => ({
        id: vet.id,
        nome: `Clínica Dr. ${vet.nome.split(' ')[0]}`,
        endereco: vet.endereco,
        telefone: vet.telefone,
        especialidades: ["Clínica Geral", "Cirurgia", "Dermatologia"].slice(0, Math.floor(Math.random() * 3) + 1),
        horario24h: Math.random() > 0.7
      }))
    : [];

  const veterinarios = Array.isArray(veterinariosMock)
    ? veterinariosMock.filter(vet => vet && vet.id && favoritosVets.includes(vet.id))
    : [];

  // Filter based on search term
  const filteredClinicas = clinicas.filter(clinica => 
    clinica.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinica.especialidades.some(esp => esp.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredVets = veterinarios.filter(vet => 
    vet.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoverClinica = (id: string) => {
    setFavoritosClinicas(prev => prev.filter(favId => favId !== id));
    toast({
      description: "Clínica removida dos favoritos",
    });
  };

  const handleRemoverVet = (id: string) => {
    setFavoritosVets(prev => prev.filter(favId => favId !== id));
    toast({
      description: "Veterinário removido dos favoritos",
    });
  };

  const handleOpenMaps = (endereco: any) => {
    if (!endereco) return;
    
    const enderecoFormatado = `${endereco.logradouro}, ${endereco.numero}, ${endereco.cidade}, ${endereco.estado}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoFormatado)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleOpenWhatsApp = (telefone: string) => {
    const phoneNumber = telefone.replace(/\D/g, '');
    const message = encodeURIComponent("Olá, gostaria de algumas informações.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Meus Favoritos</h1>
          <p className="text-muted-foreground">
            Gerencie suas clínicas e veterinários favoritos
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Buscar nos favoritos..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="clinicas" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="clinicas">Clínicas</TabsTrigger>
            <TabsTrigger value="veterinarios">Veterinários</TabsTrigger>
          </TabsList>
          
          <TabsContent value="clinicas" className="space-y-6">
            {filteredClinicas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClinicas.map((clinica) => (
                  <Card key={clinica.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{clinica.nome}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {clinica.endereco.cidade}, {clinica.endereco.estado}
                          </CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoverClinica(clinica.id)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {clinica.especialidades.map((esp, i) => (
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
                          onClick={() => handleOpenMaps(clinica.endereco)}
                          className="flex items-center gap-2"
                        >
                          <MapPin className="h-4 w-4" />
                          Ver no mapa
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenWhatsApp(clinica.telefone)}
                          className="flex items-center gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          WhatsApp
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">
                  Você não tem clínicas favoritas
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="veterinarios" className="space-y-6">
            {filteredVets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVets.map((vet) => (
                  <Card key={vet.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Dr. {vet.nome}</CardTitle>
                          <CardDescription className="mt-1">
                            CRMV: {vet.crmv}
                          </CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoverVet(vet.id)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {vet.especialidades?.map((esp, i) => (
                          <Badge key={i} variant="outline">{esp}</Badge>
                        ))}
                      </div>
                      <div className="flex justify-between mt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenWhatsApp(vet.telefone)}
                          className="flex items-center gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          WhatsApp
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          Agendar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">
                  Você não tem veterinários favoritos
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Favoritos;
