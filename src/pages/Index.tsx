
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Tablet, 
  Search, 
  Calendar, 
  Clock,
  Home,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated, profile } = useAuth();

  const getDashboardLink = () => {
    if (!isAuthenticated) return "/login";
    return profile?.tipo === "client" ? "/dashboard" : "/dashboard-vet";
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-background to-vetcare-50 pb-10 md:pb-20">
        <div className="container mx-auto px-6 pt-12 md:pt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Cuidado veterinário na <span className="text-vetcare-500">porta da sua casa</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Agende consultas veterinárias domiciliares de forma rápida e segura, conectando-se aos melhores profissionais da sua região.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link to="/cadastro" className="px-6">
                    Cadastre-se Agora
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to={getDashboardLink()} className="px-6">
                    {isAuthenticated ? "Acessar Minha Conta" : "Entrar"}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-end animate-pulse-slow">
              <img 
                src="https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Veterinário cuidando de animal de estimação" 
                className="rounded-xl shadow-lg max-w-[450px]"
              />
            </div>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto mt-16 px-6">
          <div className="bg-card shadow-lg rounded-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-vetcare-100 text-vetcare-600 rounded-full flex items-center justify-center mb-4">
                <Search size={20} />
              </div>
              <h3 className="font-medium mb-2">Encontre especialistas</h3>
              <p className="text-muted-foreground text-sm">
                Busque veterinários por especialidade e localização próxima a você.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-vetcare-100 text-vetcare-600 rounded-full flex items-center justify-center mb-4">
                <Calendar size={20} />
              </div>
              <h3 className="font-medium mb-2">Agende facilmente</h3>
              <p className="text-muted-foreground text-sm">
                Escolha data e horário conforme a disponibilidade do veterinário.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-vetcare-100 text-vetcare-600 rounded-full flex items-center justify-center mb-4">
                <Home size={20} />
              </div>
              <h3 className="font-medium mb-2">Atendimento em casa</h3>
              <p className="text-muted-foreground text-sm">
                Receba cuidados veterinários no conforto do seu lar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Como funciona</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="w-10 h-10 bg-vetblue-100 text-vetblue-600 rounded-full flex items-center justify-center mb-4">
                <span className="font-bold">1</span>
              </div>
              <h3 className="font-medium mb-2">Cadastre-se</h3>
              <p className="text-muted-foreground text-sm">
                Crie sua conta rapidamente com e-mail e informações básicas.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="w-10 h-10 bg-vetblue-100 text-vetblue-600 rounded-full flex items-center justify-center mb-4">
                <span className="font-bold">2</span>
              </div>
              <h3 className="font-medium mb-2">Encontre um veterinário</h3>
              <p className="text-muted-foreground text-sm">
                Busque profissionais por localização e especialidade.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="w-10 h-10 bg-vetblue-100 text-vetblue-600 rounded-full flex items-center justify-center mb-4">
                <span className="font-bold">3</span>
              </div>
              <h3 className="font-medium mb-2">Agende a consulta</h3>
              <p className="text-muted-foreground text-sm">
                Escolha data e horário que melhor se adequem à sua rotina.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="w-10 h-10 bg-vetblue-100 text-vetblue-600 rounded-full flex items-center justify-center mb-4">
                <span className="font-bold">4</span>
              </div>
              <h3 className="font-medium mb-2">Receba o atendimento</h3>
              <p className="text-muted-foreground text-sm">
                O veterinário irá até sua casa no horário marcado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Para Veterinários */}
      <section className="py-16 bg-vetblue-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-4">
                Para Veterinários
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Expanda sua atuação profissional e atenda mais pacientes com nossa plataforma moderna e intuitiva.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-vetblue-100 text-vetblue-600 flex items-center justify-center mr-3 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Gerencie seus atendimentos com facilidade</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-vetblue-100 text-vetblue-600 flex items-center justify-center mr-3 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Flexibilidade para definir sua disponibilidade</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-vetblue-100 text-vetblue-600 flex items-center justify-center mr-3 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Mantenha histórico completo dos pacientes</span>
                </li>
              </ul>
              <Button asChild>
                <Link to="/cadastro-veterinario">
                  Cadastre-se como Veterinário
                </Link>
              </Button>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Veterinário cuidando de animal"
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-vetcare-500 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Comece a usar o VetCasa hoje
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de tutores e veterinários que já estão usando nossa plataforma para proporcionar o melhor cuidado aos pets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-vetcare-500 hover:bg-gray-100">
              <Link to="/cadastro">
                Cadastrar como Tutor
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/cadastro-veterinario">
                Cadastrar como Veterinário
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
