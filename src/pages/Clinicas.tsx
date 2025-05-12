
import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Search, MessageSquare, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { veterinariosMock } from "@/data/mockData";

const Clinicas = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [favoritos, setFavoritos] = useState<string[]>([]);

  // Mock data for clinics
  const clinicas = veterinariosMock.map(vet => ({
    id: vet.id,
    nome: `Clínica Dr. ${vet.nome.split(' ')[0]}`,
    endereco: vet.endereco,
    telefone: vet.telefone,
    especialidades: ["Clínica Geral", "Cirurgia", "Dermatologia"].slice(0, Math.floor(Math.random() * 3) + 1),
    horario24h: Math.random() > 0.7
  }));

  const filteredClinicas = clinicas.filter(clinica => 
    clinica.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinica.especialidades.some(esp => esp.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  const handleOpenMaps = (endereco: any) => {
    if (!endereco) return;
    
    const enderecoFormatado = `${endereco.logradouro}, ${endereco.numero}, ${endereco.cidade}, ${endereco.estado}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoFormatado)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleOpenWhatsApp = (telefone: string) => {
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
                    onClick={() => handleAddFavorito(clinica.id)}
                    className={favoritos.includes(clinica.id) ? "text-red-500" : ""}
                  >
                    <Heart className="h-5 w-5" fill={favoritos.includes(clinica.id) ? "currentColor" : "none"} />
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
        
        {filteredClinicas.length === 0 && (
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
