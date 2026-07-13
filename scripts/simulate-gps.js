#!/usr/bin/env node
// scripts/simulate-gps.js
// Connects to backend socket.io and emits vehiclePosition events (alternative simulator)

const io = require('socket.io-client');
const socket = io(process.env.SOCKET_URL || 'http://localhost:4000');

const vehicles = [
  { vehicleId: 1, number: '001' },
  { vehicleId: 2, number: '002' },
  { vehicleId: 3, number: '003' }
];

socket.on('connect', () => {
  console.log('connected to server');
  setInterval(() => {
    vehicles.forEach(v => {
      const lat = -26.9196 + (Math.random()-0.5)*0.05;
      const lng = -49.0710 + (Math.random()-0.5)*0.05;
      socket.emit('vehiclePosition', { ...v, lat, lng, speed: Math.floor(Math.random()*100), updatedAt: new Date().toISOString() });
    });
  }, 3000);
});
