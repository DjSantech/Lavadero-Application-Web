// src/components/admin/Estadisticas.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, Bike, TrendingUp } from 'lucide-react';

const dataEjemplo = [
  { name: 'Lun', total: 12 },
  { name: 'Mar', total: 18 },
  { name: 'Mie', total: 15 },
  { name: 'Jue', total: 25 }, // Día de mayor venta
  { name: 'Vie', total: 30 },
  { name: 'Sab', total: 45 },
  { name: 'Dom', total: 20 },
];

const Estadisticas: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* KPIs Rápidos */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-5 rounded-3xl text-white shadow-lg shadow-blue-200">
          <DollarSign className="mb-2 opacity-50" size={24} />
          <p className="text-xs font-bold opacity-80 uppercase">Ventas totales</p>
          <p className="text-2xl font-black">$1.240.000</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm">
          <Bike className="mb-2 text-blue-600" size={24} />
          <p className="text-xs font-bold text-slate-400 uppercase">Total Motos</p>
          <p className="text-2xl font-black text-slate-800">84</p>
        </div>
      </div>

      {/* Gráfico de Flujo Semanal */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-green-500" size={20} />
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Flujo Semanal (Motos)</h3>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataEjemplo}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
              <Tooltip 
                cursor={{fill: '#f0f9ff'}} 
                contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
              />
              <Bar dataKey="total" radius={[6, 6, 6, 6]}>
                {dataEjemplo.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.total > 30 ? '#2563eb' : '#93c5fd'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dato Curioso / Insights */}
      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
        <p className="text-sm text-blue-800 font-medium italic">
          ✨ "El sábado es tu mejor día. La hora más concurrida suele ser las 10:00 AM."
        </p>
      </div>
    </div>
  );
};

export default Estadisticas;