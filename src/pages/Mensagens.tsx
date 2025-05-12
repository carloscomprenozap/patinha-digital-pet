
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { veterinariosMock } from "@/data/mockData";

interface Mensagem {
  id: string;
  senderId: string;
  receiverId: string;
  conteudo: string;
  dataHora: Date;
  lida: boolean;
}

interface Conversa {
  id: string;
  nome: string;
  ultimaMensagem: string;
  dataHora: Date;
  naoLidas: number;
  online: boolean;
  avatar?: string;
}

const Mensagens = () => {
  const { user, profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [conversaSelecionada, setConversaSelecionada] = useState<string | null>(null);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock data for conversations
  const [conversas, setConversas] = useState<Conversa[]>([
    {
      id: veterinariosMock[0].id,
      nome: `Dr. ${veterinariosMock[0].nome}`,
      ultimaMensagem: "Olá! Como posso ajudar?",
      dataHora: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      naoLidas: 1,
      online: true
    },
    {
      id: veterinariosMock[1].id,
      nome: `Dr. ${veterinariosMock[1].nome}`,
      ultimaMensagem: "Seu pet está bem, não se preocupe!",
      dataHora: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      naoLidas: 0,
      online: false
    },
    {
      id: veterinariosMock[2].id,
      nome: `Dr. ${veterinariosMock[2].nome}`,
      ultimaMensagem: "O exame ficou pronto. Vou te enviar.",
      dataHora: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      naoLidas: 0,
      online: false
    }
  ]);
  
  // Mock data for messages
  const [mensagens, setMensagens] = useState<Record<string, Mensagem[]>>({
    [veterinariosMock[0].id]: [
      {
        id: "1",
        senderId: veterinariosMock[0].id,
        receiverId: user?.id || "",
        conteudo: "Olá! Como posso ajudar?",
        dataHora: new Date(Date.now() - 1000 * 60 * 5),
        lida: false
      }
    ],
    [veterinariosMock[1].id]: [
      {
        id: "2",
        senderId: veterinariosMock[1].id,
        receiverId: user?.id || "",
        conteudo: "Bom dia! Recebi os resultados do exame do seu pet.",
        dataHora: new Date(Date.now() - 1000 * 60 * 65),
        lida: true
      },
      {
        id: "3",
        senderId: user?.id || "",
        receiverId: veterinariosMock[1].id,
        conteudo: "Obrigado! E como está?",
        dataHora: new Date(Date.now() - 1000 * 60 * 63),
        lida: true
      },
      {
        id: "4",
        senderId: veterinariosMock[1].id,
        receiverId: user?.id || "",
        conteudo: "Seu pet está bem, não se preocupe!",
        dataHora: new Date(Date.now() - 1000 * 60 * 60),
        lida: true
      }
    ],
    [veterinariosMock[2].id]: [
      {
        id: "5",
        senderId: veterinariosMock[2].id,
        receiverId: user?.id || "",
        conteudo: "Olá, estou enviando a prescrição do seu pet.",
        dataHora: new Date(Date.now() - 1000 * 60 * 60 * 25),
        lida: true
      },
      {
        id: "6",
        senderId: user?.id || "",
        receiverId: veterinariosMock[2].id,
        conteudo: "Obrigado! E quando ficará pronto o exame que solicitou?",
        dataHora: new Date(Date.now() - 1000 * 60 * 60 * 24.5),
        lida: true
      },
      {
        id: "7",
        senderId: veterinariosMock[2].id,
        receiverId: user?.id || "",
        conteudo: "O exame ficou pronto. Vou te enviar.",
        dataHora: new Date(Date.now() - 1000 * 60 * 60 * 24),
        lida: true
      }
    ]
  });
  
  // Check if there's a userId in the URL params to open a specific chat
  useEffect(() => {
    const userIdParam = searchParams.get('userId');
    if (userIdParam) {
      setConversaSelecionada(userIdParam);
      
      // Mark messages as read
      if (mensagens[userIdParam]) {
        setMensagens(prev => ({
          ...prev,
          [userIdParam]: prev[userIdParam].map(msg => ({
            ...msg,
            lida: true
          }))
        }));
        
        // Update unread count in conversation list
        setConversas(prev => prev.map(conv => 
          conv.id === userIdParam ? { ...conv, naoLidas: 0 } : conv
        ));
      }
    }
  }, [searchParams]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensagens, conversaSelecionada]);
  
  const enviarMensagem = () => {
    if (!conversaSelecionada || !novaMensagem.trim()) return;
    
    const novaMensagemObj: Mensagem = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || "",
      receiverId: conversaSelecionada,
      conteudo: novaMensagem,
      dataHora: new Date(),
      lida: false
    };
    
    // Add message to the conversation
    setMensagens(prev => ({
      ...prev,
      [conversaSelecionada]: [...(prev[conversaSelecionada] || []), novaMensagemObj]
    }));
    
    // Update conversation preview
    setConversas(prev => prev.map(conv => 
      conv.id === conversaSelecionada 
        ? { 
            ...conv, 
            ultimaMensagem: novaMensagem,
            dataHora: new Date()
          } 
        : conv
    ));
    
    setNovaMensagem("");
    
    // Simulate reply after 2 seconds
    setTimeout(() => {
      const resposta: Mensagem = {
        id: `msg-${Date.now() + 1}`,
        senderId: conversaSelecionada,
        receiverId: user?.id || "",
        conteudo: "Obrigado pela mensagem! Vou verificar e retornar em breve.",
        dataHora: new Date(),
        lida: false
      };
      
      setMensagens(prev => ({
        ...prev,
        [conversaSelecionada]: [...(prev[conversaSelecionada] || []), resposta]
      }));
      
      // Update conversation preview
      setConversas(prev => prev.map(conv => 
        conv.id === conversaSelecionada 
          ? { 
              ...conv, 
              ultimaMensagem: resposta.conteudo,
              dataHora: new Date(),
              naoLidas: conv.id !== conversaSelecionada ? conv.naoLidas + 1 : 0
            } 
          : conv
      ));
    }, 2000);
  };
  
  const selecionarConversa = (conversaId: string) => {
    setConversaSelecionada(conversaId);
    setSearchParams({ userId: conversaId });
    
    // Mark messages as read
    setMensagens(prev => ({
      ...prev,
      [conversaId]: prev[conversaId]?.map(msg => ({
        ...msg,
        lida: true
      })) || []
    }));
    
    // Update unread count in conversation list
    setConversas(prev => prev.map(conv => 
      conv.id === conversaId ? { ...conv, naoLidas: 0 } : conv
    ));
  };
  
  const filteredConversas = conversas.filter(conversa => 
    conversa.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      return `${diffDays}d`;
    }
  };
  
  // Format date for messages
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get the first letter of each name word for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-6rem)] overflow-hidden">
        {/* Conversation List */}
        <div className="w-full md:w-80 border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold mb-4">Mensagens</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Buscar conversas..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversas.length > 0 ? (
              filteredConversas.map((conversa) => (
                <div
                  key={conversa.id}
                  className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted ${
                    conversaSelecionada === conversa.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => selecionarConversa(conversa.id)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversa.avatar} />
                      <AvatarFallback>{getInitials(conversa.nome)}</AvatarFallback>
                    </Avatar>
                    {conversa.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium truncate">{conversa.nome}</h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimeAgo(conversa.dataHora)}
                      </span>
                    </div>
                    <p className="text-sm truncate text-muted-foreground">
                      {conversa.ultimaMensagem}
                    </p>
                  </div>
                  
                  {conversa.naoLidas > 0 && (
                    <Badge className="bg-primary h-5 w-5 flex items-center justify-center p-0 rounded-full">
                      {conversa.naoLidas}
                    </Badge>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                {searchTerm 
                  ? "Nenhuma conversa encontrada" 
                  : "Nenhuma conversa iniciada"}
              </div>
            )}
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {conversaSelecionada ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarFallback>
                      {getInitials(conversas.find(c => c.id === conversaSelecionada)?.nome || "")}
                    </AvatarFallback>
                  </Avatar>
                  {conversas.find(c => c.id === conversaSelecionada)?.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium">
                    {conversas.find(c => c.id === conversaSelecionada)?.nome}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {conversas.find(c => c.id === conversaSelecionada)?.online 
                      ? "Online" 
                      : "Offline"}
                  </p>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {mensagens[conversaSelecionada]?.map((msg) => {
                    const isSender = msg.senderId === user?.id;
                    
                    return (
                      <div 
                        key={msg.id}
                        className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            isSender 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p>{msg.conteudo}</p>
                          <div className={`text-xs mt-1 ${isSender ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                            {formatMessageTime(msg.dataHora)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Digite sua mensagem..."
                    className="resize-none"
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        enviarMensagem();
                      }
                    }}
                  />
                  <Button 
                    className="flex-shrink-0" 
                    onClick={enviarMensagem}
                    disabled={!novaMensagem.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Card className="w-[80%] max-w-md">
                <CardHeader>
                  <CardTitle className="text-center">Conversas</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Selecione uma conversa para começar a conversar ou inicie uma nova conversa.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Mensagens;
