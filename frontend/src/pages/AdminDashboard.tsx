import React, { useState } from 'react';
import Layout from '../components/Layout';
import RegistroMoto from '../components/admin/RegistroMoto';
import ListaMotos from '../components/admin/ListaMotos';
import Estadisticas from '../components/admin/Estadisticas';
import { ClipboardList, List, PieChart } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [seccion, setSeccion] = useState<'registro' | 'lista' | 'stats'>('registro');

  return (
    <Layout titulo={seccion === 'registro' ? 'Nueva Entrada' : seccion === 'lista' ? 'Historial' : 'Reportes'}>
      
      {/* Selector de Secciones (Tabs) */}
      <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-sky-100 mb-6">
        <button 
          onClick={() => setSeccion('registro')}
          className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${seccion === 'registro' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}
        >
          <ClipboardList size={18} /> <span className="hidden md:inline">Registro</span>
        </button>
        <button 
          onClick={() => setSeccion('lista')}
          className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${seccion === 'lista' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}
        >
          <List size={18} /> <span className="hidden md:inline">Listado</span>
        </button>
        <button 
          onClick={() => setSeccion('stats')}
          className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${seccion === 'stats' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}
        >
          <PieChart size={18} /> <span className="hidden md:inline">Estadísticas</span>
        </button>
      </div>

      {/* Renderizado Condicional de Componentes */}
      <div className="animate-in fade-in duration-500">
        {seccion === 'registro' && <RegistroMoto />}
        {seccion === 'lista' && <ListaMotos />}
        {seccion === 'stats' && <Estadisticas />}
      </div>
      
    </Layout>
  );
};

export default AdminDashboard;