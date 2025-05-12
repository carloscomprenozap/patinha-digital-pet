
import { User } from "@/types";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { verificarLogin, LoginCredentials } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Verificar se existe um usuário no localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("vetcasa_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao ler usuário armazenado:", error);
        localStorage.removeItem("vetcasa_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulando um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const loggedUser = verificarLogin(credentials);
      
      if (loggedUser) {
        setUser(loggedUser);
        localStorage.setItem("vetcasa_user", JSON.stringify(loggedUser));
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo(a) ${loggedUser.nome}!`,
        });
        return true;
      } else {
        toast({
          title: "Erro de autenticação",
          description: "Email ou senha incorretos",
          variant: "destructive",
        });
        return false;
      }
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("vetcasa_user");
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
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
