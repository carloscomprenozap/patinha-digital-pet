import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Search, MessageSquare, Calendar, MapPin, FileText, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const VetConnect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditCurriculo, setIsEditCurriculo] = useState(false);
  const [curriculoAtivo, setCurriculoAtivo] = useState(false);
  
  // Mock data for curriculum
  const [curriculo, setCurriculo] = useState({
    nome: profile?.nome || "",
    telefone: profile?.telefone || "",
    email: user?.email || "",
    formacao: "",
    especializacao: "",
    experiencia: "",
    disponibilidade: "",
    pretensao: "",
    sobre: ""
  });
  
  // Mock data for job offers
  const [vagas, setVagas] = useState([
    {
      id: "v1",
      titulo: "Plantão Veterinário",
      clinica: "Clínica PetVida",
      cidade: "São Paulo",
      estado: "SP",
      tipo: "Plantão",
      salario: "R$ 450/plantão",
      descricao: "Plantão de 12 horas para atendimento de pequenos animais. Experiência mínima de 2 anos.",
      contato: "contato@petvida.com"
    },
    {
      id: "v2",
      titulo: "Veterinário Freelancer",
      clinica: "Hospital Animal Care",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      tipo: "Freelancer",
      salario: "R$ 600/dia",
      descricao: "Atendimento clínico geral e cirurgia de pequenos animais. Disponibilidade para finais de semana.",
      contato: "rh@animalcare.com"
    },
    {
      id: "v3",
      titulo: "Plantão Cirúrgico",
      clinica: "Centro Veterinário Saúde Pet",
      cidade: "Belo Horizonte",
      estado: "MG",
      tipo: "Plantão",
      salario: "R$ 700/plantão",
      descricao: "Plantão para cirurgias de emergência. Especialização em cirurgia necessária.",
      contato: "vagas@saudepet.com"
    }
  ]);
  
  // Mock data for proposals
  const [propostas, setPropostas] = useState([
    {
      id: "p1",
      clinica: "Clínica VetPlus",
      cargo: "Veterinário Clínico",
      cidade: "Campinas",
      estado: "SP",
      tipo: "CLT",
      salario: "R$ 6.000 - R$ 8.000",
      descricao: "Vaga para atendimento clínico geral em pequenos animais.",
      mensagem: "Olá, temos interesse no seu perfil profissional para nossa vaga."
    },
    {
      id: "p2",
      clinica: "PetCare Center",
      cargo: "Dermatologista Veterinário",
      cidade: "São Paulo",
      estado: "SP",
      tipo: "PJ",
      salario: "R$ 10.000 - R$ 15.000",
      descricao: "Vaga para especialista em dermatologia veterinária.",
      mensagem: "Prezado(a), seu currículo chamou nossa atenção e gostaríamos de conversar sobre uma oportunidade."
    }
  ]);
  
  const filteredVagas = searchTerm 
    ? vagas.filter(vaga => 
        vaga.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vaga.clinica.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vaga.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vaga.tipo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : vagas;
  
  const handleSaveCurriculo = () => {
    setIsEditCurriculo(false);
    toast({
      description: "Currículo salvo com sucesso!",
    });
  };
  
  const handleToggleCurriculo = () => {
    setCurriculoAtivo(!curriculoAtivo);
    toast({
      description: curriculoAtivo ? "Currículo desativado" : "Currículo ativado e visível para clínicas",
    });
  };
  
  const handleDeleteCurriculo = () => {
    setCurriculo({
      nome: profile?.nome || "",
      telefone: profile?.telefone || "",
      email: user?.email || "",
      formacao: "",
      especializacao: "",
      experiencia: "",
      disponibilidade: "",
      pretensao: "",
      sobre: ""
    });
    setCurriculoAtivo(false);
    toast({
      description: "Currículo excluído com sucesso",
    });
  };
  
  const handleIniciarChat = (contato: string) => {
    // In a real app, this would start a chat with the contact
    toast({
      description: `Iniciando chat com ${contato}`,
    });
    navigate(`/mensagens?contact=${contato}`);
  };
  
  const curriculoPreenchido = curriculo.formacao !== "" || curriculo.experiencia !== "";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">VetConnect</h1>
          <p className="text-muted-foreground">
            Conecte-se com oportunidades de trabalho
          </p>
        </div>
        
        <Tabs defaultValue="curriculo" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="curriculo">Currículo</TabsTrigger>
            <TabsTrigger value="vagas">Plantões e Freelancer</TabsTrigger>
            <TabsTrigger value="propostas">Propostas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="curriculo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meu Currículo</CardTitle>
                <CardDescription>
                  {curriculoPreenchido 
                    ? "Gerencie seu currículo profissional" 
                    : "Crie seu currículo para receber propostas de clínicas"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isEditCurriculo && curriculoPreenchido ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg">{curriculo.nome}</h3>
                      <p className="text-muted-foreground">{curriculo.email}</p>
                      <p className="text-muted-foreground">{curriculo.telefone}</p>
                    </div>
                    
                    {curriculo.formacao && (
                      <div>
                        <h4 className="font-medium text-base">Formação Acadêmica</h4>
                        <p>{curriculo.formacao}</p>
                      </div>
                    )}
                    
                    {curriculo.especializacao && (
                      <div>
                        <h4 className="font-medium text-base">Especializações</h4>
                        <p>{curriculo.especializacao}</p>
                      </div>
                    )}
                    
                    {curriculo.experiencia && (
                      <div>
                        <h4 className="font-medium text-base">Experiência Profissional</h4>
                        <p>{curriculo.experiencia}</p>
                      </div>
                    )}
                    
                    {curriculo.disponibilidade && (
                      <div>
                        <h4 className="font-medium text-base">Disponibilidade</h4>
                        <p>{curriculo.disponibilidade}</p>
                      </div>
                    )}
                    
                    {curriculo.pretensao && (
                      <div>
                        <h4 className="font-medium text-base">Pretensão Salarial</h4>
                        <p>{curriculo.pretensao}</p>
                      </div>
                    )}
                    
                    {curriculo.sobre && (
                      <div>
                        <h4 className="font-medium text-base">Sobre Mim</h4>
                        <p>{curriculo.sobre}</p>
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <Badge className={curriculoAtivo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {curriculoAtivo ? "Currículo Ativo" : "Currículo Inativo"}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {curriculoAtivo 
                          ? "Seu currículo está visível para clínicas" 
                          : "Seu currículo não está visível para clínicas"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input 
                          id="nome" 
                          value={curriculo.nome} 
                          onChange={e => setCurriculo({...curriculo, nome: e.target.value})} 
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input 
                          id="telefone" 
                          value={curriculo.telefone} 
                          onChange={e => setCurriculo({...curriculo, telefone: e.target.value})} 
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        value={curriculo.email} 
                        onChange={e => setCurriculo({...curriculo, email: e.target.value})} 
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="formacao">Formação Acadêmica</Label>
                      <Textarea 
                        id="formacao" 
                        value={curriculo.formacao} 
                        onChange={e => setCurriculo({...curriculo, formacao: e.target.value})} 
                        placeholder="Ex: Medicina Veterinária, Universidade XYZ, 2015"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="especializacao">Especializações</Label>
                      <Textarea 
                        id="especializacao" 
                        value={curriculo.especializacao} 
                        onChange={e => setCurriculo({...curriculo, especializacao: e.target.value})} 
                        placeholder="Ex: Dermatologia, Cirurgia, Clínica Geral"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="experiencia">Experiência Profissional</Label>
                      <Textarea 
                        id="experiencia" 
                        value={curriculo.experiencia} 
                        onChange={e => setCurriculo({...curriculo, experiencia: e.target.value})} 
                        placeholder="Ex: 3 anos em Clínica XYZ como Veterinário Clínico"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="disponibilidade">Disponibilidade</Label>
                      <Textarea 
                        id="disponibilidade" 
                        value={curriculo.disponibilidade} 
                        onChange={e => setCurriculo({...curriculo, disponibilidade: e.target.value})} 
                        placeholder="Ex: Período integral, plantões, freelancer"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="pretensao">Pretensão Salarial</Label>
                      <Input 
                        id="pretensao" 
                        value={curriculo.pretensao} 
                        onChange={e => setCurriculo({...curriculo, pretensao: e.target.value})} 
                        placeholder="Ex: R$ 5.000 - R$ 7.000 / mês"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="sobre">Sobre Você</Label>
                      <Textarea 
                        id="sobre" 
                        value={curriculo.sobre} 
                        onChange={e => setCurriculo({...curriculo, sobre: e.target.value})} 
                        placeholder="Conte um pouco sobre você, suas habilidades e objetivos profissionais"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {!isEditCurriculo && curriculoPreenchido ? (
                  <>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditCurriculo(true)}
                      >
                        Editar
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            Excluir
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Excluir Currículo</DialogTitle>
                            <DialogDescription>
                              Tem certeza que deseja excluir seu currículo? Esta ação não pode ser desfeita.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline">Cancelar</Button>
                            <Button variant="destructive" onClick={handleDeleteCurriculo}>Excluir</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Button 
                      onClick={handleToggleCurriculo}
                      variant={curriculoAtivo ? "outline" : "default"}
                      className={curriculoAtivo ? "bg-gray-100" : ""}
                    >
                      {curriculoAtivo ? "Desativar" : "Ativar"} Currículo
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (curriculoPreenchido) {
                          setIsEditCurriculo(false);
                        } else {
                          setCurriculo({
                            nome: profile?.nome || "",
                            telefone: profile?.telefone || "",
                            email: user?.email || "",
                            formacao: "",
                            especializacao: "",
                            experiencia: "",
                            disponibilidade: "",
                            pretensao: "",
                            sobre: ""
                          });
                        }
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveCurriculo}>
                      Salvar Currículo
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="vagas" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Buscar vagas por título, clínica ou localidade..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {filteredVagas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredVagas.map((vaga) => (
                  <Card key={vaga.id} className="overflow-hidden">
                    <CardHeader>
                      <div>
                        <CardTitle className="flex items-center justify-between">
                          <span>{vaga.titulo}</span>
                          <Badge variant="outline">{vaga.tipo}</Badge>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {vaga.clinica}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{vaga.cidade}, {vaga.estado}</span>
                      </div>
                      
                      <div className="text-sm">
                        <div className="font-semibold mb-1">Remuneração</div>
                        <p className="text-muted-foreground">{vaga.salario}</p>
                      </div>
                      
                      <div className="text-sm">
                        <div className="font-semibold mb-1">Descrição</div>
                        <p className="text-muted-foreground">{vaga.descricao}</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => handleIniciarChat(vaga.contato)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        Iniciar Chat
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Nenhuma vaga encontrada com os termos da busca" : "Nenhuma vaga disponível no momento"}
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
          </TabsContent>
          
          <TabsContent value="propostas" className="space-y-6">
            {propostas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {propostas.map((proposta) => (
                  <Card key={proposta.id} className="overflow-hidden">
                    <CardHeader>
                      <div>
                        <CardTitle className="flex items-center justify-between">
                          <span>{proposta.cargo}</span>
                          <Badge variant="outline">{proposta.tipo}</Badge>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {proposta.clinica}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{proposta.cidade}, {proposta.estado}</span>
                      </div>
                      
                      <div className="text-sm">
                        <div className="font-semibold mb-1">Remuneração</div>
                        <p className="text-muted-foreground">{proposta.salario}</p>
                      </div>
                      
                      <div className="text-sm">
                        <div className="font-semibold mb-1">Descrição</div>
                        <p className="text-muted-foreground">{proposta.descricao}</p>
                      </div>
                      
                      <div className="text-sm p-4 bg-muted rounded-md">
                        <div className="font-semibold mb-1">Mensagem da Clínica</div>
                        <p className="italic">{proposta.mensagem}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button 
                        variant="outline"
                        className="flex items-center justify-center gap-2 flex-1"
                        onClick={() => handleIniciarChat(proposta.clinica)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        Responder
                      </Button>
                      <Button 
                        className="flex items-center justify-center gap-2 flex-1"
                        onClick={() => {
                          toast({
                            description: "Proposta aceita! A clínica entrará em contato em breve.",
                          });
                        }}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Aceitar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">
                  Você ainda não recebeu propostas
                </p>
                <p className="text-sm">
                  Ative seu currículo para começar a receber propostas de clínicas
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => {
                    // Switch to curriculum tab
                    const curriculoTab = document.querySelector('[data-state="inactive"][data-value="curriculo"]');
                    if (curriculoTab) {
                      (curriculoTab as HTMLButtonElement).click();
                    }
                  }}
                >
                  Gerenciar Currículo
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default VetConnect;
