const express = require('express');
const router = express.Router();
const { crearToken, igualSeguro } = require('../middleware/auth');

// Freno básico contra fuerza bruta: máx. 10 intentos fallidos por IP cada 15 min
const intentos = new Map();
const VENTANA_MS = 15 * 60 * 1000;
const MAX_INTENTOS = 10;

// POST /api/auth/login
router.post('/login', (req, res) => {
  const ip = req.ip;
  const ahora = Date.now();
  const registro = intentos.get(ip);
  if (registro && ahora - registro.inicio < VENTANA_MS && registro.fallos >= MAX_INTENTOS) {
    return res.status(429).json({ error: 'Demasiados intentos. Intenta más tarde.' });
  }

  const { ADMIN_USER, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_USER || !ADMIN_PASSWORD || !process.env.AUTH_SECRET) {
    return res.status(500).json({ error: 'Autenticación no configurada en el servidor' });
  }

  const { usuario = '', clave = '' } = req.body || {};
  if (igualSeguro(usuario, ADMIN_USER) && igualSeguro(clave, ADMIN_PASSWORD)) {
    intentos.delete(ip);
    return res.json({ token: crearToken(usuario) });
  }

  if (!registro || ahora - registro.inicio >= VENTANA_MS) {
    intentos.set(ip, { inicio: ahora, fallos: 1 });
  } else {
    registro.fallos++;
  }
  res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
});

module.exports = router;
