
import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { agendamentosMock, veterinariosMock, petsMock } from "@/data/mockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, Send, User } from "lucide-react";

// Mock data para usuários
const usuariosMock = [
  ...veterinariosMock.map(v => ({
    id: v.id,
    nome: v.nome,
    tipo: 'vet',
    online: Math.random() > 0.5,
    ultimaVisto: new Date().toISOString()
  })),
  ...petsMock.map(p => ({
    id: p.clientId,
    nome: `Tutor de ${p.nome}`,
    tipo: 'client',
    online: Math.random() > 0.5,
    ultimaVisto: new Date().toISOString()
  }))
];

// Mock data para mensagens
const mockMensagens: Record<string, Array<{id: string; senderId: string; text: string; timestamp: string}>> = {};

// Preenche mensagens mock para cada usuário
usuariosMock.forEach(usuario => {
  if (usuario.id === '1') return; // Evita conversa consigo mesmo
  
  const numMensagens = Math.floor(Math.random() * 10) + 1;
  const mensagens = [];
  
  for (let i = 0; i < numMensagens; i++) {
    const isUser = Math.random() > 0.5;
    const hoursAgo = Math.floor(Math.random() * 48);
    mensagens.push({
      id: `msg-${usuario.id}-${i}`,
      senderId: isUser ? '1' : usuario.id,
      text: isUser 
        ? `Esta é uma mensagem enviada para ${usuario.nome}. #${i}` 
        : `Esta é uma mensagem recebida de ${usuario.nome}. #${i}`,
      timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()
    });
  }
  
  // Ordena mensagens por timestamp
  mensagens.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  mockMensagens[usuario.id] = mensagens;
});

const Mensagens = () => {
  const { user, profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedUser, setSelectedUser] = useState<string | null>(searchParams.get('userId'));
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState<typeof mockMensagens>({});
  const [searchTerm, setSearchTerm] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isVet = profile?.tipo === 'vet';

  // Inicializa mensagens do mock
  useEffect(() => {
    setMensagens(mockMensagens);
  }, []);

  // Scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedUser, mensagens]);

  // Usuários filtrados baseado na busca e no tipo de usuário (vet vê clientes, cliente vê vets)
  const usuariosFiltrados = usuariosMock.filter(u => {
    // Filtra por tipo oposto ao do usuário logado
    const tipoMatch = isVet ? u.tipo === 'client' : u.tipo === 'vet';
    
    // Filtra pela busca
    const searchMatch = !searchTerm || 
      u.nome.toLowerCase().includes(searchTerm.toLowerCase());
    
    return tipoMatch && searchMatch && u.id !== user?.id;
  });

  // Função para enviar mensagem
  const enviarMensagem = () => {
    if (!mensagem.trim() || !selectedUser) return;
    
    const novaMensagem = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || '',
      text: mensagem,
      timestamp: new Date().toISOString()
    };
    
    setMensagens(prev => ({
      ...prev,
      [selectedUser]: [...(prev[selectedUser] || []), novaMensagem]
    }));
    
    setMensagem("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  const formatarHora = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  const formatarData = (timestamp: string) => {
    return format(new Date(timestamp), "dd 'de' MMMM", { locale: ptBR });
  };

  const formatarStatusOnline = (usuario: any) => {
    if (usuario.online) return 'Online';
    
    const ultimaVisto = new Date(usuario.ultimaVisto);
    const agora = new Date();
    const diferencaHoras = Math.floor((agora.getTime() - ultimaVisto.getTime()) / (1000 * 60 * 60));
    
    if (diferencaHoras < 1) return 'Visto há pouco';
    if (diferencaHoras < 24) return `Visto há ${diferencaHoras}h`;
    return `Visto em ${format(ultimaVisto, 'dd/MM')}`;
  };

  const getNomeUsuario = (id: string) => {
    const usuario = usuariosMock.find(u => u.id === id);
    return usuario ? usuario.nome : 'Usuário';
  };

  return (
    <DashboardLayout>
      <div className="h-full">
        <h1 className="text-3xl font-bold mb-6">Mensagens</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 h-[calc(100vh-220px)]">
          {/* Lista de Contatos */}
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Conversas</CardTitle>
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar contatos..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pb-0">
              <div className="space-y-2">
                {usuariosFiltrados.map((usuario) => (
                  <div
                    key={usuario.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer transition-colors
                      ${selectedUser === usuario.id ? 'bg-primary/10' : 'hover:bg-muted'}`}
                    onClick={() => {
                      setSelectedUser(usuario.id);
                      setSearchParams({ userId: usuario.id });
                    }}
                  >
                    <div className="relative mr-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full 
                        ${usuario.online ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium text-sm truncate">{usuario.nome}</h3>
                        <span className="text-xs text-muted-foreground">
                          {(mensagens[usuario.id]?.length ?? 0) > 0 ? formatarHora(mensagens[usuario.id]![mensagens[usuario.id]!.length - 1].timestamp) : ''}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="truncate">
                          {formatarStatusOnline(usuario)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {usuariosFiltrados.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    Nenhum contato encontrado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Área de Chat */}
          <Card className="h-full flex flex-col">
            {selectedUser ? (
              <>
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center">
                    <div className="relative mr-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full 
                        ${usuariosMock.find(u => u.id === selectedUser)?.online ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {getNomeUsuario(selectedUser)}
                      </CardTitle>
                      <div className="text-xs text-muted-foreground">
                        {formatarStatusOnline(usuariosMock.find(u => u.id === selectedUser) || {})}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto py-4">
                  {mensagens[selectedUser]?.length ? (
                    <div className="space-y-4">
                      {mensagens[selectedUser].map((msg, i) => {
                        const isSender = msg.senderId === user?.id;
                        const showDate = i === 0 || 
                          new Date(msg.timestamp).toDateString() !== new Date(mensagens[selectedUser][i-1].timestamp).toDateString();
                        
                        return (
                          <div key={msg.id}>
                            {showDate && (
                              <div className="text-center my-4">
                                <span className="text-xs bg-muted py-1 px-2 rounded-full">
                                  {formatarData(msg.timestamp)}
                                </span>
                              </div>
                            )}
                            <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                              <div 
                                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                  isSender ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                }`}
                              >
                                <div className="text-sm">{msg.text}</div>
                                <div className="text-xs text-right mt-1 opacity-70">
                                  {formatarHora(msg.timestamp)}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-2">Nenhuma mensagem ainda</p>
                        <p className="text-sm text-muted-foreground">
                          Envie uma mensagem para iniciar a conversa.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1"
                    />
                    <Button onClick={enviarMensagem} disabled={!mensagem.trim()}>
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Enviar</span>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">Selecione uma conversa</p>
                  <p className="text-sm text-muted-foreground">
                    Escolha um contato para iniciar ou continuar uma conversa.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Mensagens;
