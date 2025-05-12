
import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Users, Calendar, Clock, Clipboard, Settings } from "lucide-react";

const Clinica = () => {
  const { user, profile } = useAuth();

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-2">Gerenciamento de Clínica</h1>
        <p className="text-muted-foreground mb-6">
          Ferramentas para gerenciar sua clínica veterinária
        </p>

        <Tabs defaultValue="painel" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
            <TabsTrigger value="painel">Painel</TabsTrigger>
            <TabsTrigger value="pacientes">Pacientes</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="prontuarios">Prontuários</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          </TabsList>

          {/* Tab Painel */}
          <TabsContent value="painel" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Localização</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">Clínica Info</div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Configurar endereço e informações de contato da clínica
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Gerenciar Informações
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Equipe</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">Veterinários</div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Gerencie a equipe de profissionais da clínica
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Gerenciar Equipe
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Horários</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">Funcionamento</div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Configure os horários de funcionamento da clínica
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Gerenciar Horários
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas da Clínica</CardTitle>
                <CardDescription>
                  Visão geral do desempenho da clínica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-2">
                    Função disponível em breve
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Estamos trabalhando para trazer estatísticas detalhadas para sua clínica.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Pacientes */}
          <TabsContent value="pacientes">
            <Card>
              <CardHeader>
                <CardTitle>Cadastro de Pacientes</CardTitle>
                <CardDescription>
                  Gerencie os pacientes da clínica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-2">
                    Função em desenvolvimento
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Em breve você poderá cadastrar e gerenciar os pacientes da clínica.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Agenda */}
          <TabsContent value="agenda">
            <Card>
              <CardHeader>
                <CardTitle>Agenda da Clínica</CardTitle>
                <CardDescription>
                  Gerencie todos os agendamentos da clínica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-2">
                    Função em desenvolvimento
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Em breve você terá acesso à agenda completa da clínica.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Prontuários */}
          <TabsContent value="prontuarios">
            <Card>
              <CardHeader>
                <CardTitle>Prontuários</CardTitle>
                <CardDescription>
                  Acesse todos os prontuários da clínica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-2">
                    Função em desenvolvimento
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Em breve você poderá acessar todos os prontuários dos pacientes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Financeiro */}
          <TabsContent value="financeiro">
            <Card>
              <CardHeader>
                <CardTitle>Gestão Financeira</CardTitle>
                <CardDescription>
                  Acompanhe as finanças da clínica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-2">
                    Função em desenvolvimento
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Em breve você terá acesso a relatórios financeiros detalhados.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Configurações */}
          <TabsContent value="configuracoes">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Clínica</CardTitle>
                <CardDescription>
                  Gerencie as configurações gerais da clínica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-2">
                    Função em desenvolvimento
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Em breve você poderá personalizar todas as configurações da clínica.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Clinica;
