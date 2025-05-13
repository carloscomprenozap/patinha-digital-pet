
import { Link } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import MainLayout from "@/components/layouts/MainLayout";
import Logo from "@/components/Logo";

const Login = () => {
  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold mb-2">Acesse sua conta</h1>
          <p className="text-muted-foreground">
            Entre com suas credenciais para continuar
          </p>
        </div>
        
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2 bg-muted p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Bem-vindo de volta!</h2>
            
            <p className="text-muted-foreground mb-6">
              Faça login para acessar sua conta e gerenciar suas consultas veterinárias. 
              Se você ainda não tem uma conta, pode se cadastrar como cliente ou veterinário.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Para tutores de pets</p>
                  <p className="text-sm text-muted-foreground">Acesse para agendar consultas e gerenciar seus pets.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M8.56 3.69a9 9 0 0 0-2.92 1.95" />
                    <path d="M3.69 8.56A9 9 0 0 0 3 12" />
                    <path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" />
                    <path d="M8.56 20.31A9 9 0 0 0 12 21" />
                    <path d="M15.44 20.31a9 9 0 0 0 2.92-1.95" />
                    <path d="M20.31 15.44A9 9 0 0 0 21 12" />
                    <path d="M20.31 8.56a9 9 0 0 0-1.95-2.92" />
                    <path d="M15.44 3.69A9 9 0 0 0 12 3" />
                    <path d="M12 12v.01" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Para veterinários</p>
                  <p className="text-sm text-muted-foreground">Acesse para gerenciar consultas, horários e prontuários.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded">
              <p className="text-sm">
                Novo por aqui? <Link to="/cadastro" className="text-primary hover:underline font-medium">Cadastre-se como cliente</Link>
              </p>
              <p className="text-sm mt-1">
                É um veterinário? <Link to="/cadastro-veterinario" className="text-primary hover:underline font-medium">Cadastre-se como profissional</Link>
              </p>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <LoginForm />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
