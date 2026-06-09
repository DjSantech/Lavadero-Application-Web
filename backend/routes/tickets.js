const express = require('express');
const router = express.Router();
const Ticket = require('../models/Tickets');

// GET /api/tickets/stats — estadísticas reales (debe ir ANTES de /:id)
router.get('/stats', async (req, res) => {
  try {
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    const [mensual] = await Ticket.aggregate([
      { $match: { fecha: { $gte: inicioMes } } },
      {
        $group: {
          _id: null,
          totalVentas: { $sum: '$precio' },
          totalMotos: { $sum: 1 }
        }
      }
    ]);

    // Flujo últimos 7 días agrupado por día de semana
    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 6);
    hace7Dias.setHours(0, 0, 0, 0);

    const porDia = await Ticket.aggregate([
      { $match: { fecha: { $gte: hace7Dias } } },
      {
        $group: {
          _id: { $dayOfWeek: '$fecha' }, // 1=Dom, 2=Lun ... 7=Sab
          total: { $sum: 1 }
        }
      }
    ]);

    const nombresDias = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const flujoPorDia = nombresDias.map((name, i) => {
      const found = porDia.find(d => d._id === i + 1);
      return { name, total: found ? found.total : 0 };
    });

    // Hora más concurrida (basada en todos los registros)
    const porHora = await Ticket.aggregate([
      {
        $group: {
          _id: { $substr: ['$horaEntrada', 0, 2] }, // primeros 2 chars de "HH:MM"
          total: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]);

    const horaMasConcurrida = porHora[0] ? `${porHora[0]._id}:00` : null;
    const mejorDia = flujoPorDia.reduce((a, b) => (b.total > a.total ? b : a), { name: '', total: 0 });

    res.json({
      totalVentas: mensual?.totalVentas ?? 0,
      totalMotos: mensual?.totalMotos ?? 0,
      flujoPorDia,
      mejorDia: mejorDia.total > 0 ? mejorDia.name : null,
      horaMasConcurrida
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tickets/buscar?placa=XXX — consulta pública del estado de una moto
router.get('/buscar', async (req, res) => {
  try {
    const { placa } = req.query;
    if (!placa) return res.status(400).json({ error: 'Placa requerida' });

    const regex = new RegExp(`^${placa.trim()}$`, 'i');

    // Prioridad: ticket activo (no entregado) más reciente
    let ticket = await Ticket.findOne({ placa: regex, estado: { $ne: 'entregado' } }).sort({ fecha: -1 });

    // Si no hay activo, devolver el más reciente de cualquier estado
    if (!ticket) {
      ticket = await Ticket.findOne({ placa: regex }).sort({ fecha: -1 });
    }

    if (!ticket) return res.status(404).json({ error: 'No se encontró ninguna moto con esa placa' });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tickets — listar con filtro opcional por periodo
router.get('/', async (req, res) => {
  try {
    const { periodo } = req.query;
    const ahora = new Date();
    let filtroFecha = {};

    if (periodo === 'dia') {
      const inicio = new Date(ahora);
      inicio.setHours(0, 0, 0, 0);
      filtroFecha = { fecha: { $gte: inicio } };
    } else if (periodo === 'semana') {
      const inicio = new Date(ahora);
      inicio.setDate(ahora.getDate() - 7);
      inicio.setHours(0, 0, 0, 0);
      filtroFecha = { fecha: { $gte: inicio } };
    } else if (periodo === 'mes') {
      const inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      filtroFecha = { fecha: { $gte: inicio } };
    }

    const tickets = await Ticket.find(filtroFecha).sort({ fecha: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tickets — crear nuevo ingreso
router.post('/', async (req, res) => {
  try {
    const ticket = new Ticket(req.body);
    const saved = await ticket.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/tickets/:id/estado — actualizar estado
router.patch('/:id/estado', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { estado: req.body.estado },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/tickets/:id — eliminar
router.delete('/:id', async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ticket eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
