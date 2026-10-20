import type { EstadoMoto, NuevoTicket, Stats, TicketDB } from '../types';
import { auth } from '../utils/auth';

const BASE = '/api';

function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = auth.getToken();
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401 && auth.getToken()) {
    // Sesión vencida o inválida: volver al login
    auth.logout();
    window.location.href = '/login';
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Error ${res.status}`);
  }
  return res.json();
}

export const authApi = {
  login(usuario: string, clave: string): Promise<{ token: string }> {
    return fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, clave }),
    }).then(r => handleResponse<{ token: string }>(r));
  },
};

export const ticketsApi = {
  listar(periodo?: 'dia' | 'semana' | 'mes'): Promise<TicketDB[]> {
    const url = periodo ? `${BASE}/tickets?periodo=${periodo}` : `${BASE}/tickets`;
    return fetch(url, { headers: authHeaders() }).then(r => handleResponse<TicketDB[]>(r));
  },

  crear(ticket: NuevoTicket): Promise<TicketDB> {
    return fetch(`${BASE}/tickets`, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(ticket),
    }).then(r => handleResponse<TicketDB>(r));
  },

  actualizarEstado(id: string, estado: EstadoMoto): Promise<TicketDB> {
    return fetch(`${BASE}/tickets/${id}/estado`, {
      method: 'PATCH',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ estado }),
    }).then(r => handleResponse<TicketDB>(r));
  },

  eliminar(id: string): Promise<void> {
    return fetch(`${BASE}/tickets/${id}`, { method: 'DELETE', headers: authHeaders() }).then(r =>
      handleResponse<void>(r)
    );
  },

  buscarPorPlaca(placa: string): Promise<TicketDB> {
    return fetch(`${BASE}/tickets/buscar?placa=${encodeURIComponent(placa)}`).then(r =>
      handleResponse<TicketDB>(r)
    );
  },

  stats(): Promise<Stats> {
    return fetch(`${BASE}/tickets/stats`, { headers: authHeaders() }).then(r => handleResponse<Stats>(r));
  },
};
