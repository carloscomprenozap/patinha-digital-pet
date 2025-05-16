
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AgendamentoForm from '@/components/agendamento/AgendamentoForm';

const AgendarConsulta = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Agendar Consulta</h1>
        <AgendamentoForm />
      </div>
    </DashboardLayout>
  );
};

export default AgendarConsulta;
