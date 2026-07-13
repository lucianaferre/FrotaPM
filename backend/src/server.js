const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const http = require('http');
const { Server } = require('socket.io');
const vehiclesRouter = require('./routes/vehicles');
const gpsSimulator = require('./sockets/gpsSimulator');

const PORT = process.env.PORT || 4000;

// Postgres pool config from env or defaults
const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USER || 'frota_user',
  password: process.env.DATABASE_PASSWORD || 'frota_pass',
  database: process.env.DATABASE_NAME || 'frota'
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// attach pool to req for handlers
app.use((req, res, next) => { req.db = pool; next(); });

app.get('/', (req, res) => res.json({ ok: true, msg: 'FrotaPM Backend' }));
app.use('/api/vehicles', vehiclesRouter);

// simple health
app.get('/api/health', async (req, res) => {
  try {
    const r = await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// WebSocket: tracking channel
io.on('connection', (socket) => {
  console.log('ws connected', socket.id);
  socket.on('subscribe', (room) => {
    socket.join(room);
  });
  socket.on('disconnect', () => {
    console.log('ws disconnected', socket.id);
  });
});

// Expose io for simulator
app.set('io', io);

// Start simulator if requested
if (process.env.SIMULATE_GPS === 'true') {
  gpsSimulator(io, pool);
}

server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
