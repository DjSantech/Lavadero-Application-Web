// src/components/Layout.tsx
import React from 'react';
import { LayoutDashboard, PlusCircle, BarChart3, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  titulo: string;
}

const Layout: React.FC<LayoutProps> = ({ children, titulo }) => {
  const navigate = useNavigate();
  return (
    // Fondo azul muy claro para toda la app
    <div className="min-h-screen bg-sky-50 font-sans text-slate-900">
      
      {/* Header con degradado azul */}
      <header className="bg-gradient-to-r from-blue-600 to-sky-500 text-white p-6 shadow-lg rounded-b-[2rem]">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Droplets className="text-white fill-white" size={24} />
              <h1 className="text-xl font-black tracking-tight">MOTO CLEAN</h1>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold mt-2">{titulo}</h2>
        </div>
      </header>

      {/* Contenido dinámico */}
      <main className="max-w-4xl mx-auto p-4 pb-32">
        {children}
      </main>

      {/* Barra de Navegación Inferior (Flotante y azul) */}
      <div className="fixed bottom-6 left-0 right-0 px-6 z-50">
        <nav className="max-w-md mx-auto bg-white/90 backdrop-blur-lg border border-sky-100 h-16 rounded-2xl shadow-2xl flex justify-around items-center px-4">
          <button 
            onClick={() => navigate('/')} // Volver al Home informativo
            className="flex flex-col items-center text-sky-600"
          >
            <LayoutDashboard size={24} />
            <span className="text-[10px] font-bold uppercase">Inicio</span>
          </button>

          {/* Botón Central de Acción */}
          <button className="bg-blue-600 text-white p-4 rounded-xl shadow-lg shadow-blue-200 -mt-12 border-4 border-sky-50 active:scale-90 transition-all">
            <PlusCircle size={28} />
          </button>

          <button className="flex flex-col items-center text-slate-400 hover:text-sky-500 transition-colors">
            <BarChart3 size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Stats</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Layout;