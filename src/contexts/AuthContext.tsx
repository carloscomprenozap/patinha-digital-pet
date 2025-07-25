
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast"; // Changed: import toast function instead of useToast hook
import { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface UserWithProfile extends User {
  profile?: Profile | null;
  tipo?: string;  // Add tipo property directly to UserWithProfile
}

interface AuthContextType {
  user: UserWithProfile | null;
  profile: Profile | null;
  loading: boolean;
  login: (credentials: { email: string; senha: string }) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

interface SignupData {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  tipo: "client" | "vet" | "admin";
  crmv?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  
  // Removed useToast hook call here

  // Inicializa autenticação e escuta mudanças de estado
  useEffect(() => {
    // Configura o listener de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        
        const currentUser = currentSession?.user ?? null;
        setUser(currentUser ? { ...currentUser } : null);
        
        // Obtém perfil do usuário quando o estado muda
        if (currentUser) {
          setTimeout(() => {
            fetchProfile(currentUser.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Verifica sessão existente no carregamento inicial
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser ? { ...currentUser } : null);
      
      if (currentUser) {
        fetchProfile(currentUser.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Busca o perfil do usuário pelo ID
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error);
        return;
      }

      setProfile(data);
      
      // Atualiza o objeto de usuário com o perfil e expõe o tipo diretamente
      setUser(prev => prev ? { ...prev, profile: data, tipo: data.tipo } : null);
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    }
  };

  const login = async (credentials: { email: string; senha: string }): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.senha,
      });
      
      if (error) {
        toast({
          title: "Erro de autenticação",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo(a) de volta!`,
      });
      return true;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Registra o usuário com email e senha
      const { data, error } = await supabase.auth.signUp({ 
        email: userData.email,
        password: userData.senha,
        options: {
          data: {
            nome: userData.nome,
            telefone: userData.telefone,
            tipo: userData.tipo,
            crmv: userData.crmv || null,
          }
        }
      });
      
      if (error) {
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Cadastro realizado com sucesso",
        description: "Você já pode fazer login na plataforma.",
      });
      return true;
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        profile,
        loading, 
        login, 
        signup,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
