// Adicionando as novas rotas de administração ao App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import LoginAdmin from "./pages/LoginAdmin";
import Cadastro from "./pages/Cadastro";
import CadastroVeterinario from "./pages/CadastroVeterinario";
import CadastroAdmin from "./pages/CadastroAdmin";
import Dashboard from "./pages/Dashboard";
import DashboardVet from "./pages/DashboardVet";
import DashboardAdmin from "./pages/DashboardAdmin";
import AgendarConsulta from "./pages/AgendarConsulta";
import NotFound from "./pages/NotFound";
import Agenda from "./pages/Agenda";
import MeusHorarios from "./pages/MeusHorarios";
import HistoricoAtendimentos from "./pages/HistoricoAtendimentos";
import Clinica from "./pages/Clinica";
import Mensagens from "./pages/Mensagens";
import Perfil from "./pages/Perfil";
import Prontuario from "./pages/Prontuario";
import Clinicas from "./pages/Clinicas";
import Favoritos from "./pages/Favoritos";
import Historico from "./pages/Historico";
import MeusPets from "./pages/MeusPets";
import MinhasConsultas from "./pages/MinhasConsultas";
import Prontuarios from "./pages/Prontuarios";
import VetConnect from "./pages/VetConnect";
import Modulos from "./pages/Modulos";

// Import Admin pages
import Usuarios from "./pages/admin/Usuarios";
import Consultas from "./pages/admin/Consultas";
import Veterinarios from "./pages/admin/Veterinarios";
import Relatorios from "./pages/admin/Relatorios";
import Notificacoes from "./pages/admin/Notificacoes";
import Configuracoes from "./pages/admin/Configuracoes";

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

// Componente de rota protegida para administradores
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, profile, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login-admin" />;
  }
  
  if (profile?.tipo !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// Componente para rota protegida para usuários autenticados (qualquer tipo)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
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
    } else if (profile?.tipo === 'admin') {
      return <Navigate to="/dashboard-admin" />;
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
      path="/login-admin" 
      element={
        <GuestRoute>
          <LoginAdmin />
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
    <Route 
      path="/cadastro-admin" 
      element={
        <GuestRoute>
          <CadastroAdmin />
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
    <Route 
      path="/minhas-consultas" 
      element={
        <ClienteRoute>
          <MinhasConsultas />
        </ClienteRoute>
      } 
    />
    <Route 
      path="/meus-pets" 
      element={
        <ClienteRoute>
          <MeusPets />
        </ClienteRoute>
      } 
    />
    <Route 
      path="/clinicas" 
      element={
        <ClienteRoute>
          <Clinicas />
        </ClienteRoute>
      } 
    />
    <Route 
      path="/favoritos" 
      element={
        <ClienteRoute>
          <Favoritos />
        </ClienteRoute>
      } 
    />
    <Route 
      path="/prontuarios" 
      element={
        <ClienteRoute>
          <Prontuarios />
        </ClienteRoute>
      } 
    />
    <Route 
      path="/historico" 
      element={
        <ClienteRoute>
          <Historico />
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
    <Route 
      path="/agenda" 
      element={
        <VeterinarioRoute>
          <Agenda />
        </VeterinarioRoute>
      } 
    />
    <Route 
      path="/meus-horarios" 
      element={
        <VeterinarioRoute>
          <MeusHorarios />
        </VeterinarioRoute>
      } 
    />
    <Route 
      path="/historico-atendimentos" 
      element={
        <VeterinarioRoute>
          <HistoricoAtendimentos />
        </VeterinarioRoute>
      } 
    />
    <Route 
      path="/clinica" 
      element={
        <VeterinarioRoute>
          <Clinica />
        </VeterinarioRoute>
      } 
    />
    <Route 
      path="/prontuario" 
      element={
        <AuthRoute>
          <Prontuario />
        </AuthRoute>
      } 
    />
    <Route 
      path="/vetconnect" 
      element={
        <VeterinarioRoute>
          <VetConnect />
        </VeterinarioRoute>
      } 
    />
    <Route 
      path="/modulos" 
      element={
        <VeterinarioRoute>
          <Modulos />
        </VeterinarioRoute>
      } 
    />
    
    {/* Rotas de Administrador */}
    <Route 
      path="/dashboard-admin" 
      element={
        <AdminRoute>
          <DashboardAdmin />
        </AdminRoute>
      } 
    />
    <Route 
      path="/admin/usuarios" 
      element={
        <AdminRoute>
          <Usuarios />
        </AdminRoute>
      } 
    />
    <Route 
      path="/admin/consultas" 
      element={
        <AdminRoute>
          <Consultas />
        </AdminRoute>
      } 
    />
    <Route 
      path="/admin/veterinarios" 
      element={
        <AdminRoute>
          <Veterinarios />
        </AdminRoute>
      } 
    />
    <Route 
      path="/admin/relatorios" 
      element={
        <AdminRoute>
          <Relatorios />
        </AdminRoute>
      } 
    />
    <Route 
      path="/admin/mensagens" 
      element={
        <AdminRoute>
          <Mensagens />
        </AdminRoute>
      } 
    />
    <Route 
      path="/admin/notificacoes" 
      element={
        <AdminRoute>
          <Notificacoes />
        </AdminRoute>
      } 
    />
    <Route 
      path="/admin/configuracoes" 
      element={
        <AdminRoute>
          <Configuracoes />
        </AdminRoute>
      } 
    />
    <Route 
      path="/admin/perfil" 
      element={
        <AdminRoute>
          <Perfil />
        </AdminRoute>
      } 
    />
    
    {/* Rotas Compartilhadas (Cliente e Veterinário) */}
    <Route 
      path="/mensagens" 
      element={
        <AuthRoute>
          <Mensagens />
        </AuthRoute>
      } 
    />
    <Route 
      path="/perfil" 
      element={
        <AuthRoute>
          <Perfil />
        </AuthRoute>
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
