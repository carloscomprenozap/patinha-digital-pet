
import { useState, ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  LogOut, 
  User, 
  Users,
  Settings,
  Activity,
  MessageSquare,
  BarChart,
  Bell,
  Menu,
  Shield,
  X
} from "lucide-react";
import Logo from "@/components/Logo";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

interface AdminDashboardLayoutProps {
  children: ReactNode;
}

const AdminDashboardLayout = ({ children }: AdminDashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login-admin');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const menuItems = [
    { icon: Home, label: "Painel Principal", path: "/dashboard-admin" },
    { icon: Users, label: "Usuários", path: "/admin/usuarios" },
    { icon: Activity, label: "Consultas", path: "/admin/consultas" },
    { icon: Shield, label: "Veterinários", path: "/admin/veterinarios" },
    { icon: BarChart, label: "Relatórios", path: "/admin/relatorios" },
    { icon: MessageSquare, label: "Mensagens", path: "/admin/mensagens" },
    { icon: Bell, label: "Notificações", path: "/admin/notificacoes" },
    { icon: Settings, label: "Configurações", path: "/admin/configuracoes" },
    { icon: User, label: "Perfil Admin", path: "/admin/perfil" },
  ];

  const NavItems = () => (
    <>
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="flex items-center space-x-3 text-foreground/80 hover:text-primary hover:bg-primary/10 px-4 py-3 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <item.icon size={20} />
          <span>{item.label}</span>
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-3 text-foreground/80 hover:text-destructive hover:bg-destructive/10 px-4 py-3 rounded-lg transition-colors mt-auto w-full text-left"
      >
        <LogOut size={20} />
        <span>Sair</span>
      </button>
    </>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border p-4 bg-card">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Logo />
            <span className="ml-2 font-semibold text-sm text-primary">Admin</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-1 flex-1 overflow-auto">
          <NavItems />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card shadow-sm">
          <div className="flex items-center">
            <Logo size="sm" />
            <span className="ml-2 font-semibold text-sm text-primary">Admin</span>
          </div>
          
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center">
                    <Logo size="sm" />
                    <span className="ml-2 font-semibold text-primary">Admin</span>
                  </div>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                      <X size={18} />
                    </Button>
                  </SheetClose>
                </div>
                <div className="flex-1 overflow-auto p-4 space-y-2">
                  <NavItems />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
