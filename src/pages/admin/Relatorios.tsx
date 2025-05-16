
import { useState } from "react";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import {
  Calendar,
  Download,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  PieChart as PieChartIcon
} from "lucide-react";

// Mock data for charts
const usuariosData = [
  { mes: 'Jan', clientes: 45, veterinarios: 12 },
  { mes: 'Fev', clientes: 52, veterinarios: 15 },
  { mes: 'Mar', clientes: 61, veterinarios: 18 },
  { mes: 'Abr', clientes: 67, veterinarios: 22 },
  { mes: 'Mai', clientes: 75, veterinarios: 27 },
  { mes: 'Jun', clientes: 87, veterinarios: 32 },
  { mes: 'Jul', clientes: 93, veterinarios: 35 }
];

const consultasData = [
  { mes: 'Jan', consultas: 78, concluidas: 65, canceladas: 13 },
  { mes: 'Fev', consultas: 92, concluidas: 76, canceladas: 16 },
  { mes: 'Mar', consultas: 118, concluidas: 95, canceladas: 23 },
  { mes: 'Abr', consultas: 145, concluidas: 120, canceladas: 25 },
  { mes: 'Mai', consultas: 171, concluidas: 142, canceladas: 29 },
  { mes: 'Jun', consultas: 195, concluidas: 160, canceladas: 35 },
  { mes: 'Jul', consultas: 214, concluidas: 176, canceladas: 38 }
];

const faturamentoData = [
  { mes: 'Jan', valor: 15680 },
  { mes: 'Fev', valor: 18420 },
  { mes: 'Mar', valor: 23600 },
  { mes: 'Abr', valor: 29000 },
  { mes: 'Mai', valor: 34200 },
  { mes: 'Jun', valor: 39000 },
  { mes: 'Jul', valor: 42800 }
];

const especialidadesData = [
  { nome: 'Clínica Geral', valor: 35 },
  { nome: 'Dermatologia', valor: 18 },
  { nome: 'Ortopedia', valor: 15 },
  { nome: 'Cardiologia', valor: 12 },
  { nome: 'Oftalmologia', valor: 10 },
  { nome: 'Outras', valor: 10 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#d88488'];

const especiesData = [
  { nome: 'Cachorro', valor: 65 },
  { nome: 'Gato', valor: 25 },
  { nome: 'Ave', valor: 5 },
  { nome: 'Roedor', valor: 3 },
  { nome: 'Réptil', valor: 1 },
  { nome: 'Outro', valor: 1 }
];

const Relatorios = () => {
  const [currentTab, setCurrentTab] = useState("usuarios");
  const [periodoUsuarios, setPeriodoUsuarios] = useState("7meses");
  const [periodoConsultas, setPeriodoConsultas] = useState("7meses");
  const [periodoFaturamento, setPeriodoFaturamento] = useState("7meses");
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios e Análises</h1>
            <p className="text-muted-foreground mt-1">
              Visualize métricas e estatísticas da plataforma
            </p>
          </div>
          <div className="flex space-x-2">
            <Button className="h-10">
              <Calendar className="h-4 w-4 mr-2" />
              Período Personalizado
            </Button>
            <Button variant="outline" className="h-10">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="usuarios">
              <Users className="h-4 w-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="consultas">
              <Activity className="h-4 w-4 mr-2" />
              Consultas
            </TabsTrigger>
            <TabsTrigger value="faturamento">
              <DollarSign className="h-4 w-4 mr-2" />
              Faturamento
            </TabsTrigger>
            <TabsTrigger value="analises">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Análises
            </TabsTrigger>
          </TabsList>
          
          {/* Tab de Usuários */}
          <TabsContent value="usuarios" className="mt-4 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Crescimento de Usuários</h2>
              <Select value={periodoUsuarios} onValueChange={setPeriodoUsuarios}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                  <SelectItem value="3meses">Últimos 3 meses</SelectItem>
                  <SelectItem value="7meses">Últimos 7 meses</SelectItem>
                  <SelectItem value="12meses">Últimos 12 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total de Usuários</CardTitle>
                  <CardDescription>Número total de cadastros</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">1,247</div>
                  <p className="text-sm text-green-600 flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +14.5% em relação ao período anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Clientes</CardTitle>
                  <CardDescription>Usuários tipo cliente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">1,085</div>
                  <p className="text-sm text-green-600 flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12.8% em relação ao período anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Veterinários</CardTitle>
                  <CardDescription>Usuários tipo veterinário</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">162</div>
                  <p className="text-sm text-green-600 flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +8.7% em relação ao período anterior
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Crescimento por Tipo de Usuário</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={usuariosData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="clientes" name="Clientes" fill="#0088FE" />
                    <Bar dataKey="veterinarios" name="Veterinários" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab de Consultas */}
          <TabsContent value="consultas" className="mt-4 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Estatísticas de Consultas</h2>
              <Select value={periodoConsultas} onValueChange={setPeriodoConsultas}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                  <SelectItem value="3meses">Últimos 3 meses</SelectItem>
                  <SelectItem value="7meses">Últimos 7 meses</SelectItem>
                  <SelectItem value="12meses">Últimos 12 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total de Consultas</CardTitle>
                  <CardDescription>Período selecionado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">1,013</div>
                  <p className="text-sm text-green-600 flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +18.2% em relação ao período anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Consultas Concluídas</CardTitle>
                  <CardDescription>Período selecionado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">834</div>
                  <p className="text-sm text-green-600 flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +15.5% em relação ao período anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Consultas Canceladas</CardTitle>
                  <CardDescription>Período selecionado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">179</div>
                  <p className="text-sm text-green-600 flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +3.4% em relação ao período anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Taxa de Conclusão</CardTitle>
                  <CardDescription>Período selecionado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">82.3%</div>
                  <p className="text-sm text-green-600 flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +2.1% em relação ao período anterior
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Evolução de Consultas</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={consultasData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="consultas" name="Total de Consultas" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="concluidas" name="Consultas Concluídas" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="canceladas" name="Consultas Canceladas" stroke="#ff7300" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab de Faturamento */}
          <TabsContent value="faturamento" className="mt-4 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Dados Financeiros</h2>
              <Select value={periodoFaturamento} onValueChange={setPeriodoFaturamento}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                  <SelectItem value="3meses">Últimos 3 meses</SelectItem>
                  <SelectItem value="7meses">Últimos 7 meses</SelectItem>
                  <SelectItem value="12meses">Últimos 12 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Faturamento Total</CardTitle>
                  <CardDescription>Período selecionado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{formatCurrency(202700)}</div>
                  <p className="text-sm text-green-600 flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +22.5% em relação ao período anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ticket Médio</CardTitle>
                  <CardDescription>Valor médio por consulta</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{formatCurrency(200)}</div>
                  <p className="text-sm text-green-600 flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +5.2% em relação ao período anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Projeção Mensal</CardTitle>
                  <CardDescription>Baseada no ritmo atual</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{formatCurrency(45000)}</div>
                  <p className="text-sm text-green-600 flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +18.7% em relação ao período anterior
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Evolução do Faturamento</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={faturamentoData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="valor" name="Faturamento" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab de Análises */}
          <TabsContent value="analises" className="mt-4 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Análises e Distribuições</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Especialidades</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={especialidadesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="valor"
                        label={({ nome, percent }) => `${nome}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {especialidadesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend layout="vertical" align="right" verticalAlign="middle" />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Espécies</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={especiesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="valor"
                        label={({ nome, percent }) => `${nome}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {especiesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend layout="vertical" align="right" verticalAlign="middle" />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  );
};

export default Relatorios;
