import type { EstadoMoto, NuevoTicket, Stats, TicketDB } from '../types';

const BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Error ${res.status}`);
  }
  return res.json();
}

export const ticketsApi = {
  listar(periodo?: 'dia' | 'semana' | 'mes'): Promise<TicketDB[]> {
    const url = periodo ? `${BASE}/tickets?periodo=${periodo}` : `${BASE}/tickets`;
    return fetch(url).then(r => handleResponse<TicketDB[]>(r));
  },

  crear(ticket: NuevoTicket): Promise<TicketDB> {
    return fetch(`${BASE}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    }).then(r => handleResponse<TicketDB>(r));
  },

  actualizarEstado(id: string, estado: EstadoMoto): Promise<TicketDB> {
    return fetch(`${BASE}/tickets/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    }).then(r => handleResponse<TicketDB>(r));
  },

  eliminar(id: string): Promise<void> {
    return fetch(`${BASE}/tickets/${id}`, { method: 'DELETE' }).then(r =>
      handleResponse<void>(r)
    );
  },

  buscarPorPlaca(placa: string): Promise<TicketDB> {
    return fetch(`${BASE}/tickets/buscar?placa=${encodeURIComponent(placa)}`).then(r =>
      handleResponse<TicketDB>(r)
    );
  },

  stats(): Promise<Stats> {
    return fetch(`${BASE}/tickets/stats`).then(r => handleResponse<Stats>(r));
  },
};
