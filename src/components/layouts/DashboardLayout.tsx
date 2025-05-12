
import { useState, ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Home, 
  LogOut, 
  User, 
  List,
  Clock,
  MessageSquare,
  MapPin,
  Heart,
  Users,
  FileText,
  Bell,
} from "lucide-react";
import Logo from "@/components/Logo";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isClient = profile?.tipo === 'client';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const clientMenuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Calendar, label: "Agendar Consulta", path: "/agendar" },
    { icon: List, label: "Minhas Consultas", path: "/minhas-consultas" },
    { icon: Heart, label: "Favoritos", path: "/favoritos" },
    { icon: User, label: "Meus Pets", path: "/meus-pets" },
    { icon: Users, label: "Clínicas", path: "/clinicas" },
    { icon: FileText, label: "Prontuários", path: "/prontuarios" },
    { icon: Clock, label: "Histórico", path: "/historico" },
    { icon: MessageSquare, label: "Mensagens", path: "/mensagens" },
    { icon: User, label: "Meu Perfil", path: "/perfil" },
  ];

  const vetMenuItems = [
    { icon: Home, label: "Meu Consultório", path: "/dashboard-vet" },
    { icon: Calendar, label: "Agenda", path: "/agenda" },
    { icon: MapPin, label: "Clínica", path: "/clinica" },
    { icon: MessageSquare, label: "Mensagens", path: "/mensagens" },
    { icon: Clock, label: "Meus Horários", path: "/meus-horarios" },
    { icon: List, label: "Histórico", path: "/historico-atendimentos" },
    { icon: Users, label: "VetConnect", path: "/vetconnect" },
    { icon: Bell, label: "Módulos", path: "/modulos" },
    { icon: User, label: "Meu Perfil", path: "/perfil" },
  ];

  const menuItems = isClient ? clientMenuItems : vetMenuItems;

  const NavItems = () => (
    <>
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="flex items-center space-x-3 text-foreground/80 hover:text-primary hover:bg-primary/10 px-4 py-2 rounded-md transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <item.icon size={18} />
          <span>{item.label}</span>
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-3 text-foreground/80 hover:text-destructive hover:bg-destructive/10 px-4 py-2 rounded-md transition-colors mt-auto"
      >
        <LogOut size={18} />
        <span>Sair</span>
      </button>
    </>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border p-4 bg-card">
        <div className="flex items-center justify-between mb-8">
          <Logo />
        </div>
        
        <div className="flex flex-col space-y-1 flex-1">
          <NavItems />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <Logo size="sm" />
          
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px]">
              <div className="flex flex-col h-full py-6">
                <div className="mb-8">
                  <Logo />
                </div>
                <div className="flex flex-col space-y-1 flex-1">
                  <NavItems />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
