require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const registerSockets = require('./sockets');

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');
const alertRoutes = require('./routes/alerts');
const profileRoutes = require('./routes/profile');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);
registerSockets(io);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'Emergency Alert API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/profile', profileRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});