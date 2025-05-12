
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import CadastroVeterinario from "./pages/CadastroVeterinario";
import Dashboard from "./pages/Dashboard";
import DashboardVet from "./pages/DashboardVet";
import AgendarConsulta from "./pages/AgendarConsulta";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente de rota protegida para clientes
const ClienteRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, profile, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (profile?.tipo !== 'client') {
    return <Navigate to="/dashboard-vet" />;
  }
  
  return <>{children}</>;
};

// Componente de rota protegida para veterinários
const VeterinarioRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, profile, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (profile?.tipo !== 'vet') {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

// Componente para redirecionar usuário autenticado
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, profile, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  if (isAuthenticated) {
    if (profile?.tipo === 'vet') {
      return <Navigate to="/dashboard-vet" />;
    }
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    {/* Rotas Públicas */}
    <Route path="/" element={<Index />} />
    
    {/* Rotas de Autenticação */}
    <Route 
      path="/login" 
      element={
        <GuestRoute>
          <Login />
        </GuestRoute>
      } 
    />
    <Route 
      path="/cadastro" 
      element={
        <GuestRoute>
          <Cadastro />
        </GuestRoute>
      } 
    />
    <Route 
      path="/cadastro-veterinario" 
      element={
        <GuestRoute>
          <CadastroVeterinario />
        </GuestRoute>
      } 
    />
    
    {/* Rotas de Cliente */}
    <Route 
      path="/dashboard" 
      element={
        <ClienteRoute>
          <Dashboard />
        </ClienteRoute>
      } 
    />
    <Route 
      path="/agendar" 
      element={
        <ClienteRoute>
          <AgendarConsulta />
        </ClienteRoute>
      } 
    />
    
    {/* Rotas de Veterinário */}
    <Route 
      path="/dashboard-vet" 
      element={
        <VeterinarioRoute>
          <DashboardVet />
        </VeterinarioRoute>
      } 
    />
    
    {/* Rota de Erro */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
