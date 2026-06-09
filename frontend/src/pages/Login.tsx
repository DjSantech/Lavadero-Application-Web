import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { auth } from '../utils/auth';

const USUARIO = 'toño2005';
const CLAVE = 'toño1234';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [mostrarClave, setMostrarClave] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (usuario === USUARIO && clave === CLAVE) {
      auth.login();
      navigate('/admin');
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <Droplets className="text-blue-600" size={32} />
        <h1 className="text-3xl font-black tracking-tighter text-slate-800">
          MOTO<span className="text-blue-600">WASH</span>
        </h1>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-sky-100 p-8 space-y-5">
        <div>
          <h2 className="text-xl font-black text-slate-800">Acceso admin</h2>
          <p className="text-sm text-slate-400 mt-1">Solo personal autorizado.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Usuario */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">Usuario</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-blue-400" size={18} />
              <input
                type="text"
                value={usuario}
                onChange={e => { setUsuario(e.target.value); setError(''); }}
                placeholder="tu usuario"
                autoComplete="username"
                className="bg-sky-50 border-none rounded-2xl p-3 pl-10 w-full font-semibold outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-blue-400" size={18} />
              <input
                type={mostrarClave ? 'text' : 'password'}
                value={clave}
                onChange={e => { setClave(e.target.value); setError(''); }}
                placeholder="••••••••"
                autoComplete="current-password"
                className="bg-sky-50 border-none rounded-2xl p-3 pl-10 pr-10 w-full font-semibold outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setMostrarClave(v => !v)}
                className="absolute right-3 top-3 text-slate-400 hover:text-blue-500 transition-colors"
              >
                {mostrarClave ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-2xl text-sm font-semibold">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-base shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            Entrar
          </button>
        </form>

        <button
          onClick={() => navigate('/')}
          className="w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default Login;
