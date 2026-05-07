// src/components/admin/ListaMotos.tsx
import React, { useState } from 'react';
import { Calendar, Search, CheckCircle2, Clock } from 'lucide-react';

const ListaMotos: React.FC = () => {
  const [filtro, setFiltro] = useState<'dia' | 'semana' | 'mes'>('dia');

  return (
    <div className="space-y-4">
      {/* Filtros rápidos */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['dia', 'semana', 'mes'].map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f as any)}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              filtro === f ? 'bg-slate-800 text-white' : 'bg-white text-slate-400 border border-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Lista de Cards */}
      <div className="space-y-3">
        {/* Ejemplo de una moto en la lista */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-sky-100 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="bg-sky-100 p-3 rounded-2xl text-blue-600 font-black">
              GSR-500
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Yamaha R3</h4>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={12} /> 14:30 - 15:30
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-sm font-black text-blue-600">$18.000</span>
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Entregado</span>
          </div>
        </div>

        {/* Mensaje si no hay datos */}
        <div className="text-center py-10 opacity-40">
          <Calendar className="mx-auto mb-2" size={40} />
          <p className="text-sm font-medium">No hay más registros para este periodo</p>
        </div>
      </div>
    </div>
  );
};

export default ListaMotos;