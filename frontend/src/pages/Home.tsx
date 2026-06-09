import React, { useState } from 'react';
import { LogIn, Droplets, Search, Clock, Loader2, AlertCircle } from 'lucide-react';
import PreciosInformativos from '../components/PreciosInformativos';
import { useNavigate } from 'react-router-dom';
import { ticketsApi } from '../services/api';
import type { TicketDB, EstadoMoto } from '../types';

const ESTADO_INFO: Record<EstadoMoto, { label: string; color: string; dot: string }> = {
  'en espera': {
    label: 'En cola de espera',
    color: 'bg-amber-50 border-amber-200 text-amber-800',
    dot: 'bg-amber-400',
  },
  lavando: {
    label: 'Lavando ahora',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    dot: 'bg-blue-500',
  },
  listo: {
    label: 'Lista para recoger',
    color: 'bg-green-50 border-green-200 text-green-800',
    dot: 'bg-green-500',
  },
  entregado: {
    label: 'Ya fue entregada',
    color: 'bg-slate-50 border-slate-200 text-slate-600',
    dot: 'bg-slate-400',
  },
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [placa, setPlaca] = useState('');
  const [resultado, setResultado] = useState<TicketDB | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState('');

  const buscar = async () => {
    const placaTrim = placa.trim().toUpperCase();
    if (!placaTrim) return;
    setBuscando(true);
    setResultado(null);
    setErrorBusqueda('');
    try {
      const ticket = await ticketsApi.buscarPorPlaca(placaTrim);
      setResultado(ticket);
    } catch (err) {
      setErrorBusqueda(err instanceof Error ? err.message : 'No encontrado');
    } finally {
      setBuscando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') buscar();
  };

  const info = resultado ? ESTADO_INFO[resultado.estado] : null;

  return (
    <div className="min-h-screen bg-sky-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-sky-100 p-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Droplets className="text-blue-600" size={28} />
            <h1 className="text-2xl font-black tracking-tighter text-slate-800">
              MOTO<span className="text-blue-600">WASH</span>
            </h1>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
          >
            <LogIn size={18} />
            Ingresar
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-10">
        {/* Banner */}
        <section className="text-center pt-6">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-2">
            ¡Tu moto como nueva!
          </h2>
          <p className="text-slate-500 font-medium">
            Calidad, rapidez y el mejor cuidado para tu máquina.
          </p>
        </section>

        {/* Buscador de placa */}
        <section className="bg-white rounded-3xl border border-sky-100 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="font-black text-slate-800 text-lg">¿Cómo va tu moto?</h3>
            <p className="text-sm text-slate-400 mt-0.5">Ingresa la placa para ver el estado del lavado.</p>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-blue-400" size={18} />
              <input
                type="text"
                value={placa}
                onChange={e => {
                  setPlaca(e.target.value.toUpperCase());
                  setResultado(null);
                  setErrorBusqueda('');
                }}
                onKeyDown={handleKeyDown}
                placeholder="ABC-123"
                maxLength={10}
                className="bg-sky-50 border-none rounded-2xl p-3 pl-10 w-full font-bold text-lg uppercase outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={buscar}
              disabled={buscando || !placa.trim()}
              className="bg-blue-600 text-white px-5 rounded-2xl font-black hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {buscando ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            </button>
          </div>

          {/* Resultado */}
          {resultado && info && (
            <div className={`rounded-2xl border p-4 space-y-2 ${info.color}`}>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${info.dot} ${resultado.estado === 'lavando' ? 'animate-pulse' : ''}`} />
                <span className="font-black text-base">{info.label}</span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-medium opacity-80">
                <span>Placa: <strong>{resultado.placa}</strong></span>
                <span>Tipo: {resultado.tipoMoto}</span>
                {resultado.horaSalidaEstimada && (
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    Salida estimada: <strong>{resultado.horaSalidaEstimada}</strong>
                  </span>
                )}
              </div>
              {resultado.estado === 'listo' && (
                <p className="text-sm font-bold mt-1">¡Puedes venir a recogerla! 🎉</p>
              )}
            </div>
          )}

          {errorBusqueda && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-2xl text-sm font-semibold border border-red-100">
              <AlertCircle size={16} /> {errorBusqueda}
            </div>
          )}
        </section>

        {/* Tarifas */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-1 w-8 bg-blue-600 rounded-full" />
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">
              Nuestras Tarifas
            </h3>
          </div>
          <PreciosInformativos />
        </section>

        <footer className="text-center text-slate-400 text-xs pb-10">
          <p>© 2026 MotoWash - Lavadero de Motos Profesional</p>
        </footer>
      </main>
    </div>
  );
};

export default Home;
