
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const CadastroTabs = () => {
  const [activeTab, setActiveTab] = useState("cliente");
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === "cliente") {
      navigate("/cadastro");
    } else if (value === "veterinario") {
      navigate("/cadastro-veterinario");
    } else if (value === "admin") {
      navigate("/cadastro-admin");
    }
  };

  return (
    <div className="mb-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="cliente">Cliente</TabsTrigger>
          <TabsTrigger value="veterinario">Veterinário</TabsTrigger>
          <TabsTrigger value="admin">Administrador</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default CadastroTabs;
