
import { Link } from "react-router-dom";
import CadastroVeterinarioForm from "@/components/auth/CadastroVeterinarioForm";
import MainLayout from "@/components/layouts/MainLayout";
import Logo from "@/components/Logo";

const CadastroVeterinario = () => {
  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold mb-2">Cadastro de Veterinário</h1>
          <p className="text-muted-foreground">
            Junte-se à nossa plataforma e expanda seu atendimento com consultas domiciliares
          </p>
        </div>
        
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2 bg-muted p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Por que se cadastrar?</h2>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Amplie seu atendimento</p>
                  <p className="text-sm text-muted-foreground">Atenda pacientes em domicílio e aumente sua carteira de clientes.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Gerencie sua agenda</p>
                  <p className="text-sm text-muted-foreground">Defina seus horários disponíveis e gerencie suas consultas facilmente.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Acesso a prontuários</p>
                  <p className="text-sm text-muted-foreground">Crie e acesse prontuários eletrônicos para acompanhamento dos pacientes.</p>
                </div>
              </li>
            </ul>
            
            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded">
              <p className="text-sm">
                Já tem uma conta? <Link to="/login" className="text-primary hover:underline font-medium">Faça login</Link>
              </p>
              <p className="text-sm mt-1">
                É um tutor de pets? <Link to="/cadastro" className="text-primary hover:underline font-medium">Cadastre-se como cliente</Link>
              </p>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <CadastroVeterinarioForm />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CadastroVeterinario;
