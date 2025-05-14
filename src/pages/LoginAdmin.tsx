
import { Link } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import Logo from "@/components/Logo";
import AdminLoginForm from "@/components/auth/AdminLoginForm";

const LoginAdmin = () => {
  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto px-4 py-6 md:py-10">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Acesso Administrativo</h1>
          <p className="text-muted-foreground px-4">
            Entre com suas credenciais de administrador para continuar
          </p>
        </div>
        
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-2 bg-muted p-5 rounded-lg shadow-sm order-2 md:order-1">
            <h2 className="text-lg font-semibold mb-3">Área Restrita</h2>
            
            <p className="text-muted-foreground mb-5 text-sm">
              Este acesso é exclusivo para administradores do sistema. Apenas contas registradas com 
              permissões administrativas podem acessar o painel de controle.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Gerenciamento completo</p>
                  <p className="text-xs text-muted-foreground">Acesse todas as funcionalidades administrativas.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Acesso restrito</p>
                  <p className="text-xs text-muted-foreground">Apenas administradores autorizados podem acessar este painel.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-5 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-xs">
                Não tem acesso administrativo?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Voltar ao acesso comum
                </Link>
              </p>
              <p className="text-xs mt-1">
                Precisa de acesso administrativo?{" "}
                <Link to="/cadastro-admin" className="text-primary hover:underline font-medium">
                  Solicite acesso
                </Link>
              </p>
            </div>
          </div>
          
          <div className="md:col-span-3 order-1 md:order-2">
            <AdminLoginForm />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginAdmin;
