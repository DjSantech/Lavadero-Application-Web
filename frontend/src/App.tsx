// src/App.tsx
import React, { useState } from 'react';
import { LayoutDashboard, PlusCircle, BarChart3 } from 'lucide-react';
import { Ticket } from './types'; // Importamos tu interfaz

const App: React.FC = () => {
  // Estado tipado para manejar la lista de motos hoy
  const [tickets, setTickets] = useState<Ticket[]>([]);

  return (
    <div className="min-h-screen bg-gray-100 pb-20 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-extrabold tracking-tight">MOTO<span className="text-blue-500">WASH</span></h1>
          <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-500/30">
            Admin Mode
          </span>
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto space-y-4">
        {/* Resumen Rápido */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
            <p className="text-gray-500 text-xs font-bold uppercase">Motos hoy</p>
            <p className="text-2xl font-black text-slate-800">{tickets.length}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
            <p className="text-gray-500 text-xs font-bold uppercase">Ventas</p>
            <p className="text-2xl font-black text-green-600">$0</p>
          </div>
        </section>

        {/* Lista de Trabajo */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-slate-700">Cola de Lavado</h2>
            <button className="text-blue-600 text-sm font-semibold">+ Ver todas</button>
          </div>
          
          {tickets.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center">
              <p className="text-gray-400">No hay motos en proceso</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Aquí mapearás tus tickets */}
            </div>
          )}
        </section>
      </main>

      {/* Navegación Mobile-First */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 px-6 py-3 flex justify-between items-center md:hidden">
        <button className="flex flex-col items-center gap-1 text-blue-600">
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-bold uppercase">Panel</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
          <PlusCircle size={20} />
          <span className="text-[10px] font-bold uppercase">Entrada</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
          <BarChart3 size={20} />
          <span className="text-[10px] font-bold uppercase">Stats</span>
        </button>
      </nav>
    </div>
  );
};

export default App;