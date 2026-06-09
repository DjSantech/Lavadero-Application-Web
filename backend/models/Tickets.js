// backend/models/Ticket.js
const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  placa: { 
    type: String, 
    required: true, 
    uppercase: true, 
    trim: true 
  },
  tipoMoto: { 
    type: String, 
    required: true,
    enum: ['Scooter', 'Calle', 'Alto Cilindraje', 'Enduro'] 
  },
  horaEntrada: { 
    type: String, // Guardamos como "14:30"
    required: true 
  },
  horaSalidaEstimada: { 
    type: String 
  },
  dejoCasco: { 
    type: Boolean, 
    default: false 
  },
  observaciones: { 
    type: String 
  },
  fecha: { 
    type: Date, 
    default: Date.now // Esto nos servirá para las estadísticas de días/meses
  },
  estado: { 
    type: String, 
    enum: ['en espera', 'lavando', 'listo', 'entregado'], 
    default: 'en espera' 
  },
  precio: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Ticket', TicketSchema);