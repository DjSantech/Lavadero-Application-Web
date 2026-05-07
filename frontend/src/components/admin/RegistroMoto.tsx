// src/components/admin/RegistroMoto.tsx
import React, { useState } from 'react';
import { Save, Clock, Info, ShieldCheck } from 'lucide-react';

const RegistroMoto: React.FC = () => {
  return (
    <form className="space-y-4">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-sky-100 space-y-4">
        
        {/* Placa y Tipo */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">Placa</label>
            <input type="text" placeholder="ABC-123" className="bg-sky-50 border-none rounded-2xl p-3 text-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">Tipo de Moto</label>
            <select className="bg-sky-50 border-none rounded-2xl p-3 font-semibold outline-none">
              <option>Scooter</option>
              <option>Calle</option>
              <option>Alto Cilindraje</option>
              <option>Enduro</option>
            </select>
          </div>
        </div>

        {/* Horarios */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">Hora Entrada</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-blue-400" size={18} />
              <input type="time" className="bg-sky-50 border-none rounded-2xl p-3 pl-10 w-full font-semibold outline-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">Salida Estimada</label>
            <input type="time" className="bg-sky-50 border-none rounded-2xl p-3 font-semibold outline-none" />
          </div>
        </div>

        {/* Casco y Notas */}
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl">
          <input type="checkbox" id="casco" className="w-5 h-5 accent-blue-600" />
          <label htmlFor="casco" className="text-sm font-bold text-blue-800 flex items-center gap-2">
            <ShieldCheck size={18} /> ¿Dejó casco?
          </label>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-black text-slate-400 uppercase ml-1">Observaciones / Estado</label>
          <textarea 
            placeholder="Ej: Rayón en mofle, sin retrovisor izquierdo..." 
            className="bg-sky-50 border-none rounded-2xl p-3 text-sm min-h-[80px] outline-none"
          ></textarea>
        </div>

        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex justify-center items-center gap-2">
          <Save size={22} /> GUARDAR INGRESO
        </button>
      </div>
    </form>
  );
};

export default RegistroMoto;