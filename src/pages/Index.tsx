
// Adicionando link para acesso administrativo na página inicial

import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layouts/MainLayout";
import Logo from "@/components/Logo";

const Index = () => {
  return (
    <MainLayout>
      <div className="flex min-h-screen flex-col">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-background to-background/80">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="mb-6">
                <Logo size="lg" />
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Cuidados veterinários acessíveis a um clique de distância
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Conectamos tutores a veterinários qualificados para oferecer o melhor atendimento para seu pet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 min-[400px]:gap-6">
                <Link to="/cadastro">
                  <Button size="lg" className="w-full sm:w-auto">Sou Tutor de Pet</Button>
                </Link>
                <Link to="/cadastro-veterinario">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">Sou Veterinário</Button>
                </Link>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Já tem uma conta?{" "}
                  <Link to="/login" className="text-primary underline underline-offset-2">
                    Faça login
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <Link to="/login-admin" className="text-primary/80 hover:underline">
                    Acesso Administrativo
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12 md:py-16 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Recurso 1 */}
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
                    <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
                    <circle cx="12" cy="12" r="2"></circle>
                    <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
                    <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Atendimento Online</h3>
                <p className="text-muted-foreground">
                  Conecte-se com veterinários de forma remota para consultas, dúvidas e orientações.
                </p>
              </div>
              
              {/* Recurso 2 */}
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                    <path d="M8 14h.01"></path>
                    <path d="M12 14h.01"></path>
                    <path d="M16 14h.01"></path>
                    <path d="M8 18h.01"></path>
                    <path d="M12 18h.01"></path>
                    <path d="M16 18h.01"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Agendamento Fácil</h3>
                <p className="text-muted-foreground">
                  Marque consultas com veterinários de sua preferência em horários convenientes.
                </p>
              </div>
              
              {/* Recurso 3 */}
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M18 2h-2c-.6 0-1 .4-1 1v.658A9.028 9.028 0 0 0 9.958 2C5.752 2 2.328 5.18 2 9.286c-.29 3.629 1.912 6.791 5 7.974v1.652c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-1h2v1c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-1.03c1.526-.722 2.704-1.99 3.242-3.596.135-.4-.163-.804-.592-.804h-1.8c-.326 0-.599.247-.656.57A4.175 4.175 0 0 1 16.5 16.5c-2.3 0-4.13-1.84-4.13-4.13 0-2.29 1.84-4.13 4.13-4.13.933 0 1.784.31 2.473.826.082.06.18.1.285.114.106.015.214.001.312-.041.098-.042.18-.11.24-.195.059-.085.09-.187.087-.289V3c0-.55-.45-1-1-1z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Histórico Completo</h3>
                <p className="text-muted-foreground">
                  Acompanhe todo o histórico de atendimento e evolução da saúde dos seus pets.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Pronto para cuidar melhor do seu pet?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Junte-se a milhares de tutores e veterinários que já utilizam nossa plataforma.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Link to="/cadastro">
                  <Button size="lg" className="w-full sm:w-auto">Cadastrar Agora</Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">Já tenho conta</Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mt-4 pt-2">
                <Link to="/login-admin" className="text-primary/80 hover:underline">
                  Acesso para administradores
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
