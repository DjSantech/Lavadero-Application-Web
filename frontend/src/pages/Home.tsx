// src/pages/Home.tsx
import React from 'react';
import { LogIn, Droplets } from 'lucide-react';
import PreciosInformativos from '../components/PreciosInformativos';
import { useNavigate } from 'react-router-dom';


const Home: React.FC = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-sky-50 font-sans text-slate-900">
      {/* Header Simple solo con Logo y Login */}
      <header className="bg-white border-b border-sky-100 p-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Droplets className="text-blue-600" size={28} />
            <h1 className="text-2xl font-black tracking-tighter text-slate-800">
              MOTO<span className="text-blue-600">WASH</span>
            </h1>
          </div>
          
          <button 
      onClick={() => navigate('/admin')} // 3. Agrega el evento click
      className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-800"
    >
      <LogIn size={18} />
      Ingresar
    </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Banner de Bienvenida */}
        <section className="text-center my-10">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-2">
            ¡Tu moto como nueva! 
          </h2>
          <p className="text-slate-500 font-medium">
            Calidad, rapidez y el mejor cuidado para tu máquina.
          </p>
        </section>

        {/* Sección de Precios */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">
              Nuestras Tarifas
            </h3>
          </div>
          
          <PreciosInformativos />
        </section>

        {/* Footer informativo simple */}
        <footer className="mt-20 text-center text-slate-400 text-xs pb-10">
          <p>© 2026 MotoWash - Lavadero de Motos Profesional</p>
        </footer>
      </main>
    </div>
  );
};

export default Home;