const KEY = 'lavamotos_token';

function leerExpiracion(token: string): number {
  try {
    const payload = token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload)).exp ?? 0;
  } catch {
    return 0;
  }
}

export const auth = {
  login: (token: string) => localStorage.setItem(KEY, token),
  logout: () => localStorage.removeItem(KEY),
  getToken: () => localStorage.getItem(KEY),
  isLogged: () => {
    const token = localStorage.getItem(KEY);
    return !!token && leerExpiracion(token) > Date.now();
  },
};
