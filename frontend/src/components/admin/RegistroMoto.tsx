import React, { useState, useEffect } from 'react';
import { Save, Clock, ShieldCheck, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ticketsApi } from '../../services/api';
import type { TipoMoto } from '../../types';

const PRECIOS: Record<TipoMoto, number> = {
  'Scooter': 15000,
  'Calle': 18000,
  'Alto Cilindraje': 25000,
  'Enduro': 30000,
};

const horaActual = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

type Estado = 'idle' | 'loading' | 'success' | 'error';

const RegistroMoto: React.FC = () => {
  const [placa, setPlaca] = useState('');
  const [tipoMoto, setTipoMoto] = useState<TipoMoto>('Scooter');
  const [horaEntrada, setHoraEntrada] = useState(horaActual());
  const [horaSalidaEstimada, setHoraSalidaEstimada] = useState('');
  const [dejoCasco, setDejoCasco] = useState(false);
  const [observaciones, setObservaciones] = useState('');
  const [estado, setEstado] = useState<Estado>('idle');
  const [mensajeError, setMensajeError] = useState('');

  // Actualizar hora cada vez que se monta el componente
  useEffect(() => {
    setHoraEntrada(horaActual());
  }, []);

  const precio = PRECIOS[tipoMoto];

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!placa.trim()) {
      setMensajeError('La placa es obligatoria.');
      setEstado('error');
      return;
    }

    setEstado('loading');
    setMensajeError('');

    try {
      await ticketsApi.crear({
        placa: placa.toUpperCase().trim(),
        tipoMoto,
        horaEntrada,
        horaSalidaEstimada: horaSalidaEstimada || undefined,
        dejoCasco,
        observaciones: observaciones.trim() || undefined,
        precio,
      });

      setEstado('success');
      // Resetear formulario
      setPlaca('');
      setTipoMoto('Scooter');
      setHoraEntrada(horaActual());
      setHoraSalidaEstimada('');
      setDejoCasco(false);
      setObservaciones('');

      setTimeout(() => setEstado('idle'), 3000);
    } catch (err) {
      setMensajeError(err instanceof Error ? err.message : 'Error al guardar');
      setEstado('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-sky-100 space-y-4">

        {/* Placa y Tipo */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">Placa</label>
            <input
              type="text"
              value={placa}
              onChange={e => setPlaca(e.target.value.toUpperCase())}
              placeholder="ABC-123"
              maxLength={10}
              className="bg-sky-50 border-none rounded-2xl p-3 text-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none uppercase"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">Tipo de Moto</label>
            <select
              value={tipoMoto}
              onChange={e => setTipoMoto(e.target.value as TipoMoto)}
              className="bg-sky-50 border-none rounded-2xl p-3 font-semibold outline-none"
            >
              <option>Scooter</option>
              <option>Calle</option>
              <option>Alto Cilindraje</option>
              <option>Enduro</option>
            </select>
          </div>
        </div>

        {/* Precio automático */}
        <div className="flex items-center justify-between px-4 py-3 bg-blue-50 rounded-2xl">
          <span className="text-sm font-bold text-blue-700">Precio del servicio</span>
          <span className="text-xl font-black text-blue-600">
            ${precio.toLocaleString('es-CO')}
          </span>
        </div>

        {/* Horarios */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">Hora Entrada</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-blue-400" size={18} />
              <input
                type="time"
                value={horaEntrada}
                onChange={e => setHoraEntrada(e.target.value)}
                className="bg-sky-50 border-none rounded-2xl p-3 pl-10 w-full font-semibold outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">Salida Estimada</label>
            <input
              type="time"
              value={horaSalidaEstimada}
              onChange={e => setHoraSalidaEstimada(e.target.value)}
              className="bg-sky-50 border-none rounded-2xl p-3 font-semibold outline-none"
            />
          </div>
        </div>

        {/* Casco */}
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl">
          <input
            type="checkbox"
            id="casco"
            checked={dejoCasco}
            onChange={e => setDejoCasco(e.target.checked)}
            className="w-5 h-5 accent-blue-600"
          />
          <label htmlFor="casco" className="text-sm font-bold text-blue-800 flex items-center gap-2">
            <ShieldCheck size={18} /> ¿Dejó casco?
          </label>
        </div>

        {/* Observaciones */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-black text-slate-400 uppercase ml-1">Observaciones / Estado</label>
          <textarea
            value={observaciones}
            onChange={e => setObservaciones(e.target.value)}
            placeholder="Ej: Rayón en mofle, sin retrovisor izquierdo..."
            className="bg-sky-50 border-none rounded-2xl p-3 text-sm min-h-20 outline-none resize-none"
          />
        </div>

        {/* Feedback */}
        {estado === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-2xl text-sm font-bold">
            <CheckCircle size={18} /> ¡Ingreso guardado correctamente!
          </div>
        )}
        {estado === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-2xl text-sm font-bold">
            <AlertCircle size={18} /> {mensajeError}
          </div>
        )}

        <button
          type="submit"
          disabled={estado === 'loading'}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {estado === 'loading' ? (
            <><Loader2 size={22} className="animate-spin" /> GUARDANDO...</>
          ) : (
            <><Save size={22} /> GUARDAR INGRESO</>
          )}
        </button>
      </div>
    </form>
  );
};

export default RegistroMoto;
