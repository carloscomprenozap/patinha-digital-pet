
import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Send, Search, Clock } from "lucide-react";

// Interface para mensagem
interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  conteudo: string;
  created_at: string;
  lido: boolean;
  sender_name?: string;
}

// Interface para contato
interface Contact {
  id: string;
  nome: string;
  tipo: string;
  ultima_mensagem?: string;
  data_ultima_mensagem?: string;
  nao_lidas: number;
  vet_id?: string;
  ehVeterinario: boolean;
}

const Mensagens = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("contacts");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Efeito para carregar contatos iniciais
  useEffect(() => {
    if (user) {
      loadContacts();
      
      // Configurar listener para mensagens em tempo real
      const channel = supabase
        .channel('mensagens-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'mensagens',
            filter: `receiver_id=eq.${user.id}`
          },
          payload => {
            handleNewMessage(payload.new as any);
          }
        )
        .subscribe();
      
      // Limpar listener ao desmontar
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);
  
  // Função para lidar com novas mensagens recebidas em tempo real
  const handleNewMessage = async (message: Message) => {
    // Se for do contato atualmente selecionado, adicionar à conversa
    if (selectedContact && message.sender_id === selectedContact.id) {
      // Buscar nome do remetente
      const { data: senderData } = await supabase
        .from('profiles')
        .select('nome')
        .eq('id', message.sender_id)
        .single();
      
      setMessages(prev => [...prev, {
        ...message,
        sender_name: senderData?.nome || 'Usuário'
      }]);
      
      // Marcar mensagem como lida
      markMessageAsRead(message.id);
      
      // Rolar para o final da conversa
      scrollToBottom();
    }
    
    // Atualizar lista de contatos com nova mensagem
    updateContactWithNewMessage(message);
  };
  
  // Atualizar contato com nova mensagem
  const updateContactWithNewMessage = async (message: Message) => {
    setContacts(prevContacts => {
      const contactIndex = prevContacts.findIndex(c => c.id === message.sender_id);
      if (contactIndex === -1) {
        // Se o contato não estiver na lista, adicionar (precisaria buscar dados do contato)
        return prevContacts;
      }
      
      const updatedContacts = [...prevContacts];
      updatedContacts[contactIndex] = {
        ...updatedContacts[contactIndex],
        ultima_mensagem: message.conteudo,
        data_ultima_mensagem: message.created_at,
        nao_lidas: updatedContacts[contactIndex].nao_lidas + 1
      };
      
      return updatedContacts;
    });
    
    // Atualizar contatos filtrados também
    setFilteredContacts(prevFiltered => {
      const contactIndex = prevFiltered.findIndex(c => c.id === message.sender_id);
      if (contactIndex === -1) return prevFiltered;
      
      const updatedFiltered = [...prevFiltered];
      updatedFiltered[contactIndex] = {
        ...updatedFiltered[contactIndex],
        ultima_mensagem: message.conteudo,
        data_ultima_mensagem: message.created_at,
        nao_lidas: updatedFiltered[contactIndex].nao_lidas + 1
      };
      
      return updatedFiltered;
    });
  };
  
  // Carregar contatos
  const loadContacts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Primeiro, carregamos todas as mensagens deste usuário
      const { data: mensagemData, error: mensagemError } = await supabase
        .from('mensagens')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
        
      if (mensagemError) throw mensagemError;
      
      // Identificamos os IDs únicos de usuários com quem conversamos
      const userIds = new Set<string>();
      mensagemData?.forEach(msg => {
        const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        userIds.add(otherId);
      });
      
      // Carregamos os perfis destes usuários
      const userIdsArray = Array.from(userIds);
      if (userIdsArray.length === 0) {
        setContacts([]);
        setFilteredContacts([]);
        setLoading(false);
        return;
      }
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIdsArray);
        
      if (profilesError) throw profilesError;
      
      // Informações adicionais para veterinários, se necessário
      const vetIds = profilesData
        ?.filter(profile => profile.tipo === 'vet')
        .map(profile => profile.id) || [];
        
      // Compilar informações dos contatos
      const contactsData: Contact[] = [];
      
      for (const profile of profilesData || []) {
        // Filtrar mensagens deste contato
        const conversationMessages = mensagemData?.filter(
          msg => msg.sender_id === profile.id || msg.receiver_id === profile.id
        ) || [];
        
        // Encontrar última mensagem
        conversationMessages.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        const lastMessage = conversationMessages[0];
        
        // Contar mensagens não lidas
        const unreadCount = conversationMessages.filter(
          msg => msg.receiver_id === user.id && msg.sender_id === profile.id && !msg.lido
        ).length;
        
        contactsData.push({
          id: profile.id,
          nome: profile.nome,
          tipo: profile.tipo,
          ultima_mensagem: lastMessage?.conteudo,
          data_ultima_mensagem: lastMessage?.created_at,
          nao_lidas: unreadCount,
          ehVeterinario: profile.tipo === 'vet'
        });
      }
      
      // Ordenar contatos por data da última mensagem
      contactsData.sort((a, b) => {
        if (!a.data_ultima_mensagem) return 1;
        if (!b.data_ultima_mensagem) return -1;
        return new Date(b.data_ultima_mensagem).getTime() - new Date(a.data_ultima_mensagem).getTime();
      });
      
      setContacts(contactsData);
      setFilteredContacts(contactsData);
      
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus contatos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Filtra contatos com base no termo de busca
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchTerm, contacts]);
  
  // Carregar mensagens de um contato específico
  const loadMessages = async (contact: Contact) => {
    if (!user || !contact) return;
    
    setLoading(true);
    setSelectedContact(contact);
    
    try {
      const { data, error } = await supabase
        .from('mensagens')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${contact.id}),and(sender_id.eq.${contact.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      // Mapear mensagens para o formato esperado
      const messagesWithNames: Message[] = await Promise.all(
        (data || []).map(async (msg) => {
          // Buscar nome do remetente para cada mensagem
          const { data: senderData } = await supabase
            .from('profiles')
            .select('nome')
            .eq('id', msg.sender_id)
            .single();
            
          return {
            ...msg,
            sender_name: senderData?.nome || 'Usuário'
          };
        })
      );
      
      setMessages(messagesWithNames);
      
      // Marcar mensagens recebidas como lidas
      const unreadMessages = data?.filter(msg => 
        msg.receiver_id === user.id && !msg.lido
      ) || [];
      
      if (unreadMessages.length > 0) {
        const unreadIds = unreadMessages.map(msg => msg.id);
        await markMessagesAsRead(unreadIds);
        
        // Atualizar contador de não lidas no contato
        setContacts(prev => {
          return prev.map(c => {
            if (c.id === contact.id) {
              return { ...c, nao_lidas: 0 };
            }
            return c;
          });
        });
        
        setFilteredContacts(prev => {
          return prev.map(c => {
            if (c.id === contact.id) {
              return { ...c, nao_lidas: 0 };
            }
            return c;
          });
        });
      }
      
      // Rolar para o final da conversa
      scrollToBottom();
      
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as mensagens",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Marcar uma mensagem como lida
  const markMessageAsRead = async (messageId: string) => {
    await supabase
      .from('mensagens')
      .update({ lido: true })
      .eq('id', messageId);
  };
  
  // Marcar várias mensagens como lidas
  const markMessagesAsRead = async (messageIds: string[]) => {
    if (messageIds.length === 0) return;
    
    await supabase
      .from('mensagens')
      .update({ lido: true })
      .in('id', messageIds);
  };
  
  // Enviar nova mensagem
  const sendMessage = async () => {
    if (!user || !selectedContact || !newMessage.trim()) return;
    
    try {
      const messageData = {
        sender_id: user.id,
        receiver_id: selectedContact.id,
        conteudo: newMessage.trim(),
        lido: false
      };
      
      const { data, error } = await supabase
        .from('mensagens')
        .insert(messageData)
        .select()
        .single();
        
      if (error) throw error;
      
      // Adicionar mensagem enviada à lista
      setMessages(prev => [
        ...prev, 
        { 
          ...data, 
          sender_name: profile?.nome || 'Você' 
        }
      ]);
      
      // Atualizar informações do contato
      setContacts(prev => {
        return prev.map(c => {
          if (c.id === selectedContact.id) {
            return {
              ...c,
              ultima_mensagem: newMessage.trim(),
              data_ultima_mensagem: new Date().toISOString()
            };
          }
          return c;
        });
      });
      
      setFilteredContacts(prev => {
        return prev.map(c => {
          if (c.id === selectedContact.id) {
            return {
              ...c,
              ultima_mensagem: newMessage.trim(),
              data_ultima_mensagem: new Date().toISOString()
            };
          }
          return c;
        });
      });
      
      // Limpar campo de mensagem
      setNewMessage("");
      
      // Rolar para o final da conversa
      scrollToBottom();
      
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive"
      });
    }
  };
  
  // Lidar com a tecla Enter para enviar mensagem
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newMessage.trim()) {
      sendMessage();
    }
  };
  
  // Rolar para o final da conversa
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  // Formatação de data
  const formatMessageDate = (dateString: string) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    
    // Se for hoje, mostrar apenas a hora
    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, 'HH:mm');
    }
    
    // Se for esta semana, mostrar dia da semana e hora
    const diffDays = Math.floor((today.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return format(messageDate, 'EEE, HH:mm');
    }
    
    // Caso contrário, mostrar data completa
    return format(messageDate, 'dd/MM/yyyy HH:mm');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Mensagens</h1>
          <p className="text-muted-foreground">
            Converse com seus veterinários e acompanhe suas consultas
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lista de Contatos */}
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle>Contatos</CardTitle>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar contatos..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading && contacts.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : filteredContacts.length > 0 ? (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-1">
                    {filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`p-3 rounded-lg cursor-pointer flex items-center space-x-3 hover:bg-accent ${
                          selectedContact?.id === contact.id ? 'bg-accent' : ''
                        }`}
                        onClick={() => loadMessages(contact)}
                      >
                        <Avatar>
                          <AvatarFallback>{contact.nome[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="font-medium truncate pr-2">{contact.nome}</div>
                            {contact.data_ultima_mensagem && (
                              <div className="text-xs text-muted-foreground">
                                {formatMessageDate(contact.data_ultima_mensagem)}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm truncate text-muted-foreground max-w-[180px]">
                              {contact.ultima_mensagem || "Nenhuma mensagem ainda"}
                            </div>
                            {contact.nao_lidas > 0 && (
                              <Badge variant="secondary" className="ml-2">{contact.nao_lidas}</Badge>
                            )}
                          </div>
                          {contact.ehVeterinario && (
                            <Badge variant="outline" className="mt-1">Veterinário</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum contato encontrado</p>
                  <p className="text-sm mt-1">
                    Suas conversas com veterinários aparecerão aqui
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Área de Chat */}
          <Card className="md:col-span-2">
            {selectedContact ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>{selectedContact.nome[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{selectedContact.nome}</CardTitle>
                      <div className="text-sm text-muted-foreground">{
                        selectedContact.ehVeterinario ? 'Veterinário' : 'Cliente'
                      }</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-col h-[500px]">
                    <ScrollArea className="flex-1 p-4">
                      {messages.length > 0 ? (
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${
                                message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`rounded-lg py-2 px-3 max-w-[80%] ${
                                  message.sender_id === user?.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-accent'
                                }`}
                              >
                                <div className="text-sm whitespace-pre-wrap break-words">
                                  {message.conteudo}
                                </div>
                                <div className="text-xs mt-1 opacity-70 flex items-center justify-end gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatMessageDate(message.created_at)}
                                </div>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-muted-foreground">Nenhuma mensagem ainda</p>
                            <p className="text-sm mt-1">Comece a conversar agora</p>
                          </div>
                        </div>
                      )}
                    </ScrollArea>
                    
                    <div className="p-4 border-t">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Digite sua mensagem..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={handleKeyPress}
                        />
                        <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-xl font-medium mb-2">Selecione um contato</h3>
                  <p className="text-muted-foreground max-w-md">
                    Escolha um contato da lista à esquerda para iniciar ou continuar uma conversa
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
