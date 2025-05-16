
import { useState } from "react";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText, 
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from "lucide-react";

// Dados para os gráficos (exemplos)
const dadosConsultasMes = [
  { mes: 'Jan', consultas: 120 },
  { mes: 'Fev', consultas: 145 },
  { mes: 'Mar', consultas: 190 },
  { mes: 'Abr', consultas: 228 },
  { mes: 'Mai', consultas: 310 },
  { mes: 'Jun', consultas: 348 },
];

const dadosCrescimentoUsuarios = [
  { mes: 'Jan', clientes: 65, veterinarios: 28 },
  { mes: 'Fev', clientes: 78, veterinarios: 30 },
  { mes: 'Mar', clientes: 95, veterinarios: 36 },
  { mes: 'Abr', clientes: 120, veterinarios: 42 },
  { mes: 'Mai', clientes: 162, veterinarios: 48 },
  { mes: 'Jun', clientes: 185, veterinarios: 55 },
];

const dadosEspecies = [
  { name: 'Cachorros', value: 540 },
  { name: 'Gatos', value: 320 },
  { name: 'Aves', value: 85 },
  { name: 'Roedores', value: 45 },
  { name: 'Outros', value: 25 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Relatorios = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState("6meses");
  const [tipoRelatorio, setTipoRelatorio] = useState("consultas");
  
  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
            <p className="text-muted-foreground mt-1">
              Análise de dados e estatísticas da plataforma
            </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="3meses">Últimos 3 meses</SelectItem>
                <SelectItem value="6meses">Últimos 6 meses</SelectItem>
                <SelectItem value="1ano">Último ano</SelectItem>
                <SelectItem value="total">Todo período</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Gerar PDF
            </Button>
            
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar Dados
            </Button>
          </div>
        </div>
        
        <Tabs value={tipoRelatorio} onValueChange={setTipoRelatorio} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="consultas" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Consultas
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="flex items-center">
              <LineChartIcon className="h-4 w-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="pets" className="flex items-center">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Pets
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Relatório de Consultas */}
        <TabsContent value="consultas" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Consultas por Mês</CardTitle>
                <CardDescription>
                  Número total de consultas realizadas por mês
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dadosConsultasMes}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
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
                      name="Consultas"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status de Consultas</CardTitle>
                <CardDescription>
                  Distribuição de consultas por status
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Agendadas', value: 85 },
                        { name: 'Confirmadas', value: 45 },
                        { name: 'Concluídas', value: 210 },
                        { name: 'Canceladas', value: 32 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: 'Agendadas', value: 85, color: '#8884d8' },
                        { name: 'Confirmadas', value: 45, color: '#82ca9d' },
                        { name: 'Concluídas', value: 210, color: '#ffc658' },
                        { name: 'Canceladas', value: 32, color: '#ff8042' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Consultas por Dia da Semana</CardTitle>
                <CardDescription>
                  Distribuição de agendamentos por dia
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { dia: 'Dom', consultas: 10 },
                      { dia: 'Seg', consultas: 45 },
                      { dia: 'Ter', consultas: 52 },
                      { dia: 'Qua', consultas: 58 },
                      { dia: 'Qui', consultas: 62 },
                      { dia: 'Sex', consultas: 48 },
                      { dia: 'Sáb', consultas: 25 }
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="consultas" name="Consultas" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Consultas por Horário</CardTitle>
                <CardDescription>
                  Distribuição de consultas por horário do dia
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { hora: '08:00', consultas: 12 },
                      { hora: '09:00', consultas: 18 },
                      { hora: '10:00', consultas: 24 },
                      { hora: '11:00', consultas: 22 },
                      { hora: '13:00', consultas: 25 },
                      { hora: '14:00', consultas: 28 },
                      { hora: '15:00', consultas: 26 },
                      { hora: '16:00', consultas: 21 },
                      { hora: '17:00', consultas: 18 }
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hora" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="consultas" name="Consultas" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Relatório de Usuários */}
        <TabsContent value="usuarios" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Crescimento de Usuários</CardTitle>
                <CardDescription>
                  Crescimento de clientes e veterinários por mês
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dadosCrescimentoUsuarios}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="clientes" name="Clientes" fill="#8884d8" />
                    <Bar dataKey="veterinarios" name="Veterinários" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribuição por Tipo de Usuário</CardTitle>
                <CardDescription>
                  Proporção entre tipos de usuários no sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Clientes', value: 185 },
                        { name: 'Veterinários', value: 55 },
                        { name: 'Administradores', value: 8 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#8884d8" />
                      <Cell fill="#82ca9d" />
                      <Cell fill="#FFBB28" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Retenção de Usuários</CardTitle>
                <CardDescription>
                  Taxa de retenção de usuários ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { mes: 'Jan', retencao: 94 },
                      { mes: 'Fev', retencao: 92 },
                      { mes: 'Mar', retencao: 90 },
                      { mes: 'Abr', retencao: 88 },
                      { mes: 'Mai', retencao: 86 },
                      { mes: 'Jun', retencao: 84 }
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="retencao" 
                      name="Taxa de Retenção (%)" 
                      stroke="#ff7300" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Relatório de Pets */}
        <TabsContent value="pets" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribuição por Espécie</CardTitle>
                <CardDescription>
                  Quantidade de pets por espécie
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dadosEspecies}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {dadosEspecies.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribuição por Idade</CardTitle>
                <CardDescription>
                  Quantidade de pets por faixa etária
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { idade: '< 1 ano', quantidade: 86 },
                      { idade: '1-3 anos', quantidade: 235 },
                      { idade: '4-7 anos', quantidade: 320 },
                      { idade: '8-10 anos', quantidade: 185 },
                      { idade: '> 10 anos', quantidade: 94 }
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="idade" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" name="Quantidade" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Atendimentos por Espécie</CardTitle>
                <CardDescription>
                  Número de consultas realizadas por espécie
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { especie: 'Cachorros', consultas: 245 },
                      { especie: 'Gatos', consultas: 185 },
                      { especie: 'Aves', consultas: 45 },
                      { especie: 'Roedores', consultas: 28 },
                      { especie: 'Outros', consultas: 12 }
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="especie" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="consultas" name="Consultas" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </div>
    </AdminDashboardLayout>
  );
};

export default Relatorios;
