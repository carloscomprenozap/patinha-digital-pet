
import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ModuloProps {
  id: string;
  titulo: string;
  descricao: string;
  ativo: boolean;
}

const Modulos = () => {
  const { toast } = useToast();
  
  const [modulos, setModulos] = useState<ModuloProps[]>([
    {
      id: "clinica",
      titulo: "Módulo Clínica",
      descricao: "Gerenciamento de clínica veterinária e pacientes",
      ativo: true
    },
    {
      id: "vetconnect",
      titulo: "Módulo VetConnect",
      descricao: "Plataforma de oportunidades profissionais para veterinários",
      ativo: true
    },
    {
      id: "telemedicina",
      titulo: "Módulo Telemedicina",
      descricao: "Consultas online e teleatendimento veterinário",
      ativo: false
    },
    {
      id: "financeiro",
      titulo: "Módulo Financeiro",
      descricao: "Controle financeiro da clínica e relatórios",
      ativo: false
    }
  ]);
  
  const handleToggleModulo = (id: string) => {
    const updatedModulos = modulos.map(modulo => 
      modulo.id === id ? { ...modulo, ativo: !modulo.ativo } : modulo
    );
    
    setModulos(updatedModulos);
    
    const modulo = updatedModulos.find(m => m.id === id);
    toast({
      description: `${modulo?.titulo} ${modulo?.ativo ? 'ativado' : 'desativado'} com sucesso!`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Módulos</h1>
          <p className="text-muted-foreground">
            Gerencie os módulos disponíveis para sua conta
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modulos.map((modulo) => (
            <Card key={modulo.id}>
              <CardHeader>
                <CardTitle>{modulo.titulo}</CardTitle>
                <CardDescription>{modulo.descricao}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor={`toggle-${modulo.id}`}>
                      {modulo.ativo ? 'Ativo' : 'Desativado'}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {modulo.ativo 
                        ? 'Este módulo está visível no seu menu' 
                        : 'Este módulo está oculto do seu menu'}
                    </p>
                  </div>
                  <Switch
                    id={`toggle-${modulo.id}`}
                    checked={modulo.ativo}
                    onCheckedChange={() => handleToggleModulo(modulo.id)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Módulos Premium</CardTitle>
            <CardDescription>
              Confira nossos módulos premium para expandir as funcionalidades da sua plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h3 className="font-semibold">Módulo Laboratório</h3>
                <p className="text-sm text-muted-foreground">
                  Integração com laboratórios e gestão de resultados de exames
                </p>
              </div>
              <Button>Saiba Mais</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h3 className="font-semibold">Módulo Estoque</h3>
                <p className="text-sm text-muted-foreground">
                  Controle de estoque de medicamentos e produtos veterinários
                </p>
              </div>
              <Button>Saiba Mais</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h3 className="font-semibold">Módulo Pet Shop</h3>
                <p className="text-sm text-muted-foreground">
                  Integração com loja online para venda de produtos pet
                </p>
              </div>
              <Button>Saiba Mais</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Modulos;
