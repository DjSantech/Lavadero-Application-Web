const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dns = require('dns');
require('dotenv').config();

// El DNS local de Windows no resuelve los registros SRV de mongodb+srv
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
app.set('trust proxy', 1); // Render/Vercel van detrás de proxy

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión:', err));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tickets', require('./routes/tickets'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));