// src/components/PreciosInformativos.tsx
import React from 'react';
import { Bike, Zap, Shield, Rocket } from 'lucide-react';

const LISTA_PRECIOS = [
  {
    tipo: 'Scooter / Moped',
    precio: 15000,
    icon: <Zap className="text-yellow-500" />,
    desc: 'Motos automáticas y de bajo cilindraje.'
  },
  {
    tipo: 'Calle / Trabajo',
    precio: 18000,
    icon: <Bike className="text-blue-500" />,
    desc: 'Motos tipo Boxer, Pulsar, NKD, etc.'
  },
  {
    tipo: 'Alto Cilindraje',
    precio: 25000,
    icon: <Rocket className="text-purple-500" />,
    desc: 'Motos superiores a 500cc o deportivas.'
  },
  {
    tipo: 'Enduro / Cross',
    precio: 30000,
    icon: <Shield className="text-green-600" />,
    desc: 'Incluye lavado detallado de motor y kit de arrastre.'
  }
];

const PreciosInformativos: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {LISTA_PRECIOS.map((item, index) => (
        <div 
            key={index} 
            className="bg-white p-6 rounded-3xl shadow-sm border border-sky-100 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
          <div className="p-3 bg-slate-50 rounded-xl">
            {item.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800">{item.tipo}</h3>
            <p className="text-xs text-slate-500">{item.desc}</p>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-blue-600">
              ${item.precio.toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PreciosInformativos;