
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import MainLayout from "@/components/layouts/MainLayout";
import Logo from "@/components/Logo";
import CadastroAdminForm from "@/components/forms/CadastroAdminForm";

const CadastroAdmin = () => {
  return (
    <MainLayout>
      <div className="container max-w-md mx-auto p-4">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center p-4 md:p-6 bg-primary/5 rounded-t-lg">
            <div className="flex justify-center mb-2">
              <Logo />
            </div>
            <CardTitle className="text-xl md:text-2xl">Cadastro Admin</CardTitle>
            <CardDescription>
              Crie sua conta de administrador
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-4 md:p-6">
            <CadastroAdminForm />
          </CardContent>
          
          <CardFooter className="bg-primary/5 rounded-b-lg p-4 md:p-6">
            <div className="text-center w-full text-sm">
              <p>
                Já tem uma conta de administrador?{" "}
                <Link to="/login-admin" className="text-primary font-medium hover:underline">
                  Faça login
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CadastroAdmin;
