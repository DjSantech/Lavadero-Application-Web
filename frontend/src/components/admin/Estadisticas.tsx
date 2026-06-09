import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Bike, TrendingUp, Loader2, RefreshCw } from 'lucide-react';
import { ticketsApi } from '../../services/api';
import type { Stats } from '../../types';

const Estadisticas: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const datos = await ticketsApi.stats();
      setStats(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  if (cargando) {
    return (
      <div className="flex justify-center py-16 text-blue-400">
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 text-sm font-medium space-y-3">
        <p>{error}</p>
        <button
          onClick={cargar}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const maxDia = Math.max(...stats.flujoPorDia.map(d => d.total), 1);

  const insight = (() => {
    if (stats.totalMotos === 0) return 'Aún no hay registros este mes. ¡A lavar se dijo!';
    const partes: string[] = [];
    if (stats.mejorDia) partes.push(`Tu mejor día es el ${stats.mejorDia}.`);
    if (stats.horaMasConcurrida) partes.push(`La hora pico es las ${stats.horaMasConcurrida}.`);
    return partes.length > 0 ? partes.join(' ') : `${stats.totalMotos} motos lavadas este mes. ¡Sigue así!`;
  })();

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-linear-to-br from-blue-600 to-blue-700 p-5 rounded-3xl text-white shadow-lg shadow-blue-200">
          <DollarSign className="mb-2 opacity-50" size={24} />
          <p className="text-xs font-bold opacity-80 uppercase">Ventas este mes</p>
          <p className="text-2xl font-black">
            ${stats.totalVentas.toLocaleString('es-CO')}
          </p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm">
          <Bike className="mb-2 text-blue-600" size={24} />
          <p className="text-xs font-bold text-slate-400 uppercase">Motos este mes</p>
          <p className="text-2xl font-black text-slate-800">{stats.totalMotos}</p>
        </div>
      </div>

      {/* Gráfico semanal */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-green-500" size={20} />
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
              Flujo últimos 7 días
            </h3>
          </div>
          <button
            onClick={cargar}
            className="p-1.5 rounded-full text-slate-400 hover:text-blue-600 transition-colors"
            title="Actualizar"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.flujoPorDia.map(d => ({
                ...d,
                fill: d.total === maxDia && d.total > 0 ? '#2563eb' : '#93c5fd',
              }))}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fontWeight: 'bold' }}
              />
              <YAxis hide allowDecimals={false} />
              <Tooltip
                cursor={{ fill: '#f0f9ff' }}
                contentStyle={{
                  borderRadius: '15px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                }}
                formatter={(value) => [`${value ?? 0} motos`, '']}
              />
              <Bar dataKey="total" radius={[6, 6, 6, 6]} fill="#93c5fd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insight dinámico */}
      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
        <p className="text-sm text-blue-800 font-medium italic">✨ "{insight}"</p>
      </div>
    </div>
  );
};

export default Estadisticas;
