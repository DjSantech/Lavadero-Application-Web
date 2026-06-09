import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, ShieldCheck, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { ticketsApi } from '../../services/api';
import type { EstadoMoto, TicketDB } from '../../types';

type Periodo = 'dia' | 'semana' | 'mes';

const ESTADO_ESTILOS: Record<EstadoMoto, string> = {
  'en espera': 'bg-amber-100 text-amber-700',
  'lavando':   'bg-blue-100 text-blue-700',
  'listo':     'bg-purple-100 text-purple-700',
  'entregado': 'bg-green-100 text-green-700',
};

const ESTADOS: EstadoMoto[] = ['en espera', 'lavando', 'listo', 'entregado'];

const ListaMotos: React.FC = () => {
  const [periodo, setPeriodo] = useState<Periodo>('dia');
  const [tickets, setTickets] = useState<TicketDB[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [actualizando, setActualizando] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const datos = await ticketsApi.listar(periodo);
      setTickets(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar');
    } finally {
      setCargando(false);
    }
  }, [periodo]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const cambiarEstado = async (id: string, nuevoEstado: EstadoMoto) => {
    setActualizando(id);
    try {
      const actualizado = await ticketsApi.actualizarEstado(id, nuevoEstado);
      setTickets(prev => prev.map(t => t._id === id ? actualizado : t));
    } catch {
      // silencioso — el estado visual no cambia si falla
    } finally {
      setActualizando(null);
    }
  };

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar este registro?')) return;
    try {
      await ticketsApi.eliminar(id);
      setTickets(prev => prev.filter(t => t._id !== id));
    } catch {
      // silencioso
    }
  };

  const totalIngresos = tickets.reduce((sum, t) => sum + t.precio, 0);

  return (
    <div className="space-y-4">
      {/* Filtros + Refresh */}
      <div className="flex gap-2 items-center overflow-x-auto pb-1">
        {(['dia', 'semana', 'mes'] as Periodo[]).map(f => (
          <button
            key={f}
            onClick={() => setPeriodo(f)}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              periodo === f ? 'bg-slate-800 text-white' : 'bg-white text-slate-400 border border-slate-200'
            }`}
          >
            {f === 'dia' ? 'Hoy' : f === 'semana' ? 'Semana' : 'Mes'}
          </button>
        ))}
        <button
          onClick={cargar}
          className="ml-auto p-2 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-blue-600 transition-colors"
          title="Recargar"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Resumen rápido */}
      {tickets.length > 0 && (
        <div className="flex justify-between items-center px-4 py-3 bg-white rounded-2xl border border-sky-100 shadow-sm">
          <span className="text-xs font-black text-slate-400 uppercase">
            {tickets.length} moto{tickets.length !== 1 ? 's' : ''}
          </span>
          <span className="text-sm font-black text-blue-600">
            ${totalIngresos.toLocaleString('es-CO')}
          </span>
        </div>
      )}

      {/* Estados */}
      {cargando && (
        <div className="flex justify-center py-12 text-blue-400">
          <Loader2 size={32} className="animate-spin" />
        </div>
      )}

      {!cargando && error && (
        <div className="text-center py-8 text-red-500 text-sm font-medium">{error}</div>
      )}

      {!cargando && !error && (
        <div className="space-y-3">
          {tickets.map(ticket => (
            <div
              key={ticket._id}
              className="bg-white p-4 rounded-3xl shadow-sm border border-sky-100"
            >
              <div className="flex justify-between items-start gap-3">
                {/* Placa + info */}
                <div className="flex gap-3 items-center min-w-0">
                  <div className="bg-sky-100 px-3 py-2 rounded-2xl text-blue-700 font-black text-sm shrink-0">
                    {ticket.placa}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm">{ticket.tipoMoto}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 flex-wrap">
                      <Clock size={11} />
                      {ticket.horaEntrada}
                      {ticket.horaSalidaEstimada && ` → ${ticket.horaSalidaEstimada}`}
                      {ticket.dejoCasco && (
                        <span className="flex items-center gap-0.5 text-blue-500">
                          <ShieldCheck size={11} /> casco
                        </span>
                      )}
                    </p>
                    {ticket.observaciones && (
                      <p className="text-xs text-slate-400 italic mt-0.5 truncate max-w-45">
                        {ticket.observaciones}
                      </p>
                    )}
                  </div>
                </div>

                {/* Precio + acciones */}
                <div className="text-right shrink-0 space-y-1">
                  <p className="text-sm font-black text-blue-600">
                    ${ticket.precio.toLocaleString('es-CO')}
                  </p>
                  <button
                    onClick={() => eliminar(ticket._id)}
                    className="text-slate-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Selector de estado */}
              <div className="mt-3 flex gap-1.5 flex-wrap">
                {ESTADOS.map(e => (
                  <button
                    key={e}
                    disabled={actualizando === ticket._id}
                    onClick={() => cambiarEstado(ticket._id, e)}
                    className={`text-[10px] font-black px-3 py-1 rounded-full transition-all capitalize ${
                      ticket.estado === e
                        ? ESTADO_ESTILOS[e]
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {actualizando === ticket._id && ticket.estado !== e ? (
                      <Loader2 size={10} className="animate-spin inline" />
                    ) : e}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {tickets.length === 0 && (
            <div className="text-center py-12 opacity-40">
              <Calendar className="mx-auto mb-2" size={40} />
              <p className="text-sm font-medium">Sin registros para este periodo</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListaMotos;
