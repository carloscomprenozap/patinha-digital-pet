
import { useState } from "react";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar,
  LineChart,
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Users, 
  UserPlus, 
  Calendar,
  Building,
  Activity,
  PieChart as PieChartIcon,
  Search
} from "lucide-react";

// Dados para os gráficos (exemplos)
const userStats = [
  { mes: 'Jan', clientes: 65, veterinarios: 28 },
  { mes: 'Fev', clientes: 78, veterinarios: 30 },
  { mes: 'Mar', clientes: 95, veterinarios: 36 },
  { mes: 'Abr', clientes: 120, veterinarios: 42 },
  { mes: 'Mai', clientes: 162, veterinarios: 48 },
  { mes: 'Jun', clientes: 185, veterinarios: 55 },
];

const consultasData = [
  { mes: 'Jan', consultas: 120 },
  { mes: 'Fev', consultas: 145 },
  { mes: 'Mar', consultas: 190 },
  { mes: 'Abr', consultas: 228 },
  { mes: 'Mai', consultas: 310 },
  { mes: 'Jun', consultas: 348 },
];

const pieData = [
  { name: 'Cachorros', value: 540 },
  { name: 'Gatos', value: 320 },
  { name: 'Aves', value: 85 },
  { name: 'Roedores', value: 45 },
  { name: 'Outros', value: 25 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DashboardAdmin = () => {
  const [currentTab, setCurrentTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <AdminDashboardLayout>
      <div className="p-3 md:p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Painel Administrativo</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gerencie todos os aspectos do sistema a partir deste painel.
            </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Buscar..." 
                className="pl-9 h-10 md:w-60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="h-10">Exportar Dados</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Usuários</p>
                <h3 className="text-2xl font-bold">1,247</h3>
                <p className="text-xs text-green-600">+12.5% este mês</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Novos Cadastros</p>
                <h3 className="text-2xl font-bold">48</h3>
                <p className="text-xs text-green-600">+8.2% este mês</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Consultas</p>
                <h3 className="text-2xl font-bold">348</h3>
                <p className="text-xs text-green-600">+24.3% este mês</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clínicas</p>
                <h3 className="text-2xl font-bold">32</h3>
                <p className="text-xs text-green-600">+3.1% este mês</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Building className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full mb-6">
          <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Activity className="h-5 w-5 mr-2" />
                    Crescimento de Usuários
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 md:p-2">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={userStats}
                        margin={{
                          top: 5,
                          right: 20,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="clientes" fill="#8884d8" name="Clientes" />
                        <Bar dataKey="veterinarios" fill="#82ca9d" name="Veterinários" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <PieChartIcon className="h-5 w-5 mr-2" />
                    Distribuição de Pets
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 md:p-2">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Calendar className="h-5 w-5 mr-2" />
                    Consultas por Mês
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 md:p-2">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={consultasData}
                        margin={{
                          top: 5,
                          right: 20,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="consultas"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Conteúdo de gerenciamento de usuários será implementado aqui.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Relatórios e análises avançadas serão implementados aqui.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  );
};

export default DashboardAdmin;
