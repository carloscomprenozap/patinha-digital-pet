
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
  Shield
} from "lucide-react";
import Logo from "@/components/Logo";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
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
          <div className="flex items-center">
            <Logo />
            <span className="ml-2 font-semibold text-sm text-primary">Admin</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-1 flex-1">
          <NavItems />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center">
            <Logo size="sm" />
            <span className="ml-2 font-semibold text-sm text-primary">Admin</span>
          </div>
          
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px]">
              <div className="flex flex-col h-full py-6">
                <div className="mb-8 flex items-center">
                  <Logo />
                  <span className="ml-2 font-semibold text-primary">Admin</span>
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

export default AdminDashboardLayout;
