
// Atualização do CadastroVeterinario para incluir abas de tipo de cadastro
// Importação do componente CadastroTabs
import CadastroVeterinarioForm from "@/components/auth/CadastroVeterinarioForm";
import Logo from "@/components/Logo";
import MainLayout from "@/components/layouts/MainLayout";
import CadastroTabs from "@/components/auth/CadastroTabs";

const CadastroVeterinario = () => {
  return (
    <MainLayout>
      <div className="container max-w-xl mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold mb-2">Cadastro de Veterinário</h1>
          <p className="text-muted-foreground mb-6">
            Crie sua conta para oferecer seus serviços veterinários na plataforma
          </p>
          <CadastroTabs />
        </div>
        
        <CadastroVeterinarioForm />
      </div>
    </MainLayout>
  );
};

export default CadastroVeterinario;
