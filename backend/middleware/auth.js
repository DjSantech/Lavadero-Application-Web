const crypto = require('crypto');

const DURACION_MS = 12 * 60 * 60 * 1000; // 12 horas

function secreto() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error('AUTH_SECRET no está configurado');
  return s;
}

function firmar(payload) {
  return crypto.createHmac('sha256', secreto()).update(payload).digest('base64url');
}

// Token simple: base64url(json) + "." + firma HMAC
function crearToken(usuario) {
  const payload = Buffer.from(JSON.stringify({ u: usuario, exp: Date.now() + DURACION_MS })).toString('base64url');
  return `${payload}.${firmar(payload)}`;
}

function verificarToken(token) {
  const [payload, firma] = (token || '').split('.');
  if (!payload || !firma) return null;

  const esperada = Buffer.from(firmar(payload));
  const recibida = Buffer.from(firma);
  if (esperada.length !== recibida.length || !crypto.timingSafeEqual(esperada, recibida)) return null;

  try {
    const datos = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return datos.exp > Date.now() ? datos : null;
  } catch {
    return null;
  }
}

// Comparación en tiempo constante para no filtrar info por timing
function igualSeguro(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!verificarToken(token)) return res.status(401).json({ error: 'No autorizado' });
  next();
}

module.exports = { crearToken, verificarToken, igualSeguro, requireAuth };
