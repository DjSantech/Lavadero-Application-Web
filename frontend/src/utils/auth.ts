const KEY = 'lavamotos_admin';

export const auth = {
  login: () => localStorage.setItem(KEY, '1'),
  logout: () => localStorage.removeItem(KEY),
  isLogged: () => localStorage.getItem(KEY) === '1',
};
